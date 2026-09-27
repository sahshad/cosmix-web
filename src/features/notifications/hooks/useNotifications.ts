"use client";

import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../api/notification.service';
import { createInfiniteQueryOptions, flattenInfinitePages } from '@/lib/infinite-query';
import { Notification, GetNotificationsResponse } from '@/types';

const getNotifications = (response: GetNotificationsResponse) => response.notifications ?? [];
const getNotificationsPagination = (response: GetNotificationsResponse) => response.pagination;

export function useNotifications(page: number = 1, limit: number = 20, enabled: boolean = false) {
  return useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => notificationService.getNotifications(page, limit),
    enabled,
  });
}

export function useInfiniteNotifications(limit: number = 10, enabled: boolean = false) {
  return useInfiniteQuery(createInfiniteQueryOptions<Notification, GetNotificationsResponse>({
    queryKey: ['notifications'],
    fetchPage: (page, limit) => notificationService.getNotifications(page, limit),
    limit,
    enabled,
    getItems: getNotifications,
    getPagination: getNotificationsPagination,
  }));
}

export function flattenNotificationPages(data: { pages: GetNotificationsResponse[]; pageParams: number[] } | undefined): Notification[] {
  return flattenInfinitePages(data, getNotifications);
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    select: (data) => data.count,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationActions() {
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  return {
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    isMarkingAsRead: markAsRead.isPending,
    isMarkingAllAsRead: markAllAsRead.isPending,
  };
}