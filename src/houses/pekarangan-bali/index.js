// Pekarangan Bali: a Balinese house compound laid out by the Sanga Mandala.
// Site coordinates: kaja (towards the mountain) is −z, kelod (towards the sea) +z,
// kangin (sunrise) +x, kauh (sunset) −x. The gateway is on the kelod side.
import { sanggah } from './sanggah.js';
import { baleMeten, baleDangin, baleDauh, paon, jineng } from './bales.js';
import { gate, WALL } from './gate.js';

const ZONES = [
  { id: 'parahyangan', label: { en: 'Sacred', id: 'Suci' },  local: 'Parahyangan', color: '#d9a441' },
  { id: 'pawongan',    label: { en: 'Living', id: 'Hunian' },  local: 'Pawongan',    color: '#c8673f' },
  { id: 'palemahan',   label: { en: 'Grounds', id: 'Lingkungan' }, local: 'Palemahan',   color: '#7fa37a' },
];

const BUILDINGS = [
  {
    id: 'sanggah', def: sanggah, at: [0, 0], rot: 0, zone: 'parahyangan',
    name: 'Sanggah', alias: 'Merajan', en: { en: 'Family temple', id: 'Pura keluarga' },
    desc: { en: 'The walled family temple in the corner closest to the mountain and the sunrise, with shrines for God and for the deified ancestors.', id: 'Pura keluarga berpagar di sudut yang paling dekat dengan gunung dan matahari terbit, dengan pelinggih untuk Tuhan dan para leluhur yang telah disucikan.' },
    fn: { en: 'Daily offerings and the family’s temple ceremonies take place here.', id: 'Persembahan sehari-hari dan upacara pura keluarga dilakukan di sini.' },
    meaning: { en: 'Kaja-kangin is the most sacred direction of the Sanga Mandala, so the temple always takes this corner.', id: 'Kaja-kangin adalah arah paling suci dalam Sanga Mandala, sehingga pura keluarga selalu menempati sudut ini.' },
    specs: [{ en: '4 shrines', id: '4 pelinggih' }, 'Kaja-kangin'],
  },
  {
    id: 'bale_meten', def: baleMeten, at: [-2, -8.5], rot: 0, zone: 'pawongan',
    name: 'Bale Meten', alias: 'Bale daja', en: { en: 'Sleeping house', id: 'Rumah tidur' },
    desc: { en: 'The only closed bale: brick walls and a carved door on the highest plinth, on the kaja (mountain) side of the courtyard.', id: 'Satu-satunya bale yang tertutup: tembok bata dan pintu berukir di atas bebaturan tertinggi, di sisi kaja (gunung) natah.' },
    fn: { en: 'The sleeping place of the head of the family and the elders, where heirlooms and valuables are kept.', id: 'Tempat tidur kepala keluarga dan para tetua, tempat pusaka dan barang berharga disimpan.' },
    meaning: { en: 'The most honoured household building stands on the side nearest the sacred mountain.', id: 'Bangunan rumah tangga yang paling dihormati berdiri di sisi yang paling dekat dengan gunung suci.' },
    specs: [{ en: '8 posts · sakutus', id: '8 tiang · sakutus' }, { en: 'Floor +1.0 m', id: 'Lantai +1,0 m' }],
  },
  {
    id: 'bale_dangin', def: baleDangin, at: [8.5, 1.5], rot: -Math.PI / 2, zone: 'pawongan',
    name: 'Bale Dangin', alias: 'Bale gede, bale adat', en: { en: 'Ceremonial pavilion', id: 'Bale upacara' },
    desc: { en: 'An open pavilion on twelve posts on the kangin (east) side, with two broad platforms.', id: 'Bale terbuka bertiang dua belas di sisi kangin (timur), dengan dua bale-bale yang lebar.' },
    fn: { en: 'Rites of passage happen here: tooth filing, weddings, and laying out the body of a family member before cremation.', id: 'Upacara daur hidup berlangsung di sini: potong gigi, pernikahan, hingga membaringkan jenazah anggota keluarga sebelum ngaben.' },
    meaning: { en: 'Facing the sunrise, it is where the family marks each stage of life.', id: 'Menghadap matahari terbit, di sinilah keluarga menandai setiap tahap kehidupan.' },
    specs: [{ en: '12 posts · saka roras', id: '12 tiang · saka roras' }, { en: 'Open', id: 'Terbuka' }],
  },
  {
    id: 'bale_dauh', def: baleDauh, at: [-9.5, 1.5], rot: Math.PI / 2, zone: 'pawongan',
    name: 'Bale Dauh', alias: 'Bale loji', en: { en: 'Guest pavilion', id: 'Bale tamu' },
    desc: { en: 'An open pavilion on nine posts on the kauh (west) side.', id: 'Bale terbuka bertiang sembilan di sisi kauh (barat).' },
    fn: { en: 'For receiving guests and for work, and traditionally a sleeping place for the young men of the household.', id: 'Untuk menerima tamu dan bekerja, dan secara tradisi menjadi tempat tidur para pemuda keluarga.' },
    meaning: { en: 'The sunset side is less sacred, suited to everyday and social life.', id: 'Sisi matahari terbenam kurang suci, cocok untuk kehidupan sehari-hari dan bersosialisasi.' },
    specs: [{ en: '9 posts · tiang sanga', id: '9 tiang · tiang sanga' }, { en: 'Open', id: 'Terbuka' }],
  },
  {
    id: 'paon', def: paon, at: [-9.5, 10], rot: Math.PI, zone: 'pawongan',
    name: 'Paon', alias: 'Dapur', en: { en: 'Kitchen', id: 'Dapur' },
    desc: { en: 'The kitchen, walled on three sides, with a clay stove (jalikan).', id: 'Dapur bertembok di tiga sisi, dengan tungku tanah liat (jalikan).' },
    fn: { en: 'Cooking for the household and its offerings.', id: 'Memasak untuk rumah tangga dan persembahannya.' },
    meaning: { en: 'Fire and daily work belong to the kelod-kauh (sea and sunset) side, the least sacred part of the compound.', id: 'Api dan pekerjaan sehari-hari berada di sisi kelod-kauh (laut dan matahari terbenam), bagian pekarangan yang paling rendah kesuciannya.' },
    specs: [{ en: '6 posts', id: '6 tiang' }, { en: 'Clay stove', id: 'Tungku tanah liat' }],
  },
  {
    id: 'jineng', def: jineng, at: [7, 10.5], rot: Math.PI, zone: 'pawongan',
    name: 'Jineng', alias: 'Lumbung', en: { en: 'Rice barn', id: 'Lumbung padi' },
    desc: { en: 'A rice barn on four posts with a rounded thatched roof and a sitting platform beneath.', id: 'Lumbung padi bertiang empat dengan atap alang-alang yang melengkung dan balai untuk duduk di bawahnya.' },
    fn: { en: 'Stores the harvest; the platform below is a shaded place to rest and work.', id: 'Menyimpan hasil panen; balai di bawahnya menjadi tempat teduh untuk beristirahat dan bekerja.' },
    meaning: { en: 'The family’s rice, honoured as a gift of Dewi Sri, kept safe and dry.', id: 'Padi keluarga, dihormati sebagai anugerah Dewi Sri, disimpan aman dan kering.' },
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: 'Rounded roof', id: 'Atap melengkung' }],
  },
  {
    id: 'gerbang', def: gate, at: [0, 0], rot: 0, zone: 'palemahan',
    name: 'Angkul-angkul & Penyengker', alias: 'Gerbang & tembok', en: { en: 'Gateway, walls and courtyard', id: 'Gerbang, tembok, dan natah' },
    desc: { en: 'The roofed gateway, the screen wall behind it, the wall around the compound and the natah (central courtyard).', id: 'Gerbang beratap, tembok penghalang di baliknya, tembok yang mengelilingi pekarangan, dan natah (halaman tengah).' },
    fn: { en: 'Enclose the household and control the way in from the street.', id: 'Melingkupi rumah tangga dan mengatur jalan masuk dari jalan.' },
    meaning: { en: 'The aling-aling makes everyone turn before entering: the courtyard is never seen straight from the street.', id: 'Aling-aling membuat setiap orang berbelok sebelum masuk: natah tidak pernah terlihat langsung dari jalan.' },
    specs: [`${WALL.x * 2} × ${WALL.z * 2} m`, { en: '1 gateway', id: '1 gerbang' }],
  },
];

// Sanga Mandala: nine zones from the two axes; the sacredness of a zone rises towards kaja and kangin.
const ROWS = [['utama', -WALL.z, -5], ['madya', -5, 5], ['nista', 5, WALL.z]];        // kaja → kelod
const COLS = [['nista', -WALL.x, -5], ['madya', -5, 5], ['utama', 5, WALL.x]];        // kauh → kangin
const RANK = { utama: 2, madya: 1, nista: 0 };
const SHADES = ['#7d8794', '#9a9a88', '#b9a77a', '#cfa75c', '#e3a33a'];
const MANDALA = ROWS.flatMap(([row, z0, z1]) => COLS.map(([col, x0, x1]) => ({
  zone: 'pawongan', x0, x1, z0, z1, color: SHADES[RANK[row] + RANK[col]],
  text: `${row[0].toUpperCase() + row.slice(1)}ning ${col}`,
})));

export default {
  loading: { en: 'Laying out the Sanga Mandala…', id: 'Menata Sanga Mandala…' },
  about: {
    title: { en: 'The Balinese house compound', id: 'Pekarangan rumah Bali' },
    paras: [
      { en: 'A traditional Balinese home (umah) is not one building but a walled compound (pekarangan) of separate pavilions (bale) around an open courtyard, the natah. Each bale has its own purpose and its own place.', id: 'Rumah tradisional Bali (umah) bukan satu bangunan, melainkan pekarangan bertembok berisi bale-bale terpisah di sekeliling halaman terbuka, natah. Setiap bale memiliki fungsi dan tempatnya sendiri.' },
      { en: 'The layout follows the Sanga Mandala, nine zones formed by two axes: kaja–kelod, towards the mountain or the sea, and kangin–kauh, towards the sunrise or the sunset. The kaja-kangin corner is the most sacred and holds the family temple; the kitchen and the gateway sit on the kelod side.', id: 'Tata letaknya mengikuti Sanga Mandala, sembilan zona yang dibentuk dua sumbu: kaja–kelod, ke arah gunung atau laut, dan kangin–kauh, ke arah matahari terbit atau terbenam. Sudut kaja-kangin paling suci dan ditempati pura keluarga; dapur dan gerbang berada di sisi kelod.' },
      { en: 'The rules for proportion and placement are set out in the Asta Kosala Kosali. Each bale is read like a body (Tri Angga): a base, a body of posts, and a roof as its head. The compound as a whole balances the sacred (parahyangan), the human (pawongan) and the natural (palemahan).', id: 'Aturan proporsi dan penempatannya termuat dalam Asta Kosala Kosali. Setiap bale dibaca seperti tubuh (Tri Angga): kaki, badan dari tiang-tiang, dan atap sebagai kepala. Pekarangan secara keseluruhan menyeimbangkan yang suci (parahyangan), manusia (pawongan), dan alam (palemahan).' },
      { en: 'This model is an idealised compound for learning, based on South Bali, where the mountain lies to the north. Real compounds vary in size, layout and which bale they have.', id: 'Model ini adalah pekarangan yang diidealkan untuk belajar, berdasarkan Bali Selatan, tempat gunung berada di utara. Pekarangan sebenarnya beragam dalam ukuran, tata letak, dan bale yang dimiliki.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.6,
    views: { inside: { pos: [-3, 1.7, 21], target: [-1, 2.2, 6] } },
    overlay: {
      x0: -WALL.x, x1: WALL.x,
      zones: MANDALA,
      axis: { from: [0, WALL.z], to: [0, -WALL.z], text: { en: 'Kaja · mountain ↑   Kelod · sea ↓', id: 'Kaja · gunung ↑   Kelod · laut ↓' } },
    },
    walk: {
      stops: [
        {
          title: 'Angkul-angkul', local: { en: 'The gateway', id: 'Gerbang' },
          pos: [-3, 1.7, 22], target: [-3, 2.4, 15],
          text: { en: 'From the lane, a Balinese home shows only a wall and a roofed gateway. Everything else lies behind it, inside the pekarangan.', id: 'Dari gang, rumah Bali hanya memperlihatkan tembok dan gerbang beratap. Segala yang lain berada di baliknya, di dalam pekarangan.' },
        },
        {
          title: 'Aling-aling', local: { en: 'The screen wall', id: 'Tembok penghalang' },
          pos: [-3, 1.7, 14.4], target: [-3, 1.5, 12.6],
          text: { en: 'Just inside, a wall blocks the way. You must turn to enter. It keeps the courtyard private, and by tradition it stops evil spirits, which travel only in straight lines.', id: 'Tepat di balik gerbang, sebuah tembok menghalangi jalan. Anda harus berbelok untuk masuk. Tembok ini menjaga privasi natah, dan menurut tradisi menolak roh jahat yang hanya bisa bergerak lurus.' },
        },
        {
          title: 'Natah', local: { en: 'The courtyard', id: 'Halaman tengah' }, via: [[0.6, 1.7, 13.6], [0.6, 1.7, 11.0]],
          pos: [-0.4, 1.7, 8.5], target: [0, 2.6, -4],
          text: { en: 'Around the aling-aling opens the natah, the courtyard at the centre of the compound. Every bale faces it, each on its own side and for its own purpose.', id: 'Di balik aling-aling terbentang natah, halaman di tengah pekarangan. Setiap bale menghadap ke sana, masing-masing di sisinya sendiri dan dengan tujuannya sendiri.' },
        },
        {
          title: 'Bale Dangin', local: { en: 'Ceremonies of life', id: 'Upacara kehidupan' }, buildings: ['bale_dangin'],
          pos: [1.6, 2.0, 3.4], target: [8.5, 2.0, 1.5],
          text: { en: 'On the sunrise side stands the open Bale Dangin. The family’s rites of passage take place on its platforms, from tooth filing and weddings to the last rites before cremation.', id: 'Di sisi matahari terbit berdiri Bale Dangin yang terbuka. Upacara daur hidup keluarga berlangsung di atas bale-balenya, dari potong gigi dan pernikahan hingga upacara terakhir sebelum ngaben.' },
        },
        {
          title: 'Bale Meten', local: { en: 'Towards the mountain', id: 'Ke arah gunung' }, buildings: ['bale_meten'],
          pos: [-1.4, 2.0, -1.2], target: [-2, 2.4, -8.5],
          text: { en: 'On the mountain side, on the highest plinth, is the Bale Meten, the only closed bale. The head of the family and the elders sleep here, and heirlooms are kept safe.', id: 'Di sisi gunung, di atas bebaturan tertinggi, berdiri Bale Meten, satu-satunya bale yang tertutup. Kepala keluarga dan para tetua tidur di sini, dan pusaka disimpan dengan aman.' },
        },
        {
          title: 'Sanggah', local: { en: 'The family temple', id: 'Pura keluarga' }, buildings: ['sanggah'],
          pos: [8.2, 2.4, -2.4], target: [11.4, 1.8, -11.2],
          text: { en: 'In the corner closest to the mountain and the sunrise is the family temple, with its own walls and gateway. Here stand the shrines for God and for the deified ancestors.', id: 'Di sudut yang paling dekat dengan gunung dan matahari terbit ada pura keluarga, dengan tembok dan gerbangnya sendiri. Di sini berdiri pelinggih untuk Tuhan dan para leluhur yang telah disucikan.' },
        },
        {
          title: 'Paon & Jineng', local: { en: 'Towards the sea', id: 'Ke arah laut' }, buildings: ['paon', 'jineng'],
          pos: [-0.5, 3.4, 3.6], target: [-1, 1.4, 10.8],
          text: { en: 'On the seaward side are the kitchen and the rice barn. Fire, smoke and daily work belong to the least sacred part of the compound, close to the gateway.', id: 'Di sisi laut terdapat dapur dan lumbung padi. Api, asap, dan pekerjaan sehari-hari berada di bagian pekarangan yang paling rendah kesuciannya, dekat gerbang.' },
        },
        {
          title: 'Sanga Mandala', local: { en: 'Nine zones', id: 'Sembilan zona' }, overlay: true,
          pos: [0, 58, 16], target: [0, 0, 1],
          text: { en: 'From above, the nine zones of the Sanga Mandala appear. Sacredness rises towards the mountain and the sunrise: the temple holds the highest corner, the kitchen and gate the lowest.', id: 'Dari atas, tampak sembilan zona Sanga Mandala. Kesucian meningkat ke arah gunung dan matahari terbit: pura menempati sudut tertinggi, dapur dan gerbang yang terendah.' },
        },
      ],
    },
  },

  slots: [
    { id: 'thatch', label: 'Alang-alang', tex: 'thatch', clay: '#dcd4c6' },
    { id: 'ijuk', label: 'Ijuk', tex: 'thatch', clay: '#cfc7ba' },
    { id: 'bata', label: { en: 'Brick', id: 'Bata' }, tex: 'brick', clay: '#e6e0d6' },
    { id: 'paras', label: 'Paras', tex: 'stone', clay: '#ece8e0' },
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'accent', label: 'Prada', tex: null, glossy: true },
    { id: 'plank', label: { en: 'Platforms', id: 'Bale-bale' }, tex: 'wood', ui: false },
    { id: 'bamboo', label: { en: 'Bamboo', id: 'Bambu' }, tex: 'bamboo', ui: false },
    { id: 'clay', label: { en: 'Clay', id: 'Tanah liat' }, tex: 'stone', ui: false },
    { id: 'ground', label: { en: 'Courtyard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: { en: 'Tradisional · alang-alang & bata', id: 'Tradisional · alang-alang & bata' }, rough: 0.8, metal: { accent: 0.7 },
      colors: { thatch: '#a8915f', ijuk: '#2a2522', bata: '#a4553b', paras: '#a29f91', wood: '#6e4a2f', accent: '#c9a24a', plank: '#8b6a48', bamboo: '#c2a571', clay: '#9c5a3c', ground: '#93a067' },
    },
    genteng: {
      label: { en: 'Genteng · clay tile roofs', id: 'Genteng · atap genteng tanah liat' }, rough: 0.7, metal: { accent: 0.7 }, tex: { thatch: 'tile' },
      colors: { thatch: '#b55d3c', ijuk: '#2a2522', bata: '#a4553b', paras: '#a29f91', wood: '#6e4a2f', accent: '#c9a24a', plank: '#8b6a48', bamboo: '#c2a571', clay: '#9c5a3c', ground: '#93a067' },
    },
    puri: {
      label: { en: 'Puri · pale paras & gold', id: 'Puri · paras pucat & emas' }, rough: 0.6, metal: { accent: 0.85 },
      colors: { thatch: '#9a8458', ijuk: '#221d1a', bata: '#b2603f', paras: '#d4cfbf', wood: '#4e3424', accent: '#d8aa4c', plank: '#6f5038', bamboo: '#b89a66', clay: '#9c5a3c', ground: '#8e9b62' },
    },
  },
};
