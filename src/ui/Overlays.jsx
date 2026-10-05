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
import { LangMenu, ThemeMenu } from './TopBar.jsx';
import { useLang } from './lang.jsx';
import { SITE_LINKS } from './site-links.js';
import { cn } from '@/lib/utils';

function ToolButton({ label, onClick, disabled, className, children }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={label} onClick={onClick} disabled={disabled} className={className}>{children}</Button>
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

const Divider = ({ className }) => <Separator orientation="vertical" className={cn('mx-1 !h-5', className)} />;
// Phones zoom with a pinch, so the zoom buttons are left out there to keep the toolbar narrow.
const desktopOnly = 'hidden md:inline-flex';

export function Toolbar({ onHelp, onDownload }) {
  const { engine, s } = useEngine();
  const [fs, setFs] = useState(!!document.fullscreenElement);
  useEffect(() => {
    const on = () => setFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);
  const { t } = useLang();
  const canWalk = s.mode === 'site' && s.house.hasWalk;
  return (
    <nav aria-label={t('Tools', 'Alat')} className="floating pointer-events-auto flex items-center rounded-2xl p-1 shadow-lg">
      <ToolButton label={canWalk ? t('Guided walk (W)', 'Jelajah terpandu (W)') : t('Guided walk: open the whole compound', 'Jelajah terpandu: buka seluruh kompleks')} onClick={() => engine.startWalk()} disabled={!canWalk || s.walk.on}><Footprints /></ToolButton>
      <ToolButton label={t('Help & shortcuts (?)', 'Bantuan & pintasan (?)')} onClick={onHelp}><CircleHelp /></ToolButton>
      <ThemeMenu />
      <LangMenu />
      <Divider className="hidden md:block" />
      <ToolButton className={desktopOnly} label={t('Zoom in', 'Perbesar')} onClick={() => engine.zoomIn()}><ZoomIn /></ToolButton>
      <ToolButton className={desktopOnly} label={t('Zoom out', 'Perkecil')} onClick={() => engine.zoomOut()}><ZoomOut /></ToolButton>
      <Divider />
      <ToolButton label={t('Frame model', 'Bingkai model')} onClick={() => engine.fit()}><FrameIcon /></ToolButton>
      <ToolButton label={fs ? t('Exit fullscreen', 'Keluar layar penuh') : t('Fullscreen', 'Layar penuh')} onClick={() => (fs ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())}>
        {fs ? <Shrink /> : <Expand />}
      </ToolButton>
      <Divider />
      <ToolButton label={t('Save screenshot', 'Simpan tangkapan layar')} onClick={() => engine.screenshot()}><Camera /></ToolButton>
      <ToolButton label={t('Download 3D model', 'Unduh model 3D')} onClick={onDownload}><Download /></ToolButton>
    </nav>
  );
}

// Footer text sits directly on the scene, like the title.
// The overlay layer ignores clicks so the scene can be dragged; footer text opts back in.
const footerText = 'pointer-events-auto text-xs text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.45)]';

export function FooterCredit({ className }) {
  const { t } = useLang();
  return (
    <p className={cn(footerText, className)}>
      © {new Date().getFullYear()} · {t('Built by', 'Dibuat oleh')}{' '}
      <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium hover:underline">{CREDIT.name}</a>
    </p>
  );
}

export function FooterLinks({ className, linkClassName }) {
  const { t, tx } = useLang();
  return (
    <nav aria-label={t('Site', 'Situs')} className={cn(footerText, 'flex items-center gap-1.5', className)}>
      {SITE_LINKS.map((p, i) => (
        <span key={p.id} className="flex items-center gap-1.5">
          {i > 0 && <span aria-hidden="true">·</span>}
          <a href={`#/${p.id}`} className={cn('hover:underline', linkClassName)}>{tx(p.short)}</a>
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
  [['1', '5'], { en: 'Camera views', id: 'Sudut kamera' }, '–'], [['E'], { en: 'Explode / lift roofs', id: 'Urai / angkat atap' }],
  [['S'], { en: 'Section cut', id: 'Potongan' }], [['X'], { en: 'Cycle render style', id: 'Ganti gaya tampilan' }],
  [['L'], { en: 'Labels', id: 'Label' }], [['F'], { en: 'Focus selection', id: 'Fokus ke pilihan' }],
  [['H'], { en: 'Hide selection', id: 'Sembunyikan pilihan' }], [['←', '→'], { en: 'Previous / next', id: 'Sebelumnya / berikutnya' }, '/'],
  [['W'], { en: 'Guided walk', id: 'Jelajah terpandu' }], [['Esc'], { en: 'Close / go back', id: 'Tutup / kembali' }],
];

export function HelpDialog({ open, onOpenChange }) {
  const { t, tx } = useLang();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-semibold">{t('Help & shortcuts', 'Bantuan & pintasan')}</DialogTitle>
          <DialogDescription>
            {t(
              'Drag to orbit, right-drag to pan and scroll to zoom. Click a building or part to learn about it; double-click a building to go inside.',
              'Seret untuk memutar, seret dengan klik kanan untuk menggeser, dan gulir untuk memperbesar. Klik bangunan atau bagian untuk mengenalnya; klik dua kali bangunan untuk masuk ke dalamnya.',
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {KEYS.map(([keys, label, sep]) => (
            <div key={label.en} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground">{tx(label)}</span>
              <span className="flex items-center gap-1">
                {keys.map((k, i) => <span key={k} className="flex items-center gap-1">{i > 0 && <span className="text-xs text-muted-foreground">{sep}</span>}<Kbd>{k}</Kbd></span>)}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter className="items-center sm:justify-between">
          <FooterLinks className="text-muted-foreground [text-shadow:none]" linkClassName="hover:text-foreground" />
          <Button variant="outline" onClick={() => onOpenChange(false)}>{t('Close', 'Tutup')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function LoadingScreen({ show, text }) {
  const { t } = useLang();
  return (
    <div className={cn('fixed inset-0 z-50 grid place-content-center justify-items-center gap-3 bg-background transition-opacity duration-500', show ? 'opacity-100' : 'pointer-events-none opacity-0')}>
      <Loader2 className="size-7 animate-spin text-primary" />
      <p className="font-heading text-lg text-muted-foreground italic">{text || t('Loading…', 'Memuat…')}</p>
    </div>
  );
}
