import type { Metadata } from 'next';
import { Cormorant_Garamond, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-editorial',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Maison Aurea | Vendita, affitti e gestione immobiliare',
  description:
    'Consulenza immobiliare premium per vendita, affitti e gestione locazioni. Valutazione, promozione, selezione conduttori e property management.',
  openGraph: {
    title: 'Maison Aurea | Vendita, affitti e gestione immobiliare',
    description:
      'Un unico interlocutore per vendere, affittare e gestire immobili selezionati.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
