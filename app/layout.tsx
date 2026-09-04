import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Maison Aurea | Agenzia immobiliare premium',
  description:
    'Sito immobiliare premium con gestione annunci, promozione proprietà e distribuzione verso i principali portali.',
  openGraph: {
    title: 'Maison Aurea | Agenzia immobiliare premium',
    description:
      'Gestisci e promuovi immobili di pregio con un sito di nuova generazione.',
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
