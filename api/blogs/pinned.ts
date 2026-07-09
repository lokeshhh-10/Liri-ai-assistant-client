import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb.js';
import { ok, error } from '../lib/response.js';

/**
 * GET /api/blogs/pinned
 * Public endpoint — returns up to 3 pinned & published blogs, sorted by publishedAt desc.
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    return error(res, 405, 'Method not allowed');
  }

  try {
    const { db } = await connectToDatabase();
    const blogs = db.collection('blogs');

    const pinnedBlogs = await blogs
      .find({ isPinned: true, isPublished: true })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3)
      .toArray();

    // Cache at CDN edge for 2 minutes; pinned blogs don't change often
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=120, max-age=30, stale-while-revalidate=300'
    );

    return ok(res, { blogs: pinnedBlogs });
  } catch (err) {
    console.error('[/api/blogs/pinned] Error:', err);
    return error(res, 500, 'Internal server error');
  }
}
