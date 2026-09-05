export type PropertyStatus = 'published' | 'draft' | 'reserved' | 'sold';

export type Property = {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  address: string;
  price: number;
  surface: number;
  rooms: number;
  bathrooms: number;
  floor: string;
  energyClass: string;
  status: PropertyStatus;
  featured: boolean;
  promoted: boolean;
  category: string;
  heroImage: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  highlights: string[];
  createdAt: string;
};

export const seedProperties: Property[] = [
  {
    id: 'p-001',
    slug: 'attico-brera-terrazza-panoramica',
    title: 'Attico Brera con terrazza panoramica',
    city: 'Milano',
    district: 'Brera',
    address: 'Via Solferino 22',
    price: 1850000,
    surface: 178,
    rooms: 5,
    bathrooms: 3,
    floor: '6',
    energyClass: 'A4',
    status: 'published',
    featured: true,
    promoted: true,
    category: 'Attico',
    heroImage:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85',
    ],
    shortDescription:
      'Un ultimo piano scenografico con luce piena, materiali naturali e una terrazza che domina i tetti storici.',
    description:
      'Residenza di rappresentanza nel cuore di Brera, progettata per chi vuole privacy, vista e una distribuzione fluida tra living, zona notte e spazi esterni. La terrazza corre lungo il fronte principale e diventa una stanza aperta per cene, eventi e momenti privati.',
    highlights: ['Terrazza 64 mq', 'Ascensore privato', 'Domotica', 'Box doppio'],
    createdAt: '2026-08-18T10:00:00.000Z',
  },
  {
    id: 'p-002',
    slug: 'villa-moderna-lago-como',
    title: 'Villa moderna sul Lago di Como',
    city: 'Como',
    district: 'Cernobbio',
    address: 'Via Regina 91',
    price: 4200000,
    surface: 410,
    rooms: 8,
    bathrooms: 5,
    floor: 'Terra',
    energyClass: 'A3',
    status: 'published',
    featured: true,
    promoted: true,
    category: 'Villa',
    heroImage:
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=85',
    ],
    shortDescription:
      'Architettura pulita, vetrate a tutta altezza, piscina e pontile privato in una delle rive più desiderate.',
    description:
      'Una villa contemporanea costruita per vivere il lago tutto l’anno. Gli spazi di rappresentanza dialogano con giardino, piscina e area wellness. La suite padronale ha vista piena e guardaroba separato.',
    highlights: ['Pontile privato', 'Piscina infinity', 'Spa', 'Dependance'],
    createdAt: '2026-08-09T10:00:00.000Z',
  },
  {
    id: 'p-003',
    slug: 'loft-design-porta-romana',
    title: 'Loft di design in Porta Romana',
    city: 'Milano',
    district: 'Porta Romana',
    address: 'Via Crema 14',
    price: 790000,
    surface: 132,
    rooms: 3,
    bathrooms: 2,
    floor: '1',
    energyClass: 'B',
    status: 'published',
    featured: false,
    promoted: true,
    category: 'Loft',
    heroImage:
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?auto=format&fit=crop&w=1400&q=85',
    ],
    shortDescription:
      'Volumi aperti, pareti materiche e cucina custom in un contesto industriale riconvertito.',
    description:
      'Un loft elegante e funzionale, ideale per professionisti e coppie che desiderano un ambiente urbano con forte identità. Gli arredi integrati valorizzano l’altezza interna e separano senza chiudere.',
    highlights: ['Soffitti 4,2 m', 'Cucina su misura', 'Corte interna', 'Pronto da vivere'],
    createdAt: '2026-07-30T10:00:00.000Z',
  },
  {
    id: 'p-004',
    slug: 'residenza-storica-firenze',
    title: 'Residenza storica vista Duomo',
    city: 'Firenze',
    district: 'Centro Storico',
    address: 'Borgo San Lorenzo 8',
    price: 1320000,
    surface: 155,
    rooms: 5,
    bathrooms: 3,
    floor: '3',
    energyClass: 'C',
    status: 'published',
    featured: false,
    promoted: false,
    category: 'Appartamento',
    heroImage:
      'https://images.unsplash.com/photo-1630701052108-5601f06df085?auto=format&fit=crop&w=1800&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85',
      'https://images.unsplash.com/photo-1600607688960-e095ff83135c?auto=format&fit=crop&w=1400&q=85',
    ],
    shortDescription:
      'Affreschi restaurati, pavimenti originali e una vista rara nel cuore monumentale della città.',
    description:
      'Una casa con anima storica e comfort contemporanei, pensata per chi cerca un indirizzo iconico senza rinunciare alla funzionalità. Il salone centrale affacciato sui tetti crea una scenografia quotidiana.',
    highlights: ['Vista Duomo', 'Affreschi', 'Cantina', 'Restauro certificato'],
    createdAt: '2026-07-16T10:00:00.000Z',
  },
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
