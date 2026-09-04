import { env } from 'cloudflare:workers';

export async function POST(request: Request) {
  if (!env.FILES) {
    return Response.json({ error: 'Archivio immagini non disponibile' }, { status: 503 });
  }

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'File mancante' }, { status: 400 });
  }

  const key = `properties/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
  await env.FILES.put(key, file.stream(), {
    httpMetadata: { contentType: file.type || 'application/octet-stream' },
  });

  return Response.json({ key, url: `/api/uploads/${encodeURIComponent(key)}` });
}

