'use client';

import type { SyntheticEvent } from 'react';

const fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85';

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = fallbackImage;
}

export function PropertyGallery({ category, gallery, heroImage, title }: { category: string; gallery: string[]; heroImage: string; title: string }) {
  return (
    <div className="detail-gallery">
      <div className="detail-hero-image">
        <img alt={title} onError={handleImageError} src={heroImage} />
        <span>{category}</span>
      </div>
      {gallery.length > 0 && (
        <div className="detail-thumbnails">
          {gallery.map((image, index) => <img alt={`${title}, ambiente ${index + 2}`} key={`${image}-${index}`} loading="lazy" onError={handleImageError} src={image} />)}
        </div>
      )}
    </div>
  );
}
