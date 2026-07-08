import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v2 as cloudinary } from 'cloudinary';
import { requireAuth } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed');
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  const { image, folder = 'blog-covers' } = (req.body as { image?: string; folder?: string }) || {};

  if (!image || typeof image !== 'string') {
    return error(res, 400, 'Missing or invalid image data (expected base64 string)');
  }

  // Validate it looks like a base64 data URI or raw base64
  const isDataUri = image.startsWith('data:');
  const uploadData = isDataUri ? image : `data:image/jpeg;base64,${image}`;

  try {
    const result = await cloudinary.uploader.upload(uploadData, {
      folder,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });

    return ok(res, {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error('[/api/upload/image] Cloudinary error:', err);
    return error(res, 500, 'Image upload failed');
  }
}
