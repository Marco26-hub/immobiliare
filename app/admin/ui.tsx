'use client';

import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BadgeEuro,
  CalendarDays,
  CheckCircle2,
  Eye,
  Gem,
  Home,
  ImagePlus,
  LogOut,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { formatPrice, seedProperties, type Property, type PropertyStatus } from '@/app/data';
import type { Appointment, AppointmentStatus } from '@/lib/appointments';

type View = 'properties' | 'appointments' | 'portals';

const portalRows = [
  ['Immobiliare.it', 'Feed XML pronto', '/api/feeds/immobiliare'],
  ['Idealista', 'Feed XML pronto', '/api/feeds/idealista'],
  ['Casa.it', 'Feed XML pronto', '/api/feeds/casa'],
  ['Subito', 'Export per gestionale', '/api/feeds/subito'],
  ['Wikicasa', 'Feed gestionale', '/api/feeds/wikicasa'],
  ['Trovacasa', 'Feed gestionale', '/api/feeds/trovacasa'],
];

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85';

const emptyForm: Partial<Property> = {
  title: '',
  city: 'Milano',
  district: '',
  address: '',
  price: 0,
  surface: 0,
  rooms: 3,
  bathrooms: 2,
  floor: '1',
  energyClass: 'A',
  status: 'published',
  featured: false,
  promoted: false,
  category: 'Appartamento',
  heroImage: fallbackImage,
  gallery: [],
  shortDescription: '',
  description: '',
  highlights: ['Nuova acquisizione', 'Servizio fotografico premium'],
};

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<View>('properties');
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selected, setSelected] = useState<Partial<Property>>({ ...emptyForm });
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<'hero' | 'gallery' | null>(null);

  useEffect(() => {
    void loadProperties();
    void loadAppointments();
  }, []);

  async function loadProperties() {
    try {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data.properties || seedProperties);
    } catch {
      setProperties(seedProperties);
    }
  }

  async function loadAppointments() {
    try {
      const response = await fetch('/api/appointments');
      if (response.status === 401) {
        window.location.href = '/admin/login';
        return;
      }
      const data = await response.json();
      setAppointments(data.appointments || []);
    } catch {
      setAppointments([]);
    }
  }

  const filtered = useMemo(() => {
    const term = query.toLocaleLowerCase('it');
    return properties.filter((property) =>
      [property.title, property.city, property.district, property.category].join(' ').toLocaleLowerCase('it').includes(term),
    );
  }, [properties, query]);

  function setField<K extends keyof Property>(field: K, value: Property[K]) {
    setSelected((current) => ({ ...current, [field]: value }));
  }

  function newProperty() {
    setSelected({ ...emptyForm, gallery: [], highlights: [...(emptyForm.highlights || [])] });
    setFeedback('Nuova scheda pronta');
  }

  async function saveProperty() {
    if (!selected.title?.trim() || !selected.city?.trim() || !selected.shortDescription?.trim()) {
      setFeedback('Compila titolo, città e sintesi commerciale');
      return;
    }
    setSaving(true);
    setFeedback('');
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(selected),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Salvataggio non riuscito');
      setProperties((items) => [data.property, ...items.filter((item) => item.id !== data.property.id)]);
      setSelected({ ...emptyForm, gallery: [] });
      setFeedback('Immobile salvato e pubblicazione aggiornata');
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Salvataggio non riuscito');
    } finally {
      setSaving(false);
    }
  }

  async function removeProperty(id: string) {
    if (!window.confirm('Eliminare definitivamente questo immobile?')) return;
    const response = await fetch(`/api/properties?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setFeedback(data.error || 'Eliminazione non riuscita');
      return;
    }
    setProperties((items) => items.filter((item) => item.id !== id));
    if (selected.id === id) newProperty();
    setFeedback('Immobile eliminato');
  }

  async function uploadFiles(files: File[], target: 'hero' | 'gallery') {
    if (!files.length) return;
    setUploading(target);
    setFeedback('');
    try {
      const urls: string[] = [];
      for (const file of files) {
        const form = new FormData();
        form.append('file', file);
        const response = await fetch('/api/uploads', { method: 'POST', body: form });
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.error || `Errore nel caricamento di ${file.name}`);
        urls.push(data.url);
      }
      setSelected((current) => target === 'hero'
        ? { ...current, heroImage: urls[0] }
        : { ...current, gallery: [...(current.gallery || []), ...urls] });
      setFeedback(target === 'hero' ? 'Foto principale caricata' : `${urls.length} foto aggiunte alla galleria`);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Caricamento non riuscito');
    } finally {
      setUploading(null);
    }
  }

  async function changeAppointmentStatus(id: string, status: AppointmentStatus) {
    const response = await fetch('/api/appointments', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await response.json();
    if (!response.ok) {
      setFeedback(data.error || 'Aggiornamento non riuscito');
      return;
    }
    setAppointments((items) => items.map((item) => item.id === id ? data.appointment : item));
    setFeedback('Stato appuntamento aggiornato');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/admin/login';
  }

  return (
    <main className="admin-shell min-h-screen bg-[#12110f] text-[#fff7ea]">
      <div aria-hidden="true" className="admin-aurora" />
      <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="admin-sidebar border-b border-white/10 bg-[#171511] px-5 py-6 lg:border-b-0 lg:border-r">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#d7a84d] text-[#15120d]"><Gem className="h-5 w-5" /></span>
            <span><strong className="block text-lg">Maison Aurea</strong><small className="text-[#b8ab96]">Property command center</small></span>
          </Link>

          <nav className="mt-10 space-y-2" aria-label="Sezioni amministrazione">
            <AdminNav active={activeView === 'properties'} icon={Home} label="Immobili" onClick={() => setActiveView('properties')} />
            <AdminNav active={activeView === 'appointments'} icon={CalendarDays} label="Appuntamenti" onClick={() => setActiveView('appointments')} badge={appointments.filter((item) => item.status === 'new').length} />
            <AdminNav active={activeView === 'portals'} icon={Megaphone} label="Portali" onClick={() => setActiveView('portals')} />
          </nav>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs uppercase text-[#d7a84d]">Portfolio</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <span className="admin-kpi"><strong>{properties.length}</strong>annunci</span>
              <span className="admin-kpi"><strong>{properties.filter((item) => item.promoted).length}</strong>promossi</span>
            </div>
          </div>

          <button className="admin-logout" onClick={logout} type="button"><LogOut className="h-4 w-4" /> Esci</button>
        </aside>

        <section className="relative min-w-0 px-5 py-6 lg:px-8">
          <header className="admin-header">
            <div><p className="text-sm font-semibold uppercase text-[#d7a84d]">Area riservata</p><h1 className="display-type mt-2 text-3xl md:text-5xl">{activeView === 'properties' ? 'Portfolio e pubblicazione.' : activeView === 'appointments' ? 'Agenda commerciale.' : 'Distribuzione portali.'}</h1></div>
            <div className="flex flex-wrap gap-2"><Link className="premium-button header-admin" href="/" target="_blank"><Eye className="h-4 w-4" /> Vedi sito</Link>{activeView === 'properties' && <Button className="h-11 gap-2 bg-[#d7a84d] text-[#171511] hover:bg-[#e3bc6c]" onClick={newProperty}><Plus className="h-4 w-4" /> Nuovo immobile</Button>}</div>
          </header>

          {feedback && <div className="admin-feedback" role="status"><CheckCircle2 className="h-4 w-4" /> {feedback}</div>}
          {activeView === 'properties' && <PropertiesView filtered={filtered} query={query} removeProperty={removeProperty} saveProperty={saveProperty} selected={selected} setField={setField} setQuery={setQuery} setSelected={setSelected} saving={saving} uploading={uploading} uploadFiles={uploadFiles} />}
          {activeView === 'appointments' && <AppointmentsView appointments={appointments} changeStatus={changeAppointmentStatus} />}
          {activeView === 'portals' && <PortalsView properties={properties} />}
        </section>
      </div>
    </main>
  );
}

function AdminNav({ active, badge, icon: Icon, label, onClick }: { active: boolean; badge?: number; icon: typeof Home; label: string; onClick: () => void }) {
  return <button className={`admin-nav${active ? ' active' : ''}`} onClick={onClick} type="button"><Icon className="h-4 w-4" />{label}{Boolean(badge) && <span>{badge}</span>}</button>;
}

function PropertiesView({ filtered, query, removeProperty, saveProperty, selected, setField, setQuery, setSelected, saving, uploading, uploadFiles }: {
  filtered: Property[];
  query: string;
  removeProperty: (id: string) => Promise<void>;
  saveProperty: () => Promise<void>;
  selected: Partial<Property>;
  setField: <K extends keyof Property>(field: K, value: Property[K]) => void;
  setQuery: (value: string) => void;
  setSelected: (value: Partial<Property>) => void;
  saving: boolean;
  uploading: 'hero' | 'gallery' | null;
  uploadFiles: (files: File[], target: 'hero' | 'gallery') => Promise<void>;
}) {
  return (
    <div className="mt-7 grid gap-6 2xl:grid-cols-[minmax(0,1fr)_500px]">
      <section>
        <div className="admin-search"><Search className="h-4 w-4" /><input onChange={(event) => setQuery(event.target.value)} placeholder="Cerca per città, zona o tipologia..." value={query} /></div>
        <div className="admin-table mt-5 overflow-hidden rounded-[8px] border border-white/10">
          {filtered.map((property) => (
            <article className="admin-row" key={property.id}>
              <img alt="" onError={handleImageError} src={property.heroImage} />
              <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-lg font-semibold">{property.title}</h2>{property.promoted && <span className="status-pill gold">Promo</span>}<span className="status-pill">{property.status}</span></div><p className="mt-1 text-sm text-[#b8ab96]">{property.city}, {property.district} · {property.surface} mq · {formatPrice(property.price)}</p><p className="mt-2 line-clamp-2 text-sm text-[#efe1c9]/80">{property.shortDescription}</p></div>
              <div className="flex gap-2"><Button aria-label="Modifica immobile" onClick={() => setSelected({ ...property, gallery: [...property.gallery], highlights: [...property.highlights] })} size="icon" variant="secondary"><Pencil className="h-4 w-4" /></Button><Button aria-label="Elimina immobile" onClick={() => void removeProperty(property.id)} size="icon" variant="secondary"><Trash2 className="h-4 w-4" /></Button></div>
            </article>
          ))}
        </div>
      </section>

      <aside className="admin-form-panel rounded-[8px] border border-[#d7a84d]/30 bg-[#fff7ea] p-5 text-[#171511]">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase text-[#8a6432]">{selected.id ? 'Modifica annuncio' : 'Nuova acquisizione'}</p><h2 className="mt-1 text-2xl font-semibold">Scheda immobile</h2></div><span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#171511] text-[#d7a84d]"><Home className="h-5 w-5" /></span></div>
        <div className="admin-form-grid mt-5">
          <AdminField label="Titolo dell’immobile" wide><Input onChange={(event) => setField('title', event.target.value)} value={selected.title || ''} /></AdminField>
          <AdminField label="Città"><Input onChange={(event) => setField('city', event.target.value)} value={selected.city || ''} /></AdminField>
          <AdminField label="Zona"><Input onChange={(event) => setField('district', event.target.value)} value={selected.district || ''} /></AdminField>
          <AdminField label="Indirizzo" wide><Input onChange={(event) => setField('address', event.target.value)} value={selected.address || ''} /></AdminField>
          <AdminField label="Tipologia"><select className="admin-select" onChange={(event) => setField('category', event.target.value)} value={selected.category || 'Appartamento'}>{['Appartamento', 'Attico', 'Villa', 'Loft', 'Casa indipendente', 'Palazzo'].map((item) => <option key={item}>{item}</option>)}</select></AdminField>
          <AdminField label="Stato"><select className="admin-select" onChange={(event) => setField('status', event.target.value as PropertyStatus)} value={selected.status || 'draft'}><option value="draft">Bozza</option><option value="published">Pubblicato</option><option value="reserved">Riservato</option><option value="sold">Venduto</option></select></AdminField>
          <AdminField label="Prezzo"><Input onChange={(event) => setField('price', Number(event.target.value))} type="number" value={selected.price || ''} /></AdminField>
          <AdminField label="Superficie mq"><Input onChange={(event) => setField('surface', Number(event.target.value))} type="number" value={selected.surface || ''} /></AdminField>
          <AdminField label="Locali"><Input onChange={(event) => setField('rooms', Number(event.target.value))} type="number" value={selected.rooms || ''} /></AdminField>
          <AdminField label="Bagni"><Input onChange={(event) => setField('bathrooms', Number(event.target.value))} type="number" value={selected.bathrooms || ''} /></AdminField>
          <AdminField label="Piano"><Input onChange={(event) => setField('floor', event.target.value)} value={selected.floor || ''} /></AdminField>
          <AdminField label="Classe energetica"><Input onChange={(event) => setField('energyClass', event.target.value.toUpperCase())} value={selected.energyClass || ''} /></AdminField>
          <AdminField label="Sintesi commerciale" wide><Textarea onChange={(event) => setField('shortDescription', event.target.value)} value={selected.shortDescription || ''} /></AdminField>
          <AdminField label="Descrizione completa" wide><Textarea className="min-h-32" onChange={(event) => setField('description', event.target.value)} value={selected.description || ''} /></AdminField>
          <AdminField label="Punti di forza, separati da virgola" wide><Input onChange={(event) => setField('highlights', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} value={(selected.highlights || []).join(', ')} /></AdminField>
          <AdminField label="URL foto principale" wide><Input onChange={(event) => setField('heroImage', event.target.value)} value={selected.heroImage || ''} /></AdminField>
          <label className="upload-dropzone admin-form-wide"><UploadCloud className="h-5 w-5" /><span><strong>{uploading === 'hero' ? 'Caricamento...' : 'Carica foto principale'}</strong><small>JPG, PNG o WebP su Vercel Blob</small></span><input accept="image/*" className="sr-only" disabled={Boolean(uploading)} onChange={(event) => void uploadFiles(Array.from(event.target.files || []), 'hero')} type="file" /></label>
          {selected.heroImage && <img alt="Anteprima principale" className="admin-hero-preview admin-form-wide" onError={handleImageError} src={selected.heroImage} />}
          <label className="upload-dropzone admin-form-wide"><ImagePlus className="h-5 w-5" /><span><strong>{uploading === 'gallery' ? 'Caricamento galleria...' : 'Aggiungi foto alla galleria'}</strong><small>Selezione multipla disponibile</small></span><input accept="image/*" className="sr-only" disabled={Boolean(uploading)} multiple onChange={(event) => void uploadFiles(Array.from(event.target.files || []), 'gallery')} type="file" /></label>
          {Boolean(selected.gallery?.length) && <div className="admin-gallery-preview admin-form-wide">{selected.gallery?.map((image, index) => <div key={`${image}-${index}`}><img alt={`Galleria ${index + 1}`} onError={handleImageError} src={image} /><button aria-label="Rimuovi foto" onClick={() => setField('gallery', (selected.gallery || []).filter((_, itemIndex) => itemIndex !== index))} type="button"><Trash2 className="h-3 w-3" /></button></div>)}</div>}
          <label className="admin-toggle admin-form-wide"><span><strong>In evidenza</strong><small>Mostra la proprietà nell’apertura del sito.</small></span><Switch checked={Boolean(selected.featured)} onCheckedChange={(value) => setField('featured', value)} /></label>
          <label className="admin-toggle admin-form-wide"><span><strong>Promuovi annuncio</strong><small>Attiva priorità visiva e badge campagna.</small></span><Switch checked={Boolean(selected.promoted)} onCheckedChange={(value) => setField('promoted', value)} /></label>
          <Button className="admin-save admin-form-wide" disabled={saving || Boolean(uploading)} onClick={() => void saveProperty()}>{saving ? <UploadCloud className="h-4 w-4" /> : <BadgeEuro className="h-4 w-4" />}{saving ? 'Salvataggio...' : 'Salva immobile'}</Button>
        </div>
      </aside>
    </div>
  );
}

function AdminField({ children, label, wide = false }: { children: React.ReactNode; label: string; wide?: boolean }) {
  return <label className={`admin-field${wide ? ' admin-form-wide' : ''}`}><span>{label}</span>{children}</label>;
}

function AppointmentsView({ appointments, changeStatus }: { appointments: Appointment[]; changeStatus: (id: string, status: AppointmentStatus) => Promise<void> }) {
  return (
    <section className="mt-7">
      <div className="appointments-summary"><div><span>Da gestire</span><strong>{appointments.filter((item) => item.status === 'new').length}</strong></div><div><span>Confermati</span><strong>{appointments.filter((item) => item.status === 'confirmed').length}</strong></div><div><span>Totale richieste</span><strong>{appointments.length}</strong></div></div>
      <div className="appointments-list mt-6">
        {appointments.length ? appointments.map((appointment) => (
          <article className="appointment-row" key={appointment.id}>
            <div className="appointment-date"><strong>{new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: 'short' }).format(new Date(`${appointment.date}T12:00:00`))}</strong><span>{appointment.time}</span></div>
            <div className="appointment-person"><span><UserRound className="h-4 w-4" /> {appointment.name}</span><a href={`mailto:${appointment.email}`}>{appointment.email}</a><a href={`tel:${appointment.phone}`}>{appointment.phone}</a></div>
            <div className="appointment-subject"><strong>{appointment.service}</strong><span>{appointment.propertyTitle || 'Consulenza generale'}</span>{appointment.message && <p>{appointment.message}</p>}</div>
            <label className="appointment-status"><span>Stato</span><select onChange={(event) => void changeStatus(appointment.id, event.target.value as AppointmentStatus)} value={appointment.status}><option value="new">Nuovo</option><option value="confirmed">Confermato</option><option value="completed">Completato</option><option value="cancelled">Annullato</option></select></label>
          </article>
        )) : <div className="admin-empty"><CalendarDays className="h-7 w-7" /><h2>Nessun appuntamento</h2><p>Le prenotazioni dal sito compariranno qui in tempo reale.</p></div>}
      </div>
    </section>
  );
}

function PortalsView({ properties }: { properties: Property[] }) {
  return (
    <section className="mt-7">
      <div className="portal-intro"><div><p className="eyebrow gold">Distribuzione centralizzata</p><h2>Un catalogo, più canali.</h2><p>I feed espongono i dati degli immobili pubblicati in un formato pronto per l’integrazione tecnica. L’attivazione commerciale definitiva dipende da accordi e credenziali di ciascun portale.</p></div><span><strong>{properties.filter((item) => item.status === 'published').length}</strong> immobili pubblicabili</span></div>
      <div className="portal-management-grid mt-6">{portalRows.map(([name, status, feed]) => <article key={name}><span><Megaphone className="h-5 w-5" /></span><h3>{name}</h3><p>{status}</p><a href={feed} target="_blank">Apri feed <ArrowUpRight className="h-4 w-4" /></a></article>)}</div>
    </section>
  );
}
