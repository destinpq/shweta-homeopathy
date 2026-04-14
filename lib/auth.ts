// JWT auth utilities for admin
import { SignJWT, jwtVerify } from 'jose';

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET is not set');
  return new TextEncoder().encode(s);
};

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secret());
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    if (token) return token;
  }
  // Fall back to the httpOnly cookie sent automatically by the browser
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}
