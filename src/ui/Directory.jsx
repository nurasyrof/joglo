// Directory landing page (#/), shown only when SHOW_DIRECTORY is on.
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HOUSES, ISLANDS } from '@/houses/index.js';
import { CREDIT, SITE } from '@/config.js';
import { HouseArt } from './HouseArt.jsx';
import { cn } from '@/lib/utils';

const TINTS = ['oklch(0.62 0.09 140)', 'oklch(0.62 0.11 65)', 'oklch(0.6 0.12 35)', 'oklch(0.58 0.08 180)', 'oklch(0.55 0.09 310)', 'oklch(0.56 0.09 245)'];

export function Directory() {
  const [island, setIsland] = useState('all');
  const [q, setQ] = useState('');
  const [only3d, setOnly3d] = useState(false);
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return HOUSES
      .filter((h) => (island === 'all' || h.island === island) && (!only3d || h.status === 'ready'))
      .filter((h) => !query || `${h.name} ${h.local} ${h.province} ${h.people} ${h.island}`.toLowerCase().includes(query))
      .sort((a, b) => (a.status === 'ready' ? -1 : 0) - (b.status === 'ready' ? -1 : 0));
  }, [island, q, only3d]);
  const ready = HOUSES.filter((h) => h.status === 'ready').length;

  return (
    <main className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-7">
        <header className="flex items-center justify-between py-5">
          <a href="#/" className="font-heading text-2xl font-semibold">{SITE}</a>
          <a href={CREDIT.url} target="_blank" rel="noopener" className="text-xs text-muted-foreground hover:text-foreground">Made by {CREDIT.name}</a>
        </header>

        <section className="pt-10 pb-8 sm:pt-16">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">Rumah adat · Traditional houses of Indonesia</p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-[1.02] font-semibold text-balance sm:text-6xl">The architecture of the archipelago, one house at a time</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">Explore Indonesia’s traditional houses in 3D. Take them apart, cut through them and learn what every beam, roof and carving means.</p>
          <p className="mt-4 text-sm text-muted-foreground">{ready} in 3D · {HOUSES.length} houses · {ISLANDS.length} island groups</p>
        </section>

        <section className="sticky top-0 z-10 -mx-4 flex flex-wrap items-center gap-3 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-7 sm:px-7">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, province or people…" className="pl-9" />
          </div>
          <ToggleGroup type="single" variant="outline" size="sm" value={island} onValueChange={(v) => v && setIsland(v)} className="flex-wrap">
            <ToggleGroupItem value="all">All islands</ToggleGroupItem>
            {ISLANDS.map((i) => <ToggleGroupItem key={i} value={i}>{i}</ToggleGroupItem>)}
          </ToggleGroup>
          <div className="flex items-center gap-2 sm:ml-auto">
            <Switch id="only3d" checked={only3d} onCheckedChange={setOnly3d} />
            <Label htmlFor="only3d" className="font-normal text-muted-foreground">Only houses in 3D</Label>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((h) => {
            const isReady = h.status === 'ready';
            const tint = TINTS[ISLANDS.indexOf(h.island)];
            const body = (
              <Card className={cn('h-full gap-0 py-0 transition', isReady ? 'hover:-translate-y-0.5 hover:shadow-lg hover:ring-primary/40' : 'opacity-80')}>
                <div className="relative grid aspect-video place-items-center" style={{ background: `linear-gradient(180deg, color-mix(in oklch, ${tint} 18%, var(--card)), color-mix(in oklch, ${tint} 34%, var(--card)))` }}>
                  <HouseArt art={h.art} className="w-2/3" style={undefined} />
                  <Badge variant={isReady ? 'default' : 'outline'} className="absolute top-2.5 right-2.5">{isReady ? 'Explore in 3D' : 'Coming soon'}</Badge>
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: tint }}>{h.island}</p>
                  <h3 className="font-heading text-2xl leading-tight font-semibold">{h.name}</h3>
                  <p className="text-xs text-primary">{h.province} · {h.people}</p>
                  <p className="pt-1 text-[13px] leading-relaxed text-muted-foreground">{h.blurb}</p>
                </div>
              </Card>
            );
            return isReady
              ? <a key={h.id} href={`#/${h.id}`} className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring" style={{ color: tint }}>{body}</a>
              : <div key={h.id} style={{ color: tint }}>{body}</div>;
          })}
        </section>
        {list.length === 0 && <p className="pb-10 text-muted-foreground">No houses match your search.</p>}

        <footer className="flex flex-wrap justify-between gap-2 border-t py-8 text-xs text-muted-foreground">
          <span>More houses are being modelled. Each one is built from real proportions and checked against published sources.</span>
          <a href={CREDIT.url} target="_blank" rel="noopener" className="hover:text-foreground">Made by {CREDIT.name}</a>
        </footer>
      </div>
    </main>
  );
}
