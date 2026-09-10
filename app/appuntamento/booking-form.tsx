'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarCheck2, CalendarDays, Check, Clock3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { seedProperties, type Property } from '@/app/data';

const timeSlots = ['09:30', '11:00', '14:30', '16:00', '17:30'];
const services = ['Visita immobile', 'Valutazione e vendita', 'Affitto immobile', 'Gestione locazioni', 'Ricerca immobile', 'Incontro conoscitivo', 'Consulenza immobiliare'];

function localDate(daysAhead = 1) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function BookingForm() {
  const searchParams = useSearchParams();
  const requestedProperty = searchParams.get('property') || '';
  const requestedService = searchParams.get('service') || '';
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [propertyId, setPropertyId] = useState(requestedProperty);
  const [service, setService] = useState(requestedService || (requestedProperty ? 'Visita immobile' : 'Valutazione e vendita'));
  const [date, setDate] = useState(localDate());
  const [time, setTime] = useState('');
  const [booked, setBooked] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => setProperties(data.properties || seedProperties))
      .catch(() => setProperties(seedProperties));
  }, []);

  useEffect(() => {
    if (!date) return;
    setLoadingSlots(true);
    setTime('');
    fetch(`/api/appointments?date=${encodeURIComponent(date)}`)
      .then((response) => response.json())
      .then((data) => setBooked(data.booked || []))
      .catch(() => setBooked([]))
      .finally(() => setLoadingSlots(false));
  }, [date]);

  const selectedProperty = useMemo(() => properties.find((item) => item.id === propertyId), [properties, propertyId]);
  const formattedDate = confirmation
    ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'long' }).format(new Date(`${confirmation.date}T12:00:00`))
    : '';

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!time) {
      setError('Seleziona un orario disponibile.');
      return;
    }
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          message: formData.get('message'),
          service,
          date,
          time,
          propertyId: selectedProperty?.id || null,
          propertyTitle: selectedProperty?.title || null,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Non è stato possibile confermare la prenotazione.');
      setConfirmation({ date, time });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Non è stato possibile confermare la prenotazione.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmation) {
    return (
      <section className="booking-success mx-auto max-w-3xl px-5 py-24">
        <span><Check className="h-8 w-8" /></span>
        <p className="eyebrow">Appuntamento registrato</p>
        <h1 className="display-type mt-4 text-5xl leading-none md:text-7xl">Ci vediamo {formattedDate}.</h1>
        <p className="mt-6 text-xl text-[#655c4f]">Orario: <strong>{confirmation.time}</strong>. La richiesta è arrivata al team Maison Aurea e verrà confermata utilizzando i recapiti indicati.</p>
        <div className="mt-9 flex flex-wrap gap-3"><Link className="premium-button dark" href="/">Torna alla home</Link><Link className="premium-button light" href="/immobili">Esplora gli immobili</Link></div>
      </section>
    );
  }

  return (
    <section className="booking-page">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <aside className="booking-intro lg:sticky lg:top-28">
          <Link className="back-link" href={selectedProperty ? `/properties/${selectedProperty.slug}` : '/'}><ArrowLeft className="h-4 w-4" /> Torna indietro</Link>
          <p className="eyebrow mt-10">Agenda Maison Aurea</p>
          <h1 className="display-type mt-4 text-5xl leading-none md:text-7xl">Il tempo giusto per parlare del tuo progetto.</h1>
          <p className="mt-6 text-lg leading-8 text-[#655c4f]">Scegli servizio, giorno e orario. L’appuntamento entra direttamente nella nostra agenda riservata.</p>
          <div className="booking-notes mt-8">
            <span><CalendarCheck2 className="h-5 w-5" /> Prenotazione immediata</span>
            <span><Clock3 className="h-5 w-5" /> Incontro di circa 45 minuti</span>
            <span><ShieldCheck className="h-5 w-5" /> Dati trattati in modo riservato</span>
          </div>
        </aside>

        <form className="booking-form" onSubmit={submitBooking}>
          <div className="booking-form-heading"><span><CalendarDays className="h-5 w-5" /></span><div><p>Richiesta appuntamento</p><h2>Componi il tuo incontro</h2></div></div>

          <div className="form-section">
            <span className="form-step">01</span>
            <div><h3>Di cosa vuoi parlare?</h3><p>Seleziona il servizio e, se utile, l’immobile di tuo interesse.</p></div>
            <label className="form-field form-field-wide"><span>Servizio</span><select onChange={(event) => setService(event.target.value)} value={service}>{services.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="form-field form-field-wide"><span>Immobile (facoltativo)</span><select onChange={(event) => { setPropertyId(event.target.value); if (event.target.value) setService('Visita immobile'); }} value={propertyId}><option value="">Nessun immobile selezionato</option>{properties.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.city}</option>)}</select></label>
          </div>

          <div className="form-section">
            <span className="form-step">02</span>
            <div><h3>Quando preferisci?</h3><p>Gli orari già occupati non sono selezionabili.</p></div>
            <label className="form-field form-field-wide"><span>Data</span><Input min={localDate()} name="date" onChange={(event) => setDate(event.target.value)} required type="date" value={date} /></label>
            <div className="time-slots form-field-wide" aria-label="Orari disponibili">
              {timeSlots.map((slot) => {
                const unavailable = booked.includes(slot);
                return <button aria-pressed={time === slot} className={time === slot ? 'selected' : ''} disabled={unavailable || loadingSlots} key={slot} onClick={() => setTime(slot)} type="button"><Clock3 className="h-4 w-4" /> {slot}{unavailable && <small>Occupato</small>}</button>;
              })}
            </div>
          </div>

          <div className="form-section contact-section">
            <span className="form-step">03</span>
            <div><h3>Come possiamo ricontattarti?</h3><p>Inserisci i dati della persona che parteciperà all’incontro.</p></div>
            <label className="form-field"><span>Nome e cognome</span><Input autoComplete="name" name="name" required /></label>
            <label className="form-field"><span>Email</span><Input autoComplete="email" name="email" required type="email" /></label>
            <label className="form-field form-field-wide"><span>Telefono</span><Input autoComplete="tel" name="phone" required type="tel" /></label>
            <label className="form-field form-field-wide"><span>Messaggio (facoltativo)</span><Textarea className="min-h-28" name="message" placeholder="Raccontaci in poche righe cosa vuoi ottenere dall’incontro." /></label>
            <label className="privacy-check form-field-wide"><input required type="checkbox" /><span>Acconsento al trattamento dei dati per essere ricontattato in merito alla richiesta.</span></label>
          </div>

          {error && <p className="booking-error" role="alert">{error}</p>}
          <Button className="booking-submit" disabled={submitting} type="submit">{submitting ? 'Registrazione in corso...' : 'Conferma appuntamento'} <ArrowUpRight className="h-4 w-4" /></Button>
        </form>
      </div>
    </section>
  );
}
