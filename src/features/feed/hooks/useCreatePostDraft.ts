import { useState } from "react";
import { toast } from "sonner";
import { MediaItem } from "../types";
import { useCreatePost } from "./useFeed";
import { isVideoFile, pickMediaFiles, uploadMediaFiles } from "../lib/media";

interface DraftMedia {
  url: string;
  file: File;
  isVideo: boolean;
}

/** Standalone "type and post" draft state for the compact inline composer. */
export function useCreatePostDraft() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<DraftMedia[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createPost } = useCreatePost();

  const handleFilesSelect = (files: File[]) => {
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

  const reset = () => {
    setContent("");
    setMedia([]);
  };

  const canSubmit = content.trim().length > 0 || media.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      let mediaItems: MediaItem[] = [];
      if (media.length > 0) {
        const uploadRes = await uploadMediaFiles(media.map((m) => m.file));
        if (!uploadRes.success) {
          toast.error(uploadRes.error);
          return;
        }
        mediaItems = uploadRes.items;
      }

      createPost({ content, media: mediaItems }, { onSuccess: reset });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    content,
    setContent,
    media,
    isSubmitting,
    canSubmit,
    handleFilesSelect,
    handleRemoveMedia,
    handleSubmit,
    reset,
  };
}
