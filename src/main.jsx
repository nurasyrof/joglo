import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { houseById } from './houses/index.js';
import { DEFAULT_HOUSE } from './config.js';
import { interceptLinks, parse } from './ui/router.js';
import './index.css';

// In-app links navigate without reloading (old #/ links and the language redirect are handled
// by the inline script in index.html, before this runs).
interceptLinks();

// After a deploy, an open tab may ask for code files that no longer exist (their names change
// with every build). Reload once to pick up the new version instead of failing silently.
const STALE = /dynamically imported module|Importing a module script failed|error loading dynamically imported/i;
function reloadForNewVersion() {
  try {
    const last = Number(sessionStorage.getItem('reloadedForNewVersion') || 0);
    if (Date.now() - last < 10000) return false;      // already tried just now: don't loop
    sessionStorage.setItem('reloadedForNewVersion', String(Date.now()));
  } catch (e) { /* storage blocked: reload anyway */ }
  location.reload();
  return true;
}
// Only swallow the error when we are reloading; otherwise let it surface as usual.
addEventListener('vite:preloadError', (e) => { if (reloadForNewVersion()) e.preventDefault(); });
addEventListener('unhandledrejection', (e) => { if (STALE.test(e.reason?.message || '')) reloadForNewVersion(); });

// Start downloading the house in the URL right away, while React and the 3D engine start up.
(houseById(parse(location.pathname).house) ?? houseById(DEFAULT_HOUSE))?.load?.();

// Development only: ?icons=1 renders the favicon and app icon PNGs from public/icon.svg.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('icons')) import('./dev/og.js').then((m) => m.makeIcons());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
