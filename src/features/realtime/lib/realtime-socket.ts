import type { RealtimeMessage } from '../types';

type MessageListener = (message: RealtimeMessage) => void;
type TokenRefreshHandler = () => Promise<string | null>;

const DEFAULT_SOCKET_PATH = '/ws';
const INITIAL_RECONNECT_DELAY = 1_000;
const MAX_RECONNECT_DELAY = 30_000;
const TOKEN_EXPIRY_SKEW_SECONDS = 30;

function resolveSocketUrl(): string {
  const explicitUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (explicitUrl) return explicitUrl;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!apiBaseUrl) return `ws://localhost:5000${DEFAULT_SOCKET_PATH}`;

  const url = new URL(apiBaseUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = DEFAULT_SOCKET_PATH;
  url.search = '';
  url.hash = '';

  return url.toString();
}

/** Reads the JWT `exp` claim without verifying the signature (the server verifies it). */
function isTokenExpired(token: string, skewSeconds = TOKEN_EXPIRY_SKEW_SECONDS): boolean {
  const [, payload] = token.split('.');
  if (!payload) return false;

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const decoded = decodeURIComponent(
      atob(padded)
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
    const { exp } = JSON.parse(decoded) as { exp?: number };

    if (typeof exp !== 'number') return false;
    return exp * 1000 <= Date.now() + skewSeconds * 1000;
  } catch {
    return false;
  }
}

function parseMessage(raw: unknown): RealtimeMessage | null {
  if (typeof raw !== 'string') return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const message = parsed as { type?: unknown; data?: unknown };
    if (typeof message.type !== 'string') return null;

    return message as RealtimeMessage;
  } catch {
    return null;
  }
}

export class RealtimeSocket {
  private readonly url: string;
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private refreshTokenHandler: TokenRefreshHandler | null = null;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private manuallyClosed = true;
  private generation = 0;
  private readonly messageListeners = new Set<MessageListener>();

  constructor(url: string = resolveSocketUrl()) {
    this.url = url;
  }

  subscribe(listener: MessageListener): () => void {
    this.messageListeners.add(listener);
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  setTokenRefreshHandler(handler: TokenRefreshHandler | null): void {
    this.refreshTokenHandler = handler;
  }

  connect(token: string): void {
    this.manuallyClosed = false;

    const isActive =
      this.socket !== null &&
      (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING);

    if (isActive) {
      if (this.token === token) return;
      this.token = token;
      this.restart();
      return;
    }

    this.token = token;
    this.reconnectAttempt = 0;
    this.restart();
  }

  disconnect(): void {
    this.manuallyClosed = true;
    this.token = null;
    this.reconnectAttempt = 0;
    this.clearReconnectTimer();
    this.generation += 1;
    this.closeSocket();
  }

  private restart(): void {
    this.generation += 1;
    this.clearReconnectTimer();
    this.closeSocket();
    void this.open(this.generation);
  }

  private async open(generation: number): Promise<void> {
    if (this.manuallyClosed || typeof window === 'undefined') return;

    const token = await this.resolveToken();
    if (generation !== this.generation || this.manuallyClosed) return;
    if (!token) return;

    let socket: WebSocket;
    try {
      socket = new WebSocket(this.buildUrl(token));
    } catch {
      this.scheduleReconnect(generation);
      return;
    }

    this.socket = socket;

    socket.onopen = () => {
      if (this.socket !== socket) return;
      this.reconnectAttempt = 0;
    };

    socket.onmessage = (event) => {
      if (this.socket !== socket) return;

      const message = parseMessage(event.data);
      if (!message) return;

      this.messageListeners.forEach((listener) => listener(message));
    };

    socket.onerror = () => {
      socket.close();
    };

    socket.onclose = () => {
      if (this.socket !== socket) return;
      this.socket = null;

      if (!this.manuallyClosed) {
        this.scheduleReconnect(generation);
      }
    };
  }

  private async resolveToken(): Promise<string | null> {
    const token = this.token;
    if (!token) return null;
    if (!this.refreshTokenHandler || !isTokenExpired(token)) return token;

    try {
      const refreshed = await this.refreshTokenHandler();
      if (refreshed) {
        this.token = refreshed;
        return refreshed;
      }
      return null;
    } catch {
      return null;
    }
  }

  private buildUrl(token: string): string {
    const url = new URL(this.url);
    url.searchParams.set('token', token);
    return url.toString();
  }

  private scheduleReconnect(generation: number): void {
    if (this.manuallyClosed || generation !== this.generation) return;

    this.clearReconnectTimer();

    const delay = Math.min(
      MAX_RECONNECT_DELAY,
      INITIAL_RECONNECT_DELAY * 2 ** this.reconnectAttempt
    );
    const jitter = Math.floor(Math.random() * 250);
    this.reconnectAttempt += 1;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.open(generation);
    }, delay + jitter);
  }

  private clearReconnectTimer(): void {
    if (!this.reconnectTimer) return;
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  private closeSocket(): void {
    const socket = this.socket;
    this.socket = null;
    if (!socket) return;

    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;

    if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
      socket.close(1000, 'client disconnect');
    }
  }
}

let socketInstance: RealtimeSocket | null = null;

export function getRealtimeSocket(): RealtimeSocket {
  if (!socketInstance) {
    socketInstance = new RealtimeSocket();
  }
  return socketInstance;
}
