'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Building2, Search, SlidersHorizontal, X } from 'lucide-react';
import { PropertyCard } from '@/components/site/property-card';
import { seedProperties, type Property } from '@/app/data';

const budgets = [
  { label: 'Qualsiasi budget', value: 'all' },
  { label: 'Fino a 900.000 euro', value: '900' },
  { label: 'Da 900.000 a 2 milioni', value: '2000' },
  { label: 'Oltre 2 milioni', value: 'over' },
];

export function PropertyCatalog() {
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('Tutte');
  const [category, setCategory] = useState('Tutte');
  const [budget, setBudget] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties')
      .then((response) => response.json())
      .then((data) => setProperties(data.properties || seedProperties))
      .catch(() => setProperties(seedProperties))
      .finally(() => setLoading(false));
  }, []);

  const cities = ['Tutte', ...Array.from(new Set(properties.map((item) => item.city)))];
  const categories = ['Tutte', ...Array.from(new Set(properties.map((item) => item.category)))];

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('it');
    return properties.filter((property) => {
      const searchText = [property.title, property.city, property.district, property.category]
        .join(' ')
        .toLocaleLowerCase('it');
      const budgetMatch =
        budget === 'all' ||
        (budget === '900' && property.price <= 900000) ||
        (budget === '2000' && property.price > 900000 && property.price <= 2000000) ||
        (budget === 'over' && property.price > 2000000);
      return (
        (!term || searchText.includes(term)) &&
        (city === 'Tutte' || property.city === city) &&
        (category === 'Tutte' || property.category === category) &&
        budgetMatch
      );
    });
  }, [budget, category, city, properties, query]);

  const hasFilters = query || city !== 'Tutte' || category !== 'Tutte' || budget !== 'all';
  const resetFilters = () => {
    setQuery('');
    setCity('Tutte');
    setCategory('Tutte');
    setBudget('all');
  };

  return (
    <>
      <section className="catalog-intro">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[1fr_0.65fr] lg:items-end">
          <div>
            <p className="eyebrow">Portfolio Maison Aurea</p>
            <h1 className="display-type mt-4 max-w-4xl text-5xl leading-none md:text-7xl">
              Case in vendita, raccontate con precisione.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-[#655c4f]">
            Una selezione curata di residenze, con informazioni leggibili, immagini immersive e un consulente dedicato dal primo interesse alla proposta.
          </p>
        </div>
      </section>

      <section className="catalog-toolbar" aria-label="Filtri immobili">
        <div className="mx-auto max-w-7xl px-5 py-5">
          <div className="catalog-filter-grid">
            <label className="catalog-search">
              <Search className="h-5 w-5" />
              <span className="sr-only">Cerca</span>
              <input
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Città, quartiere o tipologia"
                value={query}
              />
            </label>
            <CatalogSelect label="Città" onChange={setCity} options={cities.map((item) => ({ label: item, value: item }))} value={city} />
            <CatalogSelect label="Tipologia" onChange={setCategory} options={categories.map((item) => ({ label: item, value: item }))} value={category} />
            <CatalogSelect label="Budget" onChange={setBudget} options={budgets} value={budget} />
            <button className="filter-reset" disabled={!hasFilters} onClick={resetFilters} title="Azzera filtri" type="button">
              {hasFilters ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
              <span>{hasFilters ? 'Azzera' : 'Filtri'}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Selezione disponibile</p>
            <h2 className="mt-2 text-2xl font-semibold">{loading ? 'Ricerca in corso' : `${filtered.length} proprietà`}</h2>
          </div>
          <Link className="text-link" href="/appuntamento?service=Ricerca%20immobile">
            Affidaci la tua ricerca <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {filtered.length ? (
          <div className="property-grid">
            {filtered.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        ) : (
          <div className="catalog-empty">
            <Building2 className="h-7 w-7" />
            <h2>Nessuna proprietà con questi criteri</h2>
            <p>Possiamo attivare una ricerca riservata oppure puoi ampliare i filtri.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="premium-button light" onClick={resetFilters} type="button">Azzera i filtri</button>
              <Link className="premium-button dark" href="/appuntamento?service=Ricerca%20immobile">Parla con un consulente</Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function CatalogSelect({ label, onChange, options, value }: { label: string; onChange: (value: string) => void; options: { label: string; value: string }[]; value: string }) {
  return (
    <label className="catalog-select">
      <span>{label}</span>
      <select onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
