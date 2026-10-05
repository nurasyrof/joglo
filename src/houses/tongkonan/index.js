// Tongkonan (Toraja, South Sulawesi): a row of ancestral houses facing north across a yard
// to their row of rice barns (alang), with the rante, the field of funeral stones, to the west.
// Site coordinates: north is −z, east +x. Houses face north, barns face south.
import { makeTongkonan } from './banua.js';
import { makeAlang } from './alang.js';
import { rante, yard, SITE, ROW_XS } from './village.js';

const ZONES = [
  { id: 'banua',   label: { en: 'Houses', id: 'Rumah' },        local: 'Tongkonan', color: '#b3402f' },
  { id: 'alang',   label: { en: 'Rice barns', id: 'Lumbung padi' },    local: 'Alang',     color: '#d9a63a' },
  { id: 'rante',   label: { en: 'Funeral field', id: 'Lapangan upacara pemakaman' }, local: 'Rante',     color: '#8d8a82' },
  { id: 'halaman', label: { en: 'Yard', id: 'Halaman' },          local: 'Halaman',   color: '#7fa37a' },
];

const HOUSE_Z = 11, BARN_Z = -8;
const [W, C, E] = ROW_XS;

const FAMILY = {
  zone: 'banua', rot: Math.PI, alias: 'Tongkonan', en: { en: 'Family house', id: 'Rumah keluarga' },
  desc: { en: 'Another tongkonan of the family line, built like the main house but with a lower roof and fewer horns.', id: 'Tongkonan lain dari garis keturunan yang sama, dibangun seperti rumah utama tetapi dengan atap lebih rendah dan tanduk lebih sedikit.' },
  fn: { en: 'Home of a branch of the family. Toraja trace descent through both parents, so a person belongs to several tongkonan at once.', id: 'Rumah salah satu cabang keluarga. Orang Toraja menelusuri keturunan dari kedua orang tua, sehingga seseorang menjadi bagian dari beberapa tongkonan sekaligus.' },
  meaning: { en: 'Houses stand side by side in a row, all facing north, the same way as their ancestors’ houses.', id: 'Rumah-rumah berdiri berjajar, semuanya menghadap utara, sama seperti rumah para leluhur mereka.' },
};
const BARN = {
  zone: 'alang', rot: 0, alias: 'Lumbung padi', en: { en: 'Rice barn', id: 'Lumbung padi' },
  desc: { en: 'A plainer alang facing its house across the yard.', id: 'Alang yang lebih polos, menghadap rumahnya di seberang halaman.' },
  fn: { en: 'Stores the family’s rice. Guests sit on the platform beneath it.', id: 'Menyimpan padi keluarga. Tamu duduk di balai di bawahnya.' },
  meaning: { en: 'Every tongkonan has its alang opposite: the house and the rice that sustains it.', id: 'Setiap tongkonan memiliki alang di hadapannya: rumah dan padi yang menghidupinya.' },
};

const BUILDINGS = [
  {
    id: 'tongkonan', def: makeTongkonan({ horns: 14, H: 4.4, seed: 41 }), at: [C, HOUSE_Z], rot: Math.PI, zone: 'banua',
    name: 'Tongkonan', alias: 'Banua', en: { en: 'Ancestral house', id: 'Rumah leluhur' },
    desc: { en: 'The ancestral house of the family, on a base of posts, under a roof that sweeps up at both ends. Buffalo horns are stacked on the post at the front.', id: 'Rumah leluhur keluarga, di atas kaki dari tiang-tiang, di bawah atap yang menjulang di kedua ujungnya. Tanduk kerbau disusun pada tiang di depan.' },
    fn: { en: 'The origin house of the family line, where its members gather for ceremonies, and where its heirlooms are kept.', id: 'Rumah asal garis keturunan, tempat anggotanya berkumpul untuk upacara dan tempat pusakanya disimpan.' },
    meaning: { en: 'Tongkonan comes from tongkon, “to sit”: the place where the family sits together.', id: 'Tongkonan berasal dari tongkon, “duduk”: tempat keluarga duduk bersama.' },
    specs: [{ en: '3 rooms', id: '3 ruang' }, { en: '14 pairs of horns', id: '14 pasang tanduk' }],
  },
  { id: 'tongkonan_barat', def: makeTongkonan({ horns: 8, H: 3.8, seed: 42 }), at: [W, HOUSE_Z], name: 'Tongkonan II', ...FAMILY, specs: [{ en: '8 pairs of horns', id: '8 pasang tanduk' }] },
  { id: 'tongkonan_timur', def: makeTongkonan({ horns: 5, H: 3.6, seed: 43 }), at: [E, HOUSE_Z], name: 'Tongkonan III', ...FAMILY, specs: [{ en: '5 pairs of horns', id: '5 pasang tanduk' }] },
  {
    id: 'alang_sura', def: makeAlang({ carved: true, seed: 51 }), at: [C, BARN_Z], rot: 0, zone: 'alang',
    name: 'Alang Sura’', alias: 'Lumbung berukir', en: { en: 'Carved rice barn', id: 'Lumbung berukir' },
    desc: { en: 'The carved rice barn facing the main house: a closed store on six smooth posts, under a small curved roof.', id: 'Lumbung berukir yang menghadap rumah utama: lumbung tertutup di atas enam tiang licin, di bawah atap kecil yang melengkung.' },
    fn: { en: 'Stores the family’s rice. The platform beneath is where guests are seated at ceremonies.', id: 'Menyimpan padi keluarga. Balai di bawahnya adalah tempat tamu didudukkan saat upacara.' },
    meaning: { en: 'Sura’ means carved. The barn is decorated like the house it faces, a sign of the family’s prosperity.', id: 'Sura’ berarti berukir. Lumbung ini dihias seperti rumah di hadapannya, tanda kemakmuran keluarga.' },
    specs: [{ en: '6 posts', id: '6 tiang' }, { en: 'Carved', id: 'Berukir' }],
  },
  { id: 'alang_barat', def: makeAlang({ carved: false, seed: 52 }), at: [W, BARN_Z], name: 'Alang II', ...BARN, specs: [{ en: '6 posts', id: '6 tiang' }, { en: 'Plain', id: 'Polos' }] },
  { id: 'alang_timur', def: makeAlang({ carved: false, seed: 53 }), at: [E, BARN_Z], name: 'Alang III', ...BARN, specs: [{ en: '6 posts', id: '6 tiang' }, { en: 'Plain', id: 'Polos' }] },
  {
    id: 'rante', def: rante, at: [0, 0], rot: 0, zone: 'rante',
    name: 'Rante', alias: 'Simbuang batu', en: { en: 'Field of standing stones', id: 'Lapangan batu tegak' },
    desc: { en: 'An open field to the west of the houses, with standing stones of many sizes.', id: 'Lapangan terbuka di sebelah barat rumah-rumah, dengan batu-batu tegak beragam ukuran.' },
    fn: { en: 'The great funerals (Rambu Solo’) are held here. A stone is raised for the funeral of a person of high standing.', id: 'Upacara pemakaman besar (Rambu Solo’) diadakan di sini. Sebuah batu didirikan untuk pemakaman orang yang berkedudukan tinggi.' },
    meaning: { en: 'In Toraja, west is the direction of death and the ancestors, east the direction of life. Funerals belong to the west.', id: 'Di Toraja, barat adalah arah kematian dan para leluhur, timur arah kehidupan. Upacara pemakaman berada di barat.' },
    specs: [{ en: '11 stones', id: '11 batu' }],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'halaman',
    name: 'Halaman', alias: 'Halaman tongkonan', en: { en: 'Yard', id: 'Halaman' },
    desc: { en: 'The long yard between the row of houses and the row of barns.', id: 'Halaman panjang di antara deretan rumah dan deretan lumbung.' },
    fn: { en: 'For drying rice, daily work and family ceremonies.', id: 'Untuk menjemur padi, pekerjaan sehari-hari, dan upacara keluarga.' },
    meaning: { en: 'Shared ground, framed by the houses on one side and their barns on the other.', id: 'Tanah bersama, dibingkai rumah-rumah di satu sisi dan lumbung-lumbungnya di sisi lain.' },
    specs: [`${SITE.x1 - SITE.x0} × ${SITE.z1 - SITE.z0} m`],
  },
];

export default {
  loading: { en: 'Raising the roofs…', id: 'Menegakkan atap…' },
  about: {
    title: { en: 'The Tongkonan of the Toraja', id: 'Tongkonan Toraja' },
    paras: [
      { en: 'The tongkonan is the ancestral house of the Toraja people of the South Sulawesi highlands. Its name comes from tongkon, “to sit”: it is the place where a family sits together. A tongkonan is less a home than the origin of a family line, and Toraja count themselves members of the tongkonan of both their mother and their father.', id: 'Tongkonan adalah rumah leluhur orang Toraja di dataran tinggi Sulawesi Selatan. Namanya berasal dari tongkon, “duduk”: tempat keluarga duduk bersama. Tongkonan lebih merupakan asal-usul sebuah garis keturunan daripada sekadar tempat tinggal, dan orang Toraja menjadi anggota tongkonan dari pihak ibu maupun ayah.' },
      { en: 'Every tongkonan faces north. In front of it, across a long yard, its rice barns (alang) face back towards it. Many villages have a row of houses facing a row of barns, with buffalo horns from past funerals stacked up the front of the houses.', id: 'Setiap tongkonan menghadap utara. Di depannya, di seberang halaman panjang, lumbung-lumbung padinya (alang) menghadap balik ke arahnya. Banyak kampung memiliki sederet rumah yang berhadapan dengan sederet lumbung, dengan tanduk kerbau dari upacara pemakaman terdahulu tersusun di depan rumah.' },
      { en: 'Read from the top down, the house has three parts, like the Toraja cosmos: the roof (rattiang banua) belongs with the upper world, the body (kale banua) with the world of the living, and the base of posts (sulluk banua) with the world below. The great roof of layered bamboo rises at both ends, like a boat’s prow or a buffalo’s horns.', id: 'Dibaca dari atas ke bawah, rumah ini memiliki tiga bagian, seperti alam semesta Toraja: atap (rattiang banua) bertalian dengan dunia atas, badan (kale banua) dengan dunia orang hidup, dan kaki dari tiang-tiang (sulluk banua) dengan dunia bawah. Atap besar dari bambu berlapis menjulang di kedua ujungnya, seperti haluan perahu atau tanduk kerbau.' },
      { en: 'Directions matter: north is linked to the Creator, Puang Matua, and the south to the land of souls. Ceremonies of life (Rambu Tuka’) belong to the east, and funerals (Rambu Solo’) to the west. This model is an idealised settlement for learning, loosely based on villages like Ke’te’ Kesu’. Many tongkonan today have zinc roofs.', id: 'Arah sangat bermakna: utara bertalian dengan Sang Pencipta, Puang Matua, dan selatan dengan negeri arwah. Upacara kehidupan (Rambu Tuka’) berada di timur, dan upacara pemakaman (Rambu Solo’) di barat. Model ini adalah permukiman yang diidealkan untuk belajar, berdasarkan secara longgar pada kampung seperti Ke’te’ Kesu’. Kini banyak tongkonan beratap seng.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 3.3,
    views: { inside: { pos: [31, 2.4, -2.5], target: [0, 5, 4] } },
    overlay: {
      x0: SITE.x0, x1: SITE.x1,
      zones: [
        { zone: 'banua', x0: -18, x1: 18, z0: 2.0, z1: SITE.z1, text: { en: 'Tongkonan · facing north', id: 'Tongkonan · menghadap utara' } },
        { zone: 'halaman', x0: -18, x1: 18, z0: -4.0, z1: 2.0, text: 'Halaman' },
        { zone: 'alang', x0: -18, x1: 18, z0: SITE.z0, z1: -4.0, text: { en: 'Alang · facing the houses', id: 'Alang · menghadap rumah' } },
        { zone: 'rante', x0: SITE.x0, x1: -20, z0: -6, z1: 12, text: { en: 'Rante · the west, side of the dead', id: 'Rante · barat, sisi orang mati' } },
      ],
      axis: { from: [6, SITE.z1], to: [6, SITE.z0], text: { en: 'North · Puang Matua ↑   South · Puya ↓', id: 'Utara · Puang Matua ↑   Selatan · Puya ↓' } },
    },
    walk: {
      stops: [
        {
          title: 'Tongkonan', local: { en: 'The row of houses', id: 'Deretan rumah' },
          pos: [31, 2.4, -2.5], target: [0, 5, 4],
          text: { en: 'A row of houses faces a row of rice barns across a long yard. Every tongkonan faces north, and its roof rises at both ends like the prow of a boat.', id: 'Sederet rumah berhadapan dengan sederet lumbung padi di seberang halaman panjang. Setiap tongkonan menghadap utara, dan atapnya menjulang di kedua ujung seperti haluan perahu.' },
        },
        {
          title: 'Alang', local: { en: 'The rice barns', id: 'Lumbung padi' }, buildings: ['alang_sura', 'alang_barat', 'alang_timur'],
          pos: [4.2, 1.6, -0.6], target: [0, 2.6, -8],
          text: { en: 'Opposite each house stands its alang, a small house for rice on smooth palm-wood posts that rats cannot climb. On the platform beneath, guests are seated at ceremonies.', id: 'Di seberang setiap rumah berdiri alangnya, rumah kecil untuk padi di atas tiang kayu palem yang licin sehingga tikus tidak dapat memanjat. Di balai di bawahnya, tamu didudukkan saat upacara.' },
        },
        {
          title: 'Tanduk Tedong', local: { en: 'Horns of the buffalo', id: 'Tanduk kerbau' },
          pos: [4.6, 2.0, -4.6], target: [0, 4.6, 5],
          text: { en: 'Up the post at the front of the house are buffalo horns, one pair for each buffalo sacrificed at the family’s funerals. Above the door is a carved buffalo head, and above it the long-necked katik.', id: 'Di tiang depan rumah tersusun tanduk-tanduk kerbau, sepasang untuk setiap kerbau yang dikurbankan dalam upacara pemakaman keluarga. Di atas pintu ada kepala kerbau berukir, dan di atasnya katik yang berleher panjang.' },
        },
        {
          title: 'Sali', local: { en: 'Inside the house', id: 'Di dalam rumah' },
          pos: [-1.1, 3.55, 9.75], target: [1.4, 2.6, 12.2],
          via: [[0, 2.4, 3.6], [0, 3.3, 6.0], [0, 3.4, 7.6], [-0.95, 3.5, 9.0]],
          text: { en: 'Up the ladder and through the small door, the house is dark and low. The middle room, sali, holds the hearth. When someone dies, the body stays in the house, often for months, until the funeral can be held.', id: 'Setelah menaiki tangga dan melewati pintu kecil, rumah terasa gelap dan rendah. Ruang tengah, sali, berisi tungku. Jika seseorang meninggal, jenazahnya disemayamkan di rumah, sering kali berbulan-bulan, sampai upacara pemakaman dapat diadakan.' },
        },
        {
          title: 'Rattiang Banua', local: { en: 'The roof', id: 'Atap' },
          pos: [21, 5, 21], target: [3, 7, 10],
          text: { en: 'The roof is built of split bamboo laid in thick layers. Its ridge sags in the middle and sweeps up at both ends, far beyond the walls, carried by tall posts. The roof is the house’s link to the upper world.', id: 'Atapnya dibangun dari bilah bambu yang disusun berlapis tebal. Bubungannya melendut di tengah dan menjulang di kedua ujung, jauh melewati dinding, ditopang tiang-tiang tinggi. Atap adalah penghubung rumah dengan dunia atas.' },
        },
        {
          title: 'Rante', local: { en: 'The field of stones', id: 'Lapangan batu' }, buildings: ['rante'],
          pos: [-16.5, 2.2, -4], target: [-28, 2.6, 3],
          text: { en: 'To the west lies the rante. The great funerals are held here, with buffalo sacrifices and hundreds of guests, and a stone is raised for a person of high standing. Only after the funeral does the soul leave for Puya, the land of souls.', id: 'Di sebelah barat terbentang rante. Upacara pemakaman besar diadakan di sini, dengan pengurbanan kerbau dan ratusan tamu, dan sebuah batu didirikan bagi orang yang berkedudukan tinggi. Baru setelah upacara itu jiwa berangkat ke Puya, negeri arwah.' },
        },
        {
          title: { en: 'The settlement', id: 'Permukiman' }, local: { en: 'Reading the whole', id: 'Membaca keseluruhan' }, overlay: true,
          pos: [22, 42, 42], target: [-8, 0, 3],
          text: { en: 'From above: houses face north towards their barns, life and its ceremonies to the east, death and the ancestors to the west.', id: 'Dari atas: rumah-rumah menghadap utara ke arah lumbungnya, kehidupan dan upacaranya di timur, kematian dan para leluhur di barat.' },
        },
      ],
    },
  },

  slots: [
    { id: 'roof', label: { en: 'Bamboo roof', id: 'Atap bambu' }, tex: 'bambooRoof', clay: '#d6d0c4' },
    { id: 'passura', label: 'Passura’', tex: 'passura' },
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'plank', label: { en: 'Boards', id: 'Papan' }, tex: 'wood' },
    { id: 'accent', label: { en: 'Carving', id: 'Ukiran' }, tex: null },
    { id: 'horn', label: { en: 'Horns', id: 'Tanduk' }, tex: null, glossy: true },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'bone', label: { en: 'Bone', id: 'Tulang' }, tex: null, ui: false },
    { id: 'ground', label: { en: 'Ground', id: 'Tanah' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tradisional: {
      label: { en: 'Tradisional · bamboo & passura’', id: 'Tradisional · bambu & passura’' }, rough: 0.85, metal: {},
      colors: { roof: '#7a6a52', passura: '#ffffff', wood: '#4a3020', plank: '#6b4a32', accent: '#2a1c14', horn: '#4a423a', stone: '#7d786e', bone: '#e6dcc6', ground: '#8f9a6a' },
    },
    lumut: {
      label: { en: 'Berlumut · mossy old roofs', id: 'Berlumut · atap tua berlumut' }, rough: 0.95, metal: {},
      colors: { roof: '#56653c', passura: '#e8ddcc', wood: '#3f2b1d', plank: '#5d422d', accent: '#251912', horn: '#463f37', stone: '#726e64', bone: '#d9cfb9', ground: '#7f8d5c' },
    },
    seng: {
      label: { en: 'Atap seng · zinc roof', id: 'Atap seng' }, rough: 0.55, metal: { roof: 0.6 }, tex: { roof: null },
      colors: { roof: '#9aa0a6', passura: '#ffffff', wood: '#4a3020', plank: '#6b4a32', accent: '#2a1c14', horn: '#4a423a', stone: '#7d786e', bone: '#e6dcc6', ground: '#8f9a6a' },
    },
  },
};
