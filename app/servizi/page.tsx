import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Building2, Camera, Check, FileCheck2, KeyRound, Megaphone, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/site/page-hero';
import { PublicShell } from '@/components/site/public-shell';

export const metadata: Metadata = {
  title: 'Vendita, affitti e gestione locazioni | Maison Aurea',
  description: 'Strategia di vendita, ricerca conduttori e property management con un unico interlocutore e una regia digitale completa.',
};

const services = [
  {
    icon: Building2,
    number: '01',
    title: 'Vendita immobiliare',
    intro: 'Costruiamo il posizionamento corretto prima di portare una proprietà sul mercato.',
    items: ['Valutazione comparativa e strategia di prezzo', 'Servizio fotografico, video e testi editoriali', 'Distribuzione sui principali portali e campagne mirate', 'Visite qualificate, negoziazione e assistenza al rogito'],
  },
  {
    icon: KeyRound,
    number: '02',
    title: 'Affitti selezionati',
    intro: 'Riduciamo tempi, rischi e complessità nella scelta del conduttore e nella firma del contratto.',
    items: ['Analisi del canone e della domanda locale', 'Promozione e raccolta delle candidature', 'Verifica documentale e selezione del profilo', 'Contratto, inventario, consegna e verbale'],
  },
  {
    icon: ShieldCheck,
    number: '03',
    title: 'Gestione locazioni',
    intro: 'Presidiamo la relazione e l’operatività dell’immobile, con rendicontazione chiara per la proprietà.',
    items: ['Monitoraggio canoni, scadenze e adeguamenti', 'Coordinamento di manutenzioni e fornitori', 'Assistenza al conduttore e report al proprietario', 'Rinnovi, disdette e riconsegna dell’immobile'],
  },
];

export default function ServicesPage() {
  return (
    <PublicShell>
      <PageHero
        actions={<Link className="premium-button gold" href="/appuntamento?service=Consulenza%20immobiliare">Prenota una consulenza <ArrowUpRight className="h-4 w-4" /></Link>}
        description="Dalla prima valutazione alla gestione quotidiana: competenze commerciali, comunicazione e controllo operativo coordinate da un solo referente."
        eyebrow="Servizi per proprietari e investitori"
        image="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=88"
        title="Più valore all’immobile. Meno complessità per te."
      />

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="service-detail-list">
          {services.map(({ icon: Icon, intro, items, number, title }) => (
            <article className="service-detail" key={title}>
              <div className="service-detail-heading">
                <span>{number}</span>
                <Icon className="h-6 w-6" />
                <h2>{title}</h2>
              </div>
              <p>{intro}</p>
              <ul>
                {items.map((item) => <li key={item}><Check className="h-4 w-4" /> {item}</li>)}
              </ul>
              <Link href={`/appuntamento?service=${encodeURIComponent(title)}`}>Approfondisci il servizio <ArrowUpRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="process-band">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <p className="eyebrow gold">Un incarico, una regia completa</p>
          <h2 className="display-type mt-4 max-w-3xl text-4xl leading-none text-white md:text-6xl">Ogni passaggio ha un responsabile e un obiettivo misurabile.</h2>
          <div className="process-grid mt-12">
            {[
              [Camera, 'Presentazione', 'Immagini e contenuti progettati per far percepire qualità e caratteristiche reali.'],
              [Megaphone, 'Distribuzione', 'Pubblicazione coordinata e dati sempre allineati tra sito e canali immobiliari.'],
              [FileCheck2, 'Chiusura', 'Documenti, trattativa e passaggi contrattuali seguiti con attenzione puntuale.'],
            ].map(([Icon, title, copy]) => (
              <article key={String(title)}><Icon className="h-6 w-6" /><h3>{String(title)}</h3><p>{String(copy)}</p></article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
