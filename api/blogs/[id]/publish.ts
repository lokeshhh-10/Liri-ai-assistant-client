import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../../lib/mongodb.js';
import { requireAuth } from '../../lib/auth.js';
import { ok, error } from '../../lib/response.js';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'PATCH') {
    return error(res, 405, 'Method not allowed');
  }

  const auth = requireAuth(req, res);
  if (!auth) return;

  const { id } = req.query;
  const idStr = Array.isArray(id) ? id[0] : id;

  if (!idStr || !ObjectId.isValid(idStr)) {
    return error(res, 400, 'Invalid blog ID');
  }

  try {
    const { db } = await connectToDatabase();
    const blogs = db.collection('blogs');
    const objectId = new ObjectId(idStr);

    const blog = await blogs.findOne({ _id: objectId });
    if (!blog) return error(res, 404, 'Blog not found');

    const newPublishedState = !blog.isPublished;
    const now = new Date();

    await blogs.updateOne(
      { _id: objectId },
      {
        $set: {
          isPublished: newPublishedState,
          ...(newPublishedState && !blog.publishedAt && { publishedAt: now }),
          updatedAt: now,
        },
      }
    );

    const updated = await blogs.findOne({ _id: objectId });
    return ok(res, { blog: updated });
  } catch (err) {
    console.error('[/api/blogs/:id/publish] Error:', err);
    return error(res, 500, 'Internal server error');
  }
}
