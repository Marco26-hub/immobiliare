'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gem,
  Home,
  MapPin,
  Maximize2,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { formatPrice, seedProperties } from './data';

const channels = [
  'Immobiliare.it',
  'Idealista',
  'Casa.it',
  'Subito',
  'Wikicasa',
  'Trovacasa',
];

export default function HomePage() {
  const [city, setCity] = useState('Tutte');
  const [typology, setTypology] = useState('Tutte');
  const [budget, setBudget] = useState('Qualsiasi');

  const cities = ['Tutte', ...Array.from(new Set(seedProperties.map((item) => item.city)))];
  const types = ['Tutte', ...Array.from(new Set(seedProperties.map((item) => item.category)))];

  const filtered = useMemo(() => {
    return seedProperties.filter((property) => {
      const budgetMatch =
        budget === 'Qualsiasi' ||
        (budget === 'Fino a 900k' && property.price <= 900000) ||
        (budget === '900k - 2M' && property.price > 900000 && property.price <= 2000000) ||
        (budget === 'Oltre 2M' && property.price > 2000000);
      return (
        (city === 'Tutte' || property.city === city) &&
        (typology === 'Tutte' || property.category === typology) &&
        budgetMatch
      );
    });
  }, [budget, city, typology]);

  const hero = seedProperties[0];

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#171511]">
      <header className="sticky top-0 z-40 border-b border-[#d7c8b3]/70 bg-[#f7f1e8]/88 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="brand-mark">
              <Gem className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-lg leading-none">Maison Aurea</strong>
              <small className="text-xs uppercase tracking-[0.18em] text-[#8a6432]">
                Real estate atelier
              </small>
            </span>
          </Link>
          <div className="hidden items-center gap-7 text-sm font-medium lg:flex">
            <a href="#immobili">Immobili</a>
            <a href="#promozione">Promozione</a>
            <a href="#metodo">Metodo</a>
          </div>
          <Link className="premium-button dark" href="/admin">
            Admin
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 pt-7 lg:grid-cols-[0.95fr_1.05fr] lg:pb-20">
        <div className="flex min-h-[620px] flex-col justify-between">
          <div>
            <p className="eyebrow">Agenzia immobiliare premium</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] md:text-7xl">
              Case importanti, raccontate come meritano.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f574b]">
              Un sito immobiliare di nuova generazione per acquisire incarichi,
              promuovere proprietà selezionate e distribuire gli annunci sui portali
              più rilevanti.
            </p>
          </div>

          <div className="mt-10 grid gap-3 rounded-[8px] border border-[#d6c4a7] bg-[#fffaf2]/80 p-3 shadow-[0_24px_80px_rgb(55_38_18/10%)] md:grid-cols-4">
            <Filter label="Città" onChange={setCity} options={cities} value={city} />
            <Filter label="Tipologia" onChange={setTypology} options={types} value={typology} />
            <Filter
              label="Budget"
              onChange={setBudget}
              options={['Qualsiasi', 'Fino a 900k', '900k - 2M', 'Oltre 2M']}
              value={budget}
            />
            <a className="search-button" href="#immobili">
              <Search className="h-5 w-5" />
              Cerca
            </a>
          </div>
        </div>

        <div className="relative min-h-[620px] overflow-hidden rounded-[8px] bg-[#191612]">
          <img
            alt={hero.title}
            className="absolute inset-0 h-full w-full object-cover opacity-88"
            src={hero.heroImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,13,9,0.05),rgba(16,13,9,0.72))]" />
          <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
            <span className="rounded-full bg-[#fffaf2]/92 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em]">
              In evidenza
            </span>
            <span className="rounded-full bg-[#d7a84d] px-4 py-2 text-sm font-bold">
              {formatPrice(hero.price)}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white md:p-8">
            <p className="mb-3 flex items-center gap-2 text-sm text-[#f4d99a]">
              <MapPin className="h-4 w-4" />
              {hero.city}, {hero.district}
            </p>
            <h2 className="max-w-xl text-4xl font-semibold leading-tight">{hero.title}</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="hero-chip">
                <Maximize2 className="h-4 w-4" />
                {hero.surface} mq
              </span>
              <span className="hero-chip">
                <BedDouble className="h-4 w-4" />
                {hero.rooms} locali
              </span>
              <span className="hero-chip">
                <Bath className="h-4 w-4" />
                {hero.bathrooms} bagni
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="promozione" className="border-y border-[#d7c8b3] bg-[#171511] py-8 text-[#fff7ea]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow gold">Distribuzione portali</p>
            <h2 className="mt-3 text-3xl font-semibold md:text-5xl">
              Un solo caricamento, pronto per tutti i canali.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {channels.map((channel) => (
              <span className="portal-pill" key={channel}>
                <CheckCircle2 className="h-4 w-4" />
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="immobili" className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h2 className="mt-3 text-4xl font-semibold md:text-6xl">Immobili selezionati</h2>
          </div>
          <p className="max-w-md text-[#655c4f]">
            Ogni scheda è pensata per vendere: fotografia dominante, dettagli chiari,
            storytelling e call to action dirette.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((property) => (
            <Link className="property-card group" href={`/properties/${property.slug}`} key={property.id}>
              <div className="relative aspect-[1.18] overflow-hidden rounded-[8px]">
                <img
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  src={property.heroImage}
                />
                {property.promoted && <span className="promo-badge">Promosso</span>}
              </div>
              <div className="pt-4">
                <p className="text-sm uppercase tracking-[0.14em] text-[#8a6432]">
                  {property.city} · {property.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight">{property.title}</h3>
                <p className="mt-3 line-clamp-2 text-[#655c4f]">{property.shortDescription}</p>
                <div className="mt-5 flex items-center justify-between border-t border-[#d7c8b3] pt-4">
                  <strong>{formatPrice(property.price)}</strong>
                  <span className="flex items-center gap-2 text-sm">
                    Dettagli
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="metodo" className="bg-[#fffaf2] py-16">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 lg:grid-cols-4">
          {[
            [Building2, 'Acquisizione', 'Schede eleganti per convincere proprietari e venditori di fascia alta.'],
            [Camera, 'Media premium', 'Hero photo, gallery, planimetrie e contenuti pronti per campagne.'],
            [Megaphone, 'Portali', 'Export e canali collegabili a Immobiliare.it, Idealista, Casa.it, Subito e altri.'],
            [ShieldCheck, 'Controllo', 'Admin interno per stato, prezzo, promozione, descrizioni e pubblicazione.'],
          ].map(([Icon, title, text]) => (
            <article className="method-card" key={String(title)}>
              <Icon className="h-7 w-7 text-[#b57f2a]" />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#171511] px-5 py-10 text-[#fff7ea]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <strong className="text-2xl">Maison Aurea</strong>
            <p className="mt-1 text-[#b8ab96]">Sito premium con gestione immobiliare integrata.</p>
          </div>
          <Link className="premium-button gold" href="/admin">
            Apri admin
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </footer>
    </main>
  );
}

function Filter({
  label,
  onChange,
  options,
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
}) {
  return (
    <label className="filter-box">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

