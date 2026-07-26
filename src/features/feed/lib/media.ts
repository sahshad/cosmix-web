import { uploadToCloudinary } from "@/actions/upload";
import { MediaItem } from "../types";

export const MAX_MEDIA_ITEMS = 10;

// Mirrors the server-side limits in src/lib/cloudinary.ts (posts folder) — kept
// duplicated so this stays a client-safe module (no Node Cloudinary SDK import).
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
export const MAX_VIDEO_SIZE_BYTES = 50 * 1024 * 1024;

export function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

function formatMb(bytes: number): string {
  return `${Math.floor(bytes / (1024 * 1024))}MB`;
}

/** Client-side pre-check so oversized/invalid files are rejected instantly, without a round-trip. */
function validateMediaFile(file: File): string | null {
  const isImage = file.type.startsWith("image/");
  const isVideo = isVideoFile(file);

  if (!isImage && !isVideo) {
    return `${file.name} isn't an image or video`;
  }
  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    return `${file.name} is larger than ${formatMb(MAX_IMAGE_SIZE_BYTES)}`;
  }
  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    return `${file.name} is larger than ${formatMb(MAX_VIDEO_SIZE_BYTES)}`;
  }
  return null;
}

/** Validates newly-picked files against per-file rules and the per-post attachment cap. */
export function pickMediaFiles(
  incoming: File[],
  currentCount: number
): { valid: File[]; errors: string[] } {
  const errors: string[] = [];
  const valid: File[] = [];

  for (const file of incoming) {
    const error = validateMediaFile(file);
    if (error) {
      errors.push(error);
      continue;
    }
    if (currentCount + valid.length >= MAX_MEDIA_ITEMS) {
      errors.push(`You can attach up to ${MAX_MEDIA_ITEMS} files per post`);
      break;
    }
    valid.push(file);
  }

  return { valid, errors };
}

type UploadMediaResult =
  | { success: true; items: MediaItem[] }
  | { success: false; error: string };

/** Uploads multiple files to Cloudinary in parallel, preserving input order. */
export async function uploadMediaFiles(files: File[]): Promise<UploadMediaResult> {
  const results = await Promise.all(
    files.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      return uploadToCloudinary(formData);
    })
  );

  const failed = results.find((res) => !res.success);
  if (failed && !failed.success) {
    return { success: false, error: failed.error || "Failed to upload media" };
  }

  const items = results.map((res) => {
    const { data } = res as Extract<(typeof results)[number], { success: true }>;
    return {
      publicId: data.publicId,
      url: data.url,
      type: data.resourceType,
      duration: data.duration || 0,
    };
  });

  return { success: true, items };
}
