import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken } from '../lib/auth.js';
import { ok, error } from '../lib/response.js';

export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'GET') {
    return error(res, 405, 'Method not allowed');
  }

  const payload = verifyToken(req);
  if (!payload) {
    return error(res, 401, 'Not authenticated');
  }

  return ok(res, { authenticated: true, username: payload.username });
}
