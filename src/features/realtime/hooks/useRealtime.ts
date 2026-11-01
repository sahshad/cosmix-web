'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/features/auth/api/auth.service';
import { useAuthStore } from '@/features/auth/store';
import { getRealtimeSocket } from '../lib/realtime-socket';
import type { RealtimeMessage, RealtimeNotificationMessage } from '../types';

const NOTIFICATIONS_QUERY_KEY = ['notifications'];

function isNotificationMessage(
  message: RealtimeMessage
): message is RealtimeNotificationMessage {
  return (
    message.type === 'notification' &&
    typeof message.data === 'object' &&
    message.data !== null
  );
}

export function useRealtimeNotifications(): void {
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getRealtimeSocket();

    socket.setTokenRefreshHandler(async () => {
      try {
        const { accessToken } = await authService.refresh();
        useAuthStore.getState().setToken(accessToken);
        return accessToken;
      } catch {
        useAuthStore.getState().logout();
        return null;
      }
    });

    if (!token) {
      socket.disconnect();
      return;
    }

    const unsubscribe = socket.subscribe((message) => {
      if (!isNotificationMessage(message)) return;

      const notification = message.data;

      queryClient.setQueryData<{ count: number }>(
        [...NOTIFICATIONS_QUERY_KEY, 'unread-count'],
        (current) => (current ? { count: current.count + 1 } : current)
      );

      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });

      toast(notification.title, {
        description: notification.body || undefined,
      });
    });

    socket.connect(token);

    return () => {
      unsubscribe();
      socket.disconnect();
    };
  }, [token, queryClient]);
}
