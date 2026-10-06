// Keeps <title> and the SEO / social tags in <head> in step with the page as you navigate.
// Link-preview bots read the pre-filled HTML the build writes for each page; this matters for
// search engines that run JavaScript and for the browser's own share sheet.
import { useEffect } from 'react';
import { headTags, pageMeta } from '@/seo.js';

function apply(m) {
  document.title = m.title;
  for (const el of document.head.querySelectorAll('[data-seo]')) el.remove();
  for (const [tag, attrs, text] of headTags(m)) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute('data-seo', '');
    if (text) el.textContent = text;
    document.head.appendChild(el);
  }
}

export function usePageMeta({ lang, page, house, building }) {
  useEffect(() => {
    let cancelled = false;
    const path = page ? `/${page}` : house ? `/${[house.id, building].filter(Boolean).join('/')}` : '/';
    if (house && building) {
      // Building names and descriptions live in the house definition, which is loaded anyway.
      house.load().then((mod) => {
        if (cancelled) return;
        const b = mod.default.site?.buildings.find((x) => x.id === building);
        apply(pageMeta({ lang, path, house, building: b || null }));
      });
    } else {
      apply(pageMeta({ lang, path, page, house }));
    }
    return () => { cancelled = true; };
  }, [lang, page, house, building]);
}
