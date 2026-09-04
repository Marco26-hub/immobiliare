import { seedProperties, type Property } from '@/app/data';

const channelNames: Record<string, string> = {
  immobiliare: 'Immobiliare.it',
  idealista: 'Idealista',
  casa: 'Casa.it',
  subito: 'Subito',
  wikicasa: 'Wikicasa',
  trovacasa: 'Trovacasa',
};

function escapeXml(value: string | number | boolean) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function propertyXml(property: Property, origin: string) {
  const photos = [property.heroImage, ...property.gallery]
    .map((image) => `<image>${escapeXml(image)}</image>`)
    .join('');

  return `<property>
  <id>${escapeXml(property.id)}</id>
  <reference>${escapeXml(property.slug)}</reference>
  <url>${escapeXml(`${origin}/properties/${property.slug}`)}</url>
  <title>${escapeXml(property.title)}</title>
  <description>${escapeXml(property.description)}</description>
  <category>${escapeXml(property.category)}</category>
  <status>${escapeXml(property.status)}</status>
  <city>${escapeXml(property.city)}</city>
  <zone>${escapeXml(property.district)}</zone>
  <address>${escapeXml(property.address)}</address>
  <price currency="EUR">${escapeXml(property.price)}</price>
  <surface unit="sqm">${escapeXml(property.surface)}</surface>
  <rooms>${escapeXml(property.rooms)}</rooms>
  <bathrooms>${escapeXml(property.bathrooms)}</bathrooms>
  <floor>${escapeXml(property.floor)}</floor>
  <energyClass>${escapeXml(property.energyClass)}</energyClass>
  <featured>${escapeXml(property.featured)}</featured>
  <promoted>${escapeXml(property.promoted)}</promoted>
  <images>${photos}</images>
</property>`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ channel: string }> },
) {
  const { channel } = await context.params;
  const channelName = channelNames[channel] || 'Generic portal';
  const origin = new URL(request.url).origin;
  const published = seedProperties.filter((property) => property.status === 'published');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<realEstateFeed>
  <agency>Maison Aurea</agency>
  <channel>${escapeXml(channelName)}</channel>
  <generatedAt>${new Date().toISOString()}</generatedAt>
  <properties>
${published.map((property) => propertyXml(property, origin)).join('\n')}
  </properties>
</realEstateFeed>`;

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

