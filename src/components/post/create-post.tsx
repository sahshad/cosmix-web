"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/hooks/useAuth";
import { dicebearUrl, getInitials } from "@/lib/utils";
import { PostComposerDialog } from "./post-composer-dialog";

export function CreatePost() {
  const [open, setOpen] = useState(false);
  const { data: user } = useCurrentUser();

  const avatarUrl = user?.avatarUrl ?? dicebearUrl("cosmix");
  const firstName = user?.displayName?.split(" ")[0];

  return (
    <>
      <Card className="p-5 border-0 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-[14px] bg-card">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-3.5 w-full text-left group cursor-pointer"
        >
          <UserAvatar
            src={avatarUrl}
            alt={user?.displayName || "You"}
            fallback={getInitials(user?.displayName) || "ME"}
            size="md"
            className="flex-shrink-0 ring-2 ring-transparent group-hover:ring-vivid-blue/15 transition-all"
          />
          <span className="flex-1 rounded-full border border-border bg-secondary/30 group-hover:bg-secondary/60 group-hover:border-vivid-blue/30 px-4 py-3 text-[14.5px] text-muted-foreground transition-all">
            {firstName ? `Share an update, ${firstName}…` : "What's sparking your imagination today?"}
          </span>
        </button>

        <Separator className="mt-4 mb-3 bg-border/70" />

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className="h-9 rounded-full font-semibold text-[13px] text-vivid-blue hover:bg-vivid-blue/10 hover:text-vivid-blue transition-colors cursor-pointer"
          >
            <ImageIcon className="h-[17px] w-[17px] mr-1.5" />
            Photo / Video
          </Button>

          <Button
            type="button"
            onClick={() => setOpen(true)}
            className="bg-vivid-blue hover:bg-vivid-blue-hover text-white rounded-full px-6 h-9 font-bold text-[13px] shadow-md shadow-vivid-blue/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            Post
          </Button>
        </div>
      </Card>

      <PostComposerDialog mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
