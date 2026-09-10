import { createAppointment, listAppointments, listBookedSlots, updateAppointmentStatus, type AppointmentStatus } from '@/lib/appointments';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const runtime = 'nodejs';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedStatuses: AppointmentStatus[] = ['new', 'confirmed', 'completed', 'cancelled'];
const allowedTimes = ['09:30', '11:00', '14:30', '16:00', '17:30'];
const allowedServices = ['Visita immobile', 'Valutazione e vendita', 'Affitto immobile', 'Gestione locazioni', 'Ricerca immobile', 'Incontro conoscitivo', 'Consulenza immobiliare'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (date) {
    return Response.json({ booked: await listBookedSlots(date) }, { headers: { 'cache-control': 'no-store' } });
  }

  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  return Response.json({ appointments: await listAppointments() }, { headers: { 'cache-control': 'no-store' } });
}

export async function POST(request: Request) {
  const body = await request.json() as Record<string, unknown>;
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const date = String(body.date || '');
  const time = String(body.time || '');
  const service = String(body.service || 'Visita immobile').trim();

  if (name.length < 2 || name.length > 120 || !emailPattern.test(email) || email.length > 180 || phone.length < 6 || phone.length > 40 || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !allowedTimes.includes(time) || !allowedServices.includes(service)) {
    return Response.json({ error: 'Controlla i dati inseriti' }, { status: 400 });
  }

  const appointmentDate = new Date(`${date}T12:00:00Z`);
  const today = new Date().toISOString().slice(0, 10);
  if (Number.isNaN(appointmentDate.getTime()) || date < today) {
    return Response.json({ error: 'Seleziona una data futura' }, { status: 400 });
  }

  try {
    const appointment = await createAppointment({
      propertyId: body.propertyId ? String(body.propertyId) : null,
      propertyTitle: body.propertyTitle ? String(body.propertyTitle) : null,
      service,
      name,
      email,
      phone,
      date,
      time,
      message: String(body.message || '').trim().slice(0, 1200),
    });
    return Response.json({ appointment }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'SLOT_OCCUPIED') {
      return Response.json({ error: 'Questo orario è appena stato prenotato. Scegline un altro.' }, { status: 409 });
    }
    return Response.json({ error: 'Prenotazione non disponibile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: 'Non autorizzato' }, { status: 401 });
  }
  const body = await request.json() as { id?: string; status?: AppointmentStatus };
  if (!body.id || !body.status || !allowedStatuses.includes(body.status)) {
    return Response.json({ error: 'Dati non validi' }, { status: 400 });
  }
  const appointment = await updateAppointmentStatus(body.id, body.status);
  return appointment
    ? Response.json({ appointment })
    : Response.json({ error: 'Appuntamento non trovato' }, { status: 404 });
}
