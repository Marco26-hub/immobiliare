'use client';

import type { SyntheticEvent } from 'react';
import Link from 'next/link';
import { Bath, BedDouble, ChevronRight, Maximize2 } from 'lucide-react';
import { formatPrice, type Property } from '@/app/data';

const fallbackImage = 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85';

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
}

export function PropertyCard({ property, slide = false }: { property: Property; slide?: boolean }) {
  return (
    <Link className={`property-card group reveal-card${slide ? ' property-slide' : ''}`} href={`/properties/${property.slug}`}>
      <div className="property-media relative overflow-hidden rounded-[8px]">
        <img alt={property.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" decoding="async" loading="lazy" onError={handleImageError} src={property.heroImage} />
        <span aria-hidden="true" className="property-image-shade" />
        {property.promoted && <span className="promo-badge">In evidenza</span>}
      </div>
      <div className="property-content pt-4">
        <p className="text-sm uppercase text-[#8a6432]">{property.city} · {property.district}</p>
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
          <span className="flex items-center gap-2 text-sm font-semibold">Scopri <ChevronRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  );
}
