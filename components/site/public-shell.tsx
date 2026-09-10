import type { ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import { PublicFooter } from './public-footer';
import { PublicHeader } from './public-header';

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell min-h-screen bg-[#f7f1e8] text-[#171511]">
      <div aria-hidden="true" className="ambient-grid" />
      <div aria-hidden="true" className="luxury-noise" />
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <a aria-label="Prenota un appuntamento" className="whatsapp-fab" href="/appuntamento" title="Prenota appuntamento">
        <MessageCircle className="h-6 w-6" />
        <span>Appuntamento</span>
      </a>
    </div>
  );
}
