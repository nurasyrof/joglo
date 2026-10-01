// Left panel: buildings grouped by zone (compound) or parts grouped by category (building).
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEngine } from './engine-context.js';
import { cn } from '@/lib/utils';

function Row({ item, color, site, active, hidden, onSelect, onEnter, onToggle }) {
  const ref = useRef(null);
  useEffect(() => { if (active) ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, [active]);
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onDoubleClick={site ? onEnter : undefined}
      onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
      className={cn(
        'group/row flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/50',
        active && 'bg-accent ring-1 ring-primary/40',
      )}
    >
      <span className="size-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 0 3px color-mix(in oklch, ${color} 22%, transparent)` }} />
      <span className={cn('min-w-0 flex-1 leading-tight', hidden && 'opacity-45')}>
        <span className="block truncate text-[13px] font-medium">{item.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{item.en}</span>
      </span>
      {site && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100" aria-label="Go inside" onClick={(e) => { e.stopPropagation(); onEnter(); }}>
              <ArrowRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Go inside</TooltipContent>
        </Tooltip>
      )}
      <Button
        variant="ghost" size="icon-xs" aria-label={hidden ? 'Show' : 'Hide'}
        className={cn('text-muted-foreground', hidden ? 'text-primary' : 'opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100')}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {hidden ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

export function ListPanelContent({ onPicked }) {
  const { engine, s } = useEngine();
  const [q, setQ] = useState('');
  const site = s.mode === 'site';
  const scope = `${s.house.id}/${s.building?.id || s.mode}`;
  useEffect(() => setQ(''), [scope]);
  const hidden = useMemo(() => new Set(s.hidden), [s.hidden]);
  const query = q.trim().toLowerCase();
  const groups = s.groups
    .map((g) => ({ ...g, items: g.items.filter((it) => !query || `${it.name} ${it.alias} ${it.en}`.toLowerCase().includes(query)) }))
    .filter((g) => g.items.length);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2.5 px-3 pt-3 pb-2">
        <div className="flex items-baseline justify-between px-0.5">
          <h2 className="font-heading text-xl font-semibold">{site ? 'Compound' : 'Anatomy'}</h2>
          <span className="text-xs text-muted-foreground">{s.total} {site ? 'buildings' : 'parts'}</span>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={site ? 'Search buildings…' : 'Search parts…'} className="h-8 pl-8" />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block">
        <div className="px-2 pb-3">
          {groups.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted-foreground">Nothing matches “{q}”.</p>}
          {groups.map((g) => (
            <div key={g.id} className="mt-2 first:mt-0">
              <div className="flex items-baseline gap-1.5 px-2 pt-2 pb-1">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{g.label}</span>
                <span className="text-xs text-muted-foreground/70 italic">{g.local}</span>
              </div>
              {g.items.map((it) => (
                <Row
                  key={it.id} item={it} color={g.color} site={site}
                  active={s.selected === it.id} hidden={hidden.has(it.id)}
                  onSelect={() => { engine.select(it.id, { focus: true }); onPicked?.(); }}
                  onEnter={() => engine.enterBuilding(it.id)}
                  onToggle={() => engine.toggleHidden(it.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex items-center gap-2 border-t px-3 py-2">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => engine.showAll()} disabled={!s.hidden.length}>
          <Eye /> Show all
        </Button>
      </div>
    </div>
  );
}

// "About this house" (or the open building in a compound): clamped text that expands in place.
export function AboutCardContent({ className }) {
  const { s } = useEngine();
  const [open, setOpen] = useState(false);
  const b = s.building;
  const title = b ? `About the ${b.name}` : 'About this house';
  const paras = b ? [b.desc, b.fn, b.meaning] : s.house.about.paras;
  useEffect(() => setOpen(false), [b?.id, s.house.id]);
  return (
    <div className={cn('flex min-h-0 flex-col px-4 pt-3.5 pb-3', className)}>
      <h2 className="font-heading text-xl font-semibold">{title}</h2>
      <div className={cn('mt-2 min-h-0', open && 'overflow-y-auto pr-1')}>
        <p
          onClick={() => !open && setOpen(true)}
          className={cn('text-[13px] leading-relaxed whitespace-pre-line text-foreground/80', !open && 'line-clamp-8 cursor-pointer')}
        >
          {paras.join('\n\n')}
        </p>
      </div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-2 self-start text-xs font-medium text-muted-foreground hover:text-foreground">
        {open ? '…see less' : '…see more'}
      </button>
    </div>
  );
}
