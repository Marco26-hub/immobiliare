import { timingSafeEqual } from 'node:crypto';
import { ADMIN_COOKIE } from '@/lib/admin-auth-constants';

export const runtime = 'nodejs';

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export async function POST(request: Request) {
  const { password } = (await request.json()) as { password?: string };
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;

  if (!password || !expectedPassword || !sessionToken || !safeEqual(password, expectedPassword)) {
    return Response.json({ error: 'Password non valida' }, { status: 401 });
  }

  const response = Response.json({ ok: true });
  response.headers.append(
    'set-cookie',
    `${ADMIN_COOKIE}=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=28800`,
  );
  return response;
}
