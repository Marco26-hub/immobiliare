'use client';

import { type SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import {
  ArrowUpRight,
  AtSign,
  Bath,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gem,
  KeyRound,
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

const services = [
  {
    title: 'Vendita',
    eyebrow: 'Rappresentanza immobiliare',
    description:
      'Posizioniamo ogni proprietà nel segmento corretto, costruiamo una presentazione distintiva e conduciamo la trattativa con metodo e riservatezza.',
    points: ['Valutazione e strategia di prezzo', 'Marketing editoriale e portali', 'Qualifica acquirenti e negoziazione'],
    icon: Building2,
  },
  {
    title: 'Affitti',
    eyebrow: 'Locazioni selezionate',
    description:
      'Trasformiamo la locazione in un percorso ordinato: dal canone target alla selezione del conduttore, fino alla definizione dell’accordo.',
    points: ['Analisi del canone di mercato', 'Screening delle candidature', 'Contratto, consegna e verbali'],
    icon: KeyRound,
  },
  {
    title: 'Gestione locazioni',
    eyebrow: 'Property management',
    description:
      'Seguiamo l’immobile dopo la firma con un presidio puntuale di scadenze, incassi, comunicazioni e interventi, mantenendo il proprietario sempre aggiornato.',
    points: ['Canoni, scadenze e rendicontazione', 'Assistenza a proprietà e conduttori', 'Rinnovi, manutenzioni e riconsegna'],
    icon: ShieldCheck,
  },
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
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [carouselRef, carouselApi] = useEmblaCarousel({ align: 'start', loop: false });

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

  const syncCarouselControls = useCallback(() => {
    if (!carouselApi) return;
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;
    syncCarouselControls();
    carouselApi.on('select', syncCarouselControls);
    carouselApi.on('reInit', syncCarouselControls);
    return () => {
      carouselApi.off('select', syncCarouselControls);
      carouselApi.off('reInit', syncCarouselControls);
    };
  }, [carouselApi, syncCarouselControls]);

  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.reInit();
  }, [carouselApi, filtered]);

  useEffect(() => {
    if (!carouselApi || carouselPaused || filtered.length < 2) return;
    const interval = window.setInterval(() => {
      if (carouselApi.canScrollNext()) carouselApi.scrollNext();
      else carouselApi.scrollTo(0);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [carouselApi, carouselPaused, filtered.length]);

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
            <a href="#servizi">Servizi</a>
            <a href="#immobili">Proprietà</a>
            <a href="#promozione">Portali</a>
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
              Dimore in vendita. Presentate al loro massimo valore.
            </h1>
            <p className="designer-copy mt-6 max-w-2xl text-base leading-7 text-[#eee6da] md:text-lg md:leading-8">
              Selezioniamo proprietà distintive e le accompagniamo sul mercato con
              valutazioni accurate, immagini autorevoli e trattative riservate.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="premium-button gold" href="#immobili">
                Scopri le dimore
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a className="premium-button hero-secondary-button" href="#contatti">
                Vendi con Maison Aurea
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

      <section id="immobili" className="relative mx-auto w-full max-w-7xl px-5 py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">01 · Portfolio curato</p>
            <h2 className="display-type mt-3 text-4xl md:text-6xl">Dimore in vendita</h2>
          </div>
          <div className="portfolio-controls">
            <span>{filtered.length} proprietà selezionate</span>
            <button
              aria-label="Proprietà precedente"
              disabled={!canScrollPrev}
              onClick={() => carouselApi?.scrollPrev()}
              title="Precedente"
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Proprietà successiva"
              disabled={!canScrollNext}
              onClick={() => carouselApi?.scrollNext()}
              title="Successiva"
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          aria-label="Carosello immobili in vendita"
          className="property-carousel mt-9"
          onFocus={() => setCarouselPaused(true)}
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setCarouselPaused(false);
          }}
          ref={carouselRef}
          role="region"
        >
          <div className="property-carousel-track">
            {filtered.map((property) => (
              <Link className="property-card property-slide group reveal-card" href={`/properties/${property.slug}`} key={property.id}>
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
                    {property.city} · {property.district}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-tight 2xl:text-2xl">{property.title}</h3>
                  <p className="mt-3 text-[#655c4f]">{property.shortDescription}</p>
                  <div className="property-specs">
                    <span><Maximize2 className="h-4 w-4" /> {property.surface} mq</span>
                    <span><BedDouble className="h-4 w-4" /> {property.rooms} locali</span>
                    <span><Bath className="h-4 w-4" /> {property.bathrooms} bagni</span>
                    <span>Classe {property.energyClass}</span>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-[#d7c8b3] pt-4">
                    <strong className="property-price">{formatPrice(property.price)}</strong>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      Scopri
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="promozione" className="portal-band border-y border-[#d7c8b3] bg-[#171511] py-8 text-[#fff7ea]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow gold">Visibilità multipiattaforma</p>
            <h2 className="display-type mt-3 text-3xl md:text-5xl">
              Vendita e locazione sui portali giusti, con una regia centralizzata.
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

      <section className="services-section" id="servizi">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="services-heading grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="eyebrow">02 · Servizi immobiliari</p>
              <h2 className="display-type mt-4 text-4xl leading-none md:text-6xl">
                Tre competenze, un solo interlocutore.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#cfc4b3]">
              Maison Aurea accompagna proprietari, investitori e conduttori con un
              servizio costruito intorno alla qualità dell’immobile e agli obiettivi
              economici di chi lo affida.
            </p>
          </div>

          <div className="services-grid mt-14">
            {services.map(({ description, eyebrow, icon: Icon, points, title }, index) => (
              <article className="service-card" key={title}>
                <div className="service-card-top">
                  <span className="service-index">0{index + 1}</span>
                  <span className="service-icon"><Icon className="h-5 w-5" /></span>
                </div>
                <p className="service-eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p className="service-description">{description}</p>
                <ul>
                  {points.map((point) => (
                    <li key={point}><CheckCircle2 className="h-4 w-4" /> {point}</li>
                  ))}
                </ul>
                <a href="#contatti">
                  Richiedi una consulenza
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="metodo" className="method-section bg-[#fffaf2] py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="method-intro">
            <p className="eyebrow">03 · Il nostro metodo</p>
            <h2 className="display-type mt-4 text-4xl leading-none md:text-6xl">
              Una regia unica, dall’incarico alla gestione.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-[#655c4f]">
              Competenze commerciali, cura editoriale e controllo operativo lavorano
              insieme per proteggere valore, tempo e qualità della relazione.
            </p>
          </div>
          <div className="method-list">
            {[
              [Building2, 'Analisi', 'Valore di mercato, obiettivo economico e strategia vengono definiti prima della pubblicazione.'],
              [Camera, 'Presentazione', 'Fotografia, testi e materiali raccontano la proprietà con precisione e riconoscibilità.'],
              [Megaphone, 'Commercializzazione', 'Campagne e portali vengono coordinati per raggiungere interlocutori realmente qualificati.'],
              [ShieldCheck, 'Gestione', 'Trattative, contratti, scadenze e attività locative restano sotto un controllo puntuale.'],
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
            <p className="eyebrow gold">Consulenza riservata</p>
            <h2 className="display-type mt-4 max-w-4xl text-4xl leading-none text-white md:text-6xl">
              Vuoi vendere, affittare o delegare la gestione del tuo immobile?
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
            <p className="mt-1 max-w-xl text-[#b8ab96]">Vendita, locazione e property management per immobili selezionati.</p>
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
