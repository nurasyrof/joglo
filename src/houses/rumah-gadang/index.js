// Rumah Gadang (West Sumatra): the house of a Minangkabau kaum with its rice barns,
// surau and yard. Site coordinates: the house faces +z towards the yard and gate.
import house from './house.js';
import { makeRangkiang } from './rangkiang.js';
import { surau, yard, YARD } from './compound.js';

const ZONES = [
  { id: 'rumah',     label: { en: 'House', id: 'Rumah' },         local: 'Rumah',     color: '#cf5b3f' },
  { id: 'rangkiang', label: { en: 'Rice barns', id: 'Lumbung padi' },    local: 'Rangkiang', color: '#dcab52' },
  { id: 'surau',     label: { en: 'Prayer house', id: 'Surau' },  local: 'Surau',     color: '#6f9bb8' },
  { id: 'halaman',   label: { en: 'Yard', id: 'Halaman' },          local: 'Halaman',   color: '#7fa37a' },
];

const BARN_Z = 12.5;
const barn = (o) => ({ zone: 'rangkiang', rot: Math.PI, alias: 'Rangkiang', ...o });

const BUILDINGS = [
  {
    id: 'rumah_gadang', def: house, at: [0, 0], rot: 0, zone: 'rumah',
    name: 'Rumah Gadang', alias: 'Rumah bagonjong', en: { en: 'The great house', id: 'Rumah besar' },
    desc: { en: 'The long family house of the kaum on its forest of columns, with carved walls that lean outward and a roof sweeping up into gonjong.', id: 'Rumah keluarga kaum yang panjang di atas hutan tiang, dengan dinding berukir yang condong ke luar dan atap yang melengkung naik menjadi gonjong.' },
    fn: { en: 'Home of the women of the kaum and their children. Each married daughter has a biliak along the back of the hall, and the hall in front is shared for daily life and ceremonies.', id: 'Tempat tinggal kaum perempuan dan anak-anak mereka. Setiap anak perempuan yang sudah menikah memiliki biliak di sepanjang bagian belakang, dan ruang di depannya dipakai bersama untuk kehidupan sehari-hari dan upacara.' },
    meaning: { en: 'The house belongs to the women and passes from mother to daughter, the heart of the matrilineal Minangkabau family.', id: 'Rumah ini milik kaum perempuan dan diwariskan dari ibu ke anak perempuan, jantung keluarga Minangkabau yang matrilineal.' },
    specs: ['7 ruang', '5 gonjong'],
  },
  barn({
    id: 'rangkiang_sitinjau', at: [-4.3, BARN_Z], name: 'Sitinjau Lauik', en: { en: 'Barn for trade', id: 'Lumbung untuk berdagang' },
    def: makeRangkiang({ w: 1.5, d: 1.5, postH: 1.6, bodyH: 1.6, roofH: 1.5, seed: 11 }),
    desc: { en: 'The tallest and most finely carved of the barns. Its name means “looking out to sea”.', id: 'Lumbung yang paling tinggi dan paling halus ukirannya. Namanya berarti “meninjau laut”.' },
    fn: { en: 'Holds rice to be sold or bartered for goods the family cannot make itself.', id: 'Menyimpan padi untuk dijual atau ditukar dengan barang yang tidak dapat dibuat sendiri oleh keluarga.' },
    meaning: { en: 'Rice that connects the household with the world beyond the village.', id: 'Padi yang menghubungkan rumah tangga dengan dunia di luar kampung.' },
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: 'Carved', id: 'Berukir' }],
  }),
  barn({
    id: 'rangkiang_sibayau', at: [4.6, BARN_Z], name: 'Sibayau-bayau', en: { en: 'Barn for daily meals', id: 'Lumbung untuk makan sehari-hari' },
    def: makeRangkiang({ w: 2.6, d: 1.7, posts: 3, postH: 1.4, bodyH: 1.4, roofH: 1.3, seed: 12 }),
    desc: { en: 'The widest barn, on six posts.', id: 'Lumbung terlebar, di atas enam tiang.' },
    fn: { en: 'Holds the rice the family eats every day.', id: 'Menyimpan padi yang dimakan keluarga setiap hari.' },
    meaning: { en: 'The everyday store that feeds the household.', id: 'Persediaan sehari-hari yang menghidupi rumah tangga.' },
    specs: [{ en: '6 posts', id: '6 tiang' }, { en: 'Carved', id: 'Berukir' }],
  }),
  barn({
    id: 'rangkiang_sitangguang', at: [-10, BARN_Z], name: 'Sitangguang Lapa', en: { en: 'Barn against hunger', id: 'Lumbung penangkal lapar' },
    def: makeRangkiang({ w: 1.9, d: 1.9, postH: 1.4, bodyH: 1.5, roofH: 1.35, seed: 13 }),
    desc: { en: 'A square barn whose name means “bearing hunger”.', id: 'Lumbung persegi yang namanya berarti “menanggung lapar”.' },
    fn: { en: 'A reserve kept for lean seasons and disasters, also used to help poorer members of the community.', id: 'Cadangan untuk musim paceklik dan bencana, juga untuk membantu anggota masyarakat yang kekurangan.' },
    meaning: { en: 'Care for the kaum: no one should go hungry while the barn is full.', id: 'Kepedulian bagi kaum: tak seorang pun boleh kelaparan selama lumbung masih penuh.' },
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: 'Reserve', id: 'Cadangan' }],
  }),
  barn({
    id: 'rangkiang_kaciak', at: [10, BARN_Z], name: 'Rangkiang Kaciak', en: { en: 'Small barn for seed', id: 'Lumbung kecil untuk benih' },
    def: makeRangkiang({ w: 1.2, d: 1.2, postH: 1.0, bodyH: 1.1, roofH: 0.9, carved: false, gonjong: false, seed: 14 }),
    desc: { en: 'The smallest and plainest barn (kaciak means “small”), under a simple roof without gonjong.', id: 'Lumbung terkecil dan paling polos (kaciak berarti “kecil”), di bawah atap sederhana tanpa gonjong.' },
    fn: { en: 'Keeps seed rice for the next planting and rice to pay for working the fields.', id: 'Menyimpan benih untuk musim tanam berikutnya dan padi untuk membayar penggarapan sawah.' },
    meaning: { en: 'Small, but it holds the next harvest.', id: 'Kecil, tetapi menyimpan panen berikutnya.' },
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: 'Plain', id: 'Polos' }],
  }),
  {
    id: 'surau', def: surau, at: [20.5, 3], rot: -Math.PI / 2, zone: 'surau',
    name: 'Surau', alias: 'Surau kaum', en: { en: 'Prayer house', id: 'Surau' },
    desc: { en: 'A small hall on stilts under a two-tier ijuk roof, beside the house.', id: 'Bangunan panggung kecil beratap ijuk dua tingkat di samping rumah.' },
    fn: { en: 'A place of prayer and learning. Traditionally the boys and unmarried young men of the kaum slept here rather than in the house, learning religion, adat and silek (self-defence).', id: 'Tempat salat dan belajar. Secara tradisi, anak lelaki dan pemuda kaum yang belum menikah tidur di sini, bukan di rumah, sambil belajar agama, adat, dan silek (silat).' },
    meaning: { en: 'The house is the women’s; the surau is where boys grow into men of the kaum.', id: 'Rumah adalah milik kaum perempuan; surau adalah tempat anak lelaki tumbuh menjadi laki-laki kaum.' },
    specs: ['6.6 × 6.6 m', { en: '2-tier roof', id: 'Atap 2 tingkat' }],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'halaman',
    name: 'Halaman & Pagar', alias: 'Laman', en: { en: 'Yard, fence and path', id: 'Halaman, pagar, dan jalan' },
    desc: { en: 'The open yard in front of the house with its bamboo fence and stone path.', id: 'Halaman terbuka di depan rumah dengan pagar bambu dan jalan batunya.' },
    fn: { en: 'Space for drying rice, ceremonies and gatherings, enclosed by a light fence.', id: 'Tempat menjemur padi, upacara, dan berkumpul, dikelilingi pagar yang ringan.' },
    meaning: { en: 'The yard shows the rangkiang, and so the family’s prosperity, to every visitor.', id: 'Halaman memperlihatkan rangkiang, dan dengan itu kemakmuran keluarga, kepada setiap tamu.' },
    specs: [`${YARD.x1 - YARD.x0} × ${YARD.z1 - YARD.z0} m`],
  },
];

export default {
  loading: { en: 'Raising the gonjong…', id: 'Menegakkan gonjong…' },
  about: {
    title: { en: 'The Rumah Gadang of the Minangkabau', id: 'Rumah Gadang Minangkabau' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular house: a single-level rumah gadang with its rangkiang, surau and yard, put together to show the typical parts. No real compound matches it exactly, and the dimensions here are approximate.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah rumah tertentu: rumah gadang berlantai rata dengan rangkiang, surau, dan halamannya, disusun untuk memperlihatkan bagian-bagian yang khas. Tidak ada kompleks nyata yang persis sama, dan ukuran di sini merupakan perkiraan.' },
    paras: [
      { en: 'The Rumah Gadang (“big house”), also called Rumah Bagonjong, is the ancestral house of the Minangkabau of West Sumatra. Its roof sweeps up into sharp horn-like peaks called gonjong.', id: 'Rumah Gadang (“rumah besar”), disebut juga Rumah Bagonjong, adalah rumah leluhur orang Minangkabau di Sumatera Barat. Atapnya melengkung naik menjadi puncak-puncak runcing menyerupai tanduk yang disebut gonjong.' },
      { en: 'The Minangkabau are matrilineal: the house belongs to the women of the kaum (clan) and passes from mother to daughter. Married daughters each have a sleeping room (biliak) along the back of the house, while the long hall in front is shared.', id: 'Orang Minangkabau menganut sistem matrilineal: rumah adalah milik kaum perempuan dalam kaum (klan) dan diwariskan dari ibu ke anak perempuan. Setiap anak perempuan yang sudah menikah memiliki kamar tidur (biliak) di sepanjang bagian belakang rumah, sedangkan ruang panjang di depannya dipakai bersama.' },
      { en: 'The house is part of a compound. Rice barns (rangkiang), each with its own purpose, stand in the yard in front, and nearby the surau, where boys and young men traditionally slept and learned.', id: 'Rumah ini bagian dari sebuah kompleks. Lumbung-lumbung padi (rangkiang), masing-masing dengan tujuannya sendiri, berdiri di halaman depan, dan di dekatnya ada surau, tempat anak lelaki dan pemuda secara tradisi tidur dan belajar.' },
      { en: 'Styles vary by adat tradition. Houses of the Koto Piliang tradition have raised floors (anjuang) at both ends, while Bodi Caniago houses keep one level.', id: 'Gaya rumah berbeda menurut kelarasan adat. Rumah dalam tradisi Koto Piliang memiliki lantai yang ditinggikan (anjuang) di kedua ujungnya, sedangkan rumah Bodi Caniago berlantai rata.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 3.3,
    views: { inside: { pos: [0, 1.7, 24], target: [0, 4.5, 0] } },
    overlay: {
      x0: YARD.x0, x1: YARD.x1,
      zones: [
        { zone: 'rumah', x0: -12, x1: 12.5, z0: -7, z1: 8.6, text: { en: 'Rumah · the women’s house', id: 'Rumah · rumah kaum perempuan' } },
        { zone: 'rangkiang', x0: -12, x1: 12.5, z0: 8.6, z1: 16, text: { en: 'Rangkiang · the kaum’s rice', id: 'Rangkiang · padi milik kaum' } },
        { zone: 'surau', x0: 15, x1: 26, z0: -3, z1: 9, text: { en: 'Surau · men and boys', id: 'Surau · laki-laki dan anak lelaki' } },
      ],
    },
    walk: {
      stops: [
        {
          title: 'Rumah Gadang', local: { en: 'The great house', id: 'Rumah besar' },
          pos: [0, 1.7, 25], target: [0, 5.5, 0],
          text: { en: 'From the gate, the long house fills the view: carved walls leaning outward under a roof that sweeps up into gonjong. It is the house of the women of the kaum.', id: 'Dari gerbang, rumah panjang memenuhi pandangan: dinding berukir yang condong ke luar di bawah atap yang melengkung naik menjadi gonjong. Inilah rumah kaum perempuan.' },
        },
        {
          title: 'Rangkiang', local: { en: 'The rice barns', id: 'Lumbung padi' }, buildings: ['rangkiang_sitinjau', 'rangkiang_sibayau', 'rangkiang_sitangguang', 'rangkiang_kaciak'],
          pos: [-8.5, 2.0, 19], target: [-1, 3.0, 12.5],
          text: { en: 'Four barns stand in the yard, each with its own purpose: rice for trade, for daily meals, against hunger, and seed for the next planting. Together they show how the kaum provides for its own.', id: 'Empat lumbung berdiri di halaman, masing-masing dengan tujuannya: padi untuk berdagang, untuk makan sehari-hari, untuk menangkal lapar, dan benih untuk musim tanam berikutnya. Bersama-sama, keempatnya menunjukkan bagaimana kaum menghidupi anggotanya.' },
        },
        {
          title: 'Tangga', local: { en: 'Up to the house', id: 'Naik ke rumah' },
          pos: [2.4, 1.7, 10.6], target: [0, 2.8, 5.4],
          text: { en: 'A stair climbs to the small porch under its own gonjong. Traditionally a jar of water stood by the steps so that visitors could wash their feet before going in.', id: 'Tangga naik ke beranda kecil di bawah gonjongnya sendiri. Secara tradisi, sebuah tempayan air diletakkan di dekat tangga agar tamu dapat membasuh kaki sebelum masuk.' },
        },
        {
          title: { en: 'The long hall', id: 'Ruang panjang' }, local: { en: 'Shared by the family', id: 'Dipakai bersama keluarga' },
          pos: [-6.6, 3.6, 2.6], target: [5, 3.0, -1.3], via: [[0, 3.0, 6.4], [0, 3.0, 2.6]],
          text: { en: 'Inside, the hall runs the length of the house between rows of columns. Daily life, meals and ceremonies happen here, in the shared front part of the house.', id: 'Di dalam, ruang membentang sepanjang rumah di antara deretan tiang. Kehidupan sehari-hari, makan bersama, dan upacara berlangsung di sini, di bagian depan rumah yang dipakai bersama.' },
        },
        {
          title: 'Biliak', local: { en: 'The daughters’ rooms', id: 'Kamar anak perempuan' },
          pos: [-3.4, 3.4, 1.4], target: [-4.8, 2.9, -2.6],
          text: { en: 'Along the back wall, each bay holds a small room. Every married daughter has her own biliak, where her husband comes to live with her: the house belongs to its women.', id: 'Di sepanjang dinding belakang, setiap ruang di antara tiang berisi sebuah kamar kecil. Setiap anak perempuan yang sudah menikah memiliki biliaknya sendiri, tempat suaminya datang dan tinggal bersamanya: rumah ini milik kaum perempuannya.' },
        },
        {
          title: 'Surau', local: { en: 'Where boys become men', id: 'Tempat anak lelaki menjadi dewasa' }, buildings: ['surau'],
          pos: [11.5, 1.9, 10], target: [20.5, 3.2, 3],
          text: { en: 'Beside the house stands the surau. Boys and young men of the kaum traditionally slept here rather than at home, learning religion, adat and silek.', id: 'Di samping rumah berdiri surau. Secara tradisi, anak lelaki dan pemuda kaum tidur di sini, bukan di rumah, sambil belajar agama, adat, dan silek.' },
        },
        {
          title: { en: 'The compound', id: 'Kompleks' }, local: { en: 'Reading the whole', id: 'Membaca keseluruhan' }, overlay: true,
          pos: [-24, 28, 36], target: [3, 2, 4],
          text: { en: 'From above: the women’s house at the centre, the kaum’s rice in front of it, and the surau of the men and boys to the side, all within one yard.', id: 'Dari atas: rumah kaum perempuan di tengah, padi milik kaum di depannya, dan surau kaum laki-laki di sampingnya, semuanya dalam satu halaman.' },
        },
      ],
    },
  },

  slots: [
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'ukiran', label: 'Ukiran', tex: 'ukiran' },
    { id: 'accent', label: { en: 'Shutters', id: 'Daun jendela' }, tex: 'wood' },
    { id: 'thatch', label: 'Ijuk', tex: 'thatch', clay: '#d9d2c6' },
    { id: 'metal', label: { en: 'Finials', id: 'Puncak logam' }, tex: null, glossy: true, clay: '#d6cdbf' },
    { id: 'bamboo', label: 'Sasak', tex: 'bamboo' },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'plank', label: { en: 'Floor', id: 'Lantai' }, tex: 'wood' },
    { id: 'ground', label: { en: 'Yard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: { en: 'Tradisional · ijuk & ukiran', id: 'Tradisional · ijuk & ukiran' }, rough: 0.82, metal: { metal: 0.75 },
      colors: { wood: '#4b2e20', ukiran: '#ffffff', accent: '#8f2b1e', thatch: '#3b332d', metal: '#b9953f', bamboo: '#c9a773', stone: '#8a857c', plank: '#6e4a31', ground: '#a8a07c' },
    },
    seng: {
      label: { en: 'Atap seng · zinc roof', id: 'Atap seng' }, rough: 0.6, metal: { metal: 0.75, thatch: 0.6 }, tex: { thatch: null },
      colors: { wood: '#5a3a28', ukiran: '#f3eadf', accent: '#7a2a20', thatch: '#8d949b', metal: '#a9adb2', bamboo: '#c9a773', stone: '#8a857c', plank: '#7a5238', ground: '#a8a07c' },
    },
    istano: {
      label: { en: 'Istano · gilded carving', id: 'Istano · ukiran berprada' }, rough: 0.5, metal: { metal: 0.85, accent: 0.5 },
      colors: { wood: '#3a2016', ukiran: '#ffe6b3', accent: '#b88a2e', thatch: '#2c2622', metal: '#d4ab4c', bamboo: '#b89260', stone: '#77736c', plank: '#5b3a26', ground: '#9d9474' },
    },
  },
};
