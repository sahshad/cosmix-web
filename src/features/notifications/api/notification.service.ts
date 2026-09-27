import { http } from '@/lib/http';
import { GetNotificationsResponse, MarkAsReadResponse, MarkAllAsReadResponse } from '@/types';

export const notificationService = {
  getNotifications: (page: number = 1, limit: number = 20) =>
    http.get<GetNotificationsResponse>(`/notifications/me?page=${page}&limit=${limit}`),

  markAsRead: (id: string) =>
    http.patch<MarkAsReadResponse>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    http.patch<MarkAllAsReadResponse>('/notifications/read-all'),

  getUnreadCount: () =>
    http.get<{ count: number }>('/notifications/unread-count'),
};