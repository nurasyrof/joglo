// App shell: theme, tooltips and routing between the directory, a house viewer and site pages.
import { useEffect, useRef } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { houseById } from '@/houses/index.js';
import { DEFAULT_HOUSE, SHOW_DIRECTORY, SITE } from '@/config.js';
import { ThemeProvider } from '@/ui/theme.jsx';
import { useHashRoute, replaceRoute } from '@/ui/router.js';
import { Viewer } from '@/ui/Viewer.jsx';
import { Directory } from '@/ui/Directory.jsx';
import { PageOverlay, pageById } from '@/ui/pages.jsx';

function Routes() {
  const route = useHashRoute();
  const page = pageById(route.house);
  // Pages open over the last house you viewed, so the 3D scene stays loaded behind them.
  const last = useRef({ house: DEFAULT_HOUSE, building: null });
  const target = page ? last.current : route;
  const meta = houseById(target.house);
  const valid = meta?.status === 'ready';
  if (!page && valid) last.current = { house: route.house, building: route.building };

  // Unknown or coming-soon houses fall back to the directory, or to the default house while it's off.
  useEffect(() => {
    if (page || valid) return;
    if (!SHOW_DIRECTORY) { replaceRoute(`#/${DEFAULT_HOUSE}`); dispatchEvent(new HashChangeEvent('hashchange')); }
    else if (route.house) replaceRoute('#/');
  }, [page, valid, route.house]);

  useEffect(() => {
    document.title = page ? `${page.title} · ${SITE}` : valid ? `${meta.name} · ${SITE}` : `${SITE} · Traditional houses of Indonesia`;
  }, [page, valid, meta]);

  const backHref = `#/${last.current.house}${last.current.building ? `/${last.current.building}` : ''}`;
  return (
    <>
      {valid && <Viewer meta={meta} building={target.building} covered={!!page} />}
      {!valid && SHOW_DIRECTORY && !page && <Directory />}
      {page && <PageOverlay page={page} backHref={valid ? backHref : '#/'} backLabel={valid ? `Back to ${meta.name}` : 'Back'} />}
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
