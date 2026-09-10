import { ADMIN_COOKIE } from '@/lib/admin-auth-constants';

export async function POST() {
  const response = Response.json({ ok: true });
  response.headers.append('set-cookie', `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`);
  return response;
}
