import { site } from '../config/site.mjs';

export const abs = (path) => new URL(path, site.url).toString();

export const waLink = (text = '') => {
  const base = `https://wa.me/${site.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const telLink = () => `tel:${site.phone.tel}`;

export const localBusiness = () => ({
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${site.url}/#empresa`,
  name: site.name,
  url: site.url,
  image: abs('/img/og.png'),
  logo: abs('/img/logo.png'),
  telephone: [site.phone.tel, `+${site.whatsapp.number}`],
  areaServed: [{ '@type': 'City', name: site.city }, { '@type': 'Country', name: 'Brasil' }],
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'BR' },
  description:
    'Dedetização, desratização, descupinização, controle de escorpiões e limpeza de caixa d’água, com equipe licenciada e responsável técnico habilitado.',
});

export const serviceSchema = (s, path) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: s.title,
  serviceType: s.title,
  description: s.metaDescription,
  url: abs(path),
  provider: { '@id': `${site.url}/#empresa` },
  areaServed: { '@type': 'City', name: site.city },
});

export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
});

export const breadcrumbs = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({ '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.path) })),
});

export const jsonLd = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
