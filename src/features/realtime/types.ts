export interface RealtimeActor {
  id: string;
  username?: string;
  displayName?: string;
}

export interface RealtimeNotification {
  type: string;
  title: string;
  body: string;
  entityId?: string;
  entityType?: string;
  actionUrl?: string;
  actor?: RealtimeActor;
  createdAt: string;
}

export interface RealtimeMessage<TData = unknown> {
  type: string;
  data?: TData;
}

export interface RealtimeNotificationMessage {
  type: 'notification';
  data: RealtimeNotification;
}

export interface RealtimeConnectedData {
  userId: string;
}
