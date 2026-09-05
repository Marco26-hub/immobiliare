'use client';

import { type SyntheticEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  AtSign,
  Bath,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronRight,
  Gem,
  MapPin,
  Maximize2,
  MessageCircle,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { formatPrice, seedProperties, type Property } from './data';

const channels = [
  'Immobiliare.it',
  'Idealista',
  'Casa.it',
  'Subito',
  'Wikicasa',
  'Trovacasa',
];

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: AtSign },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Users },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: BriefcaseBusiness },
  { label: 'WhatsApp', href: 'https://www.whatsapp.com/', icon: MessageCircle },
];

const imageFallback =
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85';

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = imageFallback;
}

export default function HomePage() {
  const [city, setCity] = useState('Tutte');
  const [typology, setTypology] = useState('Tutte');
  const [budget, setBudget] = useState('Qualsiasi');
  const [properties, setProperties] = useState<Property[]>(seedProperties);

  useEffect(() => {
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => setProperties(data.properties || seedProperties))
      .catch(() => setProperties(seedProperties));
  }, []);

  const cities = ['Tutte', ...Array.from(new Set(properties.map((item) => item.city)))];
  const types = ['Tutte', ...Array.from(new Set(properties.map((item) => item.category)))];

  const filtered = useMemo(() => {
    return properties.filter((property) => {
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
  }, [budget, city, properties, typology]);

  const hero = properties.find((property) => property.featured) || properties[0] || seedProperties[0];

  return (
    <main className="site-shell min-h-screen bg-[#f7f1e8] text-[#171511]">
      <div aria-hidden="true" className="ambient-grid" />
      <div aria-hidden="true" className="luxury-noise" />
      <header className="public-header sticky top-0 z-40">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link className="flex items-center gap-3" href="/">
            <span className="brand-mark">
              <Gem className="h-5 w-5" />
            </span>
            <span>
              <strong className="block text-lg leading-none text-[#fff7ea]">Maison Aurea</strong>
              <small className="text-xs uppercase tracking-[0.18em] text-[#d7a84d]">
                Real estate atelier
              </small>
            </span>
          </Link>
          <div className="hidden items-center gap-8 text-sm font-medium text-[#e9dfcf] lg:flex">
            <a href="#immobili">Immobili</a>
            <a href="#promozione">Promozione</a>
            <a href="#metodo">Metodo</a>
          </div>
          <Link className="premium-button header-admin" href="/admin">
            <span className="hidden sm:inline">Area riservata</span>
            <span className="sm:hidden">Admin</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </nav>
      </header>

      <section className="editorial-hero">
        <img
          alt={hero.title}
          className="editorial-hero-image"
          onError={handleImageError}
          src={hero.heroImage}
        />
        <div aria-hidden="true" className="editorial-hero-overlay" />
        <div aria-hidden="true" className="editorial-hero-rule" />

        <div className="editorial-hero-inner mx-auto max-w-7xl px-5">
          <div className="hero-copy max-w-4xl">
            <p className="eyebrow gold">Maison Aurea · Luxury real estate advisory</p>
            <h1 className="display-type mt-5 text-5xl leading-[0.92] text-white md:text-7xl lg:text-8xl">
              Immobili di pregio, rappresentati con visione.
            </h1>
            <p className="designer-copy mt-6 max-w-2xl text-base leading-7 text-[#eee6da] md:text-lg md:leading-8">
              Selezioniamo dimore rare e ne costruiamo il valore attraverso immagine,
              consulenza e distribuzione digitale internazionale.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="premium-button gold" href="#immobili">
                Esplora le proprietà
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a className="premium-button hero-secondary-button" href="#contatti">
                Affida il tuo immobile
              </a>
            </div>
          </div>

          <Link className="featured-signature" href={`/properties/${hero.slug}`}>
            <span className="featured-index">In evidenza · 01</span>
            <span className="featured-title">{hero.title}</span>
            <span className="featured-location">
              <MapPin className="h-4 w-4" />
              {hero.city}, {hero.district}
            </span>
            <span className="featured-metrics">
              <span><Maximize2 className="h-4 w-4" /> {hero.surface} mq</span>
              <span><BedDouble className="h-4 w-4" /> {hero.rooms} locali</span>
              <span><Bath className="h-4 w-4" /> {hero.bathrooms} bagni</span>
            </span>
            <strong>{formatPrice(hero.price)}</strong>
          </Link>

          <div className="hero-search search-panel grid gap-2 p-2 md:grid-cols-4">
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
      </section>

      <section id="promozione" className="portal-band border-y border-[#d7c8b3] bg-[#171511] py-8 text-[#fff7ea]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow gold">Syndication immobiliare</p>
            <h2 className="display-type mt-3 text-3xl md:text-5xl">
              Dal dossier interno ai portali, senza duplicare il lavoro.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {channels.map((channel) => (
              <span className="portal-pill portal-pill-animated" key={channel}>
                <CheckCircle2 className="h-4 w-4" />
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="immobili" className="relative mx-auto max-w-7xl px-5 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">01 · Portfolio curato</p>
            <h2 className="display-type mt-3 text-4xl md:text-6xl">Residenze in rappresentanza</h2>
          </div>
          <div className="max-w-md border-l border-[#b99051] pl-5 text-[#655c4f]">
            <strong className="block text-sm uppercase text-[#171511]">{filtered.length} proprietà selezionate</strong>
            <p className="mt-2">Ogni incarico riceve una strategia di posizionamento, immagine e distribuzione dedicata.</p>
          </div>
        </div>

        <div className="mt-9 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-4">
          {filtered.map((property) => (
            <Link className="property-card group reveal-card" href={`/properties/${property.slug}`} key={property.id}>
              <div className="property-media relative overflow-hidden rounded-[8px]">
                <img
                  alt={property.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  decoding="async"
                  loading="lazy"
                  onError={handleImageError}
                  src={property.heroImage}
                />
                <span aria-hidden="true" className="property-image-shade" />
                {property.promoted && <span className="promo-badge">Promosso</span>}
              </div>
              <div className="property-content pt-4">
                <p className="text-sm uppercase tracking-[0.14em] text-[#8a6432]">
                  {property.city} · {property.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold leading-tight 2xl:text-2xl">{property.title}</h3>
                <p className="mt-3 line-clamp-2 text-[#655c4f]">{property.shortDescription}</p>
                <div className="mt-auto flex items-center justify-between border-t border-[#d7c8b3] pt-4">
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

      <section id="metodo" className="method-section bg-[#fffaf2] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="method-intro">
            <p className="eyebrow">02 · Il nostro metodo</p>
            <h2 className="display-type mt-4 text-4xl leading-none md:text-6xl">
              Una regia unica, dall’incarico alla trattativa.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-[#655c4f]">
              Tecnologia e sensibilità editoriale lavorano insieme per aumentare
              qualità percepita, copertura e precisione commerciale.
            </p>
          </div>
          <div className="method-list">
            {[
              [Building2, 'Mandato', 'Analisi, posizionamento e presentazione autorevole per proprietari esigenti.'],
              [Camera, 'Immagine', 'Direzione fotografica, gallery e testi costruiti intorno al carattere della proprietà.'],
              [Megaphone, 'Distribuzione', 'Pubblicazione coordinata su Immobiliare.it, Idealista, Casa.it, Subito e altri canali.'],
              [ShieldCheck, 'Governance', 'Controllo centralizzato di prezzo, stato, promozione, media e pubblicazione.'],
            ].map(([Icon, title, text], index) => (
              <article className="method-row" key={String(title)}>
                <span className="method-number">0{index + 1}</span>
                <Icon className="h-6 w-6 text-[#b57f2a]" />
                <h3>{String(title)}</h3>
                <p>{String(text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="owner-cta" id="contatti">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow gold">Valutazione riservata</p>
            <h2 className="display-type mt-4 max-w-4xl text-4xl leading-none text-white md:text-6xl">
              La tua proprietà merita una presentazione all’altezza del suo valore.
            </h2>
          </div>
          <a className="premium-button gold shrink-0" href="https://www.whatsapp.com/" rel="noreferrer" target="_blank">
            Parla con un advisor
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#171511] px-5 py-10 text-[#fff7ea]">
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-[1fr_auto_auto] md:items-center">
          <div>
            <strong className="text-2xl">Maison Aurea</strong>
            <p className="mt-1 text-[#b8ab96]">Atelier digitale per immobili di pregio e mandati qualificati.</p>
          </div>
          <nav aria-label="Canali social" className="social-links">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                aria-label={label}
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
                title={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </nav>
          <Link className="premium-button gold" href="/admin">
            Apri admin
            <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </footer>

      <a
        aria-label="Contatta Maison Aurea su WhatsApp"
        className="whatsapp-fab"
        href="https://www.whatsapp.com/"
        rel="noreferrer"
        target="_blank"
        title="WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        <span>Parliamo</span>
      </a>
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
