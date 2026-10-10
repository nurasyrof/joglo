// Right panel: every view, display, section, material, lighting and download control.
import { useState } from 'react';
import { Download, Footprints, Layers, Loader2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { FORMATS } from '@/engine/exporter.js';
import { useEngine } from './engine-context.js';
import { useLang } from './lang.jsx';

function Segmented({ value, onChange, options, ariaLabel }) {
  return (
    <ToggleGroup
      type="single" variant="outline" size="sm" spacing={0} aria-label={ariaLabel}
      value={value} onValueChange={(v) => v && onChange(v)} className="w-full"
    >
      {options.map(([v, label]) => <ToggleGroupItem key={v} value={v} className="min-w-0 flex-1 truncate px-1 text-xs">{label}</ToggleGroupItem>)}
    </ToggleGroup>
  );
}

function SwitchRow({ id, label, checked, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <Label htmlFor={id} className="font-normal">{label}</Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

function SliderRow({ label, value, display, min, max, step = 1, onChange, disabled }) {
  return (
    <div className="space-y-2.5 py-1">
      <div className="flex items-center justify-between text-sm">
        <span className={disabled ? 'text-muted-foreground' : undefined}>{label}</span>
        <span className="text-xs text-muted-foreground tabular-nums">{display}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} disabled={disabled} aria-label={label} />
    </div>
  );
}

const hhmm = (t) => `${String(Math.floor(t)).padStart(2, '0')}:${String(Math.round((t % 1) * 60)).padStart(2, '0')}`;

function DownloadSection() {
  const { engine, s } = useEngine();
  const { t, tx } = useLang();
  const [format, setFormat] = useState('glb');
  const [onlyVisible, setOnlyVisible] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [state, setState] = useState({ busy: false, note: null });
  const site = s.mode === 'site';
  const run = async () => {
    setState({ busy: true, note: null });
    try {
      const size = await engine.exportModel({ format, onlyVisible, exploded });
      setState({ busy: false, note: t(`Saved ${(size / 1048576).toFixed(1)} MB.`, `Tersimpan ${(size / 1048576).toFixed(1)} MB.`) });
    } catch (err) {
      console.error(err);
      setState({ busy: false, note: t(`Export failed: ${err.message}`, `Ekspor gagal: ${err.message}`) });
    }
  };
  return (
    <div className="space-y-3">
      <Segmented value={format} onChange={setFormat} ariaLabel="Format" options={Object.entries(FORMATS).map(([k]) => [k, k.toUpperCase()])} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {state.note && <span className="font-medium text-foreground">{state.note} </span>}
        {tx(FORMATS[format].note)}
      </p>
      <div>
        <SwitchRow id="ex-visible" label={site ? t('Only visible buildings', 'Hanya bangunan yang tampak') : t('Only visible parts', 'Hanya bagian yang tampak')} checked={onlyVisible} onChange={setOnlyVisible} />
        <SwitchRow id="ex-exploded" label={site ? t('Keep roofs lifted', 'Biarkan atap terangkat') : t('Keep exploded layout', 'Biarkan tetap terurai')} checked={exploded} onChange={setExploded} />
      </div>
      <Button className="w-full" onClick={run} disabled={state.busy}>
        {state.busy
          ? <><Loader2 className="animate-spin" /> {t('Preparing…', 'Menyiapkan…')}</>
          : <><Download /> {t('Download', 'Unduh')} {s.building ? s.building.name : site ? t('compound', 'kompleks') : 'model'} (.{FORMATS[format].ext})</>}
      </Button>
    </div>
  );
}

// `compact` (phones) keeps view, explode and display, and points to a larger screen for the rest.
export function ControlsPanelContent({ openSections, setOpenSections, heading = true, compact = false }) {
  const { engine, s } = useEngine();
  const { t } = useLang();
  const site = s.mode === 'site';
  const sec = s.section, m = s.materials, L = s.lighting;
  return (
    <div className="flex h-full min-h-0 flex-col">
      {heading && (
        <div className="flex items-baseline justify-between px-4 pt-3 pb-1">
          <h2 className="font-heading text-xl font-semibold">{t('Controls', 'Kontrol')}</h2>
          <span className="text-xs text-muted-foreground">{t('Press', 'Tekan')} <kbd className="font-sans">?</kbd> {t('for shortcuts', 'untuk pintasan')}</span>
        </div>
      )}
      <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block">
        <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="px-4 pb-3">
          <AccordionItem value="view">
            <AccordionTrigger>{t('View', 'Tampilan')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Segmented
                value={s.view} onChange={(v) => engine.goView(v)} ariaLabel={t('Camera view', 'Sudut kamera')}
                options={[['iso', '3D'], ['front', t('Front', 'Depan')], ['side', t('Side', 'Samping')], ['top', t('Plan', 'Denah')], ['inside', site ? t('Eye level', 'Setinggi mata') : t('Inside', 'Dalam')]]}
              />
              <div>
                <SwitchRow id="auto-rotate" label={t('Auto-rotate', 'Putar otomatis')} checked={s.autoRotate} onChange={(v) => engine.setAutoRotate(v)} />
                <SwitchRow id="labels" label={site ? t('Building labels', 'Label bangunan') : t('Part labels', 'Label bagian')} checked={s.labels} onChange={(v) => engine.setLabels(v)} />
              </div>
              {site && s.house.hasWalk && (
                <Button variant="outline" className="w-full" onClick={() => engine.startWalk()}>
                  <Footprints /> {t('Guided walk', 'Jelajah terpandu')}
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="explode">
            <AccordionTrigger>{site ? t('Roofs', 'Atap') : t('Explode', 'Urai')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SliderRow
                label={site ? t('Lift roofs', 'Angkat atap') : t('Separate parts', 'Pisahkan bagian')} value={Math.round(s.explode * 100)} display={`${Math.round(s.explode * 100)}%`}
                min={0} max={100} onChange={(v) => engine.setExplode(v / 100)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => engine.explodeAll(true)}><Layers /> {site ? t('Lift roofs', 'Angkat atap') : t('Explode', 'Urai')}</Button>
                <Button variant="outline" size="sm" onClick={() => engine.explodeAll(false)}>{site ? t('Lower roofs', 'Turunkan atap') : t('Assemble', 'Rakit')}</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="display">
            <AccordionTrigger>{t('Display', 'Tampilan model')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Segmented
                value={s.style} onChange={(v) => engine.setStyle(v)} ariaLabel={t('Render style', 'Gaya tampilan')}
                options={[['realistic', t('Real', 'Nyata')], ['clay', t('Clay', 'Tanah liat')], ['xray', t('X-ray', 'Sinar-X')], ['blueprint', t('Blueprint', 'Cetak biru')]]}
              />
              <SliderRow label={t('Roof opacity', 'Kepekatan atap')} value={Math.round(s.roofOpacity * 100)} display={`${Math.round(s.roofOpacity * 100)}%`} min={0} max={100} onChange={(v) => engine.setRoofOpacity(v / 100)} />
              {site && s.house.hasOverlay && (
                <SwitchRow id="site-logic" label={t('Site logic overlay', 'Lapisan logika tapak')} checked={s.siteLogic} onChange={(v) => engine.setSiteLogic(v)} />
              )}
            </AccordionContent>
          </AccordionItem>

          {!compact && (
            <>
          <AccordionItem value="section">
            <AccordionTrigger>{t('Section cut', 'Potongan')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SwitchRow id="sec-on" label={t('Enable section', 'Aktifkan potongan')} checked={sec.on} onChange={(v) => engine.setSection({ on: v })} />
              <Segmented
                value={sec.axis} onChange={(v) => engine.setSection({ axis: v })} ariaLabel={t('Section axis', 'Sumbu potongan')}
                options={[['x', t('X · long', 'X · memanjang')], ['z', t('Z · cross', 'Z · melintang')], ['y', t('Y · plan', 'Y · denah')]]}
              />
              <SliderRow label={t('Position', 'Posisi')} value={sec.pos} display={`${sec.pos.toFixed(1)} m`} min={sec.min} max={sec.max} step={0.05} disabled={!sec.on} onChange={(v) => engine.setSection({ pos: v })} />
              <div>
                <SwitchRow id="sec-flip" label={t('Flip side', 'Balik sisi')} checked={sec.flip} onChange={(v) => engine.setSection({ flip: v })} />
                <SwitchRow id="sec-plane" label={t('Show cutting plane', 'Tampilkan bidang potong')} checked={sec.plane} onChange={(v) => engine.setSection({ plane: v })} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="materials">
            <AccordionTrigger>{t('Materials', 'Material')}</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Select value={m.preset} onValueChange={(v) => engine.setPreset(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder={t('Custom', 'Kustom')} /></SelectTrigger>
                <SelectContent>
                  {m.presets.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                  {m.preset === 'custom' && <SelectItem value="custom" disabled>{t('Custom', 'Kustom')}</SelectItem>}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-4 gap-x-2 gap-y-3">
                {m.slots.map((slot) => (
                  <label key={slot.id} className="group/sw flex cursor-pointer flex-col items-center gap-1.5">
                    <span className="relative size-9 overflow-hidden rounded-full ring-1 ring-foreground/15 transition group-hover/sw:ring-2 group-hover/sw:ring-primary" style={{ background: m.colors[slot.id] }}>
                      <input
                        type="color" value={m.colors[slot.id] || '#cccccc'} aria-label={slot.label}
                        onChange={(e) => engine.setColor(slot.id, e.target.value)}
                        className="absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                    </span>
                    <span className="text-[11px] text-muted-foreground">{slot.label}</span>
                  </label>
                ))}
              </div>
              <SliderRow label={t('Roughness', 'Kekasaran')} value={Math.round(m.rough * 100)} display={m.rough.toFixed(2)} min={0} max={100} onChange={(v) => engine.setRough(v / 100)} />
              <SwitchRow id="textures" label={t('Surface textures', 'Tekstur permukaan')} checked={s.textures} onChange={(v) => engine.setTextures(v)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lighting">
            <AccordionTrigger>{t('Lighting', 'Pencahayaan')}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SliderRow label={t('Time of day', 'Waktu')} value={L.time} display={hhmm(L.time)} min={6} max={18} step={0.25} onChange={(v) => engine.setTime(v)} />
              <SliderRow label={t('Exposure', 'Eksposur')} value={Math.round(L.exposure * 100)} display={L.exposure.toFixed(2)} min={40} max={180} onChange={(v) => engine.setExposure(v / 100)} />
              <SwitchRow id="shadows" label={t('Shadows', 'Bayangan')} checked={L.shadows} onChange={(v) => engine.setShadows(v)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="download">
            <AccordionTrigger>{t('Download 3D', 'Unduh 3D')}</AccordionTrigger>
            <AccordionContent><DownloadSection /></AccordionContent>
          </AccordionItem>
            </>
          )}
        </Accordion>
        {compact && (
          <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">
            {t('More tools on a laptop or desktop: section cuts, materials, lighting and 3D downloads.', 'Alat lainnya tersedia di laptop atau komputer: potongan, material, pencahayaan, dan unduhan 3D.')}
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
