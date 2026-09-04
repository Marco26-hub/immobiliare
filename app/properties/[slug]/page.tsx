import Link from 'next/link';
import { ArrowLeft, Bath, BedDouble, MapPin, Maximize2, Sparkles } from 'lucide-react';
import { formatPrice, seedProperties } from '@/app/data';

export function generateStaticParams() {
  return seedProperties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = seedProperties.find((item) => item.slug === slug) || seedProperties[0];
  return {
    title: `${property.title} | Maison Aurea`,
    description: property.shortDescription,
    openGraph: {
      title: property.title,
      description: property.shortDescription,
      images: [property.heroImage],
    },
  };
}

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = seedProperties.find((item) => item.slug === slug) || seedProperties[0];

  return (
    <main className="min-h-screen bg-[#f7f1e8] text-[#161410]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
        <Link className="inline-flex items-center gap-2 text-sm font-semibold" href="/">
          <ArrowLeft className="h-4 w-4" />
          Torna agli immobili
        </Link>
        <Link className="premium-button dark" href="/admin">
          Admin
        </Link>
      </nav>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[8px]">
            <img
              alt={property.title}
              className="h-full w-full object-cover"
              src={property.heroImage}
            />
            <div className="absolute left-4 top-4 rounded-full bg-[#fffaf2]/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em]">
              {property.category}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {property.gallery.map((image) => (
              <img
                key={image}
                alt=""
                className="aspect-[4/3] rounded-[8px] object-cover"
                src={image}
              />
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#8a6432]">
            <Sparkles className="h-4 w-4" />
            Residenza selezionata
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
            {property.title}
          </h1>
          <p className="mt-5 flex items-center gap-2 text-lg text-[#5c554b]">
            <MapPin className="h-5 w-5" />
            {property.address}, {property.district}
          </p>
          <p className="mt-6 text-3xl font-semibold">{formatPrice(property.price)}</p>

          <div className="mt-8 grid grid-cols-3 border-y border-[#d7c8b3] py-5">
            <span className="detail-metric">
              <Maximize2 className="h-5 w-5" />
              {property.surface} mq
            </span>
            <span className="detail-metric">
              <BedDouble className="h-5 w-5" />
              {property.rooms} locali
            </span>
            <span className="detail-metric">
              <Bath className="h-5 w-5" />
              {property.bathrooms} bagni
            </span>
          </div>

          <p className="mt-8 text-lg leading-8 text-[#3f3930]">{property.description}</p>

          <div className="mt-8 flex flex-wrap gap-2">
            {property.highlights.map((highlight) => (
              <span className="rounded-full border border-[#c9b58f] px-4 py-2 text-sm" key={highlight}>
                {highlight}
              </span>
            ))}
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2">
            <a className="premium-button dark justify-center" href="tel:+390200000000">
              Chiama ora
            </a>
            <a
              className="premium-button light justify-center"
              href={`mailto:info@maisonaurea.it?subject=Richiesta ${property.title}`}
            >
              Richiedi visita
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}

