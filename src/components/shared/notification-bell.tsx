import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationDialog } from "./notification-dialog";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useInfiniteNotifications, useMarkAllAsRead, useUnreadCount, flattenNotificationPages } from "@/features/notifications/hooks/useNotifications";
import { useInfiniteScroll } from "@/hooks";

interface NotificationBellProps {
  onOpenChange?: (open: boolean) => void;
  width?: "mobile" | "desktop";
  className?: string;
}

export function NotificationBell({
  onOpenChange,
  width = "desktop",
  className,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteNotifications(10, isOpen);
  const { mutate: markAllAsRead } = useMarkAllAsRead();
  const { data: liveUnreadCount = 0 } = useUnreadCount();

  const { listRef } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 100,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (buttonRef.current && dialogRef.current) {
        if (
          !buttonRef.current.contains(event.target as Node) &&
          !dialogRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          onOpenChange?.(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onOpenChange]);

  const handleClick = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const notifications = flattenNotificationPages(data);
  const dialogWidth = width === "mobile" ? "" : "w-[420px]";

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
          <span className="absolute top-0 right-0 text-[10px] rounded-full w-4 h-4 flex items-center justify-center bg-red-600 text-white">
            {liveUnreadCount > 9 ? "9+" : liveUnreadCount}
          </span>
        )}
      </button>

      <NotificationDialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          onOpenChange?.(false);
        }}
        title="Notifications"
        position="top-right"
        className={cn(dialogWidth, "max-h-125")}
        actionLabel="Mark all as read"
        onAction={() => {
          markAllAsRead();
        }}
        contentRef={listRef}
      >
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
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
            ))}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-muted-foreground">
                Loading more...
              </div>
            )}
          </div>
        )}
      </NotificationDialog>
    </div>
  );
}