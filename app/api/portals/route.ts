const portals = [
  {
    id: 'immobiliare',
    name: 'Immobiliare.it',
    mode: 'Feed XML / gestionale autorizzato',
    status: 'ready',
    feed: '/api/feeds/immobiliare',
  },
  {
    id: 'idealista',
    name: 'Idealista',
    mode: 'Feed XML / partner API',
    status: 'ready',
    feed: '/api/feeds/idealista',
  },
  {
    id: 'casa',
    name: 'Casa.it',
    mode: 'Feed XML / accordo agenzia',
    status: 'ready',
    feed: '/api/feeds/casa',
  },
  {
    id: 'subito',
    name: 'Subito',
    mode: 'Gestionale / import professionale',
    status: 'ready',
    feed: '/api/feeds/subito',
  },
  {
    id: 'wikicasa',
    name: 'Wikicasa',
    mode: 'Feed gestionale',
    status: 'ready',
    feed: '/api/feeds/wikicasa',
  },
  {
    id: 'trovacasa',
    name: 'Trovacasa',
    mode: 'Feed gestionale',
    status: 'ready',
    feed: '/api/feeds/trovacasa',
  },
];

export async function GET() {
  return Response.json({ portals });
}

