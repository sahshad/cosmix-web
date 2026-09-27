export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actorId?: string;
  entityId?: string;
}

export interface GetNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MarkAsReadResponse {
  message: string;
}

export interface MarkAllAsReadResponse {
  message: string;
  count: number;
}