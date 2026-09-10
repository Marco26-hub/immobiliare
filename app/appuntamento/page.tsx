import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PublicShell } from '@/components/site/public-shell';
import { BookingForm } from './booking-form';

export const metadata: Metadata = {
  title: 'Prenota un appuntamento | Maison Aurea',
  description: 'Scegli il servizio, il giorno e l’orario: prenota online un incontro con Maison Aurea.',
};

export default function AppointmentPage() {
  return (
    <PublicShell>
      <Suspense fallback={<div className="booking-loading">Prepariamo l’agenda...</div>}>
        <BookingForm />
      </Suspense>
    </PublicShell>
  );
}
