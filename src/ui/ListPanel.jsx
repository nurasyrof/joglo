// Left panel: buildings grouped by zone (compound) or parts grouped by category (building).
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Eye, EyeOff, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useEngine } from './engine-context.js';
import { useLang } from './lang.jsx';
import { cn } from '@/lib/utils';

function Row({ item, color, site, active, hidden, onSelect, onEnter, onToggle }) {
  const { t } = useLang();
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
            <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100" aria-label={t('Go inside', 'Masuk')} onClick={(e) => { e.stopPropagation(); onEnter(); }}>
              <ArrowRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{t('Go inside', 'Masuk')}</TooltipContent>
        </Tooltip>
      )}
      <Button
        variant="ghost" size="icon-xs" aria-label={hidden ? t('Show', 'Tampilkan') : t('Hide', 'Sembunyikan')}
        className={cn('text-muted-foreground', hidden ? 'text-primary' : 'opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100')}
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {hidden ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}

export function ListPanelContent({ onPicked, heading = true }) {
  const { engine, s } = useEngine();
  const { t } = useLang();
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
      <div className={cn('space-y-2.5 px-3 pb-2', heading ? 'pt-3' : 'pt-1')}>
        {heading && (
          <div className="flex items-baseline justify-between px-0.5">
            <h2 className="font-heading text-xl font-semibold">{site ? t('Compound', 'Kompleks') : t('Anatomy', 'Anatomi')}</h2>
            <span className="text-xs text-muted-foreground">{s.total} {site ? t('buildings', 'bangunan') : t('parts', 'bagian')}</span>
          </div>
        )}
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={site ? t('Search buildings…', 'Cari bangunan…') : t('Search parts…', 'Cari bagian…')} className="h-8 pl-8" />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block">
        <div className="px-2 pb-3">
          {groups.length === 0 && <p className="px-2 py-6 text-center text-sm text-muted-foreground">{t(`Nothing matches “${q}”.`, `Tidak ada yang cocok dengan “${q}”.`)}</p>}
          {groups.map((g) => (
            <div key={g.id} className="mt-2 first:mt-0">
              <div className="flex items-baseline gap-1.5 px-2 pt-2 pb-1">
                <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">{g.label}</span>
                {g.local !== g.label && <span className="text-xs text-muted-foreground/70 italic">{g.local}</span>}
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
          <Eye /> {t('Show all', 'Tampilkan semua')}
        </Button>
      </div>
    </div>
  );
}

export const aboutTitle = (s, t) => (s.building ? t(`About the ${s.building.name}`, `Tentang ${s.building.name}`) : t('About this house', 'Tentang rumah ini'));

// "About this house" (or the open building in a compound): clamped text that expands in place.
// For a house, the ideal-type statement comes first and the sources follow the text.
// `full` shows all of it with no heading, for the mobile sheet where the card itself scrolls.
export function AboutCardContent({ className, full = false }) {
  const { s } = useEngine();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const b = s.building;
  const about = s.house.about;
  const paras = b ? [b.desc, b.fn, b.meaning] : [about.method, ...about.paras].filter(Boolean);
  useEffect(() => setOpen(false), [b?.id, s.house.id]);
  const label = !b && about.method && (
    <p className="text-[11px] font-semibold tracking-[0.12em] text-primary uppercase">{t('Ideal-type reconstruction', 'Rekonstruksi tipe ideal')}</p>
  );
  const sources = !b && <Sources about={about} />;
  if (full) {
    return (
      <div className={cn('space-y-3 px-5 pb-5 text-[13px] leading-relaxed text-foreground/80', className)}>
        {label}
        {paras.map((p, i) => <p key={i}>{p}</p>)}
        {sources}
      </div>
    );
  }
  return (
    <div className={cn('flex min-h-0 flex-col px-4 pt-3.5 pb-3', className)}>
      <h2 className="font-heading text-xl font-semibold">{aboutTitle(s, t)}</h2>
      <div className={cn('mt-2 min-h-0 space-y-1.5', open && 'overflow-y-auto pr-1')}>
        {label}
        <p
          onClick={() => !open && setOpen(true)}
          className={cn('text-[13px] leading-relaxed whitespace-pre-line text-foreground/80', !open && 'line-clamp-8 cursor-pointer')}
        >
          {paras.join('\n\n')}
        </p>
        {open && <div className="pt-2">{sources}</div>}
      </div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="mt-2 self-start text-xs font-medium text-muted-foreground hover:text-foreground">
        {open ? t('…see less', '…lebih sedikit') : t('…see more', '…selengkapnya')}
      </button>
    </div>
  );
}

// The house's checked sources, and further reading that has not been checked yet.
function Sources({ about }) {
  const { t } = useLang();
  const list = (items) => (
    <ul className="mt-1.5 space-y-1.5 text-[12px] leading-snug text-foreground/70">
      {items.map((r, i) => (
        <li key={i} className="pl-3 -indent-3">
          {r.url ? <a href={r.url} target="_blank" rel="noopener" className="hover:text-foreground hover:underline">{r.text}</a> : r.text}
        </li>
      ))}
    </ul>
  );
  const head = 'text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase';
  return (
    <div className="space-y-3 border-t pt-3">
      <div>
        <p className={head}>{t('Sources', 'Sumber')}</p>
        {about.sources.length
          ? list(about.sources)
          : <p className="mt-1.5 text-[12px] leading-snug text-foreground/70">{t('The sources for this house are still being checked.', 'Sumber untuk rumah ini masih sedang diperiksa.')}</p>}
      </div>
      {about.reading.length > 0 && (
        <div>
          <p className={head}>{t('Further reading, not yet checked', 'Bacaan lanjutan, belum diperiksa')}</p>
          {list(about.reading)}
        </div>
      )}
    </div>
  );
}
