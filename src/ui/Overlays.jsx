// Bottom toolbar and footer, hover tooltip, help dialog and loading screen.
import { useEffect, useState } from 'react';
import { Camera, CircleHelp, Download, Expand, Footprints, Loader2, Shrink, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CREDIT } from '@/config.js';
import { useEngine } from './engine-context.js';
import { ThemeMenu } from './TopBar.jsx';
import { SITE_LINKS } from './pages.jsx';
import { cn } from '@/lib/utils';

function ToolButton({ label, onClick, disabled, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} onClick={onClick} disabled={disabled}>{children}</Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}

// "Frame model": dashed frame with a solid square in one corner (drawn in Lucide's style).
function FrameIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M15 4h4a1 1 0 0 1 1 1v4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
    </svg>
  );
}

const Divider = () => <Separator orientation="vertical" className="mx-1 !h-5" />;

export function Toolbar({ onHelp, onDownload }) {
  const { engine, s } = useEngine();
  const [fs, setFs] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const canWalk = s.mode === 'site' && s.house.hasWalk;
  return (
    <nav aria-label="Tools" className="floating pointer-events-auto flex items-center rounded-2xl p-1 shadow-lg">
      <ToolButton label={canWalk ? 'Guided walk (W)' : 'Guided walk: open the whole compound'} onClick={() => engine.startWalk()} disabled={!canWalk || s.walk.on}><Footprints /></ToolButton>
      <ToolButton label="Help & shortcuts (?)" onClick={onHelp}><CircleHelp /></ToolButton>
      <ThemeMenu />
      <Divider />
      <ToolButton label="Zoom in" onClick={() => engine.zoomIn()}><ZoomIn /></ToolButton>
      <ToolButton label="Zoom out" onClick={() => engine.zoomOut()}><ZoomOut /></ToolButton>
      <Divider />
      <ToolButton label="Frame model" onClick={() => engine.fit()}><FrameIcon /></ToolButton>
      <ToolButton label={fs ? 'Exit fullscreen' : 'Fullscreen'} onClick={() => (fs ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())}>
        {fs ? <Shrink /> : <Expand />}
      </ToolButton>
      <Divider />
      <ToolButton label="Save screenshot" onClick={() => engine.screenshot()}><Camera /></ToolButton>
      <ToolButton label="Download 3D model" onClick={onDownload}><Download /></ToolButton>
    </nav>
  );
}

// Footer text sits directly on the scene, like the title.
const footerText = 'text-xs text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.45)]';

export function FooterCredit({ className }) {
  return (
    <p className={cn(footerText, className)}>
      © {new Date().getFullYear()} · Built by{' '}
      <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium hover:underline">{CREDIT.name}</a>
    </p>
  );
}

export function FooterLinks({ className, linkClassName }) {
  return (
    <nav aria-label="Site" className={cn(footerText, 'flex items-center gap-1.5', className)}>
      {SITE_LINKS.map((p, i) => (
        <span key={p.id} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">·</span>}
          <a href={`#/${p.id}`} className={cn('hover:underline', linkClassName)}>{p.short}</a>
        </span>
      ))}
    </nav>
  );
}

export function HoverTooltip() {
  const { engine } = useEngine();
  const [h, setH] = useState(null);
  useEffect(() => engine.onHover(setH), [engine]);
  if (!h) return null;
  return (
    <div className="pointer-events-none absolute z-30 rounded-md bg-foreground px-2.5 py-1.5 text-xs text-background shadow-md" style={{ left: h.x + 14, top: h.y + 16 }}>
      <span className="font-medium">{h.name}</span>
      <span className="ml-1.5 opacity-70">{h.en}</span>
    </div>
  );
}

const KEYS = [
  [['1', '5'], 'Camera views', '–'], [['E'], 'Explode / lift roofs'], [['S'], 'Section cut'], [['X'], 'Cycle render style'],
  [['L'], 'Labels'], [['F'], 'Focus selection'], [['H'], 'Hide selection'], [['←', '→'], 'Previous / next', '/'],
  [['W'], 'Guided walk'], [['Esc'], 'Close / go back'],
];

export function HelpDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-semibold">Help & shortcuts</DialogTitle>
          <DialogDescription>
            Drag to orbit, right-drag to pan and scroll to zoom. Click a building or part to learn about it; double-click a building to go inside.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {KEYS.map(([keys, label, sep]) => (
            <div key={label} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{label}</span>
              <span className="flex items-center gap-1">
                {keys.map((k, i) => <span key={k} className="flex items-center gap-1">{i > 0 && <span className="text-xs text-muted-foreground">{sep}</span>}<Kbd>{k}</Kbd></span>)}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter className="items-center sm:justify-between">
          <FooterLinks className="text-muted-foreground [text-shadow:none]" linkClassName="hover:text-foreground" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LoadingScreen({ show, text }) {
  return (
    <div className={cn('fixed inset-0 z-50 grid place-content-center justify-items-center gap-3 bg-background transition-opacity duration-500', show ? 'opacity-100' : 'pointer-events-none opacity-0')}>
      <Loader2 className="size-7 animate-spin text-primary" />
      <p className="font-heading text-lg text-muted-foreground italic">{text || 'Loading…'}</p>
    </div>
  );
}
