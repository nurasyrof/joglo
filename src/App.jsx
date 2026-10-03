// App shell: theme, tooltips and routing between the directory, a house viewer and site pages.
import { useEffect, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { houseById } from '@/houses/index.js';
import { DEFAULT_HOUSE, SHOW_DIRECTORY, SITE } from '@/config.js';
import { ThemeProvider } from '@/ui/theme.jsx';
import { useHashRoute, navigate, replaceRoute } from '@/ui/router.js';
import { Viewer } from '@/ui/Viewer.jsx';
import { Directory } from '@/ui/Directory.jsx';
import { PAGES, PageOverlay, linkById } from '@/ui/pages.jsx';
import { AboutDialog, ContributeDialog } from '@/ui/SiteDialogs.jsx';

const TITLES = { about: 'About', contribute: 'Contribute', terms: 'Terms & privacy' };

function Routes() {
  const route = useHashRoute();
  const link = linkById(route.house);                 // #/about, #/terms, #/contribute
  const page = link?.kind === 'page' ? PAGES[link.id] : null;
  const dialog = link?.kind === 'dialog' ? link.id : null;
  // Pages and dialogs open over the last house you viewed, so the 3D scene stays loaded behind them.
  const last = useRef({ house: DEFAULT_HOUSE, building: null });
  const target = link ? last.current : route;
  const meta = houseById(target.house);
  const valid = meta?.status === 'ready';
  if (!link && valid) last.current = { house: route.house, building: route.building };

  // Unknown or coming-soon houses fall back to the directory, or to the default house while it's off.
  useEffect(() => {
    if (link || valid) return;
    if (!SHOW_DIRECTORY) { replaceRoute(`#/${DEFAULT_HOUSE}`); dispatchEvent(new HashChangeEvent('hashchange')); }
    else if (route.house) replaceRoute('#/');
  }, [link, valid, route.house]);

  useEffect(() => {
    document.title = link ? `${TITLES[link.id]} · ${SITE}` : valid ? `${meta.name} · ${SITE}` : `${SITE} · Traditional houses of Indonesia`;
  }, [link, valid, meta]);

  const backHref = valid ? `#/${last.current.house}${last.current.building ? `/${last.current.building}` : ''}` : '#/';
  const close = () => navigate(backHref);
  return (
    <>
      {valid && <Viewer meta={meta} building={target.building} covered={!!page} />}
      {!valid && SHOW_DIRECTORY && !page && <Directory />}
      {page && <PageOverlay page={page} backHref={backHref} backLabel={valid ? `Back to ${meta.name}` : 'Back'} />}
      <AboutDialog open={dialog === 'about'} onClose={close} />
      <ContributeDialog open={dialog === 'contribute'} onClose={close} house={last.current.house} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={350}>
        <Routes />
      </TooltipProvider>
    </ThemeProvider>
  );
}
