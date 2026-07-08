import jwt, { type JwtPayload } from 'jsonwebtoken';
import { parseCookie } from 'cookie';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '7d';
const COOKIE_NAME = 'auth_token';

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

/**
 * Sign a JWT and return the Set-Cookie header string.
 */
export function signToken(payload: Record<string, unknown>): string {
  const token = jwt.sign(payload, JWT_SECRET as string, { expiresIn: JWT_EXPIRY });
  const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}; Path=/`;
}

/**
 * Clear the auth cookie by setting it expired.
 */
export function clearTokenCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;
}

/**
 * Verify the JWT from the incoming request cookies.
 * Returns the decoded payload or null if invalid/missing.
 */
export function verifyToken(req: VercelRequest): (JwtPayload & { username: string }) | null {
  try {
    const cookieHeader = (req.headers.cookie as string) || '';
    const cookies = parseCookie(cookieHeader);
    const token = cookies[COOKIE_NAME];
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET as string) as JwtPayload & { username: string };
  } catch {
    return null;
  }
}

/**
 * Checks auth cookie and returns the payload. Sends 401 if not authenticated.
 */
export function requireAuth(
  req: VercelRequest,
  res: VercelResponse
): (JwtPayload & { username: string }) | null {
  const payload = verifyToken(req);
  if (!payload) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return null;
  }
  return payload;
}
