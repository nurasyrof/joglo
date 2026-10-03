// The house viewer: engine canvas plus every floating panel, sheets on small screens,
// and keyboard shortcuts.
import { useEffect, useRef, useState } from 'react';
import { createEngine } from '@/engine/engine.js';
import { EngineContext, useEngineSnapshot } from './engine-context.js';
import { useTheme } from './theme.jsx';
import { navigate } from './router.js';
import { TitleBar } from './TopBar.jsx';
import { AboutCardContent, ListPanelContent, aboutTitle } from './ListPanel.jsx';
import { ControlsPanelContent } from './ControlsPanel.jsx';
import { InfoCard, WalkCard } from './Cards.jsx';
import { FooterCredit, FooterLinks, HelpDialog, HoverTooltip, LoadingScreen, Toolbar } from './Overlays.jsx';
import { AboveSheet, MobileFooter, SheetCarousel, useSheet } from './MobileSheet.jsx';
import { cn } from '@/lib/utils';

const VIEW_KEYS = { 1: 'iso', 2: 'front', 3: 'side', 4: 'top', 5: 'inside' };
const DEFAULT_SECTIONS = ['view', 'explode', 'display', 'section', 'materials'];

// True while a dialog, menu, popover or sheet has focus, so shortcuts stay out of the way.
const overlayOpen = () => !!document.querySelector('[role=dialog][data-state=open], [data-slot=dropdown-menu-content], [data-slot=popover-content], [data-slot=select-content]');

function useMediaQuery(query) {
  const [match, setMatch] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

function useShortcuts(engine, { onHelp }) {
  useEffect(() => {
    if (!engine) return undefined;
    const onKey = (e) => {
      const snap = engine.getSnapshot();
      if (!snap.house || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest?.('input, select, textarea, [contenteditable]') || overlayOpen()) return;
      const k = e.key.toLowerCase();
      if (snap.walk.on) {
        if (k === 'escape') engine.stopWalk();
        else if (k === 'arrowright' || k === 'enter') engine.walkNext();
        else if (k === 'arrowleft') engine.walkPrev();
        else if (k === ' ') { e.preventDefault(); engine.setWalkAuto(!snap.walk.auto); }
        return;
      }
      const site = snap.mode === 'site', sel = snap.selected;
      if (VIEW_KEYS[k]) engine.goView(VIEW_KEYS[k]);
      else if (k === 'w' && site && snap.house.hasWalk) engine.startWalk();
      else if (k === 'e') engine.explodeAll(snap.explode < 0.5);
      else if (k === 's') engine.setSection({ on: !snap.section.on });
      else if (k === 'x') engine.cycleStyle();
      else if (k === 'l') engine.setLabels(!snap.labels);
      else if (k === 'r') engine.goView('iso');
      else if (k === 'f' && sel) engine.focusSelected();
      else if (k === 'enter' && sel && site) engine.enterBuilding(sel);
      else if (k === 'h' && sel) { engine.toggleHidden(sel); engine.select(null); }
      else if (k === 'escape') { if (sel) engine.select(null); else if (snap.building) engine.backToSite(); }
      else if (k === 'arrowright') engine.step(1);
      else if (k === 'arrowleft') engine.step(-1);
      else if (k === '?') onHelp();
    };
    // Capture phase: runs before Radix closes an open overlay on Escape, so the key isn't handled twice.
    addEventListener('keydown', onKey, true);
    return () => removeEventListener('keydown', onKey, true);
  }, [engine, onHelp]);
}

export function Viewer({ meta, building, covered = false }) {
  const host = useRef(null);
  const [engine, setEngine] = useState(null);
  const { resolved } = useTheme();
  const s = useEngineSnapshot(engine);
  const [help, setHelp] = useState(false);
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const mobile = useMediaQuery('(max-width: 767px)');
  const sheet = useSheet();                                // bottom sheet on small screens
  const carousel = useRef(null);
  const { setSnap } = sheet;
  // Selecting something lowers the sheet so the model and its info card are in view.
  useEffect(() => { if (s?.selected) setSnap('low'); }, [s?.selected, setSnap]);

  useEffect(() => {
    const e = createEngine(host.current, { onNavigate: navigate });
    setEngine(e);
    return () => e.dispose();
  }, []);
  useEffect(() => { engine?.setTheme(resolved); }, [engine, resolved]);
  useEffect(() => {
    if (!engine) return undefined;
    let cancelled = false;
    meta.load().then((mod) => { if (!cancelled) engine.openHouse(meta, mod.default, building); });
    return () => { cancelled = true; };
  }, [engine, meta, building]);
  useShortcuts(covered ? null : engine, { onHelp: () => setHelp(true) });

  const openDownload = () => {
    setSections((v) => (v.includes('download') ? v : [...v, 'download']));
    if (mobile) { setSnap('high'); carousel.current?.goTo('controls'); }
    requestAnimationFrame(() => document.querySelector('[data-slot=accordion-item]:last-child')?.scrollIntoView({ behavior: 'smooth', block: 'end' }));
  };

  const ready = engine && s?.house;
  const walking = s?.walk?.on;
  const blueprint = s?.style === 'blueprint';

  return (
    <EngineContext.Provider value={{ engine, s }}>
      <div className="fixed inset-0 overflow-hidden">
        <div ref={host} className={cn('absolute inset-0', blueprint ? 'viewport-blueprint' : 'viewport-sky')} />

        {ready && !mobile && (
          <div className="pointer-events-none absolute inset-0">
            <HoverTooltip />

            {/* Centred title (house, and building inside a compound) */}
            <header className="absolute inset-x-14 top-4 flex justify-center md:inset-x-[22rem] md:top-5">
              <TitleBar meta={meta} />
            </header>

            {!walking && (
              <>
                <div className="absolute top-4 bottom-4 left-4 hidden w-[18.5rem] flex-col gap-3 md:flex">
                  <section className="floating pointer-events-auto flex max-h-[55%] min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl">
                    <AboutCardContent />
                  </section>
                  <aside className="floating pointer-events-auto min-h-[12rem] flex-1 overflow-hidden rounded-2xl">
                    <ListPanelContent />
                  </aside>
                </div>
                <aside className="floating pointer-events-auto absolute top-4 right-4 bottom-4 hidden w-80 overflow-hidden rounded-2xl md:block">
                  <ControlsPanelContent openSections={sections} setOpenSections={setSections} />
                </aside>
              </>
            )}

            {/* Bottom: cards above the toolbar, with credit and links either side */}
            <div className={cn('absolute inset-x-3 bottom-3 flex flex-col items-center gap-3 md:bottom-4', !walking && 'md:right-[22rem] md:left-[21rem]')}>
              <InfoCard />
              <WalkCard />
              <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
                <FooterCredit className="hidden justify-self-end text-right xl:block" />
                <Toolbar onHelp={() => setHelp(true)} onDownload={openDownload} />
                <FooterLinks className="hidden justify-self-start xl:flex" />
              </div>
            </div>
          </div>
        )}

        {ready && mobile && (
          <div className="pointer-events-none absolute inset-0">
            <header className="absolute inset-x-3 top-4 flex justify-center">
              <TitleBar meta={meta} />
            </header>
            <AboveSheet sheet={sheet} hidden={walking}>
              {sheet.snap === 'low' && !sheet.drag && <InfoCard />}
              <WalkCard />
              <Toolbar onHelp={() => setHelp(true)} onDownload={openDownload} />
            </AboveSheet>
            <SheetCarousel
              sheet={sheet} hidden={walking} apiRef={carousel}
              cards={[
                { id: 'about', title: aboutTitle(s), body: <AboutCardContent full /> },
                { id: 'list', title: s.mode === 'site' ? 'Compound' : 'Anatomy', scroll: false, body: <ListPanelContent heading={false} /> },
                { id: 'controls', title: 'Controls', scroll: false, body: <ControlsPanelContent heading={false} openSections={sections} setOpenSections={setSections} /> },
              ]}
            />
            <MobileFooter />
          </div>
        )}

        {ready && <HelpDialog open={help} onOpenChange={setHelp} />}

        <LoadingScreen show={!ready || s.loading} text={s?.loadingText} />
      </div>
    </EngineContext.Provider>
  );
}
