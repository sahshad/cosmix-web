"use client";

import { useRef, useState } from "react";
import { ImageIcon, Code2, Smile, Maximize2 } from "lucide-react";
import { UserAvatar } from "@/components/shared";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUser } from "@/features/auth/hooks/useAuth";
import { cn, dicebearUrl, getInitials } from "@/lib/utils";
import { PostComposerDialog } from "./post-composer-dialog";
import { AttachmentPreview } from "./attachment-preview";
import { ComposerCharCount } from "./composer-char-count";
import { AudienceMenu, type Audience } from "./composer/audience-menu";
import { useCreatePostDraft } from "../hooks/useCreatePostDraft";
import { useAutoGrowTextarea } from "../hooks/useAutoGrowTextarea";
import { MAX_MEDIA_ITEMS } from "../lib/media";

const CONTENT_LIMIT = 500;

const actionButtonClass =
  "h-8 w-8 rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer flex items-center justify-center";

export function CreatePost() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [audience, setAudience] = useState<Audience>("Public");
  const { data: user } = useCurrentUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const draft = useCreatePostDraft();

  useAutoGrowTextarea(textareaRef, draft.content);

  const avatarUrl = user?.avatarUrl ?? dicebearUrl("cosmix");
  const displayName = user?.displayName || "You";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    draft.handleFilesSelect(files);
  };

  return (
    <>
      <Card className="p-5 border-0 shadow-[0_12px_40px_rgb(0,0,0,0.06)] rounded-md bg-card">
        <div className="flex items-start gap-3">
          <UserAvatar
            src={avatarUrl}
            alt={displayName}
            fallback={getInitials(user?.displayName) || "ME"}
            size="md"
            className="shrink-0"
          />
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[14px] font-semibold text-foreground truncate">{displayName}</p>
            <AudienceMenu value={audience} onChange={setAudience} />
          </div>
        </div>

        <Textarea
          ref={textareaRef}
          placeholder="What's sparking your imagination today?"
          value={draft.content}
          onChange={(e) => draft.setContent(e.target.value)}
          maxLength={CONTENT_LIMIT}
          rows={1}
          className="mt-3 w-full min-w-0 resize-none overflow-hidden border-0 bg-transparent dark:bg-transparent p-2 text-[14.5px] leading-relaxed shadow-none focus-visible:ring-0"
        />

        {draft.media.length > 0 && (
          <AttachmentPreview
            items={draft.media.map((m) => ({ url: m.url, isVideo: m.isVideo }))}
            onRemove={draft.handleRemoveMedia}
          />
        )}

        <Separator className=" bg-border/70" />

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              type="button"
              title={draft.media.length >= MAX_MEDIA_ITEMS ? `Up to ${MAX_MEDIA_ITEMS} files per post` : "Add image"}
              aria-label="Add image"
              disabled={draft.media.length >= MAX_MEDIA_ITEMS}
              onClick={() => fileInputRef.current?.click()}
              className={cn(actionButtonClass, "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent")}
            >
              <ImageIcon className="h-4.25 w-4.25" />
            </button>
            <button type="button" title="Add code block" aria-label="Add code block" className={actionButtonClass}>
              <Code2 className="h-4.25 w-4.25" />
            </button>
            <button type="button" title="Add emoji" aria-label="Add emoji" className={actionButtonClass}>
              <Smile className="h-4.25 w-4.25" />
            </button>
            <button
              type="button"
              title="Open full composer"
              aria-label="Open full composer"
              onClick={() => setDialogOpen(true)}
              className={actionButtonClass}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ComposerCharCount length={draft.content.length} limit={CONTENT_LIMIT} />
            <button
              type="button"
              onClick={draft.handleSubmit}
              disabled={draft.isSubmitting || !draft.canSubmit}
              className="bg-vivid-blue hover:bg-vivid-blue-hover text-white rounded-full px-6 h-9 font-bold text-[13px] shadow-md shadow-vivid-blue/20 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {draft.isSubmitting ? "Posting…" : "Post"}
            </button>
          </div>
        </div>
      </Card>

      <PostComposerDialog
        mode="create"
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialContent={draft.content}
        initialFiles={draft.media.map((m) => m.file)}
        initialAudience={audience}
        onCreated={draft.reset}
      />
    </>
  );
}
