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
  const [format, setFormat] = useState('glb');
  const [onlyVisible, setOnlyVisible] = useState(true);
  const [exploded, setExploded] = useState(false);
  const [state, setState] = useState({ busy: false, note: null });
  const site = s.mode === 'site';
  const run = async () => {
    setState({ busy: true, note: null });
    try {
      const size = await engine.exportModel({ format, onlyVisible, exploded });
      setState({ busy: false, note: `Saved ${(size / 1048576).toFixed(1)} MB.` });
    } catch (err) {
      console.error(err);
      setState({ busy: false, note: `Export failed: ${err.message}` });
    }
  };
  return (
    <div className="space-y-3">
      <Segmented value={format} onChange={setFormat} ariaLabel="Format" options={Object.entries(FORMATS).map(([k]) => [k, k.toUpperCase()])} />
      <p className="text-xs leading-relaxed text-muted-foreground">
        {state.note && <span className="font-medium text-foreground">{state.note} </span>}
        {FORMATS[format].note}
      </p>
      <div>
        <SwitchRow id="ex-visible" label={site ? 'Only visible buildings' : 'Only visible parts'} checked={onlyVisible} onChange={setOnlyVisible} />
        <SwitchRow id="ex-exploded" label={site ? 'Keep roofs lifted' : 'Keep exploded layout'} checked={exploded} onChange={setExploded} />
      </div>
      <Button className="w-full" onClick={run} disabled={state.busy}>
        {state.busy ? <><Loader2 className="animate-spin" /> Preparing…</> : <><Download /> Download {s.building ? s.building.name : site ? 'compound' : 'model'} (.{FORMATS[format].ext})</>}
      </Button>
    </div>
  );
}

export function ControlsPanelContent({ openSections, setOpenSections }) {
  const { engine, s } = useEngine();
  const site = s.mode === 'site';
  const sec = s.section, m = s.materials, L = s.lighting;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-baseline justify-between px-4 pt-3 pb-1">
        <h2 className="font-heading text-xl font-semibold">Controls</h2>
        <span className="text-xs text-muted-foreground">Press <kbd className="font-sans">?</kbd> for shortcuts</span>
      </div>
      <ScrollArea className="min-h-0 flex-1 [&_[data-slot=scroll-area-viewport]>div]:!block">
        <Accordion type="multiple" value={openSections} onValueChange={setOpenSections} className="px-4 pb-3">
          <AccordionItem value="view">
            <AccordionTrigger>View</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Segmented
                value={s.view} onChange={(v) => engine.goView(v)} ariaLabel="Camera view"
                options={[['iso', '3D'], ['front', 'Front'], ['side', 'Side'], ['top', 'Plan'], ['inside', site ? 'Eye level' : 'Inside']]}
              />
              <div>
                <SwitchRow id="auto-rotate" label="Auto-rotate" checked={s.autoRotate} onChange={(v) => engine.setAutoRotate(v)} />
                <SwitchRow id="labels" label={site ? 'Building labels' : 'Part labels'} checked={s.labels} onChange={(v) => engine.setLabels(v)} />
              </div>
              {site && s.house.hasWalk && (
                <Button variant="outline" className="w-full" onClick={() => engine.startWalk()}>
                  <Footprints /> Guided walk
                </Button>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="explode">
            <AccordionTrigger>{site ? 'Roofs' : 'Explode'}</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SliderRow
                label={site ? 'Lift roofs' : 'Separate parts'} value={Math.round(s.explode * 100)} display={`${Math.round(s.explode * 100)}%`}
                min={0} max={100} onChange={(v) => engine.setExplode(v / 100)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="secondary" size="sm" onClick={() => engine.explodeAll(true)}><Layers /> {site ? 'Lift roofs' : 'Explode'}</Button>
                <Button variant="outline" size="sm" onClick={() => engine.explodeAll(false)}>{site ? 'Lower roofs' : 'Assemble'}</Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="display">
            <AccordionTrigger>Display</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <Segmented
                value={s.style} onChange={(v) => engine.setStyle(v)} ariaLabel="Render style"
                options={[['realistic', 'Real'], ['clay', 'Clay'], ['xray', 'X-ray'], ['blueprint', 'Blueprint']]}
              />
              <SliderRow label="Roof opacity" value={Math.round(s.roofOpacity * 100)} display={`${Math.round(s.roofOpacity * 100)}%`} min={0} max={100} onChange={(v) => engine.setRoofOpacity(v / 100)} />
              {site && s.house.hasOverlay && (
                <SwitchRow id="site-logic" label="Site logic overlay" checked={s.siteLogic} onChange={(v) => engine.setSiteLogic(v)} />
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="section">
            <AccordionTrigger>Section cut</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SwitchRow id="sec-on" label="Enable section" checked={sec.on} onChange={(v) => engine.setSection({ on: v })} />
              <Segmented
                value={sec.axis} onChange={(v) => engine.setSection({ axis: v })} ariaLabel="Section axis"
                options={[['x', 'X · long'], ['z', 'Z · cross'], ['y', 'Y · plan']]}
              />
              <SliderRow label="Position" value={sec.pos} display={`${sec.pos.toFixed(1)} m`} min={sec.min} max={sec.max} step={0.05} disabled={!sec.on} onChange={(v) => engine.setSection({ pos: v })} />
              <div>
                <SwitchRow id="sec-flip" label="Flip side" checked={sec.flip} onChange={(v) => engine.setSection({ flip: v })} />
                <SwitchRow id="sec-plane" label="Show cutting plane" checked={sec.plane} onChange={(v) => engine.setSection({ plane: v })} />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="materials">
            <AccordionTrigger>Materials</AccordionTrigger>
            <AccordionContent className="space-y-3">
              <Select value={m.preset} onValueChange={(v) => engine.setPreset(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Custom" /></SelectTrigger>
                <SelectContent>
                  {m.presets.map((p) => <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>)}
                  {m.preset === 'custom' && <SelectItem value="custom" disabled>Custom</SelectItem>}
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
              <SliderRow label="Roughness" value={Math.round(m.rough * 100)} display={m.rough.toFixed(2)} min={0} max={100} onChange={(v) => engine.setRough(v / 100)} />
              <SwitchRow id="textures" label="Surface textures" checked={s.textures} onChange={(v) => engine.setTextures(v)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lighting">
            <AccordionTrigger>Lighting</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <SliderRow label="Time of day" value={L.time} display={hhmm(L.time)} min={6} max={18} step={0.25} onChange={(v) => engine.setTime(v)} />
              <SliderRow label="Exposure" value={Math.round(L.exposure * 100)} display={L.exposure.toFixed(2)} min={40} max={180} onChange={(v) => engine.setExposure(v / 100)} />
              <SwitchRow id="shadows" label="Shadows" checked={L.shadows} onChange={(v) => engine.setShadows(v)} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="download">
            <AccordionTrigger>Download 3D</AccordionTrigger>
            <AccordionContent><DownloadSection /></AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  );
}
