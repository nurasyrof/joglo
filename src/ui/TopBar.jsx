// Centred title over the 3D view: house (with the house switcher) and, inside a compound
// building, the building name (with the building menu). Also the theme menu used by the toolbar.
import { useState } from 'react';
import { Check, ChevronDown, Landmark, LayoutGrid, Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HOUSES, ISLANDS, ISLAND_NAMES } from '@/houses/index.js';
import { SHOW_DIRECTORY } from '@/config.js';
import { HouseArt } from './HouseArt.jsx';
import { navigate } from './router.js';
import { useEngine } from './engine-context.js';
import { useTheme } from './theme.jsx';
import { LANGS, useLang } from './lang.jsx';
import { cn } from '@/lib/utils';

// White text over the sky, with a soft shadow so it stays readable on light backgrounds.
const onScene = 'text-white [text-shadow:0_1px_10px_rgb(0_0_0/0.35)]';
const chevronBtn = 'size-7 shrink-0 rounded-full bg-white/30 text-white shadow-sm backdrop-blur-md hover:bg-white/45 hover:text-white aria-expanded:bg-white/50 dark:bg-white/15 dark:hover:bg-white/25';

function HouseList({ meta, onPick }) {
  const { t, tx } = useLang();
  return (
    <Command>
      <CommandInput placeholder={t('Search houses, provinces, peoples…', 'Cari rumah, provinsi, suku…')} />
      <CommandList className="max-h-[min(28rem,60vh)]">
        <CommandEmpty>{t('No houses match.', 'Tidak ada rumah yang cocok.')}</CommandEmpty>
        {ISLANDS.map((island) => {
          const items = HOUSES.filter((h) => h.island === island).sort((a, b) => (a.status === 'ready' ? -1 : 0) - (b.status === 'ready' ? -1 : 0));
          if (!items.length) return null;
          return (
            <CommandGroup key={island} heading={tx(ISLAND_NAMES[island])}>
              {items.map((h) => {
                const ready = h.status === 'ready', current = h.id === meta.id;
                return (
                  <CommandItem
                    key={h.id} value={`${h.name} ${h.local} ${tx(h.province)} ${tx(h.people)} ${h.province.en} ${h.people.en}`} disabled={!ready}
                    onSelect={() => { onPick(); if (!current) navigate(`#/${h.id}`); }} className="gap-3"
                  >
                    <HouseArt art={h.art} className={cn('h-5 w-9 shrink-0', ready ? 'text-primary' : 'text-muted-foreground')} />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{h.name}</span>
                      <span className="truncate text-xs text-muted-foreground">{tx(h.province)} · {tx(h.people)}</span>
                    </span>
                    {current ? <Check className="text-primary" /> : ready ? <Badge variant="secondary">3D</Badge> : <Badge variant="outline" className="text-muted-foreground">{t('Soon', 'Segera')}</Badge>}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
        {SHOW_DIRECTORY && (
          <>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem onSelect={() => { onPick(); navigate('#/'); }}><LayoutGrid /> {t('All houses', 'Semua rumah')}</CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}

function HouseTitle({ meta }) {
  const { engine, s } = useEngine();
  const { t, tx } = useLang();
  const [open, setOpen] = useState(false);
  const inBuilding = !!s.building;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => (inBuilding ? engine.backToSite() : setOpen(true))}
            title={inBuilding ? t('Back to the whole compound', 'Kembali ke seluruh kompleks') : t('Switch house', 'Ganti rumah')}
            className={cn('group/title flex items-center gap-3 rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-white/70', onScene)}
          >
            <Landmark className="hidden size-10 shrink-0 drop-shadow-md md:block" strokeWidth={1.6} />
            <span className="flex flex-col">
              <span className="font-heading text-2xl leading-none font-semibold whitespace-nowrap group-hover/title:underline group-hover/title:decoration-white/50 group-hover/title:underline-offset-4 md:text-[1.7rem]">{meta.name}</span>
              <span className="mt-1 hidden text-xs font-medium whitespace-nowrap text-white/90 md:block">{tx(meta.province)} · {tx(meta.people)}</span>
            </span>
          </button>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className={cn(chevronBtn, 'ml-2 md:ml-6')} aria-label={t('Switch house', 'Ganti rumah')}>
              <ChevronDown />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="center" sideOffset={10} className="w-[22rem] p-0">
        <HouseList meta={meta} onPick={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

function BuildingTitle({ meta }) {
  const { engine, s } = useEngine();
  const { t } = useLang();
  if (!s.building) return null;
  // When the main building shares the house's name, show what it is instead of repeating it.
  const label = s.building.name === meta.name ? s.building.en.replace(/^\w/, (c) => c.toUpperCase()) : s.building.name;
  return (
    <DropdownMenu>
      <div className="flex items-center gap-3 pl-6 md:pl-12">
        <span className={cn('max-w-[8rem] truncate font-heading text-xl leading-none font-semibold md:max-w-none md:text-[1.6rem]', onScene)}>{label}</span>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={chevronBtn} aria-label={t('Switch building', 'Ganti bangunan')}><ChevronDown /></Button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="center" sideOffset={10} className="w-64">
        <DropdownMenuItem onSelect={() => engine.backToSite()}><LayoutGrid /> {t('Whole compound', 'Seluruh kompleks')}</DropdownMenuItem>
        {s.zones.map((z) => {
          const blds = s.buildings.filter((b) => b.zone === z.id);
          if (!blds.length) return null;
          return (
            <DropdownMenuGroup key={z.id}>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-xs text-muted-foreground">{z.label}{z.local !== z.label && <> · <i>{z.local}</i></>}</DropdownMenuLabel>
              {blds.map((b) => (
                <DropdownMenuItem key={b.id} onSelect={() => engine.enterBuilding(b.id)}>
                  <span className="size-2 rounded-full" style={{ background: z.color }} />
                  <span className="flex-1">{b.name}</span>
                  {b.id === s.building.id && <Check className="text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TitleBar({ meta }) {
  return (
    <div className="pointer-events-auto flex items-center">
      <HouseTitle meta={meta} />
      <BuildingTitle meta={meta} />
    </div>
  );
}

export function ThemeMenu({ className }) {
  const { theme, resolved, setTheme } = useTheme();
  const { t } = useLang();
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('Theme', 'Tema')} className={className}>
              {resolved === 'dark' ? <Moon /> : <Sun />}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('Theme', 'Tema')}</TooltipContent>
      </Tooltip>
      {/* Don't return focus to the button on close, or its tooltip pops up again. */}
      <DropdownMenuContent align="center" side="top" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light"><Sun /> {t('Light', 'Terang')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark"><Moon /> {t('Dark', 'Gelap')}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system"><Monitor /> {t('System', 'Sistem')}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Language menu: the button shows the current language code (ID / EN).
export function LangMenu({ className }) {
  const { lang, setLang, t } = useLang();
  const current = LANGS.find((l) => l.id === lang);
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('Language', 'Bahasa')} className={cn('text-xs font-semibold tracking-wide', className)}>
              {current.short}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>{t('Language', 'Bahasa')}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="center" side="top" onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuRadioGroup value={lang} onValueChange={setLang}>
          {LANGS.map((l) => (
            <DropdownMenuRadioItem key={l.id} value={l.id}>
              <span className="w-6 text-xs font-semibold text-muted-foreground">{l.short}</span> {l.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
