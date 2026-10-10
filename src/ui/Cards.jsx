// Bottom-centre overlays: the info card for a selected part/building and the guided-walk card.
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Crosshair, Footprints, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEngine } from './engine-context.js';
import { useLang } from './lang.jsx';
import { cn } from '@/lib/utils';

const shell = 'floating pointer-events-auto w-full max-w-[38rem] rounded-2xl';

function Nav({ label, onClick, disabled, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={label} onClick={onClick} disabled={disabled}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

// Marks a "meaning" that is our own reading of the house rather than taken from a source.
function InterpretationBadge() {
  const { t } = useLang();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="rounded-full bg-interp-muted px-1.5 py-px text-[10px] font-medium text-interp outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
          {t('Interpretation', 'Interpretasi')}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-60">{t('Our own reading of this part, not taken from a published source.', 'Tafsiran kami sendiri tentang bagian ini, bukan dari sumber terbitan.')}</TooltipContent>
    </Tooltip>
  );
}

// `compact` (phones): the card opens short, with the name and two lines of text, so the model
// stays in view; "more" opens the full card.
export function InfoCard({ compact = false }) {
  const { engine, s } = useEngine();
  const { t } = useLang();
  const c = s.card;
  const bodyRef = useRef(null);
  const [more, setMore] = useState(false);
  useEffect(() => { bodyRef.current?.scrollTo(0, 0); setMore(false); }, [c?.id]);
  if (!c) return null;
  const building = c.kind === 'building';
  const short = compact && !more;
  return (
    <section className={cn(shell, 'animate-in fade-in slide-in-from-bottom-3 duration-200')} aria-live="polite">
      <div ref={bodyRef} className="max-h-[48vh] overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex items-center gap-2">
          {c.cat && (
            <Badge variant="outline" className="gap-1.5 font-medium">
              <span className="size-1.5 rounded-full" style={{ background: c.cat.color }} />
              {c.cat.label}{c.cat.local && c.cat.local !== c.cat.label && <span className="text-muted-foreground"> · {c.cat.local}</span>}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground tabular-nums">{c.index} / {c.total}</span>
          <div className="flex-1" />
          <Nav label={t('Previous (←)', 'Sebelumnya (←)')} onClick={() => engine.step(-1)}><ChevronLeft /></Nav>
          <Nav label={t('Next (→)', 'Berikutnya (→)')} onClick={() => engine.step(1)}><ChevronRight /></Nav>
          <Nav label={t('Close (Esc)', 'Tutup (Esc)')} onClick={() => engine.select(null)}><X /></Nav>
        </div>
        <h3 className={cn('mt-2 font-heading leading-none font-semibold tracking-tight', compact ? 'text-2xl' : 'text-3xl')}>{c.name}</h3>
        <p className="mt-1.5 text-sm text-primary">
          {c.en} <span className="text-muted-foreground">· <i>{c.alias}</i></span>
        </p>
        <p className={cn('text-sm leading-relaxed', short ? 'mt-2 line-clamp-2' : 'mt-3')} onClick={short ? () => setMore(true) : undefined}>{c.desc}</p>
        {compact && (
          <div className="mt-2 flex items-center gap-2">
            <button type="button" onClick={() => setMore((v) => !v)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
              {more ? t('…see less', '…lebih sedikit') : t('…see more', '…selengkapnya')}
            </button>
            <div className="flex-1" />
            {short && building && (
              <Button size="sm" onClick={() => engine.enterBuilding(c.id)}>
                {t('Enter building', 'Masuk bangunan')} <ArrowRight />
              </Button>
            )}
          </div>
        )}
        {!short && (
        <>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{t('Function', 'Fungsi')}</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{c.fn}</p>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{t('Meaning', 'Makna')}</h4>
              {c.interp && <InterpretationBadge />}
            </div>
            <p className={cn('mt-1 text-[13px] leading-relaxed text-foreground/85', c.interp && 'border-l-2 border-interp pl-2.5')}>{c.meaning}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {c.specs.map((x) => <Badge key={x} variant="secondary" className="font-normal">{x}</Badge>)}
          <div className="flex-1" />
          {building ? (
            <Button onClick={() => engine.enterBuilding(c.id)}>
              {t('Enter building', 'Masuk bangunan')} <ArrowRight />
            </Button>
          ) : (
            <>
              <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={s.focusMode} onValueChange={(v) => v && engine.setFocusMode(v)}>
                <ToggleGroupItem value="none">{t('Highlight', 'Sorot')}</ToggleGroupItem>
                <ToggleGroupItem value="ghost">{t('Ghost others', 'Samarkan lainnya')}</ToggleGroupItem>
                <ToggleGroupItem value="isolate">{t('Isolate', 'Isolasi')}</ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" size="sm" onClick={() => engine.focusSelected()}>
                <Crosshair /> {t('Focus', 'Fokus')}
              </Button>
            </>
          )}
        </div>
        </>
        )}
      </div>
    </section>
  );
}

export function WalkCard() {
  const { engine, s } = useEngine();
  const { t } = useLang();
  const bar = useRef(null);
  useEffect(() => engine.onProgress((p) => { if (bar.current) bar.current.style.transform = `scaleX(${p})`; }), [engine]);
  const w = s.walk;
  if (!w.on) return null;
  const last = w.index === w.total - 1;
  return (
    <section className={cn(shell, 'relative overflow-hidden ring-primary/40 animate-in fade-in slide-in-from-bottom-3 duration-300')} aria-live="polite">
      <div ref={bar} className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary" />
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center gap-2">
          <Badge className="gap-1.5"><Footprints /> {t('Guided walk', 'Jelajah terpandu')}</Badge>
          <span className="text-xs text-muted-foreground tabular-nums">{w.index + 1} / {w.total}</span>
          <div className="flex-1" />
          <Nav label={t('End walk (Esc)', 'Akhiri jelajah (Esc)')} onClick={() => engine.stopWalk()}><X /></Nav>
        </div>
        <h3 key={w.index} className="mt-2 font-heading text-3xl leading-none font-semibold tracking-tight animate-in fade-in duration-500">{w.stop.title}</h3>
        {w.stop.local && <p className="mt-1.5 text-sm text-primary">{w.stop.local}</p>}
        <p key={`t${w.index}`} className="mt-3 min-h-[4.5em] text-sm leading-relaxed animate-in fade-in duration-500">{w.stop.text}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {w.titles.map((title, i) => (
              <Tooltip key={title}>
                <TooltipTrigger asChild>
                  <button
                    aria-label={title}
                    onClick={() => engine.walkGo(i)}
                    className={cn('h-2 rounded-full transition-all', i === w.index ? 'w-5 bg-primary' : i < w.index ? 'w-2 bg-primary/50' : 'w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50')}
                  />
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="flex-1" />
          <Nav label={t('Previous stop (←)', 'Titik sebelumnya (←)')} onClick={() => engine.walkPrev()} disabled={w.index === 0}><ChevronLeft /></Nav>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={w.auto ? 'secondary' : 'ghost'} size="icon-sm" aria-label={t('Auto-play (space)', 'Putar otomatis (spasi)')} onClick={() => engine.setWalkAuto(!w.auto)}>
                {w.auto ? <Pause /> : <Play />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{w.auto ? t('Pause (space)', 'Jeda (spasi)') : t('Auto-play (space)', 'Putar otomatis (spasi)')}</TooltipContent>
          </Tooltip>
          <Button size="sm" onClick={() => engine.walkNext()}>
            {last ? t('Finish', 'Selesai') : <>{t('Next stop', 'Titik berikutnya')} <ArrowRight /></>}
          </Button>
        </div>
      </div>
    </section>
  );
}
