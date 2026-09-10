import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Bath, BedDouble, Building, CalendarDays, MapPin, Maximize2, Sparkles } from 'lucide-react';
import { formatPrice, seedProperties } from '@/app/data';
import { PropertyGallery } from '@/components/site/property-gallery';
import { PublicShell } from '@/components/site/public-shell';
import { getPropertyBySlug } from '@/lib/properties';

export function generateStaticParams() {
  return seedProperties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = (await getPropertyBySlug(slug)) || seedProperties[0];
  return {
    title: `${property.title} | Maison Aurea`,
    description: property.shortDescription,
    openGraph: { title: property.title, description: property.shortDescription, images: [property.heroImage] },
  };
}

export default async function PropertyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <PublicShell>
      <section className="detail-page">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8">
          <div className="detail-topline">
            <Link className="back-link" href="/immobili"><ArrowLeft className="h-4 w-4" /> Tutti gli immobili</Link>
            <span>Rif. {property.id.slice(0, 8).toUpperCase()}</span>
          </div>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.12fr_0.88fr]">
            <PropertyGallery category={property.category} gallery={property.gallery} heroImage={property.heroImage} title={property.title} />

            <aside className="detail-summary lg:sticky lg:top-28 lg:self-start">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase text-[#8a6432]"><Sparkles className="h-4 w-4" /> Residenza selezionata</p>
              <h1 className="display-type mt-5 text-5xl leading-none md:text-6xl">{property.title}</h1>
              <p className="mt-5 flex items-center gap-2 text-lg text-[#5c554b]"><MapPin className="h-5 w-5" /> {property.address}, {property.district}, {property.city}</p>
              <p className="mt-7 text-3xl font-semibold">{formatPrice(property.price)}</p>

              <div className="detail-metrics mt-8">
                <span><Maximize2 className="h-5 w-5" /><strong>{property.surface} mq</strong><small>Superficie</small></span>
                <span><BedDouble className="h-5 w-5" /><strong>{property.rooms}</strong><small>Locali</small></span>
                <span><Bath className="h-5 w-5" /><strong>{property.bathrooms}</strong><small>Bagni</small></span>
                <span><Building className="h-5 w-5" /><strong>{property.floor}</strong><small>Piano</small></span>
              </div>

              <p className="mt-8 text-lg leading-8 text-[#3f3930]">{property.description}</p>
              <div className="detail-highlights mt-8">
                {property.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}
                <span>Classe energetica {property.energyClass}</span>
              </div>

              <div className="detail-cta mt-10">
                <Link className="premium-button gold justify-center" href={`/appuntamento?property=${encodeURIComponent(property.id)}`}>
                  <CalendarDays className="h-4 w-4" /> Prenota una visita
                </Link>
                <Link className="text-link justify-center" href="/appuntamento?service=Consulenza%20immobiliare">
                  Fai una domanda <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
