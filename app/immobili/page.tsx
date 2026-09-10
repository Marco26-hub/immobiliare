import type { Metadata } from 'next';
import { PublicShell } from '@/components/site/public-shell';
import { PropertyCatalog } from './property-catalog';

export const metadata: Metadata = {
  title: 'Immobili in vendita | Maison Aurea',
  description:
    'Scopri la selezione Maison Aurea: appartamenti, attici, loft e ville rappresentati con immagini, informazioni e consulenza dedicate.',
};

export default function PropertiesPage() {
  return (
    <PublicShell>
      <PropertyCatalog />
    </PublicShell>
  );
}
