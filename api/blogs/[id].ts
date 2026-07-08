import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb.js';
import { requireAuth } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';
import { validateBlogUpdate } from '../lib/validation.js';
import type { BlogUpdatePayload } from '../lib/validation.js';
import { ObjectId } from 'mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const { id } = req.query;
  const idStr = Array.isArray(id) ? id[0] : id;

  if (!idStr || !ObjectId.isValid(idStr)) {
    return error(res, 400, 'Invalid blog ID');
  }

  try {
    const { db } = await connectToDatabase();
    const blogs = db.collection('blogs');
    const objectId = new ObjectId(idStr);

    // GET /api/blogs/:id
    if (req.method === 'GET') {
      const blog = await blogs.findOne({ _id: objectId });
      if (!blog) return error(res, 404, 'Blog not found');
      return ok(res, { blog });
    }

    // PUT /api/blogs/:id — update (protected)
    if (req.method === 'PUT') {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const data = (req.body as BlogUpdatePayload) || ({} as BlogUpdatePayload);
      const validation = validateBlogUpdate(data);
      if (!validation.valid) {
        return error(res, 400, validation.message);
      }

      const existing = await blogs.findOne({ _id: objectId });
      if (!existing) return error(res, 404, 'Blog not found');

      // Check slug uniqueness (allow same slug on same doc)
      if (data.slug && data.slug !== existing.slug) {
        const slugConflict = await blogs.findOne({ slug: data.slug });
        if (slugConflict) return error(res, 409, 'A blog with this slug already exists.');
      }

      const now = new Date();
      const wasPublished = existing.isPublished as boolean;
      const willPublish = data.isPublished === true;

      const updateFields = {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.slug !== undefined && { slug: data.slug.trim() }),
        ...(data.excerpt !== undefined && { excerpt: data.excerpt.trim() }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
        ...(data.category !== undefined && { category: data.category.trim() }),
        ...(data.tags !== undefined && {
          tags: Array.isArray(data.tags) ? data.tags.map((t: string) => t.trim()).filter(Boolean) : [],
        }),
        ...(data.author !== undefined && { author: data.author.trim() }),
        ...(data.isPublished !== undefined && { isPublished: willPublish }),
        // Set publishedAt when first publishing
        ...(!wasPublished && willPublish && { publishedAt: now }),
        updatedAt: now,
      };

      await blogs.updateOne({ _id: objectId }, { $set: updateFields });
      const updated = await blogs.findOne({ _id: objectId });
      return ok(res, { blog: updated });
    }

    // DELETE /api/blogs/:id (protected)
    if (req.method === 'DELETE') {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const result = await blogs.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) return error(res, 404, 'Blog not found');
      return ok(res, { message: 'Blog deleted successfully' });
    }

    return error(res, 405, 'Method not allowed');
  } catch (err) {
    console.error('[/api/blogs/:id] Error:', err);
    return error(res, 500, 'Internal server error');
  }
}
