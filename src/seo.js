// Page metadata (title, description, canonical, language alternates, social cards, structured data)
// for every page of the site. Plain JS with no browser or React dependencies, so the same code
// runs at build time (vite.config.js writes a pre-filled HTML file per page for search engines
// and link previews) and in the browser (ui/page-meta.js keeps the head in sync as you navigate).
import { HOUSES } from './houses/index.js';
import { tx } from './lib/i18n.js';

export const ORIGIN = 'https://rumahadat.id';
export const SITE = 'rumahadat.id';
export const AUTHOR = { name: 'Asyrof', url: 'https://nurasyrof.com' };
const LICENSE = 'https://creativecommons.org/licenses/by-nc/4.0/';

export const pathFor = (lang, path = '/') => (lang === 'id' ? (path === '/' ? '/id' : `/id${path}`) : path);
const abs = (path) => ORIGIN + path;
const L = (en, id) => ({ en, id });

function clip(text, max = 158) {
  if (!text || text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:·–-]+$/, '')}…`;
}

const HOME = {
  title: L(`${SITE} · Indonesia’s traditional houses in 3D`, `${SITE} · Rumah adat Indonesia dalam 3D`),
  description: L(
    'Explore Indonesia’s traditional houses in 3D: take them apart, cut through them and learn what every part means.',
    'Jelajahi rumah adat Indonesia dalam 3D: urai, potong, dan pelajari makna setiap bagiannya.',
  ),
};

const PAGES = {
  about: {
    title: L(`About · ${SITE}`, `Tentang · ${SITE}`),
    description: L(
      `${SITE} is a personal, non-commercial project by ${AUTHOR.name}, an architect and product designer, bringing Indonesia’s traditional houses to life in 3D.`,
      `${SITE} adalah proyek pribadi nonkomersial oleh ${AUTHOR.name}, arsitek dan desainer produk, yang menghadirkan rumah adat Indonesia dalam 3D.`,
    ),
  },
  terms: {
    title: L(`Terms & privacy · ${SITE}`, `Ketentuan & privasi · ${SITE}`),
    description: L(
      `How you may use ${SITE} and its 3D downloads, and what data the site handles.`,
      `Cara Anda boleh menggunakan ${SITE} dan unduhan 3D-nya, serta data apa yang ditangani situs ini.`,
    ),
  },
  contribute: {
    title: L(`Contribute · ${SITE}`, `Kontribusi · ${SITE}`),
    description: L(
      'Suggest a house, send a correction, request a feature or get in touch about sponsorship and partnerships.',
      'Usulkan rumah, kirim koreksi, minta fitur, atau hubungi kami tentang sponsor dan kemitraan.',
    ),
  },
};

// Every page of the site as a language-neutral path, with what it shows. Buildings come from the
// house definitions (`defs`: house id → module default export), which only the build loads.
export function allPages(defs = {}) {
  const pages = [{ path: '/' }];
  for (const id of Object.keys(PAGES)) pages.push({ path: `/${id}`, page: id });
  for (const h of HOUSES.filter((x) => x.status === 'ready')) {
    pages.push({ path: `/${h.id}`, house: h });
    for (const b of defs[h.id]?.site?.buildings || []) pages.push({ path: `/${h.id}/${b.id}`, house: h, building: b });
  }
  return pages;
}

// Metadata for one page in one language. `building` is the building entry from the house's site.
export function pageMeta({ lang, path = '/', page = null, house = null, building = null }) {
  const X = (v) => tx(v, lang);
  let title, description, image, imageAlt, type = 'website';
  const crumbs = [{ name: SITE, path: '/' }];

  if (page && PAGES[page]) {
    ({ title, description } = PAGES[page]);
    title = X(title); description = X(description);
    crumbs.push({ name: title.split(' · ')[0], path });
  } else if (house && building) {
    const name = X(building.name), kind = X(building.en);
    const label = kind && kind.toLowerCase() !== name.toLowerCase() ? `${name} (${kind})` : name;
    title = X(L(`${label} · ${house.name} in 3D | ${SITE}`, `${label} · ${house.name} dalam 3D | ${SITE}`));
    description = clip(X(building.desc));
    crumbs.push({ name: house.name, path: `/${house.id}` }, { name: X(building.name), path });
    type = 'article';
  } else if (house) {
    const people = X(house.people);
    title = X(L(`${house.name} · ${people} traditional house in 3D | ${SITE}`, `${house.name} · Rumah adat ${people} dalam 3D | ${SITE}`));
    description = clip(`${X(house.blurb)} ${X(L('Explore every part in 3D.', 'Jelajahi setiap bagiannya dalam 3D.'))}`);
    crumbs.push({ name: house.name, path });
    type = 'article';
  } else {
    title = X(HOME.title);
    description = X(HOME.description);
  }

  if (house) {
    image = `/og/${house.id}-${lang}.jpg`;
    imageAlt = X(L(`${house.name}, a ${X(house.people)} traditional house, modelled in 3D`, `${house.name}, rumah adat ${X(house.people)}, dimodelkan dalam 3D`));
  } else {
    image = `/og/home-${lang}.jpg`;
    imageAlt = X(L('Indonesia’s traditional houses in 3D', 'Rumah adat Indonesia dalam 3D'));
  }

  const url = abs(pathFor(lang, path));
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'WebSite', name: SITE, url: ORIGIN + '/',
      inLanguage: ['en', 'id'], author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    },
  ];
  if (house) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': '3DModel',
      name: building ? `${X(building.name)} · ${house.name}` : house.name,
      description, url, image: abs(image), inLanguage: lang,
      encodingFormat: ['model/gltf-binary', 'model/obj', 'model/stl', 'model/vnd.usdz+zip'],
      license: LICENSE, isAccessibleForFree: true,
      creator: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
      about: { '@type': 'Thing', name: house.name, alternateName: house.local, description: X(house.blurb) },
      contentLocation: { '@type': 'Place', name: X(house.province), address: { '@type': 'PostalAddress', addressRegion: house.province.en, addressCountry: 'ID' } },
    });
  }
  if (crumbs.length > 1) {
    jsonLd.push({
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(pathFor(lang, c.path)) })),
    });
  }

  return {
    lang, title, description, url, type, image: abs(image), imageAlt,
    alternates: { en: abs(pathFor('en', path)), id: abs(pathFor('id', path)) },
    jsonLd,
  };
}

// The <head> elements for a page, as plain descriptors: [tag, attributes, text?]. The build turns
// them into HTML; the browser turns them into elements (both mark them with data-seo).
export function headTags(m) {
  const meta = (key, value, content) => ['meta', { [key]: value, content }];
  return [
    meta('name', 'description', m.description),
    ['link', { rel: 'canonical', href: m.url }],
    ['link', { rel: 'alternate', hreflang: 'en', href: m.alternates.en }],
    ['link', { rel: 'alternate', hreflang: 'id', href: m.alternates.id }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: m.alternates.en }],
    meta('property', 'og:site_name', SITE),
    meta('property', 'og:type', m.type),
    meta('property', 'og:title', m.title),
    meta('property', 'og:description', m.description),
    meta('property', 'og:url', m.url),
    meta('property', 'og:image', m.image),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', m.imageAlt),
    meta('property', 'og:locale', m.lang === 'id' ? 'id_ID' : 'en_US'),
    meta('property', 'og:locale:alternate', m.lang === 'id' ? 'en_US' : 'id_ID'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', m.title),
    meta('name', 'twitter:description', m.description),
    meta('name', 'twitter:image', m.image),
    meta('name', 'twitter:image:alt', m.imageAlt),
    ...m.jsonLd.map((d) => ['script', { type: 'application/ld+json' }, JSON.stringify(d)]),
  ];
}
