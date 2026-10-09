// Joglo Pencu (Kudus): a Kudus Kulon house plot. The omah on the north side faces south
// across the yard to the pekiwan and sisir, with the pawon beside it and a wall all round.
// Site coordinates: south (the way the house faces) is +z.
import omah from './omah.js';
import pawon from './pawon.js';
import pekiwan from './pekiwan.js';
import sisir from './sisir.js';
import pagar from './pagar.js';

const ZONES = [
  { id: 'omah',    label: { en: 'House', id: 'Rumah' },              local: 'Omah',    color: '#cf5b3f' },
  { id: 'pawon',   label: { en: 'Kitchen', id: 'Dapur' },            local: 'Pawon',   color: '#e08a4a' },
  { id: 'servis',  label: { en: 'Well & work', id: 'Sumur & kerja' }, local: 'Pekiwan', color: '#7fa37a' },
  { id: 'batas',   label: { en: 'Wall & yard', id: 'Pagar & halaman' }, local: 'Pagar', color: '#9a948a' },
];

const BUILDINGS = [
  {
    id: 'omah', def: omah, at: [0, -6], rot: 0, zone: 'omah',
    name: 'Omah Pencu', alias: 'Jogosatru · dalem · gedongan', en: { en: 'The main house', id: 'Rumah induk' },
    desc: { en: 'The main house under the tall pencu roof: the jogosatru behind the carved front wall, then the raised dalem with the rong-rongan and, at the back, the gedongan.', id: 'Rumah induk di bawah atap pencu yang menjulang: jogosatru di balik dinding depan berukir, lalu dalem yang ditinggikan dengan rong-rongan dan, di bagian belakang, gedongan.' },
    fn: { en: 'The jogosatru is where guests are received; the dalem and gedongan are for the family.', id: 'Jogosatru adalah tempat menerima tamu; dalem dan gedongan untuk keluarga.' },
    meaning: { en: 'Carving shows the owner’s standing, and it is richest where guests sit and in the gedongan, the most sacred room.', id: 'Ukiran menunjukkan kedudukan pemilik rumah, dan paling kaya di tempat tamu duduk serta di gedongan, ruang paling sakral.' },
    specs: ['12.6 × 11.4 m', { en: 'Pencu roof', id: 'Atap pencu' }, { en: 'Faces south', id: 'Menghadap selatan' }],
  },
  {
    id: 'pawon', def: pawon, at: [-10.1, -4.2], rot: 0, zone: 'pawon',
    name: 'Pawon', alias: 'Pawon', en: { en: 'Kitchen and everyday wing', id: 'Dapur dan sayap keseharian' },
    desc: { en: 'A separate building beside the omah, with the same gebyok pattern on its front and a steep kampung roof with a lean-to in front.', id: 'Bangunan tersendiri di samping omah, dengan pola gebyok yang sama di bagian depannya dan atap kampung yang curam dengan sosoran di depan.' },
    fn: { en: 'Cooking and the family’s daily activity. Some houses have a pawon on each side of the omah.', id: 'Memasak dan kegiatan sehari-hari keluarga. Sebagian rumah memiliki pawon di kedua sisi omah.' },
    meaning: { en: 'The active part of the house, next to the quiet dalem and the formal jogosatru.', id: 'Bagian rumah yang aktif, di samping dalem yang tenang dan jogosatru yang resmi.' },
    specs: ['6.1 × 7.7 m', { en: 'Kampung roof', id: 'Atap kampung' }],
  },
  {
    id: 'pekiwan', def: pekiwan, at: [-10.1, 10.6], rot: Math.PI, zone: 'servis',
    name: 'Pekiwan', alias: 'Sumur & bilik mandi', en: { en: 'Well and bathing rooms', id: 'Sumur dan bilik mandi' },
    desc: { en: 'The well and two roofed bathing rooms, across the yard in front of the pawon.', id: 'Sumur dan dua bilik mandi beratap, di seberang halaman di depan pawon.' },
    fn: { en: 'Water for bathing, washing and cooking.', id: 'Air untuk mandi, mencuci, dan memasak.' },
    meaning: { en: 'Unlike the Yogyakarta joglo, where the well is at the back, here it faces the house across the yard.', id: 'Berbeda dengan joglo Yogyakarta yang sumurnya di belakang, di sini sumur berhadapan dengan rumah di seberang halaman.' },
    specs: [{ en: 'Well', id: 'Sumur' }, { en: '2 bathing rooms', id: '2 bilik mandi' }],
  },
  {
    id: 'sisir', def: sisir, at: [3.4, 10.4], rot: Math.PI, zone: 'servis',
    name: 'Sisir', alias: 'Sisir', en: { en: 'Workshop and store', id: 'Tempat kerja dan gudang' },
    desc: { en: 'A plain timber outbuilding across the yard from the omah. Not every house has one.', id: 'Bangunan pelengkap dari kayu yang polos di seberang halaman dari omah. Tidak setiap rumah memilikinya.' },
    fn: { en: 'Work and storage, and in some houses a place of business.', id: 'Tempat kerja dan penyimpanan, dan pada sebagian rumah menjadi tempat usaha.' },
    meaning: { en: 'The pencu houses were built by the merchants of Kudus, and the sisir kept their trade close to home.', id: 'Rumah-rumah pencu dibangun oleh para pedagang Kudus, dan sisir mendekatkan usaha mereka ke rumah.' }, interp: true,
    specs: ['8.4 × 4.6 m', { en: 'Kampung roof', id: 'Atap kampung' }],
  },
  {
    id: 'pagar', def: pagar, at: [0, 0], rot: 0, zone: 'batas',
    name: 'Pagar & Halaman', alias: 'Pagar kilungan, lawang, latar', en: { en: 'Wall, gate and yard', id: 'Pagar, gerbang, dan halaman' },
    desc: { en: 'The wall around the plot, a side gate from the lane, and the open yard in the middle.', id: 'Tembok yang mengelilingi kapling, gerbang samping dari gang, dan halaman terbuka di tengahnya.' },
    fn: { en: 'Enclose the household and give it its own open ground.', id: 'Melingkupi rumah tangga dan memberinya tanah lapang sendiri.' },
    meaning: { en: 'The yard sits in the middle of the plot, with the house on its north side looking south over it.', id: 'Halaman berada di tengah kapling, dengan rumah di sisi utaranya yang memandang ke selatan melintasinya.' },
    specs: ['25 × 28 m', { en: '1 gate', id: '1 gerbang' }],
  },
];

export default {
  loading: { en: 'Raising the pencu…', id: 'Mendirikan pencu…' },
  about: {
    title: { en: 'The Joglo Pencu of Kudus', id: 'Joglo Pencu Kudus' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular house. It combines the plan and details of three Kudus houses described by Iswanto and Sardjono (2013) with general descriptions of the type. No real house matches it exactly: they vary in size, materials and which buildings they have, and the dimensions here are our own estimates.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah rumah tertentu. Model ini memadukan denah dan detail tiga rumah Kudus yang diuraikan Iswanto dan Sardjono (2013) dengan uraian umum tentang tipe ini. Tidak ada rumah nyata yang persis sama: semuanya beragam dalam ukuran, bahan, dan bangunan yang dimiliki, dan ukuran di sini adalah perkiraan kami sendiri.' },
    paras: [
      { en: 'The traditional house of Kudus, on the north coast of Central Java, is a joglo with an unusually tall, pointed central roof. People in Kudus call it omah pencu: pencu means rising to a peak, and is also the word for the raised boss in the middle of a gong. Most surviving examples stand in Kudus Kulon, the old town around the Menara mosque, and were built by the town’s Muslim merchant families.', id: 'Rumah tradisional Kudus, di pesisir utara Jawa Tengah, adalah joglo dengan atap tengah yang sangat tinggi dan runcing. Orang Kudus menyebutnya omah pencu: pencu berarti memuncak atau menjulang, dan juga sebutan untuk tonjolan di tengah gong. Sebagian besar yang tersisa berdiri di Kudus Kulon, kota lama di sekitar Masjid Menara, dan dibangun oleh keluarga pedagang muslim kota itu.' },
      { en: 'Unlike the Yogyakarta joglo, it is not a chain of pavilions. The main building faces south, its back to Mount Muria, on the north side of its plot. Behind its carved front wall is the jogosatru, where guests are received. A finer carved wall separates it from the raised dalem, where four soko guru carry the rong-rongan and, at the back, the gedongan is the most private room. The pawon stands beside it; across the yard are the pekiwan with the well and, in some houses, a sisir for work.', id: 'Berbeda dengan joglo Yogyakarta, rumah ini bukan rangkaian pendapa. Bangunan utamanya menghadap ke selatan, membelakangi Gunung Muria, di sisi utara kaplingnya. Di balik dinding depan berukir ada jogosatru, tempat menerima tamu. Dinding berukir yang lebih halus memisahkannya dari dalem yang ditinggikan, tempat empat soko guru memikul rong-rongan dan, di bagian belakang, gedongan menjadi ruang paling privat. Pawon berdiri di sampingnya; di seberang halaman ada pekiwan dengan sumurnya dan, pada sebagian rumah, sisir untuk bekerja.' },
      { en: 'Kudus houses are known above all for their carving: mostly plant and geometric motifs, with animals rare and heavily stylised. The carving is richest in the jogosatru and the gedongan. Many houses have been sold and taken apart for their gebyok, which also gave rise to a local industry making new ones.', id: 'Rumah Kudus terkenal terutama karena ukirannya: kebanyakan motif tumbuhan dan geometris, dengan bentuk hewan yang jarang dan sangat distilasi. Ukirannya paling kaya di jogosatru dan gedongan. Banyak rumah telah dijual dan dibongkar demi gebyoknya, yang juga melahirkan industri setempat pembuat gebyok baru.' },
    ],
    // Checked sources (see docs/content-review/joglo-pencu.md), and books not yet checked.
    sources: [
      { text: 'Iswanto, D., & Sardjono, A. B. (2013). Ornamentasi rumah tradisional Kudus: perkembangan dan penerapannya. MODUL 13(2), 77–88.', url: 'https://ejournal.undip.ac.id/index.php/modul/article/view/5380' },
      { text: 'Nazaruddin, I. (2012). Rumah Pencu di Kudus: kajian berdasarkan tipologi dan pola sebaran. Berkala Arkeologi 32(1), 51–64.', url: 'https://ejournal.brin.go.id/berkalaarkeologi/article/view/4581' },
      { text: 'Rofian (2015). Pemanfaatan unsur-unsur arsitektur rumah tradisional sebagai upaya menegaskan identitas pada bangunan modern di Kudus. Catharsis 4(1).', url: 'https://journal.unnes.ac.id/sju/catharsis/article/view/6829' },
      { text: 'Dinas Kebudayaan DIY. Mengenal Bangunan Berarsitektur Tradisional Jawa: Ander, Geganja dan Santen.', url: 'https://budaya.jogjaprov.go.id/artikel/detail/Mengenal-Bangunan-Berarsitektur-Tradisional-Jawa-Ander-Geganja-dan-Santen' },
      { text: { en: 'Rumah Adat Kudus Joglo Pencu (undergraduate thesis), UIN Sunan Kalijaga.', id: 'Rumah Adat Kudus Joglo Pencu (skripsi), UIN Sunan Kalijaga.' }, url: 'https://digilib.uin-suka.ac.id/id/eprint/48095/' },
    ],
    reading: [
      { text: 'Prijotomo, J. (2006). (Re-)Konstruksi Arsitektur Jawa: Griya Jawa dalam Tradisi Tanpatulisan. Surabaya: Wastu Lanas Grafika.' },
      { text: { en: 'Triyanto (1992). Makna Ruang dan Penataannya dalam Arsitektur Rumah Kudus. Thesis, Universitas Indonesia.', id: 'Triyanto (1992). Makna Ruang dan Penataannya dalam Arsitektur Rumah Kudus. Tesis, Universitas Indonesia.' } },
      { text: { en: 'Sardjono, A. B. (1996). Rumah-rumah di Kota Lama Kudus. Thesis, Universitas Gadjah Mada.', id: 'Sardjono, A. B. (1996). Rumah-rumah di Kota Lama Kudus. Tesis, Universitas Gadjah Mada.' } },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.6,
    views: { inside: { pos: [-3.6, 1.65, 7.4], target: [0, 4.4, -5] } },
    // Guided walk from the lane into the gedongan. pos/target are camera position and look-at
    // point in site coordinates (eye level ≈ floor + 1.65 m).
    walk: {
      stops: [
        {
          title: 'Lawang', local: { en: 'In from the lane', id: 'Masuk dari gang' }, buildings: ['pagar'],
          pos: [16.8, 1.65, 4.0], target: [6, 2.6, 3.4],
          text: { en: 'In the old town of Kudus Kulon, plots are walled and reached from narrow lanes. This house is entered through a small gate in the side wall.', id: 'Di kota lama Kudus Kulon, kapling-kapling berpagar tembok dan dicapai lewat gang-gang sempit. Rumah ini dimasuki melalui gerbang kecil di tembok samping.' },
        },
        {
          title: 'Halaman', local: { en: 'The yard', id: 'Halaman' },
          pos: [-3.6, 1.65, 7.4], target: [0, 5.4, -5],
          text: { en: 'The yard is in the middle of the plot. The house stands on its north side and faces south, with its back to Mount Muria. Its tall pencu roof rises over the middle.', id: 'Halaman berada di tengah kapling. Rumah berdiri di sisi utaranya dan menghadap ke selatan, membelakangi Gunung Muria. Atap pencunya yang tinggi menjulang di tengah.' },
        },
        {
          title: 'Tritisan', local: { en: 'The porch', id: 'Teras' },
          pos: [1.6, 1.75, 3.4], target: [-0.3, 2.2, -0.6],
          text: { en: 'Under the eaves, carried on konsol brackets, is the carved front wall: a butterfly double door in the middle, and either side a sliding gebyok behind a lattice kere screen.', id: 'Di bawah tritisan yang dipikul konsol terdapat dinding depan berukir: pintu kupu tarung di tengah, dan di kedua sisinya gebyok geser di balik kisi-kisi kere.' },
        },
        {
          title: 'Jogosatru', local: { en: 'Where guests are received', id: 'Tempat menerima tamu' },
          pos: [3.8, 2.35, -1.3], target: [0, 2.6, -3.3], via: [[0, 2.2, 2.2], [0, 2.3, -1.0]],
          text: { en: 'Guests are received in the jogosatru. They face the gebyok of the dalem, carved more finely than the front. Next to its door stands a single post, the tiang tunggal, under the end of a large bracket.', id: 'Tamu diterima di jogosatru. Mereka menghadap gebyok dalem, yang ukirannya lebih halus daripada dinding depan. Di dekat pintunya berdiri sebuah tiang tunggal, di bawah ujung konsol yang besar.' },
        },
        {
          title: 'Dalem', local: { en: 'Under the pencu', id: 'Di bawah pencu' },
          pos: [1.6, 2.8, -3.8], target: [0, 5.4, -6.8], via: [[0, 2.5, -2.6]],
          text: { en: 'Step up through the door onto the timber floor of the dalem. Look up: the four soko guru carry the rong-rongan, three courses stepping out and then many more stepping back in, under the tall pencu.', id: 'Naiklah melalui pintu ke lantai kayu dalem. Lihat ke atas: empat soko guru memikul rong-rongan, tiga susun berundak ke luar lalu lebih banyak lagi berundak ke dalam, di bawah pencu yang tinggi.' },
        },
        {
          title: 'Gedongan', local: { en: 'The innermost room', id: 'Ruang terdalam' },
          pos: [0, 2.8, -4.4], target: [0, 3.0, -9.6],
          text: { en: 'Behind the rong-rongan is the gedongan, the most sacred room, where the parents slept and kept their valuables. Its sliding door sits under a large carved crest.', id: 'Di belakang rong-rongan ada gedongan, ruang paling sakral, tempat orang tua tidur dan menyimpan harta benda. Pintu gesernya berada di bawah hiasan jenggeran yang besar.' },
        },
        {
          title: 'Pawon & Pekiwan', local: { en: 'Kitchen and well', id: 'Dapur dan sumur' }, buildings: ['pawon', 'pekiwan'],
          pos: [2.6, 3.4, 2.6], target: [-10, 1.5, 2.6], via: [[0, 2.5, -2.6], [0, 2.3, -1.0], [0, 2.2, 2.2]],
          text: { en: 'Beside the omah is the pawon, the kitchen. Across the yard in front of it is the pekiwan, with the well and two bathing rooms.', id: 'Di samping omah ada pawon, dapurnya. Di seberang halaman di depannya ada pekiwan, dengan sumur dan dua bilik mandi.' },
        },
        {
          title: 'Sisir', local: { en: 'Work and trade', id: 'Kerja dan usaha' }, buildings: ['sisir'],
          pos: [-2.4, 3.2, 1.8], target: [3.4, 1.4, 10.4],
          text: { en: 'Some houses also have a sisir across the yard, used for work and storage, and sometimes as a place of business for the merchant household.', id: 'Sebagian rumah juga memiliki sisir di seberang halaman, untuk bekerja dan menyimpan barang, dan kadang menjadi tempat usaha keluarga pedagang.' },
        },
        {
          title: { en: 'The whole plot', id: 'Seluruh kapling' }, local: { en: 'House, yard and outbuildings', id: 'Rumah, halaman, dan bangunan pelengkap' },
          pos: [24, 30, 34], target: [-2, 0, 0],
          text: { en: 'From above: the omah on the north side under its pencu, the pawon beside it, and the yard between them and the pekiwan and sisir, all inside one wall.', id: 'Dari atas: omah di sisi utara di bawah pencunya, pawon di sampingnya, dan halaman di antara keduanya dengan pekiwan serta sisir, semuanya di dalam satu tembok.' },
        },
      ],
    },
  },

  // Material slots shared by every building. `tex` names a texture in engine/materials.js.
  slots: [
    { id: 'wood', label: { en: 'Teak', id: 'Jati' }, tex: 'wood' },
    { id: 'carved', label: { en: 'Carving', id: 'Ukiran' }, tex: 'wood' },
    { id: 'accent', label: 'Prada', tex: 'wood', glossy: true },
    { id: 'roof', label: { en: 'Tiles', id: 'Genteng' }, tex: 'tile', clay: '#dcd4c8' },
    { id: 'ornament', label: { en: 'Crowns', id: 'Mahkota' }, tex: null, clay: '#d6cdbf' },
    { id: 'plaster', label: { en: 'Walls', id: 'Dinding' }, tex: 'stone', clay: '#f1eee8' },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'floor', label: { en: 'Floor', id: 'Lantai' }, tex: 'floor', clay: '#f3f0ea' },
    { id: 'plank', label: { en: 'Planks', id: 'Papan' }, tex: 'wood', ui: false },
    { id: 'bamboo', label: { en: 'Sacks', id: 'Karung' }, tex: 'bamboo', ui: false },
    { id: 'ground', label: { en: 'Yard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    natural: {
      label: { en: 'Jati alami · natural teak', id: 'Jati alami' }, rough: 0.72, metal: { accent: 0.1 },
      colors: { wood: '#8b5a32', carved: '#76462a', accent: '#a8773f', roof: '#a95a3c', ornament: '#9c4a30', plaster: '#ebe4d6', stone: '#8a857c', floor: '#a8604a', plank: '#9c7049', bamboo: '#c9a773', ground: '#c7b594' },
    },
    prada: {
      label: { en: 'Prada · gilded carving', id: 'Prada · ukiran berprada' }, rough: 0.55, metal: { accent: 0.85 },
      colors: { wood: '#6a4026', carved: '#5a3420', accent: '#d8aa4c', roof: '#9a4a32', ornament: '#b98a3c', plaster: '#f2eee6', stone: '#6d6a64', floor: '#c9c1b2', plank: '#77553c', bamboo: '#c2a06c', ground: '#d4c6a8' },
    },
    aged: {
      label: { en: 'Sepuh · weathered', id: 'Sepuh · lapuk dimakan usia' }, rough: 0.92, metal: {},
      colors: { wood: '#6d5a48', carved: '#5c4c3e', accent: '#7a6650', roof: '#6e5046', ornament: '#6e5046', plaster: '#b9b1a3', stone: '#5f625e', floor: '#8f877a', plank: '#83705b', bamboo: '#9c8a6c', ground: '#a39479' },
    },
    modern: {
      label: { en: 'Kontemporer · dark stain', id: 'Kontemporer · pelitur gelap' }, rough: 0.6, metal: { accent: 0.3 },
      colors: { wood: '#3a2a20', carved: '#33251c', accent: '#b08a55', roof: '#4a4f55', ornament: '#4a4f55', plaster: '#f4f2ee', stone: '#a3a39e', floor: '#e6e3dd', plank: '#59483b', bamboo: '#b7a079', ground: '#d8d4cc' },
    },
  },
};
