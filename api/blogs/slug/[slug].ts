import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../lib/mongodb.js';
import { ok, error } from '../../lib/response.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { slug } = req.query;
  const slugStr = Array.isArray(slug) ? slug[0] : slug;

  if (!slugStr) {
    return error(res, 400, 'Invalid slug');
  }

  try {
    const { db } = await connectToDatabase();
    const blogs = db.collection('blogs');

    if (req.method === 'GET') {
      const blog = await blogs.findOne({ slug: slugStr, isPublished: true });
      if (!blog) return error(res, 404, 'Blog not found');
      return ok(res, { blog });
    }

    return error(res, 405, 'Method not allowed');
  } catch (err) {
    console.error('[/api/blogs/slug/:slug] Error:', err);
    return error(res, 500, 'Internal server error');
  }
}
