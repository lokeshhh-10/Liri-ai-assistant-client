import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearTokenCookie } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed');
  }

  res.setHeader('Set-Cookie', clearTokenCookie());
  return ok(res, { message: 'Logged out successfully' });
}
