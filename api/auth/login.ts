import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signToken } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    return error(res, 405, 'Method not allowed');
  }

  const { username, password } = (req.body as { username?: string; password?: string }) || {};

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return error(res, 500, 'Admin credentials not configured');
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return error(res, 401, 'Invalid username or password');
  }

  const cookieHeader = signToken({ username, role: 'admin' });
  res.setHeader('Set-Cookie', cookieHeader);

  return ok(res, { message: 'Login successful' });
}
