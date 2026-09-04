'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BadgeEuro,
  Camera,
  CheckCircle2,
  Eye,
  Gem,
  Home,
  ImagePlus,
  LayoutDashboard,
  Megaphone,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { formatPrice, seedProperties, type Property } from '@/app/data';

const portalRows = [
  ['Immobiliare.it', 'Feed XML pronto', '/api/feeds/immobiliare'],
  ['Idealista', 'Feed XML pronto', '/api/feeds/idealista'],
  ['Casa.it', 'Feed XML pronto', '/api/feeds/casa'],
  ['Subito', 'Export per gestionale', '/api/feeds/subito'],
  ['Wikicasa', 'Feed gestionale', '/api/feeds/wikicasa'],
  ['Trovacasa', 'Feed gestionale', '/api/feeds/trovacasa'],
];

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
  heroImage:
    'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85',
  shortDescription: '',
  description: '',
  highlights: ['Nuova acquisizione', 'Servizio fotografico premium'],
};

export default function AdminDashboard() {
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [selected, setSelected] = useState<Partial<Property>>(emptyForm);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => setProperties(data.properties || seedProperties))
      .catch(() => setProperties(seedProperties));
  }, []);

  const filtered = useMemo(() => {
    const term = query.toLowerCase();
    return properties.filter((property) =>
      [property.title, property.city, property.district, property.category].join(' ').toLowerCase().includes(term),
    );
  }, [properties, query]);

  async function saveProperty() {
    const response = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(selected),
    });
    const data = await response.json();
    setProperties((items) => {
      const without = items.filter((item) => item.id !== data.property.id);
      return [data.property, ...without];
    });
    setSelected(emptyForm);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }

  function removeLocal(id: string) {
    setProperties((items) => items.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#12110f] text-[#fff7ea]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-[#171511] px-5 py-6 lg:border-b-0 lg:border-r">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-[#d7a84d] text-[#15120d]">
              <Gem className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-lg">Maison Aurea</strong>
              <small className="text-[#b8ab96]">Property command center</small>
            </span>
          </Link>

          <div className="mt-10 space-y-2">
            {[
              ['Dashboard', LayoutDashboard],
              ['Immobili', Home],
              ['Promozioni', Megaphone],
              ['Media gallery', Camera],
            ].map(([label, Icon]) => (
              <button className="admin-nav" key={String(label)} type="button">
                <Icon className="h-4 w-4" />
                {String(label)}
              </button>
            ))}
          </div>

          <div className="mt-10 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[#d7a84d]">Performance</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <span className="admin-kpi">
                <strong>{properties.length}</strong>
                annunci
              </span>
              <span className="admin-kpi">
                <strong>{properties.filter((item) => item.promoted).length}</strong>
                promossi
              </span>
            </div>
          </div>
        </aside>

        <section className="px-5 py-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d7a84d]">
                Admin operativo
              </p>
              <h1 className="mt-2 text-3xl font-semibold md:text-5xl">
                Gestisci immobili, contenuti e promozioni.
              </h1>
            </div>
            <Link className="premium-button gold w-fit" href="/">
              <Eye className="h-4 w-4" />
              Vedi sito
            </Link>
          </header>

          <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_440px]">
            <section>
              <div className="mb-5 grid gap-3 lg:grid-cols-3">
                {portalRows.slice(0, 3).map(([name, status, feed]) => (
                  <a className="portal-admin-card" href={feed} key={name} target="_blank">
                    <span>
                      <Megaphone className="h-4 w-4" />
                      {status}
                    </span>
                    <strong>{name}</strong>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 py-3">
                <Search className="h-4 w-4 text-[#d7a84d]" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#8d826f]"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cerca per città, zona, tipologia..."
                  value={query}
                />
              </div>

              <div className="mt-5 overflow-hidden rounded-[8px] border border-white/10">
                {filtered.map((property) => (
                  <article className="admin-row" key={property.id}>
                    <img alt="" className="h-24 w-28 object-cover" src={property.heroImage} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-semibold">{property.title}</h2>
                        {property.promoted && <span className="status-pill gold">Promo</span>}
                        <span className="status-pill">{property.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-[#b8ab96]">
                        {property.city}, {property.district} · {property.surface} mq · {formatPrice(property.price)}
                      </p>
                      <p className="mt-2 line-clamp-1 text-sm text-[#efe1c9]/80">
                        {property.shortDescription}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        aria-label="Modifica immobile"
                        onClick={() => setSelected(property)}
                        size="icon"
                        variant="secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label="Rimuovi dalla vista admin"
                        onClick={() => removeLocal(property.id)}
                        size="icon"
                        variant="secondary"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="rounded-[8px] border border-[#d7a84d]/30 bg-[#fff7ea] p-5 text-[#171511]">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Scheda immobile</h2>
                <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-[#171511] text-[#d7a84d]">
                  <Plus className="h-5 w-5" />
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <Input
                  onChange={(event) => setSelected({ ...selected, title: event.target.value })}
                  placeholder="Titolo annuncio"
                  value={selected.title || ''}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    onChange={(event) => setSelected({ ...selected, city: event.target.value })}
                    placeholder="Città"
                    value={selected.city || ''}
                  />
                  <Input
                    onChange={(event) => setSelected({ ...selected, district: event.target.value })}
                    placeholder="Zona"
                    value={selected.district || ''}
                  />
                </div>
                <Input
                  onChange={(event) => setSelected({ ...selected, address: event.target.value })}
                  placeholder="Indirizzo"
                  value={selected.address || ''}
                />
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    onChange={(event) => setSelected({ ...selected, price: Number(event.target.value) })}
                    placeholder="Prezzo"
                    type="number"
                    value={selected.price || ''}
                  />
                  <Input
                    onChange={(event) => setSelected({ ...selected, surface: Number(event.target.value) })}
                    placeholder="Mq"
                    type="number"
                    value={selected.surface || ''}
                  />
                  <Input
                    onChange={(event) => setSelected({ ...selected, rooms: Number(event.target.value) })}
                    placeholder="Locali"
                    type="number"
                    value={selected.rooms || ''}
                  />
                </div>
                <Input
                  onChange={(event) => setSelected({ ...selected, heroImage: event.target.value })}
                  placeholder="URL foto principale"
                  value={selected.heroImage || ''}
                />
                <Textarea
                  onChange={(event) => setSelected({ ...selected, shortDescription: event.target.value })}
                  placeholder="Descrizione breve per card e promozioni"
                  value={selected.shortDescription || ''}
                />
                <Textarea
                  className="min-h-28"
                  onChange={(event) => setSelected({ ...selected, description: event.target.value })}
                  placeholder="Descrizione completa"
                  value={selected.description || ''}
                />

                <label className="admin-toggle">
                  <span>
                    <strong>Metti in evidenza</strong>
                    <small>Compare nella selezione principale.</small>
                  </span>
                  <Switch
                    checked={Boolean(selected.featured)}
                    onCheckedChange={(value) => setSelected({ ...selected, featured: value })}
                  />
                </label>
                <label className="admin-toggle">
                  <span>
                    <strong>Promuovi annuncio</strong>
                    <small>Aumenta priorità e badge marketing.</small>
                  </span>
                  <Switch
                    checked={Boolean(selected.promoted)}
                    onCheckedChange={(value) => setSelected({ ...selected, promoted: value })}
                  />
                </label>

                <Button className="h-12 gap-2 bg-[#171511] text-[#fff7ea] hover:bg-[#2a251d]" onClick={saveProperty}>
                  {saved ? <CheckCircle2 className="h-4 w-4" /> : <BadgeEuro className="h-4 w-4" />}
                  {saved ? 'Salvato' : 'Salva immobile'}
                </Button>

                <div className="rounded-[8px] border border-[#d7c7a9] bg-[#f4ead8] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <ImagePlus className="h-4 w-4" />
                    Caricamento immagini
                  </p>
                  <p className="mt-1 text-sm text-[#6f604d]">
                    Il sito include già l’endpoint per archiviare foto in modo permanente. Il campo URL consente di collegare foto professionali, CDN o immagini caricate.
                  </p>
                </div>

                <div className="rounded-[8px] border border-[#d7c7a9] bg-[#f4ead8] p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Megaphone className="h-4 w-4" />
                    Portali immobiliari
                  </p>
                  <div className="mt-3 grid gap-2">
                    {portalRows.map(([name, status, feed]) => (
                      <a className="portal-link" href={feed} key={name} target="_blank">
                        <span>{name}</span>
                        <small>{status}</small>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
