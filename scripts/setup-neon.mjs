import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL mancante. Copia .env.example in .env.local e inserisci la stringa Neon.');
  process.exit(1);
}

const sql = neon(connectionString);

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

console.log('Neon pronto: tabella properties e indici creati.');

