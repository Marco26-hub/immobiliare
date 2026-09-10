import { type Property } from '@/app/data';
import { deleteProperty, listProperties, slugify, upsertProperty } from '@/lib/properties';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });

export async function GET() {
  const result = await listProperties(await isAdminAuthenticated());
  return json(result);
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return json({ error: 'Non autorizzato' }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Property>;
  const now = new Date().toISOString();
  const id = body.id || crypto.randomUUID();
  const property: Property = {
    id,
    slug: body.slug || `${slugify(body.title || 'nuovo-immobile')}-${id.slice(0, 6)}`,
    title: body.title || 'Nuovo immobile',
    city: body.city || 'Milano',
    district: body.district || 'Centro',
    address: body.address || 'Indirizzo riservato',
    price: Number(body.price || 0),
    surface: Number(body.surface || 0),
    rooms: Number(body.rooms || 1),
    bathrooms: Number(body.bathrooms || 1),
    floor: body.floor || 'N/D',
    energyClass: body.energyClass || 'A',
    status: body.status || 'draft',
    featured: Boolean(body.featured),
    promoted: Boolean(body.promoted),
    category: body.category || 'Appartamento',
    heroImage:
      body.heroImage ||
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
    gallery: body.gallery?.length ? body.gallery : [],
    shortDescription: body.shortDescription || '',
    description: body.description || '',
    highlights: body.highlights?.length ? body.highlights : ['Nuova acquisizione'],
    createdAt: body.createdAt || now,
  };

  return json({ property: await upsertProperty(property) }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return json({ error: 'Non autorizzato' }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return json({ error: 'ID mancante' }, { status: 400 });
  return (await deleteProperty(id))
    ? json({ ok: true })
    : json({ error: 'Immobile non trovato' }, { status: 404 });
}
