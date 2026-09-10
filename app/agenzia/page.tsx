import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Eye, Handshake, LineChart, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { PublicShell } from '@/components/site/public-shell';

export const metadata: Metadata = {
  title: 'Agenzia immobiliare | Maison Aurea',
  description: 'Maison Aurea unisce consulenza immobiliare, sensibilità editoriale e strumenti digitali per rappresentare proprietà di qualità.',
};

export default function AgencyPage() {
  return (
    <PublicShell>
      <PageHero
        actions={<Link className="premium-button gold" href="/appuntamento?service=Incontro%20conoscitivo">Conosciamoci <ArrowUpRight className="h-4 w-4" /></Link>}
        description="Un atelier immobiliare contemporaneo: poche sovrastrutture, responsabilità diretta e una cura rigorosa del modo in cui ogni proprietà viene rappresentata."
        eyebrow="Maison Aurea"
        image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=88"
        title="La qualità si riconosce prima ancora di entrare."
      />

      <section className="agency-story">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="eyebrow">Il nostro punto di vista</p>
            <h2 className="display-type mt-4 text-4xl leading-none md:text-6xl">Una casa non è una riga in un portale.</h2>
          </div>
          <div className="agency-copy">
            <p>È un bene economico, un progetto personale e spesso una decisione importante. Per questo il nostro lavoro inizia dall’ascolto e continua con dati, presentazione e negoziazione coerenti.</p>
            <p>Seguiamo vendita, affitto e gestione locativa con un modello trasparente: un referente dedicato, attività tracciate e una comunicazione precisa in ogni fase.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="values-grid">
          {[
            [Eye, 'Cura editoriale', 'Ogni immobile viene letto, fotografato e raccontato secondo la sua identità, senza formule generiche.'],
            [LineChart, 'Decisioni informate', 'Prezzo, canali e attività commerciali partono da dati chiari e vengono aggiornati nel tempo.'],
            [Handshake, 'Presenza reale', 'Un referente segue la relazione con proprietà, acquirenti e conduttori fino alla conclusione.'],
            [ShieldCheck, 'Riservatezza', 'Informazioni, visite e trattative sono gestite con discrezione e accessi qualificati.'],
          ].map(([Icon, title, copy], index) => (
            <article key={String(title)}><span>0{index + 1}</span><Icon className="h-6 w-6" /><h3>{String(title)}</h3><p>{String(copy)}</p></article>
          ))}
        </div>
      </section>

      <section className="owner-cta">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-16 md:flex-row md:items-end md:justify-between">
          <div><p className="eyebrow gold">Il primo passo</p><h2 className="display-type mt-4 max-w-4xl text-4xl leading-none text-white md:text-6xl">Parliamo del tuo immobile e dell’obiettivo che vuoi raggiungere.</h2></div>
          <Link className="premium-button gold shrink-0" href="/appuntamento">Prenota un appuntamento <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </PublicShell>
  );
}
