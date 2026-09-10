import { neon } from '@neondatabase/serverless';

export function getSql() {
  return process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
}
