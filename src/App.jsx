// App shell: theme, tooltips and routing between the directory, a house viewer and site pages.
import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { houseById } from '@/houses/index.js';
import { DEFAULT_HOUSE, SHOW_DIRECTORY, SITE } from '@/config.js';
import { ThemeProvider } from '@/ui/theme.jsx';
import { LangProvider, useLang } from '@/ui/lang.jsx';
import { useHashRoute, navigate, replaceRoute } from '@/ui/router.js';
import { Viewer } from '@/ui/Viewer.jsx';
import { linkById } from '@/ui/site-links.js';

// Code that most visits never need is loaded on demand.
const named = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));
const Directory = named(() => import('@/ui/Directory.jsx'), 'Directory');
const PageOverlay = named(() => import('@/ui/pages.jsx'), 'PageOverlay');
const AboutDialog = named(() => import('@/ui/SiteDialogs.jsx'), 'AboutDialog');
const ContributeDialog = named(() => import('@/ui/SiteDialogs.jsx'), 'ContributeDialog');

// If on-demand code can't be loaded (offline, or a file gone after a deploy and the automatic
// reload in main.jsx didn't help), drop just that piece instead of blanking the whole app.
// Browsers remember a failed module download until the page reloads, so it can't retry before then;
// resetting on navigation keeps the other pieces in this boundary usable.
class Optional extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidUpdate(prev) { if (this.state.failed && prev.retry !== this.props.retry) this.setState({ failed: false }); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Routes() {
  const route = useHashRoute();
  const { t, tx } = useLang();
  const link = linkById(route.house);                 // #/about, #/terms, #/contribute
  const page = link?.kind === 'page' ? link.id : null;
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
    document.title = link ? `${tx(link.short)} · ${SITE}` : valid ? `${meta.name} · ${SITE}` : `${SITE} · ${t('Traditional houses of Indonesia', 'Rumah adat Indonesia')}`;
  }, [link, valid, meta, t, tx]);

  // Dialogs load on first open, then stay mounted so they can animate closed.
  const [opened, setOpened] = useState({});
  if (dialog && !opened[dialog]) setOpened((o) => ({ ...o, [dialog]: true }));

  const backHref = valid ? `#/${last.current.house}${last.current.building ? `/${last.current.building}` : ''}` : '#/';
  const close = () => navigate(backHref);
  return (
    <>
      {valid && <Viewer meta={meta} building={target.building} covered={!!page} />}
      <Optional retry={route.house}>
        <Suspense fallback={null}>
          {!valid && SHOW_DIRECTORY && !page && <Directory />}
          {page && <PageOverlay id={page} backHref={backHref} backLabel={valid ? t(`Back to ${meta.name}`, `Kembali ke ${meta.name}`) : t('Back', 'Kembali')} />}
          {opened.about && <AboutDialog open={dialog === 'about'} onClose={close} />}
          {opened.contribute && <ContributeDialog open={dialog === 'contribute'} onClose={close} house={last.current.house} />}
        </Suspense>
      </Optional>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <TooltipProvider delayDuration={350}>
          <Routes />
        </TooltipProvider>
      </LangProvider>
    </ThemeProvider>
  );
}
