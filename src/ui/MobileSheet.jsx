// Small screens: a bottom sheet with three heights (low: the 3D view, mid: a glimpse of every
// card, high: reading and controls) holding a swipeable carousel of cards. It opens low, so the
// model has most of the screen until the visitor pulls the sheet up. The toolbar and the
// info/walk cards ride on top of the sheet. Drag the handle (or tap it) to change height.
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { BookOpen, ChevronDown, ChevronsDown, Layers, ListTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CREDIT } from '@/config.js';
import { SITE_LINKS } from './site-links.js';
import { useLang } from './lang.jsx';
import { cn } from '@/lib/utils';

export const FOOTER_H = 40;
const GAP = 12;
const SNAPS = ['low', 'mid', 'high'];

function useViewportHeight() {
  const [h, setH] = useState(() => innerHeight);
  useEffect(() => {
    const on = () => setH(innerHeight);
    addEventListener('resize', on);
    return () => removeEventListener('resize', on);
  }, []);
  return h;
}

// Sheet heights (px, not counting the footer) for a viewport of height H.
const heightsFor = (H) => ({
  low: Math.round(Math.min(160, Math.max(116, H * 0.16))),
  mid: Math.round(H * 0.44),
  high: Math.round(H - FOOTER_H - 150),          // leaves room for the title and the toolbar
});

export function useSheet() {
  const H = useViewportHeight();
  const heights = heightsFor(H);
  const [snap, setSnap] = useState('low');
  const [drag, setDrag] = useState(null);       // live height while dragging
  return { heights, snap, setSnap, drag, setDrag, height: drag ?? heights[snap] };
}

// Pointer handling for the handle area: vertical drags resize the sheet, horizontal ones are
// left to the carousel, and a tap steps the sheet up (or back down from the top).
function useHandleDrag(sheet) {
  const g = useRef(null);
  const { heights, snap, setSnap, setDrag } = sheet;
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    g.current = { id: e.pointerId, x: e.clientX, y: e.clientY, h: heights[snap], t: performance.now(), mode: null, el: e.currentTarget };
  };
  const onPointerMove = (e) => {
    const s = g.current;
    if (!s || e.pointerId !== s.id) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.mode) {
      if (Math.abs(dy) > 6 && Math.abs(dy) > Math.abs(dx)) { s.mode = 'v'; s.el.setPointerCapture(e.pointerId); }
      else if (Math.abs(dx) > 6) { g.current = null; return; }
      else return;
    }
    const h = Math.max(heights.low * 0.7, Math.min(heights.high + 24, s.h - dy));
    s.last = { h, t: performance.now() };
    setDrag(h);
  };
  const onPointerUp = (e) => {
    const s = g.current;
    g.current = null;
    if (!s || e.pointerId !== s.id) return;
    if (!s.mode) {                                 // a tap
      setSnap(snap === 'high' ? 'mid' : SNAPS[SNAPS.indexOf(snap) + 1]);
      return;
    }
    const h = s.last?.h ?? s.h;
    const v = (h - s.h) / Math.max(1, performance.now() - s.t);   // px/ms, positive = up
    let next;
    if (Math.abs(v) > 0.6) {
      const order = SNAPS.map((k) => [k, heights[k]]);
      next = v > 0 ? (order.find(([, y]) => y > h + 8)?.[0] ?? 'high') : ([...order].reverse().find(([, y]) => y < h - 8)?.[0] ?? 'low');
    } else {
      next = SNAPS.reduce((a, k) => (Math.abs(heights[k] - h) < Math.abs(heights[a] - h) ? k : a), 'low');
    }
    setSnap(next);
    setDrag(null);
  };
  return { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp };
}

function Card({ title, handle, children }) {
  return (
    <section className="floating flex h-full w-[calc(100vw-3rem)] shrink-0 snap-center flex-col overflow-hidden rounded-2xl">
      <div {...handle} className="shrink-0 cursor-grab touch-pan-x select-none active:cursor-grabbing">
        <div className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-primary" aria-hidden="true" />
        <h2 className="truncate px-4 pt-2.5 pb-2 text-center font-heading text-xl font-semibold">{title}</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </section>
  );
}

// The carousel of cards. `cards` is [{ id, title, body, scroll }]; `scroll: false` means the body
// manages its own scrolling (lists and accordions with a ScrollArea).
export function SheetCarousel({ sheet, cards, apiRef, hidden }) {
  const { t } = useLang();
  const track = useRef(null);
  const handle = useHandleDrag(sheet);
  const goTo = useCallback((id) => {
    const i = cards.findIndex((c) => c.id === id);
    const el = track.current?.children[i];
    if (el) track.current.scrollTo({ left: el.offsetLeft - (track.current.clientWidth - el.clientWidth) / 2, behavior: 'smooth' });
  }, [cards]);
  useImperativeHandle(apiRef, () => ({ goTo }), [goTo]);

  return (
    <div
      className={cn('pointer-events-auto absolute inset-x-0', !sheet.drag && 'transition-[height,transform] duration-300 ease-out', hidden && 'translate-y-[120%]')}
      style={{ bottom: FOOTER_H, height: sheet.height }}
    >
      <div ref={track} className="no-scrollbar flex h-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-6">
        {cards.map((c) => (
          <Card key={c.id} title={c.title} handle={{ ...handle, role: 'button', 'aria-label': t('Resize panel', 'Ubah tinggi panel') }}>
            {c.scroll === false ? <div className="h-full">{c.body}</div> : c.body}
          </Card>
        ))}
      </div>
    </div>
  );
}

// Toolbar and info/walk cards, stacked just above the sheet.
export function AboveSheet({ sheet, hidden, children }) {
  const bottom = FOOTER_H + (hidden ? 0 : sheet.height) + GAP;
  return (
    <div
      className={cn('absolute inset-x-3 flex flex-col items-center gap-3', !sheet.drag && 'transition-[bottom] duration-300 ease-out')}
      style={{ bottom }}
    >
      {children}
    </div>
  );
}

const HINT_KEY = 'sheet-hint';
const hintSeen = () => { try { return localStorage.getItem(HINT_KEY) === '1'; } catch { return false; } };

// First visit on a phone: dims the view and points at the lowered sheet, saying what pulling it
// up is for. Goes away for good on "Got it", a tap outside, or once the sheet is moved.
export function SheetHint({ sheet }) {
  const { t } = useLang();
  const [open, setOpen] = useState(() => !hintSeen());
  const close = useCallback(() => {
    setOpen(false);
    try { localStorage.setItem(HINT_KEY, '1'); } catch { /* storage unavailable */ }
  }, []);
  const moved = sheet.snap !== 'low' || sheet.drag != null;
  useEffect(() => { if (open && moved) close(); }, [open, moved, close]);
  if (!open || moved) return null;
  const top = FOOTER_H + sheet.height;
  const items = [
    [BookOpen, t('Read about the house and its sources', 'Membaca tentang rumah ini dan sumbernya')],
    [ListTree, t('Browse its buildings and parts', 'Menelusuri bangunan dan bagian-bagiannya')],
    [Layers, t('Take the model apart and change the view', 'Mengurai model dan mengganti tampilan')],
  ];
  return (
    <>
      <div className="pointer-events-auto absolute inset-x-0 top-0 animate-in bg-black/45 duration-300 fade-in" style={{ bottom: top }} onClick={close} aria-hidden="true" />
      <div
        role="dialog" aria-label={t('How to use the panel', 'Cara memakai panel')}
        className="pointer-events-auto absolute inset-x-6 flex animate-in flex-col items-center duration-300 fade-in slide-in-from-bottom-3"
        style={{ bottom: top + 6 }}
      >
        <div className="w-full rounded-2xl border bg-card px-5 py-4 text-card-foreground shadow-xl">
          <h2 className="font-heading text-xl font-semibold">{t('Pull this panel up', 'Tarik panel ini ke atas')}</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/80">
            {t('Swipe it up, or tap its handle, to:', 'Usap ke atas, atau ketuk pegangannya, untuk:')}
          </p>
          <ul className="mt-2.5 space-y-2 text-[13px] leading-snug">
            {items.map(([Icon, text]) => (
              <li key={text} className="flex items-center gap-2.5"><Icon className="size-4 shrink-0 text-primary" />{text}</li>
            ))}
          </ul>
          <p className="mt-2.5 text-xs text-muted-foreground">{t('Swipe sideways to switch between the three cards.', 'Usap ke samping untuk berpindah di antara tiga kartu.')}</p>
          <Button size="sm" className="mt-3 w-full" onClick={close}>{t('Got it', 'Mengerti')}</Button>
        </div>
        <ChevronsDown className="mt-1 size-6 animate-bounce text-white drop-shadow" aria-hidden="true" />
      </div>
    </>
  );
}

const footerText = 'pointer-events-auto text-xs text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.45)]';

export function MobileFooter() {
  const { t, tx, href } = useLang();
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-7" style={{ height: FOOTER_H }}>
      <p className={footerText}>
        © {new Date().getFullYear()} <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium">{CREDIT.name}</a>
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(footerText, 'flex items-center gap-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-white/70')}>
          {t('About', 'Tentang')} <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-44">
          {SITE_LINKS.map((l) => (
            <DropdownMenuItem key={l.id} asChild><a href={href(`/${l.id}`)}>{tx(l.short)}</a></DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
