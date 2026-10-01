// Site pages (About, Terms & privacy, Contribute), shown over the 3D view so the house
// doesn't have to rebuild when you come back.
// NOTE: the copy here is placeholder content, to be replaced with the final text.
import { ArrowLeft, Bug, Code2, FileWarning, Lightbulb, Images } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CREDIT, SITE } from '@/config.js';
import { cn } from '@/lib/utils';

const REPO = 'https://github.com/nurasyrof/joglo';

const H2 = ({ children }) => <h2 className="mt-10 mb-3 font-heading text-2xl font-semibold">{children}</h2>;
const P = ({ children }) => <p className="mb-4 leading-relaxed text-foreground/80">{children}</p>;

function AboutPage() {
  return (
    <>
      <P>
        {SITE} is an interactive 3D directory of Indonesia’s traditional houses (rumah adat). Each house can be taken apart,
        cut through and explored part by part, with notes on what every element does and what it means.
      </P>
      <H2>How the models are made</H2>
      <P>
        Every house is built in code from real proportions: columns, beams, roofs and carvings are generated procedurally and grouped
        into named parts. Compounds such as the Javanese joglo are modelled as a whole site, with each building in its place.
      </P>
      <P>
        The models are idealised for learning. Real houses vary from village to village and family to family, and some details are
        simplified so the structure is easier to read.
      </P>
      <H2>Sources and accuracy</H2>
      <P>
        Names and descriptions are drawn from published writing on Indonesian vernacular architecture. They are still being reviewed,
        and corrections are very welcome on the Contribute page.
      </P>
      <H2>Roadmap</H2>
      <ul className="mb-4 list-disc space-y-1.5 pl-5 text-foreground/80">
        <li>More houses across Sumatra, Java, Bali & Nusa Tenggara, Kalimantan, Sulawesi, Maluku and Papua.</li>
        <li>Compounds for houses that are more than one building, such as the Balinese pekarangan.</li>
        <li>A directory page once there are 10–15 houses in 3D.</li>
      </ul>
      <H2>Credits</H2>
      <P>
        Designed and built by <a className="font-medium text-primary hover:underline" href={CREDIT.url} target="_blank" rel="noopener">@{CREDIT.name}</a>.
        Made with Three.js, React and shadcn/ui.
      </P>
    </>
  );
}

function TermsPage() {
  return (
    <>
      <div className="mb-6 flex gap-3 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
        <FileWarning className="mt-0.5 size-4 shrink-0" />
        <span>This page is a draft placeholder. The final terms and privacy policy will replace it before launch.</span>
      </div>
      <H2>Using the site</H2>
      <P>[Placeholder] {SITE} is provided for learning and personal use. The content is offered as is, without guarantees of completeness or accuracy.</P>
      <H2>3D downloads</H2>
      <P>[Placeholder] The licence for downloaded models (GLB, OBJ, STL, USDZ) is still to be decided. Until then, please ask before using them commercially.</P>
      <H2>Privacy</H2>
      <P>[Placeholder] The site has no accounts. Your theme choice is stored in your own browser. Details about hosting logs and any analytics will be listed here.</P>
      <H2>Contact</H2>
      <P>[Placeholder] Questions about these terms can be sent to the contact listed on the Contribute page.</P>
      <p className="mt-8 text-xs text-muted-foreground">Last updated: [date to be added]</p>
    </>
  );
}

const WAYS = [
  { icon: Bug, title: 'Report a correction', text: 'Spotted a wrong name, a mistaken description or a part in the wrong place? Tell us what to fix and, if you can, where you read it.' },
  { icon: Lightbulb, title: 'Suggest a house', text: 'Which rumah adat should be modelled next? Suggestions with plans, measurements or good references help the most.' },
  { icon: Images, title: 'Share references', text: 'Photos, drawings and books about traditional houses help make the models more accurate. Please share only material you have the right to share.' },
  { icon: Code2, title: 'Contribute code', text: 'The project is on GitHub. Each house is a small set of files, and the README explains how to add one.', href: REPO },
];

function ContributePage() {
  return (
    <>
      <P>{SITE} grows with help from people who know these houses. There are a few ways to help.</P>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {WAYS.map(({ icon: Icon, title, text, href }) => (
          <Card key={title} size="sm">
            <CardContent className="space-y-2">
              <Icon className="size-5 text-primary" />
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              {href && <a href={href} target="_blank" rel="noopener" className="inline-block text-sm font-medium text-primary hover:underline">Open on GitHub →</a>}
            </CardContent>
          </Card>
        ))}
      </div>
      <H2>Get in touch</H2>
      <P>[Placeholder] A contact form or email address will go here. For now, reach out via <a className="font-medium text-primary hover:underline" href={CREDIT.url} target="_blank" rel="noopener">{CREDIT.url.replace('https://', '')}</a>.</P>
    </>
  );
}

export const PAGES = [
  { id: 'about', short: 'About', title: `About ${SITE}`, lede: 'Traditional houses of Indonesia, in 3D.', Body: AboutPage },
  { id: 'terms', short: 'Terms & privacy', title: 'Terms & privacy', lede: 'How the site and its downloads may be used.', Body: TermsPage, draft: true },
  { id: 'contribute', short: 'Contribute', title: 'Contribute', lede: 'Help make every house more accurate.', Body: ContributePage },
];
export const pageById = (id) => PAGES.find((p) => p.id === id);

export function PageOverlay({ page, backHref, backLabel }) {
  const { Body } = page;
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-background animate-in fade-in duration-200">
      <div className="mx-auto max-w-2xl px-5 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <a href={backHref}><ArrowLeft /> {backLabel}</a>
          </Button>
          <nav className="flex items-center gap-1" aria-label="Pages">
            {PAGES.map((p) => (
              <Button key={p.id} variant={p.id === page.id ? 'secondary' : 'ghost'} size="sm" asChild>
                <a href={`#/${p.id}`}>{p.short}</a>
              </Button>
            ))}
          </nav>
        </div>
        <header className="mt-10 mb-6">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
            <Badge variant="outline" className="text-muted-foreground">Placeholder content</Badge>
          </div>
          <h1 className="mt-3 font-heading text-4xl leading-tight font-semibold sm:text-5xl">{page.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{page.lede}</p>
        </header>
        <Separator className="mb-8" />
        <article className={cn('text-[15px]')}>
          <Body />
        </article>
        <Separator className="mt-12 mb-6" />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {SITE} · Built by @{CREDIT.name}</p>
      </div>
    </div>
  );
}
