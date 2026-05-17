'use server';

import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will automatically use process.env.CLOUDINARY_URL if it exists
cloudinary.config({
  secure: true
});

export async function uploadToCloudinary(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
            folder: 'cosmix/posts',
            resource_type: 'auto' // automatically detect if image or video
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return { success: true, result };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message || 'Upload failed' };
  }
}
