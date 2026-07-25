"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { actionButtonClass } from "./styles";

interface CommentButtonProps {
  onClick?: () => void;
}

export function CommentButton({ onClick }: CommentButtonProps) {
  return (
    <Button
      variant="ghost"
      className={actionButtonClass}
      onClick={onClick}
      aria-label="Focus comment input"
    >
      <MessageCircle className="h-4.5 w-4.5" />
      Comment
    </Button>
  );
}
