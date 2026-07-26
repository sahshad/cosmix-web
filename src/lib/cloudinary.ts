import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Cloudinary picks up process.env.CLOUDINARY_URL automatically
cloudinary.config({ secure: true });

type ResourceType = "image" | "video" | "auto";

interface FolderConfig {
  path: string;
  resourceType: ResourceType;
  maxImageSizeBytes: number;
  maxVideoSizeBytes: number;
}

export const CLOUDINARY_FOLDERS: Record<"posts" | "avatars" | "covers", FolderConfig> = {
  posts: {
    path: "cosmix/posts",
    resourceType: "auto",
    maxImageSizeBytes: 8 * 1024 * 1024,
    maxVideoSizeBytes: 50 * 1024 * 1024,
  },
  avatars: {
    path: "cosmix/avatars",
    resourceType: "image",
    maxImageSizeBytes: 8 * 1024 * 1024,
    maxVideoSizeBytes: 0,
  },
  covers: {
    path: "cosmix/covers",
    resourceType: "image",
    maxImageSizeBytes: 8 * 1024 * 1024,
    maxVideoSizeBytes: 0,
  },
};

export type CloudinaryFolder = keyof typeof CLOUDINARY_FOLDERS;

export function isCloudinaryFolder(value: unknown): value is CloudinaryFolder {
  return typeof value === "string" && value in CLOUDINARY_FOLDERS;
}

export type CloudinaryResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  resourceType: string;
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

function formatMb(bytes: number): string {
  return `${Math.floor(bytes / (1024 * 1024))}MB`;
}

function validateFile(file: File, folder: CloudinaryFolder): string | null {
  const { resourceType, maxImageSizeBytes, maxVideoSizeBytes } = CLOUDINARY_FOLDERS[folder];
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  if (resourceType === "image" && !isImage) {
    return "Only image files are allowed";
  }
  if (resourceType === "video" && !isVideo) {
    return "Only video files are allowed";
  }
  if (resourceType === "auto" && !isImage && !isVideo) {
    return "Only image or video files are allowed";
  }
  if (isImage && file.size > maxImageSizeBytes) {
    return `Images must be ${formatMb(maxImageSizeBytes)} or smaller`;
  }
  if (isVideo && file.size > maxVideoSizeBytes) {
    return `Videos must be ${formatMb(maxVideoSizeBytes)} or smaller`;
  }

  return null;
}

/** Maps low-level Cloudinary/network errors to messages safe and useful to show a user. */
function friendlyUploadError(error: unknown): string {
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();

  if (message.includes("timeout")) {
    return "The upload timed out. Check your connection and try again.";
  }
  if (message.includes("too large") || message.includes("file size")) {
    return "This file is too large to upload.";
  }
  if (message.includes("invalid image") || message.includes("invalid video") || message.includes("unsupported")) {
    return "This file couldn't be processed. Try a different image or video.";
  }
  if (
    message.includes("network") ||
    message.includes("econnreset") ||
    message.includes("enotfound") ||
    message.includes("fetch failed")
  ) {
    return "Network error while uploading. Please check your connection and try again.";
  }

  return "Something went wrong while uploading. Please try again.";
}

export async function uploadFile(
  file: File | null,
  folder: CloudinaryFolder
): Promise<CloudinaryResult<CloudinaryUploadResult>> {
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const validationError = validateFile(file, folder);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const config = CLOUDINARY_FOLDERS[folder];

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: config.path, resource_type: config.resourceType },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return {
      success: true,
      data: {
        publicId: result.public_id,
        url: result.secure_url,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration,
        bytes: result.bytes,
      },
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: friendlyUploadError(error),
    };
  }
}

export async function deleteFile(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<CloudinaryResult<{ deleted: boolean }>> {
  if (!publicId) {
    return { success: false, error: "No public id provided" };
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return { success: true, data: { deleted: result.result === "ok" } };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export function getPublicIdFromUrl(url?: string): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("res.cloudinary.com")) return null;

    const marker = "/upload/";
    const uploadIndex = parsed.pathname.indexOf(marker);
    if (uploadIndex === -1) return null;

    let afterUpload = parsed.pathname.slice(uploadIndex + marker.length);
    afterUpload = afterUpload.replace(/^v\d+\//, "");

    const lastDot = afterUpload.lastIndexOf(".");
    const publicId = lastDot !== -1 ? afterUpload.slice(0, lastDot) : afterUpload;

    return publicId || null;
  } catch {
    return null;
  }
}

export async function deleteByUrl(
  url?: string,
  resourceType: "image" | "video" = "image"
): Promise<CloudinaryResult<{ deleted: boolean }>> {
  const publicId = getPublicIdFromUrl(url);
  if (!publicId) {
    return { success: true, data: { deleted: false } };
  }

  return deleteFile(publicId, resourceType);
}
