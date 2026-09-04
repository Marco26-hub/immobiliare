import { neon } from '@neondatabase/serverless';
import { seedProperties, type Property } from '@/app/data';

function getSql() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return neon(process.env.DATABASE_URL);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 70);
}

export function rowToProperty(row: Record<string, unknown>): Property {
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
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : JSON.parse(String(row.gallery || '[]')),
    shortDescription: String(row.short_description),
    description: String(row.description),
    highlights: Array.isArray(row.highlights)
      ? (row.highlights as string[])
      : JSON.parse(String(row.highlights || '[]')),
    createdAt: String(row.created_at),
  };
}

export async function ensurePropertiesSchema() {
  const sql = getSql();
  if (!sql) {
    return false;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS properties (
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
      featured BOOLEAN NOT NULL DEFAULT false,
      promoted BOOLEAN NOT NULL DEFAULT false,
      category TEXT NOT NULL,
      hero_image TEXT NOT NULL,
      gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      short_description TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_properties_status_promoted
    ON properties(status, promoted)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_properties_city_category
    ON properties(city, category)
  `;

  const [{ total }] = await sql`SELECT COUNT(*)::int AS total FROM properties`;
  if (!total) {
    for (const property of seedProperties) {
      await upsertProperty(property);
    }
  }

  return true;
}

export async function listProperties() {
  const sql = getSql();
  if (!sql) {
    return { properties: seedProperties, demo: true };
  }

  await ensurePropertiesSchema();
  const rows = await sql`
    SELECT * FROM properties
    ORDER BY promoted DESC, featured DESC, created_at DESC
  `;

  return { properties: rows.map(rowToProperty), demo: false };
}

export async function getPropertyBySlug(slug: string) {
  const sql = getSql();
  if (!sql) {
    return seedProperties.find((property) => property.slug === slug) || null;
  }

  await ensurePropertiesSchema();
  const rows = await sql`SELECT * FROM properties WHERE slug = ${slug} LIMIT 1`;
  return rows[0] ? rowToProperty(rows[0]) : null;
}

export async function upsertProperty(property: Property) {
  const sql = getSql();
  if (!sql) {
    return property;
  }

  await sql`
    INSERT INTO properties (
      id, slug, title, city, district, address, price, surface, rooms, bathrooms,
      floor, energy_class, status, featured, promoted, category, hero_image,
      gallery, short_description, description, highlights, created_at
    ) VALUES (
      ${property.id}, ${property.slug}, ${property.title}, ${property.city},
      ${property.district}, ${property.address}, ${property.price}, ${property.surface},
      ${property.rooms}, ${property.bathrooms}, ${property.floor}, ${property.energyClass},
      ${property.status}, ${property.featured}, ${property.promoted}, ${property.category},
      ${property.heroImage}, ${JSON.stringify(property.gallery)}::jsonb,
      ${property.shortDescription}, ${property.description},
      ${JSON.stringify(property.highlights)}::jsonb, ${property.createdAt}
    )
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      title = EXCLUDED.title,
      city = EXCLUDED.city,
      district = EXCLUDED.district,
      address = EXCLUDED.address,
      price = EXCLUDED.price,
      surface = EXCLUDED.surface,
      rooms = EXCLUDED.rooms,
      bathrooms = EXCLUDED.bathrooms,
      floor = EXCLUDED.floor,
      energy_class = EXCLUDED.energy_class,
      status = EXCLUDED.status,
      featured = EXCLUDED.featured,
      promoted = EXCLUDED.promoted,
      category = EXCLUDED.category,
      hero_image = EXCLUDED.hero_image,
      gallery = EXCLUDED.gallery,
      short_description = EXCLUDED.short_description,
      description = EXCLUDED.description,
      highlights = EXCLUDED.highlights
  `;

  return property;
}

