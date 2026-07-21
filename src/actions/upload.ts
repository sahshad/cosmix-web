"use server";

import {
  uploadFile,
  deleteFile,
  deleteByUrl,
  isCloudinaryFolder,
  type CloudinaryFolder,
} from "@/lib/cloudinary";

export async function uploadToCloudinary(formData: FormData) {
  const file = formData.get("file") as File | null;
  const requestedFolder = formData.get("folder");
  const folder: CloudinaryFolder = isCloudinaryFolder(requestedFolder)
    ? requestedFolder
    : "posts";

  return uploadFile(file, folder);
}

export async function deleteFromCloudinary(publicId: string) {
  return deleteFile(publicId);
}

export async function deleteFromCloudinaryByUrl(url: string) {
  return deleteByUrl(url);
}
