// Site pages: Terms & privacy, shown over the 3D view so the house doesn't rebuild.
// Loaded on demand (see App.jsx); the footer links live in site-links.js.
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CREDIT, DONATE_URL, REPO_URL, SITE } from '@/config.js';

import { SITE_LINKS } from './site-links.js';
import { useLang } from './lang.jsx';

const UPDATED = { en: '6 October 2026', id: '6 Oktober 2026' };

const H2 = ({ children }) => <h2 className="mt-10 mb-3 font-heading text-2xl font-semibold">{children}</h2>;
const P = ({ children }) => <p className="mb-4 leading-relaxed text-foreground/80">{children}</p>;
const UL = ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-5 leading-relaxed text-foreground/80">{children}</ul>;
const A = ({ href, children }) => (
  <a className="font-medium text-primary hover:underline" href={href} {...(href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener' })}>{children}</a>
);

function TermsEn() {
  return (
    <>
      <P>
        {SITE} is a personal, non-commercial project by {CREDIT.name} (<A href={CREDIT.url}>{CREDIT.url.replace('https://', '')}</A>).
        These terms explain how you may use the site and its downloads, and the privacy section explains what data the site
        handles. By using {SITE} you agree to them.
      </P>

      <H2>1. What the site is</H2>
      <P>
        {SITE} is an interactive 3D directory of Indonesia’s traditional houses (rumah adat), made for learning. It is free to use
        and needs no account.
      </P>

      <H2>2. Accuracy</H2>
      <P>
        The models are idealised reconstructions. Real houses differ from region to region, village to village and family to
        family, and some details are simplified so the structure is easier to understand. Names, descriptions and meanings are
        drawn from published sources and are still being reviewed, so they may contain mistakes.
      </P>
      <UL>
        <li>The content is for general education. It is not an authoritative account of any community’s customs or beliefs.</li>
        <li>The models are not construction drawings. Do not use them to build, restore or assess the safety of a real structure.</li>
        <li>If you find an error, please report it through <A href="/contribute">Contribute</A>.</li>
      </UL>

      <H2>3. Respect for the cultures shown</H2>
      <P>
        The houses on this site, their forms, names and meanings belong to the communities that created them and keep them alive.
        {' '}{SITE} does not claim ownership of any of this heritage. Please use what you learn here respectfully, and credit the
        communities, not just this site, when you share it.
      </P>

      <H2>4. Using the site and downloads</H2>
      <P>
        The 3D models, including every download (GLB, OBJ, STL, USDZ), and the house descriptions are licensed under{' '}
        <A href="https://creativecommons.org/licenses/by-nc/4.0/">Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)</A>.
        You may share and adapt them for non-commercial purposes such as study, teaching, school projects, research and personal
        3D printing, as long as you credit “{SITE} by {CREDIT.name}”, link to {SITE} and say if you changed anything.
      </P>
      <P>
        For commercial use, such as selling models or prints, or using them in paid products, games, films or advertising, please
        ask first through <A href="/contribute">Contribute</A>.
      </P>
      <P>
        Please do not present the models as your own work, do not use them to misrepresent the communities they come from, and do
        not try to disrupt or overload the site.
      </P>

      <H2>5. Ownership and source code</H2>
      <P>
        The models, texts and design of {SITE} are © {CREDIT.name}. The source code is published on <A href={REPO_URL}>GitHub</A>{' '}
        under two licences: the house models and their content (the <code>src/houses</code> folder) under CC BY-NC 4.0, and
        everything else, such as the 3D engine and the interface, under the MIT License. Third-party libraries such as Three.js,
        React and shadcn/ui are used under their own open-source licences.
      </P>

      <H2>6. Contributions</H2>
      <P>
        When you send a suggestion, correction or request, you agree that I may use it to improve the site, for example by fixing
        a description or modelling a house you suggested, without payment. I may credit you by name if you ask to be credited.
        Please share only information and material you have the right to share.
      </P>

      <H2>7. Support and donations</H2>
      <P>
        You can support the project through <A href={DONATE_URL}>Buy Me a Coffee</A>. Support is voluntary and does not buy any
        product, service or special right on the site. Payments are handled entirely by Buy Me a Coffee under its own terms and
        privacy policy; I never see your card or payment details.
      </P>

      <H2>8. No warranty and limitation of liability</H2>
      <P>
        The site and its downloads are provided “as is”, without warranties of any kind. As far as the law allows, I am not liable
        for any loss or damage arising from using the site, its content or its downloads. The site may change, pause or go offline
        at any time.
      </P>

      <H2>9. Privacy</H2>
      <P>{SITE} is built to collect as little as possible.</P>
      <UL>
        <li><strong>No accounts, no ads, no tracking cookies.</strong> The site does not use advertising or cross-site tracking.</li>
        <li>
          <strong>Your browser’s storage.</strong> Your theme (light, dark or system) and language choices are saved in your browser’s
          local storage so they are remembered next time. They stay on your device and you can clear them at any time.
        </li>
        <li>
          <strong>Hosting.</strong> The site is hosted on Cloudflare. Like any web host, Cloudflare processes technical data such as
          your IP address and browser type to deliver pages and protect the site from abuse, under its own privacy policy.
        </li>
        <li>
          <strong>Visitor statistics.</strong> I use{' '}
          <A href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</A> to see how many people visit and which
          pages they view. It sets no cookies, does not track you across sites or build a profile of you, and only shows me totals
          such as page views, countries, referring sites and device types.
        </li>
        <li>
          <strong>Contribute form.</strong> If you send a message, I receive what you type: the form fields, plus your name and email
          address if you give them, and the page you sent it from. I use this only to read, act on and reply to your message, and I
          do not sell or share it with anyone else. Messages are delivered to me by{' '}
          <A href="https://formspree.io/legal/privacy-policy">Formspree</A>, which processes them on my behalf under its own privacy
          policy. You can ask me to delete your message at any time.
        </li>
        <li>
          <strong>Links to other sites.</strong> Links to GitHub, Buy Me a Coffee or my own site take you to services with their own
          privacy policies.
        </li>
        <li><strong>Fonts and 3D libraries</strong> are served from {SITE} itself. The only outside script is Cloudflare’s small analytics script.</li>
      </UL>
      <P>
        You can ask what information I hold about you, or ask me to correct or delete it, through <A href="/contribute">Contribute</A>.
      </P>

      <H2>10. Changes and contact</H2>
      <P>
        I may update these terms as the project grows. The date below shows the latest version, and continuing to use the site
        means you accept the updated terms. These terms are governed by the laws of the Republic of Indonesia. For any question,
        get in touch through <A href="/contribute">Contribute</A>.
      </P>
      <p className="mt-8 text-xs text-muted-foreground">Last updated: {UPDATED.en}</p>
    </>
  );
}

function TermsId() {
  return (
    <>
      <P>
        {SITE} adalah proyek pribadi dan nonkomersial oleh {CREDIT.name} (<A href={CREDIT.url}>{CREDIT.url.replace('https://', '')}</A>).
        Ketentuan ini menjelaskan bagaimana Anda boleh menggunakan situs dan unduhannya, dan bagian privasi menjelaskan data apa
        yang ditangani situs ini. Dengan menggunakan {SITE}, Anda menyetujuinya.
      </P>

      <H2>1. Tentang situs ini</H2>
      <P>
        {SITE} adalah direktori 3D interaktif rumah adat Indonesia yang dibuat untuk belajar. Situs ini gratis dan tidak memerlukan
        akun.
      </P>

      <H2>2. Ketepatan isi</H2>
      <P>
        Model-model di sini adalah rekonstruksi yang diidealkan. Rumah sebenarnya berbeda dari satu daerah ke daerah lain, dari
        desa ke desa, dan dari keluarga ke keluarga, dan beberapa detail disederhanakan agar strukturnya lebih mudah dipahami.
        Nama, deskripsi, dan makna diambil dari sumber terbitan dan masih ditinjau, sehingga mungkin masih ada kekeliruan.
      </P>
      <UL>
        <li>Isinya untuk pendidikan umum, bukan uraian resmi tentang adat atau kepercayaan suatu masyarakat.</li>
        <li>Model ini bukan gambar kerja. Jangan gunakan untuk membangun, memugar, atau menilai keamanan bangunan sungguhan.</li>
        <li>Jika menemukan kekeliruan, laporkan melalui <A href="/id/contribute">Kontribusi</A>.</li>
      </UL>

      <H2>3. Menghormati budaya yang ditampilkan</H2>
      <P>
        Rumah-rumah di situs ini, beserta bentuk, nama, dan maknanya, adalah milik masyarakat yang menciptakan dan
        melestarikannya. {SITE} tidak mengklaim kepemilikan atas warisan ini. Gunakan apa yang Anda pelajari di sini dengan hormat,
        dan saat membagikannya, sebutkan masyarakat asalnya, bukan hanya situs ini.
      </P>

      <H2>4. Menggunakan situs dan unduhan</H2>
      <P>
        Model 3D, termasuk setiap unduhan (GLB, OBJ, STL, USDZ), dan deskripsi rumah dilisensikan dengan{' '}
        <A href="https://creativecommons.org/licenses/by-nc/4.0/deed.id">Creative Commons Atribusi-NonKomersial 4.0 (CC BY-NC 4.0)</A>.
        Anda boleh membagikan dan mengadaptasinya untuk keperluan nonkomersial seperti belajar, mengajar, tugas sekolah,
        penelitian, dan cetak 3D pribadi, asalkan mencantumkan “{SITE} oleh {CREDIT.name}”, menautkan ke {SITE}, dan menyebutkan
        jika Anda mengubah sesuatu.
      </P>
      <P>
        Untuk penggunaan komersial, misalnya menjual model atau hasil cetaknya, atau memakainya dalam produk berbayar, gim, film,
        atau iklan, mohon minta izin terlebih dahulu melalui <A href="/id/contribute">Kontribusi</A>.
      </P>
      <P>
        Mohon jangan mengaku model ini sebagai karya Anda, jangan menggunakannya untuk menggambarkan secara keliru masyarakat
        asalnya, dan jangan mencoba mengganggu atau membebani situs ini.
      </P>

      <H2>5. Kepemilikan dan kode sumber</H2>
      <P>
        Model, teks, dan desain {SITE} adalah © {CREDIT.name}. Kode sumbernya dipublikasikan di <A href={REPO_URL}>GitHub</A>{' '}
        dengan dua lisensi: model rumah dan isinya (folder <code>src/houses</code>) dengan CC BY-NC 4.0, dan selebihnya, seperti
        mesin 3D dan antarmuka, dengan Lisensi MIT. Pustaka pihak ketiga seperti Three.js, React, dan shadcn/ui digunakan sesuai
        lisensi sumber terbuka masing-masing.
      </P>

      <H2>6. Kontribusi</H2>
      <P>
        Saat Anda mengirim usulan, koreksi, atau permintaan, Anda setuju bahwa saya boleh menggunakannya untuk memperbaiki situs,
        misalnya memperbaiki deskripsi atau memodelkan rumah yang Anda usulkan, tanpa imbalan. Nama Anda dapat saya cantumkan jika
        Anda memintanya. Mohon hanya membagikan informasi dan materi yang memang boleh Anda bagikan.
      </P>

      <H2>7. Dukungan dan donasi</H2>
      <P>
        Anda dapat mendukung proyek ini melalui <A href={DONATE_URL}>Buy Me a Coffee</A>. Dukungan bersifat sukarela dan tidak
        membeli produk, layanan, atau hak khusus apa pun di situs ini. Pembayaran sepenuhnya ditangani oleh Buy Me a Coffee sesuai
        ketentuan dan kebijakan privasinya sendiri; saya tidak pernah melihat detail kartu atau pembayaran Anda.
      </P>

      <H2>8. Tanpa jaminan dan batasan tanggung jawab</H2>
      <P>
        Situs dan unduhannya disediakan “sebagaimana adanya”, tanpa jaminan apa pun. Sejauh diizinkan hukum, saya tidak
        bertanggung jawab atas kerugian atau kerusakan yang timbul dari penggunaan situs, isinya, atau unduhannya. Situs ini dapat
        berubah, berhenti sementara, atau tidak tersedia sewaktu-waktu.
      </P>

      <H2>9. Privasi</H2>
      <P>{SITE} dibuat untuk mengumpulkan data sesedikit mungkin.</P>
      <UL>
        <li><strong>Tanpa akun, tanpa iklan, tanpa cookie pelacak.</strong> Situs ini tidak memakai iklan maupun pelacakan lintas situs.</li>
        <li>
          <strong>Penyimpanan di peramban Anda.</strong> Pilihan tema (terang, gelap, atau sistem) dan bahasa disimpan di
          penyimpanan lokal peramban Anda agar diingat pada kunjungan berikutnya. Data ini tetap di perangkat Anda dan dapat Anda
          hapus kapan saja.
        </li>
        <li>
          <strong>Hosting.</strong> Situs ini di-hosting di Cloudflare. Seperti layanan hosting pada umumnya, Cloudflare memproses
          data teknis seperti alamat IP dan jenis peramban untuk menayangkan halaman dan melindungi situs dari penyalahgunaan,
          sesuai kebijakan privasinya sendiri.
        </li>
        <li>
          <strong>Statistik pengunjung.</strong> Saya memakai{' '}
          <A href="https://www.cloudflare.com/web-analytics/">Cloudflare Web Analytics</A> untuk melihat berapa banyak orang yang
          berkunjung dan halaman apa yang mereka lihat. Layanan ini tidak memasang cookie, tidak melacak Anda lintas situs, dan
          tidak membuat profil Anda; saya hanya melihat angka total seperti jumlah tayangan halaman, negara, situs perujuk, dan
          jenis perangkat.
        </li>
        <li>
          <strong>Formulir kontribusi.</strong> Jika Anda mengirim pesan, saya menerima apa yang Anda tulis: isi formulir, nama dan
          alamat email jika Anda mencantumkannya, serta halaman tempat Anda mengirimnya. Data ini hanya saya gunakan untuk membaca,
          menindaklanjuti, dan membalas pesan Anda, dan tidak saya jual atau bagikan kepada siapa pun. Pesan dikirimkan kepada saya
          melalui <A href="https://formspree.io/legal/privacy-policy">Formspree</A>, yang memprosesnya atas nama saya sesuai
          kebijakan privasinya sendiri. Anda dapat meminta pesan Anda dihapus kapan saja.
        </li>
        <li>
          <strong>Tautan ke situs lain.</strong> Tautan ke GitHub, Buy Me a Coffee, atau situs pribadi saya membawa Anda ke layanan
          dengan kebijakan privasi masing-masing.
        </li>
        <li><strong>Huruf dan pustaka 3D</strong> disajikan dari {SITE} sendiri. Satu-satunya skrip dari luar adalah skrip analitik kecil milik Cloudflare.</li>
      </UL>
      <P>
        Anda dapat menanyakan informasi apa yang saya simpan tentang Anda, atau meminta saya memperbaiki atau menghapusnya, melalui{' '}
        <A href="/id/contribute">Kontribusi</A>.
      </P>

      <H2>10. Perubahan dan kontak</H2>
      <P>
        Ketentuan ini dapat saya perbarui seiring berkembangnya proyek. Tanggal di bawah menunjukkan versi terbaru, dan dengan
        terus menggunakan situs ini Anda menerima ketentuan yang diperbarui. Ketentuan ini tunduk pada hukum Republik Indonesia.
        Ini adalah terjemahan dari versi bahasa Inggris; jika ada perbedaan, versi bahasa Inggris yang berlaku. Untuk pertanyaan
        apa pun, hubungi saya melalui <A href="/id/contribute">Kontribusi</A>.
      </P>
      <p className="mt-8 text-xs text-muted-foreground">Terakhir diperbarui: {UPDATED.id}</p>
    </>
  );
}

export const PAGES = {
  terms: {
    title: { en: 'Terms & privacy', id: 'Ketentuan & privasi' },
    lede: { en: 'How you may use the site and its downloads, and what data it handles.', id: 'Cara Anda boleh menggunakan situs dan unduhannya, dan data apa yang ditanganinya.' },
    Body: { en: TermsEn, id: TermsId },
  },
};

export function PageOverlay({ id, backHref, backLabel }) {
  const { lang, t, tx, href } = useLang();
  const page = PAGES[id];
  const Body = tx(page.Body);
  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-background animate-in fade-in duration-200">
      <div className="mx-auto max-w-2xl px-5 py-6 sm:py-10">
        <div className="flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" asChild className="-ml-2">
            <a href={backHref}><ArrowLeft /> {backLabel}</a>
          </Button>
          <nav className="flex items-center gap-1" aria-label={t('Pages', 'Halaman')}>
            {SITE_LINKS.map((l) => (
              <Button key={l.id} variant={l.id === id ? 'secondary' : 'ghost'} size="sm" asChild>
                <a href={href(`/${l.id}`)}>{tx(l.short)}</a>
              </Button>
            ))}
          </nav>
        </div>
        <header className="mt-10 mb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">{SITE}</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight font-semibold sm:text-5xl">{tx(page.title)}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{tx(page.lede)}</p>
        </header>
        <Separator className="mb-8" />
        <article className="text-[15px]" lang={lang}>
          <Body />
        </article>
        <Separator className="mt-12 mb-6" />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {SITE} · {t('Built by', 'Dibuat oleh')} {CREDIT.name}</p>
      </div>
    </div>
  );
}
