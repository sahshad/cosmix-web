import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Cloudinary picks up process.env.CLOUDINARY_URL automatically
cloudinary.config({ secure: true });

type ResourceType = "image" | "video" | "auto";

interface FolderConfig {
  path: string;
  resourceType: ResourceType;
  maxSizeBytes: number;
}

export const CLOUDINARY_FOLDERS: Record<"posts" | "avatars" | "covers", FolderConfig> = {
  posts: { path: "cosmix/posts", resourceType: "auto", maxSizeBytes: 50 * 1024 * 1024 },
  avatars: { path: "cosmix/avatars", resourceType: "image", maxSizeBytes: 8 * 1024 * 1024 },
  covers: { path: "cosmix/covers", resourceType: "image", maxSizeBytes: 8 * 1024 * 1024 },
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

function validateFile(file: File, folder: CloudinaryFolder): string | null {
  const { resourceType, maxSizeBytes } = CLOUDINARY_FOLDERS[folder];
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
  if (file.size > maxSizeBytes) {
    return `File exceeds the ${Math.floor(maxSizeBytes / (1024 * 1024))}MB limit`;
  }

  return null;
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
      error: error instanceof Error ? error.message : "Upload failed",
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
