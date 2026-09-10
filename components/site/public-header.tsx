import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Gem, Menu } from 'lucide-react';

const navigation = [
  { href: '/immobili', label: 'Immobili' },
  { href: '/servizi', label: 'Servizi' },
  { href: '/agenzia', label: 'Agenzia' },
];

export function PublicHeader() {
  return (
    <header className="public-header sticky top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Navigazione principale">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="brand-mark">
            <Gem className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <strong className="block text-lg leading-none text-[#fff7ea]">Maison Aurea</strong>
            <small className="brand-subtitle text-xs uppercase text-[#d7a84d]">Real estate atelier</small>
          </span>
        </Link>

        <div className="public-nav-links hidden items-center gap-8 text-sm font-medium text-[#e9dfcf] lg:flex">
          {navigation.map((item) => (
            <Link href={item.href} key={item.href}>{item.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link className="premium-button header-booking hidden sm:inline-flex" href="/appuntamento">
            <CalendarDays className="h-4 w-4" />
            Prenota appuntamento
          </Link>
          <details className="mobile-menu lg:hidden">
            <summary aria-label="Apri menu" title="Menu">
              <Menu className="h-5 w-5" />
            </summary>
            <div className="mobile-menu-panel">
              {navigation.map((item) => (
                <Link href={item.href} key={item.href}>{item.label}</Link>
              ))}
              <Link href="/appuntamento">Prenota appuntamento</Link>
              <Link href="/admin">Area riservata <ArrowUpRight className="h-4 w-4" /></Link>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
