// Bottom-centre overlays: the info card for a selected part/building and the guided-walk card.
import { useEffect, useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Crosshair, Footprints, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEngine } from './engine-context.js';
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

export function InfoCard() {
  const { engine, s } = useEngine();
  const c = s.card;
  const bodyRef = useRef(null);
  useEffect(() => { bodyRef.current?.scrollTo(0, 0); }, [c?.id]);
  if (!c) return null;
  const building = c.kind === 'building';
  return (
    <section className={cn(shell, 'animate-in fade-in slide-in-from-bottom-3 duration-200')} aria-live="polite">
      <div ref={bodyRef} className="max-h-[48vh] overflow-y-auto px-5 pt-4 pb-4">
        <div className="flex items-center gap-2">
          {c.cat && (
            <Badge variant="outline" className="gap-1.5 font-medium">
              <span className="size-1.5 rounded-full" style={{ background: c.cat.color }} />
              {c.cat.label}{c.cat.local && <span className="text-muted-foreground"> · {c.cat.local}</span>}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground tabular-nums">{c.index} / {c.total}</span>
          <div className="flex-1" />
          <Nav label="Previous (←)" onClick={() => engine.step(-1)}><ChevronLeft /></Nav>
          <Nav label="Next (→)" onClick={() => engine.step(1)}><ChevronRight /></Nav>
          <Nav label="Close (Esc)" onClick={() => engine.select(null)}><X /></Nav>
        </div>
        <h3 className="mt-2 font-heading text-3xl leading-none font-semibold tracking-tight">{c.name}</h3>
        <p className="mt-1.5 text-sm text-primary">
          {c.en} <span className="text-muted-foreground">· <i>{c.alias}</i></span>
        </p>
        <p className="mt-3 text-sm leading-relaxed">{c.desc}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Function</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{c.fn}</p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Meaning</h4>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{c.meaning}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {c.specs.map((x) => <Badge key={x} variant="secondary" className="font-normal">{x}</Badge>)}
          <div className="flex-1" />
          {building ? (
            <Button onClick={() => engine.enterBuilding(c.id)}>
              Enter building <ArrowRight />
            </Button>
          ) : (
            <>
              <ToggleGroup type="single" variant="outline" size="sm" spacing={0} value={s.focusMode} onValueChange={(v) => v && engine.setFocusMode(v)}>
                <ToggleGroupItem value="none">Highlight</ToggleGroupItem>
                <ToggleGroupItem value="ghost">Ghost others</ToggleGroupItem>
                <ToggleGroupItem value="isolate">Isolate</ToggleGroupItem>
              </ToggleGroup>
              <Button variant="outline" size="sm" onClick={() => engine.focusSelected()}>
                <Crosshair /> Focus
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export function WalkCard() {
  const { engine, s } = useEngine();
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
          <Badge className="gap-1.5"><Footprints /> Guided walk</Badge>
          <span className="text-xs text-muted-foreground tabular-nums">{w.index + 1} / {w.total}</span>
          <div className="flex-1" />
          <Nav label="End walk (Esc)" onClick={() => engine.stopWalk()}><X /></Nav>
        </div>
        <h3 key={w.index} className="mt-2 font-heading text-3xl leading-none font-semibold tracking-tight animate-in fade-in duration-500">{w.stop.title}</h3>
        {w.stop.local && <p className="mt-1.5 text-sm text-primary">{w.stop.local}</p>}
        <p key={`t${w.index}`} className="mt-3 min-h-[4.5em] text-sm leading-relaxed animate-in fade-in duration-500">{w.stop.text}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {w.titles.map((t, i) => (
              <Tooltip key={t}>
                <TooltipTrigger asChild>
                  <button
                    aria-label={t}
                    onClick={() => engine.walkGo(i)}
                    className={cn('h-2 rounded-full transition-all', i === w.index ? 'w-5 bg-primary' : i < w.index ? 'w-2 bg-primary/50' : 'w-2 bg-muted-foreground/25 hover:bg-muted-foreground/50')}
                  />
                </TooltipTrigger>
                <TooltipContent>{t}</TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="flex-1" />
          <Nav label="Previous stop (←)" onClick={() => engine.walkPrev()} disabled={w.index === 0}><ChevronLeft /></Nav>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={w.auto ? 'secondary' : 'ghost'} size="icon-sm" aria-label="Auto-play (space)" onClick={() => engine.setWalkAuto(!w.auto)}>
                {w.auto ? <Pause /> : <Play />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{w.auto ? 'Pause' : 'Auto-play'} (space)</TooltipContent>
          </Tooltip>
          <Button size="sm" onClick={() => engine.walkNext()}>
            {last ? 'Finish' : <>Next stop <ArrowRight /></>}
          </Button>
        </div>
      </div>
    </section>
  );
}
