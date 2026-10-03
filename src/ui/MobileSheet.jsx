// Small screens: a bottom sheet with three heights (low: the 3D view, mid: a glimpse of every
// card, high: reading and controls) holding a swipeable carousel of cards. The toolbar and the
// info/walk cards ride on top of the sheet. Drag the handle (or tap it) to change height.
import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CREDIT } from '@/config.js';
import { SITE_LINKS } from './pages.jsx';
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
  const [snap, setSnap] = useState('mid');
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
          <Card key={c.id} title={c.title} handle={{ ...handle, role: 'button', 'aria-label': `Resize panel (${sheet.snap})` }}>
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

const footerText = 'pointer-events-auto text-xs text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.45)]';

export function MobileFooter() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-7" style={{ height: FOOTER_H }}>
      <p className={footerText}>
        © {new Date().getFullYear()} <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium">{CREDIT.name}</a>
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(footerText, 'flex items-center gap-1 rounded outline-none focus-visible:ring-2 focus-visible:ring-white/70')}>
          About <ChevronDown className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top" sideOffset={8} className="w-44">
          {SITE_LINKS.map((l) => (
            <DropdownMenuItem key={l.id} asChild><a href={`#/${l.id}`}>{l.short}</a></DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
