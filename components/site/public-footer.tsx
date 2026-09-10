import Link from 'next/link';
import { ArrowUpRight, AtSign, BriefcaseBusiness, Gem, MessageCircle, Users } from 'lucide-react';

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/', icon: AtSign },
  { label: 'Facebook', href: 'https://www.facebook.com/', icon: Users },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', icon: BriefcaseBusiness },
  { label: 'WhatsApp', href: 'https://www.whatsapp.com/', icon: MessageCircle },
];

export function PublicFooter() {
  return (
    <footer className="site-footer text-[#fff7ea]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link className="inline-flex items-center gap-3" href="/">
            <span className="brand-mark"><Gem className="h-5 w-5" /></span>
            <span><strong className="block text-xl">Maison Aurea</strong><small className="text-[#b8ab96]">Real estate atelier</small></span>
          </Link>
          <p className="mt-5 max-w-md leading-7 text-[#b8ab96]">Vendita, locazione e gestione di immobili selezionati, con una regia digitale pensata per valorizzare ogni incarico.</p>
        </div>
        <div className="footer-links">
          <strong>Esplora</strong>
          <Link href="/immobili">Immobili</Link>
          <Link href="/servizi">Servizi</Link>
          <Link href="/agenzia">Agenzia</Link>
          <Link href="/appuntamento">Prenota appuntamento</Link>
        </div>
        <div>
          <strong className="text-sm uppercase text-[#d7a84d]">Seguici</strong>
          <nav aria-label="Canali social" className="social-links mt-5">
            {socials.map(({ href, icon: Icon, label }) => (
              <a aria-label={label} href={href} key={label} rel="noreferrer" target="_blank" title={label}>
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </nav>
          <Link className="footer-admin mt-6" href="/admin">Area riservata <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-[#8f8575]">© {new Date().getFullYear()} Maison Aurea. Tutti i diritti riservati.</div>
    </footer>
  );
}
