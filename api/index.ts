/**
 * Single unified API handler for the Vercel Hobby plan (max 12 serverless functions).
 *
 * All routes are handled here via manual path routing instead of separate files.
 * This keeps the entire backend within the 12-function limit.
 *
 * Routes:
 *   POST   /api/auth/login
 *   POST   /api/auth/logout
 *   GET    /api/auth/me
 *
 *   GET    /api/blogs               — list all (admin: all, public: published only)
 *   POST   /api/blogs               — create blog (protected)
 *   GET    /api/blogs/pinned        — list pinned published blogs (public)
 *   GET    /api/blogs/slug/:slug    — get blog by slug (public)
 *   GET    /api/blogs/:id           — get blog by id
 *   PUT    /api/blogs/:id           — update blog (protected)
 *   DELETE /api/blogs/:id           — delete blog (protected)
 *   PATCH  /api/blogs/:id/publish   — toggle publish (protected)
 *   PATCH  /api/blogs/:id/pin       — toggle pin (protected)
 *
 *   POST   /api/upload/image        — upload image to Cloudinary (protected)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';

import { connectToDatabase } from './lib/mongodb.js';
import { signToken, clearTokenCookie, verifyToken, requireAuth } from './lib/auth.js';
import { ok, error } from './lib/response.js';
import { validateBlogCreate, validateBlogUpdate } from './lib/validation.js';
import type { BlogCreatePayload, BlogUpdatePayload } from './lib/validation.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Extract path segments after /api, e.g. "/api/blogs/abc123/publish" → ["blogs","abc123","publish"] */
function segments(req: VercelRequest): string[] {
  const raw = (req.url ?? '').split('?')[0]; // strip query string
  return raw.replace(/^\/api\/?/, '').split('/').filter(Boolean);
}

// ─── Main handler ────────────────────────────────────────────────────────────

let serverKeyIndex = 0;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Allow CORS for the portfolio frontend in development
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  const parts = segments(req);
  const [resource, param, action] = parts;
  const method = req.method ?? 'GET';

  try {
    // ── Chat / Gemini route ──────────────────────────────────────────────────

    if (resource === 'chat' && method === 'POST') {
      const { prompt, stream = false, model = 'gemini-2.5-flash' } =
        (req.body as { prompt?: string; stream?: boolean; model?: string }) || {};

      if (!prompt || typeof prompt !== 'string') {
        return error(res, 400, 'Missing or invalid prompt');
      }

      // Collect server-side keys
      const keys = [
        process.env.GEMINI_API_KEY1,
        process.env.GEMINI_API_KEY2,
        process.env.GEMINI_API_KEY3,
        process.env.GEMINI_API_KEY4,
        process.env.GEMINI_API_KEY5,
        process.env.GEMINI_API_KEY6,
        process.env.VITE_GEMINI_API_KEY1,
        process.env.VITE_GEMINI_API_KEY2,
        process.env.VITE_GEMINI_API_KEY3,
        process.env.VITE_GEMINI_API_KEY4,
        process.env.VITE_GEMINI_API_KEY5,
        process.env.VITE_GEMINI_API_KEY6,
      ].filter(Boolean) as string[];

      const uniqueKeys = Array.from(new Set(keys));

      if (uniqueKeys.length === 0) {
        return error(res, 500, 'No Gemini API keys configured on server environment variables.');
      }

      let attempts = 0;
      const maxAttempts = uniqueKeys.length;
      let lastErr: any = null;

      while (attempts < maxAttempts) {
        const apiKey = uniqueKeys[(serverKeyIndex++) % uniqueKeys.length];
        attempts++;

        try {
          if (stream) {
            const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
            const geminiRes = await fetch(googleUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            });

            if (!geminiRes.ok) {
              const errBody = await geminiRes.text();
              if (
                geminiRes.status === 429 ||
                geminiRes.status === 503 ||
                errBody.includes('RESOURCE_EXHAUSTED') ||
                errBody.includes('UNAVAILABLE')
              ) {
                console.warn(`Gemini server key attempt ${attempts} failed (${geminiRes.status}), failing over...`);
                continue;
              }
              return error(res, geminiRes.status, `Gemini API error: ${errBody}`);
            }

            res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
            res.setHeader('Cache-Control', 'no-cache, no-transform');
            res.setHeader('Connection', 'keep-alive');

            if (!geminiRes.body) {
              return error(res, 500, 'ReadableStream not supported on upstream response');
            }

            const reader = (geminiRes.body as any).getReader();
            const decoder = new TextDecoder('utf-8');

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const text = decoder.decode(value, { stream: true });
              res.write(text);
            }
            res.end();
            return;
          } else {
            const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const geminiRes = await fetch(googleUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            });

            const data = await geminiRes.json();

            if (!geminiRes.ok) {
              if (
                geminiRes.status === 429 ||
                geminiRes.status === 503 ||
                data?.error?.status === 'RESOURCE_EXHAUSTED' ||
                data?.error?.status === 'UNAVAILABLE'
              ) {
                console.warn(`Gemini server key attempt ${attempts} failed (${geminiRes.status}), failing over...`);
                continue;
              }
              return error(res, geminiRes.status, data?.error?.message || 'Gemini API error');
            }

            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            return ok(res, { text });
          }
        } catch (err: any) {
          lastErr = err;
          console.warn(`Gemini attempt ${attempts} encountered error:`, err?.message);
        }
      }

      return error(res, 500, lastErr?.message || 'All Gemini API keys failed or exhausted.');
    }

    // ── Auth routes ──────────────────────────────────────────────────────────

    if (resource === 'auth') {
      if (param === 'login' && method === 'POST') {
        const { username, password } = (req.body as { username?: string; password?: string }) || {};
        const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return error(res, 500, 'Admin credentials not configured');
        if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return error(res, 401, 'Invalid username or password');
        const cookieHeader = signToken({ username, role: 'admin' });
        res.setHeader('Set-Cookie', cookieHeader);
        return ok(res, { message: 'Login successful' });
      }

      if (param === 'logout' && method === 'POST') {
        res.setHeader('Set-Cookie', clearTokenCookie());
        return ok(res, { message: 'Logged out successfully' });
      }

      if (param === 'me' && method === 'GET') {
        const payload = verifyToken(req);
        if (!payload) return error(res, 401, 'Not authenticated');
        return ok(res, { authenticated: true, username: payload.username });
      }

      return error(res, 404, 'Not found');
    }

    // ── Upload routes ────────────────────────────────────────────────────────

    if (resource === 'upload') {
      if (param === 'image' && method === 'POST') {
        const auth = requireAuth(req, res);
        if (!auth) return;

        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true,
        });

        const { image, folder = 'blog-covers' } = (req.body as { image?: string; folder?: string }) || {};
        if (!image || typeof image !== 'string') return error(res, 400, 'Missing or invalid image data');

        const isGif = image.startsWith('data:image/gif') || (!image.startsWith('data:') && image.startsWith('R0lGOD'));
        const isWebp = image.startsWith('data:image/webp') || (!image.startsWith('data:') && image.startsWith('UklGR'));

        const uploadData = image.startsWith('data:')
          ? image
          : isGif
            ? `data:image/gif;base64,${image}`
            : isWebp
              ? `data:image/webp;base64,${image}`
              : `data:image/jpeg;base64,${image}`;

        const transformation = (isGif || isWebp)
          ? [{ width: 1200, crop: 'limit', flags: 'animated' }]
          : [
              { width: 1200, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' },
            ];

        const result = await cloudinary.uploader.upload(uploadData, {
          folder,
          resource_type: 'image',
          transformation,
        });

        return ok(res, {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }

      return error(res, 404, 'Not found');
    }

    // ── Blog routes ──────────────────────────────────────────────────────────

    if (resource === 'blogs') {
      const { db } = await connectToDatabase();
      const blogs = db.collection('blogs');

      // GET /api/blogs/pinned
      if (param === 'pinned' && method === 'GET') {
        const pinnedBlogs = await blogs
          .find({ isPinned: true, isPublished: true })
          .sort({ publishedAt: -1, createdAt: -1 })
          .limit(3)
          .toArray();
        res.setHeader('Cache-Control', 'public, s-maxage=120, max-age=30, stale-while-revalidate=300');
        return ok(res, { blogs: pinnedBlogs });
      }

      // GET /api/blogs/slug/:slug
      if (param === 'slug' && action && method === 'GET') {
        const blog = await blogs.findOne({ slug: action, isPublished: true });
        if (!blog) return error(res, 404, 'Blog not found');
        res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=30, stale-while-revalidate=600');
        return ok(res, { blog });
      }

      // GET /api/blogs  or  POST /api/blogs
      if (!param) {
        if (method === 'GET') {
          const authPayload = verifyToken(req);
          const query = authPayload ? {} : { isPublished: true };
          const sort = { publishedAt: -1, createdAt: -1 } as const;
          const blogList = await blogs.find(query).sort(sort).toArray();
          return ok(res, { blogs: blogList });
        }

        if (method === 'POST') {
          const auth = requireAuth(req, res);
          if (!auth) return;

          const data = (req.body as BlogCreatePayload) || ({} as BlogCreatePayload);
          const validation = validateBlogCreate(data);
          if (!validation.valid) return error(res, 400, validation.message);

          const existingSlug = await blogs.findOne({ slug: data.slug });
          if (existingSlug) return error(res, 409, 'A blog with this slug already exists.');

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
            isPinned: false,
            publishedAt: data.isPublished ? now : null,
            createdAt: now,
            updatedAt: now,
          };

          const result = await blogs.insertOne(newBlog);
          return ok(res, { blog: { ...newBlog, _id: result.insertedId } }, 201);
        }

        return error(res, 405, 'Method not allowed');
      }

      // Routes with :id  — param is the blog ID
      if (!ObjectId.isValid(param)) return error(res, 400, 'Invalid blog ID');
      const objectId = new ObjectId(param);

      // PATCH /api/blogs/:id/publish
      if (action === 'publish' && method === 'PATCH') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const blog = await blogs.findOne({ _id: objectId });
        if (!blog) return error(res, 404, 'Blog not found');
        const newPublishedState = !blog.isPublished;
        const now = new Date();
        await blogs.updateOne({ _id: objectId }, {
          $set: {
            isPublished: newPublishedState,
            ...(newPublishedState && !blog.publishedAt && { publishedAt: now }),
            updatedAt: now,
          },
        });
        const updated = await blogs.findOne({ _id: objectId });
        return ok(res, { blog: updated });
      }

      // PATCH /api/blogs/:id/pin
      if (action === 'pin' && method === 'PATCH') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const blog = await blogs.findOne({ _id: objectId });
        if (!blog) return error(res, 404, 'Blog not found');
        const newPinnedState = !blog.isPinned;
        if (newPinnedState) {
          const pinnedCount = await blogs.countDocuments({ isPinned: true });
          if (pinnedCount >= 3) return error(res, 400, 'You can only pin up to 3 blogs at a time. Unpin another blog first.');
        }
        const now = new Date();
        await blogs.updateOne({ _id: objectId }, { $set: { isPinned: newPinnedState, updatedAt: now } });
        const updated = await blogs.findOne({ _id: objectId });
        return ok(res, { blog: updated });
      }

      // GET /api/blogs/:id
      if (!action && method === 'GET') {
        const blog = await blogs.findOne({ _id: objectId });
        if (!blog) return error(res, 404, 'Blog not found');
        return ok(res, { blog });
      }

      // PUT /api/blogs/:id
      if (!action && method === 'PUT') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const data = (req.body as BlogUpdatePayload) || ({} as BlogUpdatePayload);
        const validation = validateBlogUpdate(data);
        if (!validation.valid) return error(res, 400, validation.message);

        const existing = await blogs.findOne({ _id: objectId });
        if (!existing) return error(res, 404, 'Blog not found');

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
          ...(!wasPublished && willPublish && { publishedAt: now }),
          updatedAt: now,
        };

        await blogs.updateOne({ _id: objectId }, { $set: updateFields });
        const updated = await blogs.findOne({ _id: objectId });
        return ok(res, { blog: updated });
      }

      // DELETE /api/blogs/:id
      if (!action && method === 'DELETE') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const result = await blogs.deleteOne({ _id: objectId });
        if (result.deletedCount === 0) return error(res, 404, 'Blog not found');
        return ok(res, { message: 'Blog deleted successfully' });
      }

      return error(res, 405, 'Method not allowed');
    }

    return error(res, 404, 'Not found');
  } catch (err) {
    console.error('[api/index] Unhandled error:', err);
    return error(res, 500, 'Internal server error');
  }
}
