import { cookies } from 'next/headers';
import { ADMIN_COOKIE } from '@/lib/admin-auth-constants';

export async function isAdminAuthenticated() {
  const sessionToken = process.env.ADMIN_SESSION_TOKEN;
  if (!sessionToken) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === sessionToken;
}
