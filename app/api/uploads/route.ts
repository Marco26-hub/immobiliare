import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'File mancante' }, { status: 400 });
  }

  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const blob = await put(`properties/${crypto.randomUUID()}-${filename}`, file, {
    access: 'public',
  });

  return Response.json({ url: blob.url, key: blob.pathname });
}

