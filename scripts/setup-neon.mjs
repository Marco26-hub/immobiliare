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

await sql`
  CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    property_id TEXT,
    property_title TEXT,
    service TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS idx_appointments_date
  ON appointments(appointment_date, appointment_time)
`;

await sql`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_active_slot
  ON appointments(appointment_date, appointment_time)
  WHERE status <> 'cancelled'
`;

console.log('Neon pronto: tabelle properties e appointments con relativi indici create.');
