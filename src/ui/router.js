// Path routing. English pages live at the root, Indonesian ones under /id:
//   /                     home (the default house while the directory is off)
//   /<house>              a house          /<house>/<building>   one building of a compound
//   /about /terms /contribute               site pages and dialogs
//   /id/…                 the same pages in Bahasa Indonesia
// Old #/… links are turned into paths on load (see main.jsx).
import { useSyncExternalStore } from 'react';

export function parse(pathname) {
  const seg = pathname.split('/').filter(Boolean).map(decodeURIComponent);
  let lang = 'en';
  if (seg[0] === 'id') { lang = 'id'; seg.shift(); }
  return { lang, house: seg[0] || '', building: seg[1] || null };
}

// The URL of a language-neutral path ('/', '/joglo', '/joglo/pendapa') in a language.
export const pathFor = (lang, path = '/') => (lang === 'id' ? (path === '/' ? '/id' : `/id${path}`) : path);
// The language-neutral part of a URL path.
export const neutralPath = (pathname) => pathname.replace(/^\/id(?=\/|$)/, '') || '/';

const listeners = new Set();
const notify = () => { for (const l of listeners) l(); };
addEventListener('popstate', notify);
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

export function navigate(to, { replace = false } = {}) {
  if (to === location.pathname + location.search + location.hash) return;
  history[replace ? 'replaceState' : 'pushState'](null, '', to);
  notify();
}
export const replaceRoute = (to) => navigate(to, { replace: true });

export function useRoute() {
  const path = useSyncExternalStore(subscribe, () => location.pathname);
  return parse(path);
}

// Plain <a href="/…"> links inside the app navigate without reloading the page.
export function interceptLinks() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest?.('a[href]');
    if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || /\.\w+$/.test(url.pathname)) return;
    e.preventDefault();
    navigate(url.pathname + url.search + url.hash);
  });
}
