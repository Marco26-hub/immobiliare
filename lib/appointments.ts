import { getSql } from '@/lib/db';

export type AppointmentStatus = 'new' | 'confirmed' | 'completed' | 'cancelled';

export type Appointment = {
  id: string;
  propertyId: string | null;
  propertyTitle: string | null;
  service: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message: string;
  status: AppointmentStatus;
  createdAt: string;
};

function normalizeDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function rowToAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: String(row.id),
    propertyId: row.property_id ? String(row.property_id) : null,
    propertyTitle: row.property_title ? String(row.property_title) : null,
    service: String(row.service),
    name: String(row.name),
    email: String(row.email),
    phone: String(row.phone),
    date: normalizeDate(row.appointment_date),
    time: String(row.appointment_time),
    message: String(row.message || ''),
    status: row.status as AppointmentStatus,
    createdAt: String(row.created_at),
  };
}

export async function ensureAppointmentsSchema() {
  const sql = getSql();
  if (!sql) return false;
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
  await sql`CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date, appointment_time)`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_appointments_active_slot
    ON appointments(appointment_date, appointment_time)
    WHERE status <> 'cancelled'
  `;
  return true;
}

export async function listBookedSlots(date: string) {
  const sql = getSql();
  if (!sql) return [];
  await ensureAppointmentsSchema();
  const rows = await sql`
    SELECT appointment_time FROM appointments
    WHERE appointment_date = ${date}::date AND status <> 'cancelled'
  `;
  return rows.map((row) => String(row.appointment_time));
}

export async function listAppointments() {
  const sql = getSql();
  if (!sql) return [];
  await ensureAppointmentsSchema();
  const rows = await sql`
    SELECT * FROM appointments
    ORDER BY appointment_date ASC, appointment_time ASC, created_at DESC
  `;
  return rows.map(rowToAppointment);
}

export async function createAppointment(input: Omit<Appointment, 'id' | 'status' | 'createdAt'>) {
  const sql = getSql();
  if (!sql) throw new Error('Database non configurato');
  await ensureAppointmentsSchema();

  const occupied = await sql`
    SELECT id FROM appointments
    WHERE appointment_date = ${input.date}::date
      AND appointment_time = ${input.time}
      AND status <> 'cancelled'
    LIMIT 1
  `;
  if (occupied.length) throw new Error('SLOT_OCCUPIED');

  const id = crypto.randomUUID();
  try {
    const rows = await sql`
      INSERT INTO appointments (
        id, property_id, property_title, service, name, email, phone,
        appointment_date, appointment_time, message, status
      ) VALUES (
        ${id}, ${input.propertyId}, ${input.propertyTitle}, ${input.service},
        ${input.name}, ${input.email}, ${input.phone}, ${input.date}::date,
        ${input.time}, ${input.message}, 'new'
      ) RETURNING *
    `;
    return rowToAppointment(rows[0]);
  } catch (error) {
    if (typeof error === 'object' && error && 'code' in error && error.code === '23505') {
      throw new Error('SLOT_OCCUPIED');
    }
    throw error;
  }
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus) {
  const sql = getSql();
  if (!sql) return null;
  const rows = await sql`
    UPDATE appointments SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return rows[0] ? rowToAppointment(rows[0]) : null;
}
