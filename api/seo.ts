import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectToDatabase } from './lib/mongodb.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const pathParam = req.query.path;
    const slug = Array.isArray(pathParam) ? pathParam[0] : pathParam;

    let title = "Blog | Lokeshwaran K";
    let description = "Read my latest thoughts and articles.";
    let image = "https://lokeshhh.me/Profile.jpeg";
    let url = `https://lokeshhh.me/blog/${slug || ''}`;

    if (slug) {
      const { db } = await connectToDatabase();
      const blog = await db.collection('blogs').findOne({ slug, isPublished: true });
      if (blog) {
        title = blog.title;
        description = blog.excerpt || description;
        image = blog.coverImage || image;
      }
    }

    // Fetch the base HTML from the deployed site root
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'lokeshhh.me';
    const baseUrl = `${protocol}://${host}`;

    const baseRes = await fetch(`${baseUrl}/`);
    let html = await baseRes.text();

    // Inject Open Graph tags
    html = html.replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(title)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(description)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:image" content="${escapeHtml(image)}" />`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:url" content="${escapeHtml(url)}" />`
    );

    // Inject Twitter tags
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(title)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(description)}" />`
    );
    html = html.replace(
      /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:image" content="${escapeHtml(image)}" />`
    );

    // Update <title>
    html = html.replace(
      /<title>.*?<\/title>/i,
      `<title>${escapeHtml(title)}</title>`
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, max-age=30, stale-while-revalidate=600');
    return res.status(200).send(html);
  } catch (error) {
    console.error('[seo] Error:', error);
    // If something fails, try to fallback to a standard redirect or simple text
    // The client will still render correctly if we just send back a default HTML or redirect.
    return res.redirect(302, '/');
  }
}

function escapeHtml(unsafe: string) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
