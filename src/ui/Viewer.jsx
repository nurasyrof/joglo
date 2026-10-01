// The house viewer: engine canvas plus every floating panel, sheets on small screens,
// and keyboard shortcuts.
import { useEffect, useRef, useState } from 'react';
import { createEngine } from '@/engine/engine.js';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { EngineContext, useEngineSnapshot } from './engine-context.js';
import { useTheme } from './theme.jsx';
import { navigate } from './router.js';
import { PanelButton, TitleBar } from './TopBar.jsx';
import { AboutCardContent, ListPanelContent } from './ListPanel.jsx';
import { ControlsPanelContent } from './ControlsPanel.jsx';
import { InfoCard, WalkCard } from './Cards.jsx';
import { FooterCredit, FooterLinks, HelpDialog, HoverTooltip, LoadingScreen, Toolbar } from './Overlays.jsx';
import { cn } from '@/lib/utils';

const VIEW_KEYS = { 1: 'iso', 2: 'front', 3: 'side', 4: 'top', 5: 'inside' };
const DEFAULT_SECTIONS = ['view', 'explode', 'display', 'section', 'materials'];

// True while a dialog, menu, popover or sheet has focus, so shortcuts stay out of the way.
const overlayOpen = () => !!document.querySelector('[role=dialog][data-state=open], [data-slot=dropdown-menu-content], [data-slot=popover-content], [data-slot=select-content]');

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
  const [sheet, setSheet] = useState(null);              // 'list' | 'controls' on small screens
  const [sections, setSections] = useState(DEFAULT_SECTIONS);

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
    if (matchMedia('(max-width: 767px)').matches) setSheet('controls');
    requestAnimationFrame(() => document.querySelector('[data-slot=accordion-item]:last-child')?.scrollIntoView({ behavior: 'smooth', block: 'end' }));
  };

  const ready = engine && s?.house;
  const walking = s?.walk?.on;
  const blueprint = s?.style === 'blueprint';

  return (
    <EngineContext.Provider value={{ engine, s }}>
      <div className="fixed inset-0 overflow-hidden">
        <div ref={host} className={cn('absolute inset-0', blueprint ? 'viewport-blueprint' : 'viewport-sky')} />

        {ready && (
          <div className="pointer-events-none absolute inset-0">
            <HoverTooltip />

            {/* Centred title (house, and building inside a compound) */}
            <header className="absolute inset-x-14 top-4 flex justify-center md:inset-x-[22rem] md:top-5">
              <TitleBar meta={meta} />
            </header>
            <div className="absolute top-4 left-3 md:hidden"><PanelButton side="left" label="About & parts" onClick={() => setSheet('list')} /></div>
            <div className="absolute top-4 right-3 md:hidden"><PanelButton side="right" label="Controls" onClick={() => setSheet('controls')} /></div>

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

        {ready && (
          <>
            <Sheet open={sheet === 'list'} onOpenChange={(o) => setSheet(o ? 'list' : null)}>
              <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
                <SheetTitle className="sr-only">About and parts</SheetTitle>
                <SheetDescription className="sr-only">About this house and its buildings or parts</SheetDescription>
                <div className="flex h-full min-h-0 flex-col">
                  <AboutCardContent className="max-h-[45%] shrink-0 border-b pr-10" />
                  <div className="min-h-0 flex-1"><ListPanelContent onPicked={() => setSheet(null)} /></div>
                  <div className="border-t px-4 py-3">
                    <FooterLinks className="text-muted-foreground [text-shadow:none]" linkClassName="hover:text-foreground" />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Sheet open={sheet === 'controls'} onOpenChange={(o) => setSheet(o ? 'controls' : null)}>
              <SheetContent side="right" className="w-[85vw] max-w-sm gap-0 p-0">
                <SheetTitle className="sr-only">Controls</SheetTitle>
                <SheetDescription className="sr-only">View, display and download controls</SheetDescription>
                <ControlsPanelContent openSections={sections} setOpenSections={setSections} />
              </SheetContent>
            </Sheet>
            <HelpDialog open={help} onOpenChange={setHelp} />
          </>
        )}

        <LoadingScreen show={!ready || s.loading} text={s?.loadingText} />
      </div>
    </EngineContext.Provider>
  );
}
