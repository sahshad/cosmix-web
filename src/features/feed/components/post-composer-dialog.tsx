"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, Globe2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadToCloudinary } from "@/actions/upload";
import { toast } from "sonner";
import { MediaItem } from "../types";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { dicebearUrl, getInitials } from "@/lib/utils";
import { useCreatePost, useUpdatePost } from "../hooks/useFeed";

interface PostComposerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  postId?: number | string;
  initialContent?: string;
  initialMedia?: MediaItem[];
}

interface MediaState {
  url: string;
  file?: File;
  publicId?: string;
  type?: string;
  duration?: number;
}

export function PostComposerDialog({
  open,
  onOpenChange,
  mode,
  postId,
  initialContent = "",
  initialMedia = [],
}: PostComposerDialogProps) {
  const isEdit = mode === "edit";

  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState<MediaState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: user } = useCurrentUser();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: createPost } = useCreatePost();

  const avatarUrl = user?.avatarUrl ?? dicebearUrl("cosmix");

  useEffect(() => {
    if (!open) return;
    setContent(initialContent);
    const existing = initialMedia[0];
    setMedia(
      existing
        ? { url: existing.url, publicId: existing.publicId, type: existing.type, duration: existing.duration }
        : null
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setMedia({ file, url: URL.createObjectURL(file) });
    }
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenChange = (next: boolean) => {
    if (!isSubmitting) onOpenChange(next);
  };

  const resolveMediaItems = async (): Promise<MediaItem[] | null> => {
    if (!media) return [];
    if (!media.file) {
      return [{ publicId: media.publicId!, url: media.url, type: media.type!, duration: media.duration }];
    }

    const formData = new FormData();
    formData.append("file", media.file);
    const uploadRes = await uploadToCloudinary(formData);
    if (!uploadRes.success) {
      toast.error(uploadRes.error || "Failed to upload media");
      return null;
    }
    return [
      {
        publicId: uploadRes.data.publicId,
        url: uploadRes.data.url,
        type: uploadRes.data.resourceType,
        duration: uploadRes.data.duration || 0,
      },
    ];
  };

  const handleSubmit = async () => {
    if (!content.trim() && !media) return;

    setIsSubmitting(true);
    try {
      const mediaItems = await resolveMediaItems();
      if (mediaItems === null) return;

      if (isEdit) {
        if (!postId) return;
        updatePost(
          { id: postId, content: content.trim(), media: mediaItems },
          { onSuccess: () => onOpenChange(false) }
        );
        return;
      }

      createPost(
        { content, media: mediaItems },
        { onSuccess: () => onOpenChange(false) }
      );
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? "Failed to update post" : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = content.trim().length > 0 || !!media;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-[20px]">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/70">
          <DialogTitle className="text-[16px]">
            {isEdit ? "Edit post" : "Create post"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4 flex items-center gap-3">
          <UserAvatar
            src={avatarUrl}
            alt={user?.displayName || "You"}
            fallback={getInitials(user?.displayName) || "ME"}
            size="md"
            className="flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">
              {user?.displayName || "You"}
            </p>
            <span className="inline-flex items-center gap-1 mt-0.5 text-[11.5px] font-medium text-muted-foreground bg-secondary/60 rounded-full px-2 py-0.5">
              <Globe2 className="h-3 w-3" />
              Anyone
            </span>
          </div>
        </div>

        <div className="px-6 pt-3 pb-1">
          <Textarea
            autoFocus
            placeholder="What's sparking your imagination today?"
            className="
            w-full
            min-w-0
            max-w-full
            min-h-32
            resize-none
            border-0
            bg-transparent
            dark:bg-transparent
            p-0
            text-[16px]
            leading-relaxed
            font-medium
            whitespace-pre-wrap
            break-words
            overflow-wrap-anywhere
            break-all
            focus-visible:ring-0 "
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {media && (
            <div className="relative mt-2 mb-3 w-max max-w-full">
              <img
                src={media.url}
                alt="Attached media"
                className="max-h-[300px] rounded-[14px] object-cover border border-border"
              />
              <button
                onClick={handleRemoveMedia}
                className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 mt-1 border-t border-border/70">
          <div className="flex items-center gap-0.5">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              title="Add photo/video"
              onClick={() => fileInputRef.current?.click()}
              className="h-9 w-9 rounded-full text-vivid-blue hover:bg-vivid-blue/10 hover:text-vivid-blue transition-colors cursor-pointer"
            >
              <ImageIcon className="h-[18px] w-[18px]" />
            </Button>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
            className="bg-vivid-blue hover:bg-vivid-blue-hover text-white rounded-full px-6 h-9 font-bold text-[13.5px] transition-all"
          >
            {isSubmitting ? (isEdit ? "Saving…" : "Posting…") : isEdit ? "Save" : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
