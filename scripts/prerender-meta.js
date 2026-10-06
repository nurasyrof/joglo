// Vite plugin (build only): writes one HTML file per page and language with that page's title,
// description, canonical and language links, social cards and structured data already in <head>,
// so search engines and link previews see the right tags without running JavaScript. Also writes
// sitemap.xml. The app itself is the same on every page; only the <head> differs.
//
//   /            → index.html          /id            → id.html
//   /joglo       → joglo.html          /id/joglo      → id/joglo.html
//   /joglo/dalem → joglo/dalem.html    /id/joglo/dalem → id/joglo/dalem.html
// Cloudflare Pages serves /joglo from joglo.html; unknown paths fall back to index.html.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function render([tag, attrs, text]) {
  const a = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
  if (tag === 'meta' || tag === 'link') return `<${tag}${a} data-seo />`;
  // JSON-LD: only "</" needs escaping inside a script element.
  return `<${tag}${a} data-seo>${String(text).replace(/<\//g, '<\\/')}</${tag}>`;
}

export function prerenderMeta() {
  let outDir, root;
  return {
    name: 'prerender-meta',
    apply: 'build',
    configResolved(c) { root = c.root; outDir = path.resolve(c.root, c.build.outDir); },
    async closeBundle() {
      const load = (p) => import(pathToFileURL(path.join(root, p)).href);
      const seo = await load('src/seo.js');
      const { HOUSES } = await load('src/houses/index.js');
      const defs = {};
      for (const h of HOUSES.filter((x) => x.status === 'ready')) defs[h.id] = (await load(`src/houses/${h.id}/index.js`)).default;

      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
      const region = /<!-- seo:[\s\S]*?<!-- \/seo -->/;
      if (!region.test(template)) throw new Error('prerender-meta: <!-- seo --> region not found in index.html');

      const pages = seo.allPages(defs);
      let count = 0;
      for (const lang of ['en', 'id']) {
        for (const p of pages) {
          const m = seo.pageMeta({ lang, ...p });
          const head = [`<title>${esc(m.title)}</title>`, ...seo.headTags(m).map(render)].join('\n  ');
          const html = template.replace(region, head).replace(/<html lang="[^"]*">/, `<html lang="${lang}">`);
          const url = seo.pathFor(lang, p.path);
          const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`;
          fs.mkdirSync(path.dirname(path.join(outDir, file)), { recursive: true });
          fs.writeFileSync(path.join(outDir, file), html);
          count++;
        }
      }

      const today = new Date().toISOString().slice(0, 10);
      const entry = (lang, p) => {
        const alt = (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${seo.ORIGIN}${seo.pathFor(l, p.path)}"/>`;
        return `  <url><loc>${seo.ORIGIN}${seo.pathFor(lang, p.path)}</loc><lastmod>${today}</lastmod>`
          + `${alt('en')}${alt('id')}<xhtml:link rel="alternate" hreflang="x-default" href="${seo.ORIGIN}${p.path}"/></url>`;
      };
      const urls = pages.flatMap((p) => ['en', 'id'].map((l) => entry(l, p)));
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
      console.log(`prerender-meta: ${count} pages, sitemap.xml with ${urls.length} URLs`);
    },
  };
}
