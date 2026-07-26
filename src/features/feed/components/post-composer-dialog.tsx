"use client";

import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, Code2, Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { MediaItem } from "../types";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { cn, dicebearUrl, getInitials } from "@/lib/utils";
import { useCreatePost, useUpdatePost } from "../hooks/useFeed";
import { useAutoGrowTextarea } from "../hooks/useAutoGrowTextarea";
import { AttachmentPreview } from "./attachment-preview";
import { ComposerCharCount } from "./composer-char-count";
import { AudienceMenu, type Audience } from "./composer/audience-menu";
import { isVideoFile, MAX_MEDIA_ITEMS, pickMediaFiles, uploadMediaFiles } from "../lib/media";

const CONTENT_LIMIT = 500;

const actionButtonClass =
  "h-9 w-9 rounded-full text-vivid-blue hover:bg-vivid-blue/10 hover:text-vivid-blue transition-colors cursor-pointer flex items-center justify-center";

interface PostComposerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  postId?: number | string;
  initialContent?: string;
  initialMedia?: MediaItem[];
  /** Not-yet-uploaded files (e.g. from a draft this dialog is expanded from). Takes precedence over initialMedia. */
  initialFiles?: File[];
  initialAudience?: Audience;
  /** Called only on a successful create (not on cancel/edit) — e.g. to clear a draft this dialog was expanded from. */
  onCreated?: () => void;
}

interface MediaState {
  url: string;
  file?: File;
  publicId?: string;
  type?: string;
  duration?: number;
  isVideo: boolean;
}

export function PostComposerDialog({
  open,
  onOpenChange,
  mode,
  postId,
  initialContent = "",
  initialMedia = [],
  initialFiles = [],
  initialAudience = "Public",
  onCreated,
}: PostComposerDialogProps) {
  const isEdit = mode === "edit";

  const [content, setContent] = useState(initialContent);
  const [media, setMedia] = useState<MediaState[]>([]);
  const [audience, setAudience] = useState<Audience>(initialAudience);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { data: user } = useCurrentUser();
  const { mutate: updatePost } = useUpdatePost();
  const { mutate: createPost } = useCreatePost();

  const avatarUrl = user?.avatarUrl ?? dicebearUrl("cosmix");
  const displayName = user?.displayName || "You";

  useAutoGrowTextarea(textareaRef, content);

  useEffect(() => {
    if (!open) return;
    setContent(initialContent);
    setAudience(initialAudience);
    setMedia(
      initialFiles.length > 0
        ? initialFiles.map((file) => ({ file, url: URL.createObjectURL(file), isVideo: isVideoFile(file) }))
        : initialMedia.map((item) => ({
            url: item.url,
            publicId: item.publicId,
            type: item.type,
            duration: item.duration,
            isVideo: item.type === "video",
          }))
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const { valid, errors } = pickMediaFiles(files, media.length);
    errors.forEach((message) => toast.error(message));
    if (valid.length === 0) return;
    setMedia((prev) => [
      ...prev,
      ...valid.map((file) => ({ file, url: URL.createObjectURL(file), isVideo: isVideoFile(file) })),
    ]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOpenChange = (next: boolean) => {
    if (!isSubmitting) onOpenChange(next);
  };

  const resolveMediaItems = async (): Promise<MediaItem[] | null> => {
    if (media.length === 0) return [];

    const filesToUpload = media.filter((m) => m.file).map((m) => m.file!);
    let uploaded: MediaItem[] = [];
    if (filesToUpload.length > 0) {
      const uploadRes = await uploadMediaFiles(filesToUpload);
      if (!uploadRes.success) {
        toast.error(uploadRes.error);
        return null;
      }
      uploaded = uploadRes.items;
    }

    let uploadedIndex = 0;
    return media.map((m) =>
      m.file
        ? uploaded[uploadedIndex++]
        : { publicId: m.publicId!, url: m.url, type: m.type!, duration: m.duration }
    );
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) return;

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
        {
          onSuccess: () => {
            onOpenChange(false);
            onCreated?.();
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(isEdit ? "Failed to update post" : "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = content.trim().length > 0 || media.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden rounded-xl">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/70">
          <DialogTitle className="text-[16px]">
            {isEdit ? "Edit post" : "Create post"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pt-4 flex items-center gap-3">
          <UserAvatar
            src={avatarUrl}
            alt={displayName}
            fallback={getInitials(user?.displayName) || "ME"}
            size="md"
            className="shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">{displayName}</p>
            <AudienceMenu value={audience} onChange={setAudience} />
          </div>
        </div>

        <div className="px-6 pt-3 pb-1">
          <Textarea
            ref={textareaRef}
            autoFocus
            placeholder="What's sparking your imagination today?"
            maxLength={CONTENT_LIMIT}
            className="
            w-full
            min-w-0
            max-w-full
            min-h-32
            resize-none
            overflow-hidden
            border-0
            bg-transparent
            dark:bg-transparent
            p-0
            text-[16px]
            leading-relaxed
            font-medium
            whitespace-pre-wrap
            wrap-break-word
            overflow-wrap-anywhere
            break-all
            focus-visible:ring-0 "
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {media.length > 0 && (
            <AttachmentPreview
              items={media.map((m) => ({ url: m.url, isVideo: m.isVideo }))}
              onRemove={handleRemoveMedia}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 mt-1 border-t border-border/70">
          <div className="flex items-center gap-0.5">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <button
              type="button"
              title={media.length >= MAX_MEDIA_ITEMS ? `Up to ${MAX_MEDIA_ITEMS} files per post` : "Add photo/video"}
              aria-label="Add photo/video"
              disabled={media.length >= MAX_MEDIA_ITEMS}
              onClick={() => fileInputRef.current?.click()}
              className={cn(actionButtonClass, "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent")}
            >
              <ImageIcon className="h-4.5 w-4.5" />
            </button>
            <button type="button" title="Add code block" aria-label="Add code block" className={actionButtonClass}>
              <Code2 className="h-4.5 w-4.5" />
            </button>
            <button type="button" title="Add emoji" aria-label="Add emoji" className={actionButtonClass}>
              <Smile className="h-4.5 w-4.5" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <ComposerCharCount length={content.length} limit={CONTENT_LIMIT} />
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmit}
              className="bg-vivid-blue hover:bg-vivid-blue-hover text-white rounded-full px-6 h-9 font-bold text-[13.5px] transition-all"
            >
              {isSubmitting ? (isEdit ? "Saving…" : "Posting…") : isEdit ? "Save" : "Post"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
