import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, description, image, actions }: { eyebrow: string; title: string; description: string; image: string; actions?: ReactNode }) {
  return (
    <section className="page-hero">
      <img alt="" className="page-hero-image" src={image} />
      <div aria-hidden="true" className="page-hero-overlay" />
      <div className="page-hero-content mx-auto max-w-7xl px-5">
        <p className="eyebrow gold">{eyebrow}</p>
        <h1 className="display-type mt-4 max-w-4xl text-5xl leading-[0.95] text-white md:text-7xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#e7ded1]">{description}</p>
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
