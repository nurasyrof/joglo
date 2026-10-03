// About and Contribute: dialogs opened from the footer (#/about, #/contribute) over the 3D view.
import { useEffect, useState } from 'react';
import { ArrowUpRight, Bug, Check, Coffee, Handshake, Home, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CONTACT, CREDIT, DONATE_URL, SITE } from '@/config.js';
import { HOUSES, houseById } from '@/houses/index.js';
import { cn } from '@/lib/utils';

const P = ({ children }) => <p className="leading-relaxed text-foreground/80">{children}</p>;

// ── About ─────────────────────────────────────────────────────────────

export function AboutDialog({ open, onClose }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-6 sm:max-w-xl sm:p-8">
        <DialogHeader className="mb-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
          <DialogTitle className="font-heading text-3xl font-semibold">About this project</DialogTitle>
          <DialogDescription className="text-base">Traditional houses of Indonesia, in 3D.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-[15px]">
          <P>
            Hi, I’m <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium text-primary hover:underline">{CREDIT.name}</a>,
            an architect and product designer.
          </P>
          <P>
            Over the past year I’ve become more and more drawn to Indonesia’s traditional houses: how a Javanese joglo leads you from
            the open pendapa to the private dalem, how a rumah gadang belongs to the women of its family, how a Balinese compound is
            laid out between the mountain and the sea. The more I read about them, the more I wished there were an easy way to really
            see them: to walk around a house, take it apart and understand why each part is there.
          </P>
          <P>
            {SITE} is my attempt at that, and a way to make something that might be useful to others. Every house is modelled in 3D
            and divided into named parts, each with a short note on what it is, what it does and what it means. You can explode a
            house, cut through it, change its materials, take a guided walk through a compound and download the model.
          </P>
          <P>
            It’s a personal, non-commercial project for students, teachers, designers and anyone curious about how Indonesians have
            built and lived. The models are idealised and still being checked, so if you know these houses well, your corrections are
            very welcome. The plan is to keep adding houses until every region of the archipelago is here.
          </P>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          <Button asChild><a href="#/contribute">Contribute</a></Button>
          <Button variant="outline" asChild>
            <a href={CREDIT.url} target="_blank" rel="noopener">{CREDIT.url.replace('https://', '')} <ArrowUpRight /></a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Contribute ────────────────────────────────────────────────────────

const READY = HOUSES.filter((h) => h.status === 'ready');

const KINDS = [
  {
    id: 'house', icon: Home, title: 'Suggest a house', text: 'A rumah adat you’d like to see next.',
    fields: [
      { id: 'house', label: 'House name', required: true, placeholder: 'e.g. Rumah Bolon' },
      { id: 'region', label: 'Region or people', placeholder: 'e.g. Batak Toba, North Sumatra' },
      { id: 'message', label: 'Why this house?', type: 'textarea', placeholder: 'What makes it special, or why it matters to you.' },
      { id: 'references', label: 'References', type: 'textarea', rows: 2, placeholder: 'Links to photos, drawings, books or articles (optional)' },
    ],
  },
  {
    id: 'correction', icon: Bug, title: 'Correct a house', text: 'Something wrong in a model or its notes.',
    fields: [
      { id: 'house', label: 'House', type: 'house', required: true },
      { id: 'part', label: 'Building or part', placeholder: 'e.g. Pendapa · Soko guru (optional)' },
      { id: 'message', label: 'What should be corrected?', type: 'textarea', required: true, placeholder: 'What’s wrong, and what it should be.' },
      { id: 'references', label: 'Source', placeholder: 'Where you read or learned this (optional)' },
    ],
  },
  {
    id: 'feature', icon: Lightbulb, title: 'Request a feature', text: 'An idea to make the site better.',
    fields: [
      { id: 'title', label: 'Your idea', required: true, placeholder: 'e.g. Measure distances in the model' },
      { id: 'message', label: 'Tell me more', type: 'textarea', required: true, placeholder: 'What would you use it for?' },
    ],
  },
  {
    id: 'partner', icon: Handshake, title: 'Sponsor or partner', text: 'Work together on the project.',
    emailRequired: true,
    fields: [
      { id: 'organisation', label: 'Organisation', placeholder: 'Company, institution or community (optional)' },
      { id: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'What you have in mind.' },
    ],
  },
];

async function send(kind, values) {
  const subject = `[${SITE}] ${kind.title}`;
  const body = { kind: kind.title, ...values, page: location.href, _subject: subject };
  if (CONTACT.endpoint) {
    const res = await fetch(CONTACT.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Sorry, your message couldn’t be sent. Please try again later.');
    return 'sent';
  }
  if (CONTACT.email) {
    const text = Object.entries(values).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n\n');
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return 'mail';
  }
  throw new Error('The contact form isn’t set up yet.');
}

function Field({ f, value, onChange }) {
  const id = `contrib-${f.id}`;
  const label = <Label htmlFor={id}>{f.label}{f.required && <span className="text-primary">*</span>}</Label>;
  let control;
  if (f.type === 'textarea') {
    control = <Textarea id={id} rows={f.rows || 4} required={f.required} placeholder={f.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
  } else if (f.type === 'house') {
    control = (
      <Select value={value} onValueChange={(v) => v && onChange(v)} required={f.required}>
        <SelectTrigger id={id} className="w-full"><SelectValue placeholder="Choose a house" /></SelectTrigger>
        <SelectContent>
          {READY.map((h) => <SelectItem key={h.id} value={h.id}>{h.name} · {h.province}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  } else {
    control = <Input id={id} type={f.type || 'text'} required={f.required} placeholder={f.placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return <div className="grid gap-1.5">{label}{control}</div>;
}

function ContributeForm({ kind, house, onDone }) {
  // A correction starts on the house you were looking at.
  const [values, setValues] = useState(() => (kind.id === 'correction' && houseById(house)?.status === 'ready' ? { house } : {}));
  const [state, setState] = useState({ status: 'idle' });
  const set = (k) => (v) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (values._gotcha) return;                       // honeypot: only bots fill it (Formspree also checks it)
    if (kind.fields.some((f) => f.required && !values[f.id]?.trim()) || (kind.emailRequired && !values.email?.trim())) {
      setState({ status: 'error', error: 'Please fill in the required fields.' });
      return;
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      setState({ status: 'error', error: 'That email address doesn’t look right.' });
      return;
    }
    setState({ status: 'sending' });
    try {
      const out = { ...values };
      if (out.house && kind.id === 'correction') out.house = houseById(out.house)?.name || out.house;
      onDone(await send(kind, out));
    } catch (err) {
      setState({ status: 'error', error: err.message });
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      {kind.fields.map((f) => <Field key={f.id} f={f} value={values[f.id] || ''} onChange={set(f.id)} />)}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field f={{ id: 'name', label: 'Your name', placeholder: 'Optional' }} value={values.name || ''} onChange={set('name')} />
        <Field
          f={{ id: 'email', label: 'Email', type: 'email', required: kind.emailRequired, placeholder: kind.emailRequired ? 'So I can reply' : 'Optional, if you’d like a reply' }}
          value={values.email || ''} onChange={set('email')}
        />
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={values._gotcha || ''} onChange={(e) => set('_gotcha')(e.target.value)} />
      {state.status === 'error' && <p className="text-sm text-destructive">{state.error}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          See <a href="#/terms" className="underline hover:text-foreground">Terms & privacy</a> for how messages are handled.
        </p>
        <Button type="submit" disabled={state.status === 'sending'}>
          {state.status === 'sending' && <Loader2 className="animate-spin" />} Send
        </Button>
      </div>
    </form>
  );
}

export function ContributeDialog({ open, onClose, house }) {
  const [kindId, setKindId] = useState('house');
  const [done, setDone] = useState(null);
  useEffect(() => { if (open) setDone(null); }, [open]);
  const kind = KINDS.find((k) => k.id === kindId);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-6 sm:max-w-2xl sm:p-8">
        <DialogHeader className="mb-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
          <DialogTitle className="font-heading text-3xl font-semibold">Contribute</DialogTitle>
          <DialogDescription className="text-base">
            Help make every house more accurate, and help decide what comes next.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="grid justify-items-center gap-3 rounded-xl border bg-muted/40 px-6 py-10 text-center">
            <span className="grid size-10 place-content-center rounded-full bg-primary text-primary-foreground"><Check className="size-5" /></span>
            <h3 className="font-heading text-2xl font-semibold">{done === 'mail' ? 'Almost there' : 'Thank you!'}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {done === 'mail'
                ? 'Your email app should have opened with the message filled in. Send it from there and I’ll get it.'
                : 'Your message is on its way. I read every one, and I’ll reply if you left an email address.'}
            </p>
            <Button variant="outline" onClick={() => setDone(null)}>Send another</Button>
          </div>
        ) : (
          <>
            <div role="radiogroup" aria-label="What would you like to do?" className="mb-6 grid grid-cols-2 gap-2">
              {KINDS.map(({ id, icon: Icon, title, text }) => (
                <button
                  key={id} type="button" role="radio" aria-checked={id === kindId} onClick={() => setKindId(id)}
                  className={cn(
                    'flex items-start gap-3 rounded-xl border p-3 text-left transition-colors outline-none hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/50',
                    id === kindId && 'border-primary bg-primary/5 hover:bg-primary/10',
                  )}
                >
                  <Icon className={cn('mt-0.5 size-4 shrink-0', id === kindId ? 'text-primary' : 'text-muted-foreground')} />
                  <span className="grid gap-0.5">
                    <span className="text-sm font-medium">{title}</span>
                    <span className="text-xs leading-snug text-muted-foreground">{text}</span>
                  </span>
                </button>
              ))}
            </div>
            <ContributeForm key={kind.id} kind={kind} house={house} onDone={setDone} />
          </>
        )}

        <Separator className="my-6" />
        <div className="flex flex-col gap-4 rounded-xl bg-muted/50 p-4 sm:flex-row sm:items-center">
          <Coffee className="size-6 shrink-0 text-primary" />
          <div className="flex-1">
            <p className="font-medium">Support the project</p>
            <p className="text-sm text-muted-foreground">{SITE} is free and made in my spare time. A coffee helps me keep adding houses.</p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={DONATE_URL} target="_blank" rel="noopener"><Coffee /> Buy me a coffee</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
