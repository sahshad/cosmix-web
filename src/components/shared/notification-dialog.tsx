"use client";

import { ReactNode, ForwardedRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NotificationDialogProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    children?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    variant?: "default" | "destructive";
    className?: string;
    position?: "center" | "top-right";
    contentRef?: ForwardedRef<HTMLDivElement>;
}

export function NotificationDialog({ 
    open, 
    onClose, 
    title = "Notification",
    message,
    children,
    actionLabel,
    onAction,
    variant = "default",
    className,
    position = "center",
    contentRef
}: NotificationDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent showCloseButton={true} position={position} className={cn(position === "top-right" ? "md:max-w-md" : "sm:max-w-sm" ,className )}>
                <DialogHeader className="shrink-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4">
                    <DialogTitle>{title}</DialogTitle>
                    {message && <DialogDescription>{message}</DialogDescription>}
                </DialogHeader>
                <div ref={contentRef} className="flex-1 overflow-y-auto p-2">
                    {children}
                </div>
                {(actionLabel || onAction) && (
                    <DialogFooter className="shrink-0 border-t border-border bg-background/95 backdrop-blur-sm p-4 flex-row flex items-center justify-end">
                        <Button 
                            variant={variant} 
                            onClick={() => {
                                onAction?.();
                                onClose();
                            }}
                        >
                            {actionLabel || "Confirm"}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}