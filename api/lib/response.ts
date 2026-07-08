import type { VercelResponse } from '@vercel/node';

/**
 * Send a successful JSON response.
 */
export function ok(res: VercelResponse, data: Record<string, unknown> = {}, status = 200): void {
  res.status(status).json({ success: true, ...data });
}

/**
 * Send an error JSON response.
 */
export function error(res: VercelResponse, status = 500, message = 'Internal server error'): void {
  res.status(status).json({ success: false, message });
}
