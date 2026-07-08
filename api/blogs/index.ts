import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from '../lib/mongodb.js';
import { requireAuth, verifyToken } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';
import { validateBlogCreate } from '../lib/validation.js';
import type { BlogCreatePayload } from '../lib/validation.js';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    const blogs = db.collection('blogs');

    // GET /api/blogs — returns all blogs (admin sees all, public sees published only)
    if (req.method === 'GET') {
      const authPayload = verifyToken(req);
      const query = authPayload ? {} : { isPublished: true };
      const sort = { publishedAt: -1, createdAt: -1 } as const;

      const blogList = await blogs.find(query).sort(sort).toArray();
      return ok(res, { blogs: blogList });
    }

    // POST /api/blogs — create a new blog (protected)
    if (req.method === 'POST') {
      const auth = requireAuth(req, res);
      if (!auth) return;

      const data = (req.body as BlogCreatePayload) || ({} as BlogCreatePayload);
      const validation = validateBlogCreate(data);
      if (!validation.valid) {
        return error(res, 400, validation.message);
      }

      // Check slug uniqueness
      const existingSlug = await blogs.findOne({ slug: data.slug });
      if (existingSlug) {
        return error(res, 409, 'A blog with this slug already exists.');
      }

      const now = new Date();
      const newBlog = {
        title: data.title.trim(),
        slug: data.slug.trim(),
        excerpt: data.excerpt?.trim() ?? '',
        content: data.content,
        coverImage: data.coverImage ?? '',
        category: data.category?.trim() ?? '',
        tags: Array.isArray(data.tags) ? data.tags.map((t: string) => t.trim()).filter(Boolean) : [],
        author: data.author?.trim() ?? 'Lokeshwaran K.',
        isPublished: data.isPublished === true,
        publishedAt: data.isPublished ? now : null,
        createdAt: now,
        updatedAt: now,
      };

      const result = await blogs.insertOne(newBlog);
      return ok(res, { blog: { ...newBlog, _id: result.insertedId } }, 201);
    }

    return error(res, 405, 'Method not allowed');
  } catch (err) {
    console.error('[/api/blogs] Error:', err);
    return error(res, 500, 'Internal server error');
  }
}
