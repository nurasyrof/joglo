// About and Contribute: dialogs opened from the footer (/about, /contribute) over the 3D view.
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
import { useLang } from './lang.jsx';
import { cn } from '@/lib/utils';

const P = ({ children }) => <p className="leading-relaxed text-foreground/80">{children}</p>;

// ── About ─────────────────────────────────────────────────────────────

const credit = <a href={CREDIT.url} target="_blank" rel="noopener" className="font-medium text-primary hover:underline">{CREDIT.name}</a>;

const ABOUT = {
  en: (
    <>
      <P>Hi, I’m {credit}, an architect and product designer.</P>
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
        built and lived. Each model is an ideal-type reconstruction: a typical example put together from published sources, not a
        record of one particular building. They are still being checked, so if you know these houses well, your corrections are
        very welcome. The plan is to keep adding houses until every region of the archipelago is here.
      </P>
    </>
  ),
  id: (
    <>
      <P>Halo, saya {credit}, arsitek dan desainer produk.</P>
      <P>
        Setahun terakhir saya makin tertarik pada rumah-rumah adat Indonesia: bagaimana joglo Jawa membawa kita dari pendapa yang
        terbuka ke dalem yang privat, bagaimana rumah gadang menjadi milik kaum perempuan keluarganya, bagaimana pekarangan Bali
        ditata di antara gunung dan laut. Semakin banyak saya membaca, semakin saya berharap ada cara mudah untuk benar-benar
        melihatnya: mengitari sebuah rumah, membongkarnya, dan memahami mengapa setiap bagian ada di sana.
      </P>
      <P>
        {SITE} adalah upaya saya untuk itu, sekaligus cara membuat sesuatu yang semoga bermanfaat bagi orang lain. Setiap rumah
        dimodelkan dalam 3D dan dibagi menjadi bagian-bagian bernama, masing-masing dengan catatan singkat tentang apa itu, apa
        fungsinya, dan apa maknanya. Anda bisa mengurai rumah, memotongnya, mengganti materialnya, mengikuti jelajah terpandu di
        sebuah kompleks, dan mengunduh modelnya.
      </P>
      <P>
        Ini proyek pribadi dan nonkomersial, untuk pelajar, guru, desainer, dan siapa pun yang ingin tahu cara orang Indonesia
        membangun dan tinggal. Setiap model adalah rekonstruksi tipe ideal: contoh yang khas, disusun dari sumber-sumber terbitan,
        bukan rekaman satu bangunan tertentu. Model-modelnya masih terus diperiksa, jadi jika Anda mengenal rumah-rumah ini dengan
        baik, koreksi Anda sangat kami harapkan. Rencananya, rumah akan terus ditambah sampai setiap wilayah Nusantara ada di sini.
      </P>
    </>
  ),
};

export function AboutDialog({ open, onClose }) {
  const { lang, t, href } = useLang();
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-6 sm:max-w-xl sm:p-8">
        <DialogHeader className="mb-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
          <DialogTitle className="font-heading text-3xl font-semibold">{t('About this project', 'Tentang proyek ini')}</DialogTitle>
          <DialogDescription className="text-base">{t('Traditional houses of Indonesia, in 3D.', 'Rumah adat Indonesia, dalam 3D.')}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-[15px]">{ABOUT[lang]}</div>
        <div className="mt-7 flex flex-wrap gap-2">
          <Button asChild><a href={href('/contribute')}>{t('Contribute', 'Kontribusi')}</a></Button>
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
const L = (en, id) => ({ en, id });

const KINDS = [
  {
    id: 'house', icon: Home, title: L('Suggest a house', 'Usulkan rumah'), text: L('A rumah adat you’d like to see next.', 'Rumah adat yang ingin Anda lihat berikutnya.'),
    fields: [
      { id: 'house', label: L('House name', 'Nama rumah'), required: true, placeholder: L('e.g. Rumah Bolon', 'mis. Rumah Bolon') },
      { id: 'region', label: L('Region or people', 'Daerah atau suku'), placeholder: L('e.g. Batak Toba, North Sumatra', 'mis. Batak Toba, Sumatera Utara') },
      { id: 'message', label: L('Why this house?', 'Mengapa rumah ini?'), type: 'textarea', placeholder: L('What makes it special, or why it matters to you.', 'Apa yang istimewa darinya, atau mengapa rumah ini penting bagi Anda.') },
      { id: 'references', label: L('References', 'Referensi'), type: 'textarea', rows: 2, placeholder: L('Links to photos, drawings, books or articles (optional)', 'Tautan foto, gambar, buku, atau artikel (opsional)') },
    ],
  },
  {
    id: 'correction', icon: Bug, title: L('Correct a house', 'Koreksi rumah'), text: L('Something wrong in a model or its notes.', 'Ada yang keliru pada model atau catatannya.'),
    fields: [
      { id: 'house', label: L('House', 'Rumah'), type: 'house', required: true },
      { id: 'part', label: L('Building or part', 'Bangunan atau bagian'), placeholder: L('e.g. Pendapa · Soko guru (optional)', 'mis. Pendapa · Soko guru (opsional)') },
      { id: 'message', label: L('What should be corrected?', 'Apa yang perlu dikoreksi?'), type: 'textarea', required: true, placeholder: L('What’s wrong, and what it should be.', 'Apa yang keliru, dan seharusnya bagaimana.') },
      { id: 'references', label: L('Source', 'Sumber'), placeholder: L('Where you read or learned this (optional)', 'Dari mana Anda membaca atau mengetahuinya (opsional)') },
    ],
  },
  {
    id: 'feature', icon: Lightbulb, title: L('Request a feature', 'Minta fitur'), text: L('An idea to make the site better.', 'Ide untuk membuat situs ini lebih baik.'),
    fields: [
      { id: 'title', label: L('Your idea', 'Ide Anda'), required: true, placeholder: L('e.g. Measure distances in the model', 'mis. Mengukur jarak pada model') },
      { id: 'message', label: L('Tell me more', 'Ceritakan lebih lanjut'), type: 'textarea', required: true, placeholder: L('What would you use it for?', 'Untuk apa Anda akan menggunakannya?') },
    ],
  },
  {
    id: 'partner', icon: Handshake, title: L('Sponsor or partner', 'Sponsor atau mitra'), text: L('Work together on the project.', 'Bekerja sama dalam proyek ini.'),
    emailRequired: true,
    fields: [
      { id: 'organisation', label: L('Organisation', 'Organisasi'), placeholder: L('Company, institution or community (optional)', 'Perusahaan, lembaga, atau komunitas (opsional)') },
      { id: 'message', label: L('Message', 'Pesan'), type: 'textarea', required: true, placeholder: L('What you have in mind.', 'Apa yang Anda bayangkan.') },
    ],
  },
];

class SendError extends Error {}

// Messages reach the inbox in English labels, with the visitor's language noted.
async function send(kind, values, lang) {
  const subject = `[${SITE}] ${kind.title.en}`;
  const body = { kind: kind.title.en, ...values, language: lang, page: location.href, _subject: subject };
  if (CONTACT.endpoint) {
    const res = await fetch(CONTACT.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new SendError('failed');
    return 'sent';
  }
  if (CONTACT.email) {
    const text = Object.entries(values).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n\n');
    location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
    return 'mail';
  }
  throw new SendError('unconfigured');
}

function Field({ f, value, onChange }) {
  const { t, tx } = useLang();
  const id = `contrib-${f.id}`;
  const label = <Label htmlFor={id}>{tx(f.label)}{f.required && <span className="text-primary">*</span>}</Label>;
  const placeholder = tx(f.placeholder);
  let control;
  if (f.type === 'textarea') {
    control = <Textarea id={id} rows={f.rows || 4} required={f.required} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
  } else if (f.type === 'house') {
    control = (
      <Select value={value} onValueChange={(v) => v && onChange(v)} required={f.required}>
        <SelectTrigger id={id} className="w-full"><SelectValue placeholder={t('Choose a house', 'Pilih rumah')} /></SelectTrigger>
        <SelectContent>
          {READY.map((h) => <SelectItem key={h.id} value={h.id}>{h.name} · {tx(h.province)}</SelectItem>)}
        </SelectContent>
      </Select>
    );
  } else {
    control = <Input id={id} type={f.type || 'text'} required={f.required} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />;
  }
  return <div className="grid gap-1.5">{label}{control}</div>;
}

function ContributeForm({ kind, house, onDone }) {
  const { lang, t, href } = useLang();
  // A correction starts on the house you were looking at.
  const [values, setValues] = useState(() => (kind.id === 'correction' && houseById(house)?.status === 'ready' ? { house } : {}));
  const [state, setState] = useState({ status: 'idle' });
  const set = (k) => (v) => setValues((s) => ({ ...s, [k]: v }));
  const ERRORS = {
    required: t('Please fill in the required fields.', 'Mohon isi kolom yang wajib.'),
    email: t('That email address doesn’t look right.', 'Alamat email tersebut sepertinya tidak benar.'),
    failed: t('Sorry, your message couldn’t be sent. Please try again later.', 'Maaf, pesan Anda gagal terkirim. Silakan coba lagi nanti.'),
    unconfigured: t('The contact form isn’t set up yet.', 'Formulir kontak belum disiapkan.'),
  };

  const submit = async (e) => {
    e.preventDefault();
    if (values._gotcha) return;                       // honeypot: only bots fill it (Formspree also checks it)
    if (kind.fields.some((f) => f.required && !values[f.id]?.trim()) || (kind.emailRequired && !values.email?.trim())) {
      setState({ status: 'error', error: 'required' });
      return;
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) {
      setState({ status: 'error', error: 'email' });
      return;
    }
    setState({ status: 'sending' });
    try {
      const out = { ...values };
      if (out.house && kind.id === 'correction') out.house = houseById(out.house)?.name || out.house;
      onDone(await send(kind, out, lang));
    } catch (err) {
      setState({ status: 'error', error: err instanceof SendError ? err.message : 'failed' });
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      {kind.fields.map((f) => <Field key={f.id} f={f} value={values[f.id] || ''} onChange={set(f.id)} />)}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field f={{ id: 'name', label: L('Your name', 'Nama Anda'), placeholder: L('Optional', 'Opsional') }} value={values.name || ''} onChange={set('name')} />
        <Field
          f={{
            id: 'email', label: L('Email', 'Email'), type: 'email', required: kind.emailRequired,
            placeholder: kind.emailRequired ? L('So I can reply', 'Agar saya bisa membalas') : L('Optional, if you’d like a reply', 'Opsional, jika ingin dibalas'),
          }}
          value={values.email || ''} onChange={set('email')}
        />
      </div>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={values._gotcha || ''} onChange={(e) => set('_gotcha')(e.target.value)} />
      {state.status === 'error' && <p className="text-sm text-destructive">{ERRORS[state.error]}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {t('See', 'Lihat')} <a href={href('/terms')} className="underline hover:text-foreground">{t('Terms & privacy', 'Ketentuan & privasi')}</a>{' '}
          {t('for how messages are handled.', 'tentang cara pesan ditangani.')}
        </p>
        <Button type="submit" disabled={state.status === 'sending'}>
          {state.status === 'sending' && <Loader2 className="animate-spin" />} {t('Send', 'Kirim')}
        </Button>
      </div>
    </form>
  );
}

export function ContributeDialog({ open, onClose, house }) {
  const { t, tx } = useLang();
  const [kindId, setKindId] = useState('house');
  const [done, setDone] = useState(null);
  useEffect(() => { if (open) setDone(null); }, [open]);
  const kind = KINDS.find((k) => k.id === kindId);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-0 overflow-y-auto p-6 sm:max-w-2xl sm:p-8">
        <DialogHeader className="mb-5">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
          <DialogTitle className="font-heading text-3xl font-semibold">{t('Contribute', 'Kontribusi')}</DialogTitle>
          <DialogDescription className="text-base">
            {t('Help make every house more accurate, and help decide what comes next.', 'Bantu membuat setiap rumah lebih akurat, dan ikut menentukan apa yang berikutnya.')}
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="grid justify-items-center gap-3 rounded-xl border bg-muted/40 px-6 py-10 text-center">
            <span className="grid size-10 place-content-center rounded-full bg-primary text-primary-foreground"><Check className="size-5" /></span>
            <h3 className="font-heading text-2xl font-semibold">{done === 'mail' ? t('Almost there', 'Sedikit lagi') : t('Thank you!', 'Terima kasih!')}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {done === 'mail'
                ? t('Your email app should have opened with the message filled in. Send it from there and I’ll get it.', 'Aplikasi email Anda seharusnya terbuka dengan pesan yang sudah terisi. Kirim dari sana dan pesan akan sampai ke saya.')
                : t('Your message is on its way. I read every one, and I’ll reply if you left an email address.', 'Pesan Anda sedang dikirim. Saya membaca setiap pesan, dan akan membalas jika Anda meninggalkan alamat email.')}
            </p>
            <Button variant="outline" onClick={() => setDone(null)}>{t('Send another', 'Kirim lagi')}</Button>
          </div>
        ) : (
          <>
            <div role="radiogroup" aria-label={t('What would you like to do?', 'Apa yang ingin Anda lakukan?')} className="mb-6 grid grid-cols-2 gap-2">
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
                    <span className="text-sm font-medium">{tx(title)}</span>
                    <span className="text-xs leading-snug text-muted-foreground">{tx(text)}</span>
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
            <p className="font-medium">{t('Support the project', 'Dukung proyek ini')}</p>
            <p className="text-sm text-muted-foreground">
              {t(`${SITE} is free and made in my spare time. A coffee helps me keep adding houses.`, `${SITE} gratis dan dibuat di waktu luang saya. Secangkir kopi membantu saya terus menambah rumah.`)}
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <a href={DONATE_URL} target="_blank" rel="noopener"><Coffee /> {t('Buy me a coffee', 'Traktir saya kopi')}</a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
