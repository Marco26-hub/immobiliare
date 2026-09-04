import { seedProperties, type Property } from '@/app/data';
import { env } from 'cloudflare:workers';

const json = (data: unknown, init?: ResponseInit) =>
  Response.json(data, {
    ...init,
    headers: {
      'cache-control': 'no-store',
      ...(init?.headers ?? {}),
    },
  });

async function ensureSchema() {
  const db = env.DB;
  if (!db) {
    throw new Error('D1 binding missing');
  }
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      city TEXT NOT NULL,
      district TEXT NOT NULL,
      address TEXT NOT NULL,
      price INTEGER NOT NULL,
      surface INTEGER NOT NULL,
      rooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      floor TEXT NOT NULL,
      energy_class TEXT NOT NULL,
      status TEXT NOT NULL,
      featured INTEGER NOT NULL,
      promoted INTEGER NOT NULL,
      category TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      gallery TEXT NOT NULL,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
  ).run();
  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_properties_status_promoted ON properties(status, promoted)',
  ).run();
  await db.prepare(
    'CREATE INDEX IF NOT EXISTS idx_properties_city_category ON properties(city, category)',
  ).run();
  const count = await db.prepare('SELECT COUNT(*) as total FROM properties').first<{ total: number }>();
  if (!count?.total) {
    for (const property of seedProperties) {
      await insertProperty(property);
    }
  }
}

function rowToProperty(row: Record<string, unknown>): Property {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    city: String(row.city),
    district: String(row.district),
    address: String(row.address),
    price: Number(row.price),
    surface: Number(row.surface),
    rooms: Number(row.rooms),
    bathrooms: Number(row.bathrooms),
    floor: String(row.floor),
    energyClass: String(row.energy_class),
    status: row.status as Property['status'],
    featured: Boolean(row.featured),
    promoted: Boolean(row.promoted),
    category: String(row.category),
    heroImage: String(row.hero_image),
    gallery: JSON.parse(String(row.gallery || '[]')),
    shortDescription: String(row.short_description),
    description: String(row.description),
    highlights: JSON.parse(String(row.highlights || '[]')),
    createdAt: String(row.created_at),
  };
}

async function insertProperty(property: Property) {
  const db = env.DB;
  if (!db) {
    throw new Error('D1 binding missing');
  }
  await db.prepare(
    `INSERT OR REPLACE INTO properties (
      id, slug, title, city, district, address, price, surface, rooms, bathrooms,
      floor, energy_class, status, featured, promoted, category, hero_image,
      gallery, short_description, description, highlights, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      property.id,
      property.slug,
      property.title,
      property.city,
      property.district,
      property.address,
      property.price,
      property.surface,
      property.rooms,
      property.bathrooms,
      property.floor,
      property.energyClass,
      property.status,
      property.featured ? 1 : 0,
      property.promoted ? 1 : 0,
      property.category,
      property.heroImage,
      JSON.stringify(property.gallery),
      property.shortDescription,
      property.description,
      JSON.stringify(property.highlights),
      property.createdAt,
    )
    .run();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

export async function GET() {
  try {
    await ensureSchema();
    const rows = await env.DB.prepare(
      'SELECT * FROM properties ORDER BY promoted DESC, featured DESC, created_at DESC',
    ).all<Record<string, unknown>>();
    return json({ properties: rows.results.map(rowToProperty) });
  } catch {
    return json({ properties: seedProperties, demo: true });
  }
}

export async function POST(request: Request) {
  await ensureSchema();
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
  await insertProperty(property);
  return json({ property }, { status: 201 });
}
