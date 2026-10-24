"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { NotificationDialog } from "./notification-dialog";
import { cn, formatCount, formatRelativeTime } from "@/lib/utils";
import { useInfiniteNotifications, useMarkAllAsRead, useUnreadCount, flattenNotificationPages } from "@/features/notifications/hooks/useNotifications";
import { Notification } from "@/types";

const NOTIFICATION_LIMIT = 10;
const SCROLL_THRESHOLD = 100;
const MAX_HEIGHT_MOBILE = "max-h-[calc(100vh-4rem)]";
const MAX_HEIGHT_DESKTOP = "max-h-[500px]";

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg hover:bg-secondary transition-colors cursor-pointer relative",
        !notification.isRead && "bg-muted/50"
      )}
    >
      {!notification.isRead && (
        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <p className={cn("font-medium", !notification.isRead && "font-semibold")}>
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground truncate">{notification.body}</p>
        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notification.createdAt)}</p>
      </div>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  listRef: React.RefObject<HTMLDivElement | null>;
}

function NotificationList({
  notifications,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  listRef
}: NotificationListProps) {
  const handleScroll = useCallback(() => {
    const element = listRef.current;
    if (!element || !hasNextPage || isFetchingNextPage) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
    const remaining = scrollHeight - (scrollTop + clientHeight);
    if (remaining <= SCROLL_THRESHOLD) {
      fetchNextPage();
    }
  }, [listRef, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div ref={listRef} className={cn(MAX_HEIGHT_DESKTOP, "space-y-1 overflow-y-auto")} onScroll={handleScroll}>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
      {isFetchingNextPage && (
        <div className="py-4 text-center text-muted-foreground">
          Loading more...
        </div>
      )}
    </div>
  );
}

export function NotificationBell({
  onOpenChange,
  width = "desktop",
  className,
}: {
  onOpenChange?: (open: boolean) => void;
  width?: "mobile" | "desktop";
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteNotifications(NOTIFICATION_LIMIT, isOpen);
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { data: liveUnreadCount = 0 } = useUnreadCount();

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const handleClick = useCallback(() => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && dialogRef.current) {
        if (
          !buttonRef.current.contains(event.target as Node) &&
          !dialogRef.current.contains(event.target as Node)
        ) {
          handleClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const notifications = flattenNotificationPages(data);
  const dialogWidth = width === "mobile" ? "" : "w-[420px]";
  const maxHeight = width === "mobile" ? MAX_HEIGHT_MOBILE : MAX_HEIGHT_DESKTOP;

  return (
    <div className="relative" ref={dialogRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={cn(
          "h-9 w-9 flex items-center justify-center rounded-full hover:bg-secondary transition-colors relative",
          className
        )}
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {liveUnreadCount > 0 && (
          <span className="absolute top-0 right-0 text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center bg-red-600 text-white tabular-nums">
            {formatCount(liveUnreadCount, { max: 99 })}
          </span>
        )}
      </button>

      <NotificationDialog
        open={isOpen}
        onClose={handleClose}
        title="Notifications"
        position="top-right"
        className={cn(dialogWidth, maxHeight)}
        actionLabel="Mark all as read"
        onAction={markAllAsRead}
      >
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No notifications yet</div>
        ) : (
          <NotificationList
            notifications={notifications}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            listRef={listRef}
          />
        )}
      </NotificationDialog>
    </div>
  );
}