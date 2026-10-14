// Mbaru Niang (Wae Rebo, Manggarai, Flores): seven cone houses standing in an open circle
// around the compang. The drum house (niang gendang) is in the middle of the arc, facing the
// altar, with three niang gena on either side.
// Site coordinates: the compang is at the origin; the drum house stands at −z and faces +z.
import { makeNiang } from './niang.js';
import { compang, ground, RING, GROUND } from './village.js';

const ZONES = [
  { id: 'gendang', label: { en: 'Drum house', id: 'Rumah gendang' }, local: 'Niang gendang', color: '#b0624a' },
  { id: 'gena',    label: { en: 'Houses', id: 'Rumah-rumah' },      local: 'Niang gena',    color: '#c58a4a' },
  { id: 'compang', label: { en: 'Altar', id: 'Altar' },             local: 'Compang',       color: '#8d8a82' },
  { id: 'tanah',   label: { en: 'Ground', id: 'Tanah' },            local: 'Halaman',       color: '#7f8a6a' },
];

const MAIN = { r: 7, top: 15 }, GENA = { r: 5.5, top: 12.5 };
const deg = (d) => (d * Math.PI) / 180;
// A house on the ring at angle a (0 = behind the compang), turned to face the centre.
const place = (a) => ({ at: [RING * Math.sin(deg(a)), -RING * Math.cos(deg(a))], rot: -deg(a) });

const GENA_TEXT = {
  zone: 'gena', alias: 'Mbaru gena', en: { en: 'Companion house', id: 'Rumah pendamping' },
  desc: { en: 'A cone house built exactly like the drum house but smaller, 11 m across.', id: 'Rumah kerucut yang dibangun persis seperti rumah gendang tetapi lebih kecil, bergaris tengah 11 m.' },
  fn: { en: 'Home to six families of the village.', id: 'Dihuni enam keluarga kampung.' },
  meaning: { en: 'Three of these stand on each side of the drum house, and each has a name of its own.', id: 'Tiga rumah seperti ini berdiri di tiap sisi rumah gendang, dan masing-masing memiliki nama sendiri.' },
  specs: [{ en: `Ø ${2 * GENA.r} m`, id: `Ø ${2 * GENA.r} m` }, { en: `Peak +${GENA.top} m`, id: `Puncak +${GENA.top} m` }, { en: '5 levels', id: '5 tingkat' }],
};
// Clockwise as seen from above, after Suhandi et al. (2022).
const GENAS = [['mandok', 'Mandok', -87], ['jekong', 'Jekong', -59], ['ndorom', 'Ndorom', -31], ['pirung', 'Pirung', 31], ['jintam', 'Jintam', 59], ['maro', 'Maro', 87]];

const BUILDINGS = [
  {
    id: 'gendang', def: makeNiang({ ...MAIN, rooms: 8, main: true, seed: 50 }), ...place(0), zone: 'gendang',
    name: 'Niang Gendang', alias: 'Mbaru gendang', en: { en: 'Drum house', id: 'Rumah gendang' },
    desc: { en: 'The largest house, 14 m across, standing in the middle of the row directly opposite the compang.', id: 'Rumah terbesar, bergaris tengah 14 m, berdiri di tengah deretan tepat berhadapan dengan compang.' },
    fn: { en: 'The centre of ceremonies and meetings. The elders live here, and the village’s drums, gongs and heirlooms are kept here.', id: 'Pusat upacara dan musyawarah. Para tetua tinggal di sini, dan gendang, gong, serta pusaka kampung disimpan di sini.' },
    meaning: { en: 'It differs from the others in size, use, position and signs: a gong hangs at its door and buffalo horns crown its roof.', id: 'Rumah ini berbeda dari yang lain dalam ukuran, fungsi, letak, dan tanda: sebuah gong tergantung di pintunya dan tanduk kerbau memahkotai atapnya.' },
    specs: [{ en: `Ø ${2 * MAIN.r} m`, id: `Ø ${2 * MAIN.r} m` }, { en: `Peak +${MAIN.top} m`, id: `Puncak +${MAIN.top} m` }, { en: '5 levels', id: '5 tingkat' }],
  },
  ...GENAS.map(([id, name, a], i) => ({ id: `gena_${id}`, def: makeNiang({ ...GENA, rooms: 6, seed: 51 + i }), ...place(a), name: `Niang Gena ${name}`, ...GENA_TEXT })),
  {
    id: 'compang', def: compang, at: [0, 0], rot: 0, zone: 'compang',
    name: 'Compang', alias: 'Altar kampung', en: { en: 'Village altar', id: 'Altar kampung' },
    desc: { en: 'A round platform of earth and stone at the centre of the village.', id: 'Pelataran bundar dari tanah dan batu di pusat kampung.' },
    fn: { en: 'Used for ceremonies honouring God and the ancestors.', id: 'Dipakai untuk upacara memuliakan Tuhan dan para leluhur.' },
    meaning: { en: 'The sacred centre: the seven houses are arranged around it.', id: 'Pusat yang sakral: tujuh rumah ditata mengelilinginya.' },
    specs: [{ en: 'Ø ≈ 7 m', id: 'Ø ≈ 7 m' }],
  },
  {
    id: 'halaman', def: ground, at: [0, 0], rot: 0, zone: 'tanah',
    name: 'Halaman Kampung', alias: 'Lapangan tengah', en: { en: 'Village green', id: 'Halaman kampung' },
    desc: { en: 'The open ground between the houses and around the compang.', id: 'Tanah lapang di antara rumah-rumah dan di sekeliling compang.' },
    fn: { en: 'The shared space of the village, where everyone gathers for ceremonies.', id: 'Ruang bersama kampung, tempat semua orang berkumpul untuk upacara.' },
    meaning: { en: 'Every door opens onto it.', id: 'Semua pintu membuka ke arahnya.' },
    specs: [{ en: `Ø ${2 * GROUND} m`, id: `Ø ${2 * GROUND} m` }],
  },
];

export default {
  loading: { en: 'Tying the roof…', id: 'Mengikat atap…' },
  about: {
    title: { en: 'The Mbaru Niang of Wae Rebo', id: 'Mbaru Niang Wae Rebo' },
    method: { en: 'This is a reconstruction of an ideal type based on one village, Wae Rebo. The diameters, the counts of posts and ribs and the materials follow the study by Danong and others (2023); the names and order of the houses follow Suhandi and others (2022). No measured drawings were available to us, so the heights, the spacing of the levels and the size of the village circle are our own estimates.', id: 'Ini adalah rekonstruksi tipe ideal yang berdasarkan satu kampung, Wae Rebo. Garis tengah, jumlah tiang dan rusuk, serta bahannya mengikuti kajian Danong dkk. (2023); nama dan urutan rumah mengikuti Suhandi dkk. (2022). Kami tidak memperoleh gambar terukur, sehingga tinggi, jarak antartingkat, dan ukuran lingkaran kampung adalah perkiraan kami sendiri.' },
    paras: [
      { en: 'Mbaru niang is the cone-shaped house of the Manggarai of western Flores. It is the general form of the traditional Manggarai house, and the best-known surviving village of them is Wae Rebo, in a mountain hollow about 1,200 m above the sea that is still reached on foot.', id: 'Mbaru niang adalah rumah berbentuk kerucut orang Manggarai di Flores bagian barat. Inilah bentuk umum rumah adat Manggarai, dan kampung yang paling dikenal yang masih mempertahankannya adalah Wae Rebo, di cekungan pegunungan sekitar 1.200 m di atas laut yang hingga kini dicapai dengan berjalan kaki.' },
      { en: 'Seven houses stand in an open circle around the compang, a round altar of earth and stone. One is the niang gendang, the drum house, where the elders live and ceremonies are held; the other six are niang gena. The seven houses are said to answer to seven mountain peaks around the village.', id: 'Tujuh rumah berdiri dalam lingkaran terbuka mengelilingi compang, altar bundar dari tanah dan batu. Satu di antaranya adalah niang gendang, rumah gendang, tempat para tetua tinggal dan upacara diadakan; enam lainnya adalah niang gena. Ketujuh rumah itu dikatakan sepadan dengan tujuh puncak gunung di sekitar kampung.' },
      { en: 'A niang has no walls: the roof of grass and palm fibre comes down almost to the ground. Inside are five levels. Families live on the first, the lutur, around a single hearth. Above it are lobo for food and goods, lentar for seed, lempa rae for reserves against a bad year, and hekang kode, at the top, for offerings to the ancestors.', id: 'Niang tidak berdinding: atap dari alang-alang dan ijuk turun hingga hampir menyentuh tanah. Di dalamnya ada lima tingkat. Keluarga-keluarga tinggal di tingkat pertama, lutur, mengelilingi satu tungku. Di atasnya ada lobo untuk makanan dan barang, lentar untuk benih, lempa rae untuk cadangan masa paceklik, dan hekang kode, di puncak, untuk sesaji bagi leluhur.' },
      { en: 'The frame is worok wood and bamboo, tied with rattan and without nails. By 2008 only four houses were left. Between 2008 and 2011 the villagers rebuilt the missing ones with the architect Yori Antar and the Rumah Asuh foundation, passing the method on to a new generation as they worked.', id: 'Rangkanya dari kayu worok dan bambu, diikat rotan tanpa paku. Pada 2008 hanya empat rumah yang tersisa. Antara 2008 dan 2011 warga membangun kembali rumah-rumah yang hilang bersama arsitek Yori Antar dan Yayasan Rumah Asuh, sambil mewariskan cara membangunnya kepada generasi baru.' },
    ],
    // Checked sources (see docs/content-review/mbaru-niang.md), and books not yet checked.
    sources: [
      { text: 'Danong, M. T., Nono, K. M., Boro, T. L., Ruma, M. T. L., & Jemida, M. K. (2023). Pemanfaatan jenis-jenis tumbuhan bahan bangunan rumah adat mbaru niang Kampung Wae Rebo. Jurnal Biotropikal Sains 20(3), 53–62.', url: 'https://ejurnal.undana.ac.id/index.php/biotropikal' },
      { text: 'Pantas, J. V. N. (2022). Kriteria desain transformasi konstruksi mbaru niang bertingkat. Prosiding Seminar Intelektual Muda #8, Universitas Trisakti, 84–89.', url: 'https://e-journal.trisakti.ac.id/index.php/sim/article/view/16337' },
      { text: { en: 'Waerebo. Wikipedia (for the works it cites: Suhandi et al. 2022; Beeh 2017).', id: 'Waerebo. Wikipedia (untuk karya yang dirujuknya: Suhandi dkk. 2022; Beeh 2017).' }, url: 'https://en.wikipedia.org/wiki/Waerebo' },
      { text: 'Aga Khan Trust for Culture. Preservation of the Mbaru Niang (2011–2013 award cycle).', url: 'https://the.akdn/en/how-we-work/our-agencies/aga-khan-trust-culture/akaa/preservation-mbaru-niang' },
    ],
    reading: [
      { text: 'Antar, Y. (ed.) (2010). Pesan dari Wae Rebo: Kelahiran Kembali Arsitektur Nusantara. Jakarta: Gramedia Pustaka Utama.' },
      { text: 'Zulkarnain et al. (2024). Studi elemen struktur rumah tradisional mbaru niang. Atrium: Jurnal Arsitektur 10(3).' },
      { text: 'Damayanti, D. P., & Suprijanto, I. (2012). Penguasaan teknologi struktur konstruksi bangunan tradisional Manggarai sebagai kunci keberhasilan dalam upaya pelestariannya.' },
      { text: 'Louis, M. (2015). Fungsi dan makna ruang pada rumah adat mbaru niang Wae Rebo. Humanis 3(2), 19–25.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 2.5,
    views: { inside: { pos: [4, 1.7, 26], target: [0, 5, -RING] } },
    overlay: {
      x0: -10, x1: 10,
      zones: [
        { zone: 'gendang', z0: -RING - 8, z1: -RING + 8, text: { en: 'Niang gendang · facing the compang', id: 'Niang gendang · menghadap compang' } },
        { zone: 'compang', x0: -5, x1: 5, z0: -5, z1: 5, text: 'Compang' },
        { zone: 'gena', x0: -RING - 7, x1: -RING + 9, z0: -24, z1: 6, text: { en: 'Three niang gena', id: 'Tiga niang gena' } },
        { zone: 'gena', x0: RING - 9, x1: RING + 7, z0: -24, z1: 6, text: { en: 'Three niang gena', id: 'Tiga niang gena' } },
      ],
      axis: { from: [0, -RING + 7.5], to: [0, 0], text: { en: 'Door of the drum house → compang', id: 'Pintu rumah gendang → compang' } },
    },
    // Guided walk from the edge of the village up through the drum house.
    walk: {
      stops: [
        {
          title: 'Wae Rebo', local: { en: 'The village', id: 'Kampung' },
          pos: [10, 2.2, 42], target: [0, 5, -10],
          text: { en: 'After hours on a forest path the ground opens and seven grey cones stand in an arc on the grass. This is the whole village: seven houses and the altar they face.', id: 'Setelah berjam-jam menyusuri jalan setapak di hutan, tanah membuka dan tujuh kerucut kelabu berdiri melengkung di atas rumput. Inilah seluruh kampung: tujuh rumah dan altar yang mereka hadapi.' },
        },
        {
          title: 'Compang', local: { en: 'The altar', id: 'Altar' }, buildings: ['compang'],
          pos: [6, 1.7, 9], target: [0, 1.0, 0],
          text: { en: 'In the middle is the compang, a round platform of earth and stone where the ceremonies for God and the ancestors are held. Every door in the village looks towards it.', id: 'Di tengah ada compang, pelataran bundar dari tanah dan batu tempat upacara bagi Tuhan dan leluhur diadakan. Semua pintu di kampung memandang ke arahnya.' },
        },
        {
          title: 'Niang Gendang', local: { en: 'The drum house', id: 'Rumah gendang' }, buildings: ['gendang'],
          pos: [5, 1.7, -RING + 15], target: [0, 5.5, -RING],
          text: { en: 'Opposite the altar stands the drum house, the largest of the seven: fourteen metres across and about fifteen high. There are no walls. The roof is the wall, lifted only where the door is.', id: 'Berhadapan dengan altar berdiri rumah gendang, yang terbesar dari ketujuhnya: empat belas meter garis tengahnya dan kira-kira lima belas meter tingginya. Tidak ada dinding. Atap itulah dindingnya, terangkat hanya di tempat pintu berada.' },
        },
        {
          title: 'Lutur', local: { en: 'The living floor', id: 'Lantai hunian' },
          pos: [0.8, 2.5, -RING + 4.6], target: [0, 2.2, -RING - 3], via: [[0, 2.0, -RING + 8.6], [0, 2.5, -RING + 6.2]],
          text: { en: 'Inside it is one dim round room. Guests sit at the front, on the lutur. In the middle the centre post rises out of sight beside the hearth, and round the back are the families’ small rooms.', id: 'Di dalamnya hanya ada satu ruang bundar yang remang. Tamu duduk di depan, di lutur. Di tengah, tiang pusat menjulang hingga tak terlihat di samping tungku, dan di bagian belakang berjajar kamar-kamar kecil keluarga.' },
        },
        {
          title: 'Lobo', local: { en: 'The levels above', id: 'Tingkat-tingkat di atas' },
          pos: [3.6, 5.6, -RING + 0.2], target: [0, 9, -RING - 0.5], via: [[3.8, 2.6, -RING + 0.2]],
          text: { en: 'A bamboo ladder leads up to the lobo, the first of four storage floors that get smaller as the roof closes in: food, then seed, then the reserve for a bad year, and at the very top the offerings to the ancestors.', id: 'Sebuah tangga bambu naik ke lobo, yang pertama dari empat lantai simpan yang makin mengecil seiring atap menguncup: makanan, lalu benih, lalu cadangan masa paceklik, dan di paling atas sesaji bagi leluhur.' },
        },
        {
          title: { en: 'Reading the village', id: 'Membaca kampung' }, local: { en: 'From above', id: 'Dari atas' }, overlay: true,
          pos: [34, 46, 52], target: [0, 2, -8],
          text: { en: 'From above: the altar at the centre, the drum house opposite it, three houses to either side, and the circle left open at the front, where the path comes in.', id: 'Dari atas: altar di pusat, rumah gendang di hadapannya, tiga rumah di tiap sisi, dan lingkaran yang dibiarkan terbuka di depan, tempat jalan setapak masuk.' },
        },
      ],
    },
  },

  slots: [
    { id: 'thatch', label: { en: 'Thatch', id: 'Penutup atap' }, tex: 'thatch', clay: '#dcd4c6' },
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'plank', label: { en: 'Boards', id: 'Papan' }, tex: 'wood' },
    { id: 'bamboo', label: { en: 'Bamboo', id: 'Bambu' }, tex: null },
    { id: 'rattan', label: { en: 'Rattan', id: 'Rotan' }, tex: null },
    { id: 'ijuk', label: 'Ijuk', tex: 'thatch' },
    { id: 'horn', label: { en: 'Horns and gong', id: 'Tanduk dan gong' }, tex: null, glossy: true, ui: false },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'earth', label: { en: 'Earth', id: 'Tanah' }, tex: null, ui: false },
    { id: 'yard', label: { en: 'Bare ground', id: 'Tanah gundul' }, tex: 'stone', ui: false, clay: '#ece8e0' },
    { id: 'ground', label: { en: 'Grass', id: 'Rumput' }, tex: 'stone', ui: false, clay: '#e4e0d6' },
  ],
  presets: {
    tua: {
      label: { en: 'Tua · weathered grey', id: 'Tua · kelabu lapuk' }, rough: 0.95, metal: {},
      colors: { thatch: '#6f6a60', wood: '#5e4a38', plank: '#7a6048', bamboo: '#a8905e', rattan: '#b89a62', ijuk: '#2e2a26', horn: '#2f2a25', stone: '#8a867d', earth: '#8a6a4c', yard: '#a8987a', ground: '#7f9060' },
    },
    baru: {
      label: { en: 'Baru · newly thatched', id: 'Baru · atap baru' }, rough: 0.9, metal: {},
      colors: { thatch: '#b09a68', wood: '#74573d', plank: '#8f6f50', bamboo: '#c7ab6e', rattan: '#cdb07a', ijuk: '#332e29', horn: '#2f2a25', stone: '#8f8a80', earth: '#94704e', yard: '#b0a080', ground: '#84955f' },
    },
    ijuk: {
      label: { en: 'Ijuk · palm-fibre black', id: 'Ijuk · hitam ijuk' }, rough: 0.9, metal: {},
      colors: { thatch: '#3c3732', wood: '#5e4a38', plank: '#7a6048', bamboo: '#a8905e', rattan: '#b89a62', ijuk: '#26221f', horn: '#2f2a25', stone: '#8a867d', earth: '#8a6a4c', yard: '#a8987a', ground: '#7f9060' },
    },
  },
};
