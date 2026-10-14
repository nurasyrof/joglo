// Rumah Bolon (Batak Toba, North Sumatra): a huta, a small walled village on the shores of
// Lake Toba. A row of houses faces a row of rice barns across the yard, inside a rampart
// planted with bamboo.
// Site coordinates: houses along −z facing +z, barns along +z facing them, the gate at +x.
import { makeRuma, makeSopo } from './ruma.js';
import { parik, alaman, HUTA } from './huta.js';

const ZONES = [
  { id: 'ruma',  label: { en: 'Houses', id: 'Rumah' },          local: 'Ruma · jabu', color: '#b0624a' },
  { id: 'sopo',  label: { en: 'Rice barns', id: 'Lumbung' },    local: 'Sopo',        color: '#c58a4a' },
  { id: 'batas', label: { en: 'Boundary', id: 'Batas kampung' }, local: 'Parik',       color: '#8d8a82' },
  { id: 'tanah', label: { en: 'Yard', id: 'Halaman' },          local: 'Alaman',      color: '#7f8a6a' },
];

const BOLON = { w: 3.3, l: 6.2, rise: 3.4 }, RUMA = { w: 2.9, l: 5.2, rise: 3.0 };
const ROW_Z = -8, SOPO_Z = 10, XS = [-11, 0, 11];
const F = 1.75;

const RUMA_TEXT = {
  zone: 'ruma', alias: 'Jabu', en: { en: 'House', id: 'Rumah' },
  desc: { en: 'A house of the same build as the great one beside it, a little smaller.', id: 'Rumah dengan bangun yang sama seperti rumah besar di sampingnya, sedikit lebih kecil.' },
  fn: { en: 'Home to several related families, who share one undivided room.', id: 'Dihuni beberapa keluarga berkerabat, yang berbagi satu ruang tanpa sekat.' },
  meaning: { en: 'Every house in the row looks across the yard at its own barn.', id: 'Setiap rumah dalam deretan memandang lumbungnya sendiri di seberang halaman.' },
  specs: [`${2 * RUMA.w} × ${2 * RUMA.l} m`, { en: 'Floor +1.75 m', id: 'Lantai +1,75 m' }],
};
const SOPO_TEXT = {
  zone: 'sopo', alias: 'Lumbung padi', en: { en: 'Rice barn', id: 'Lumbung padi' },
  desc: { en: 'A barn built like a small house, with an open floor below and the rice store under the roof.', id: 'Lumbung yang dibangun seperti rumah kecil, dengan lantai terbuka di bawah dan ruang simpan padi di bawah atap.' },
  fn: { en: 'Stores the rice of the house opposite. The open floor is a place to sit and work.', id: 'Menyimpan padi rumah di seberangnya. Lantai terbukanya menjadi tempat duduk dan bekerja.' },
  meaning: { en: 'The barns make the second row of the village, facing the houses.', id: 'Lumbung-lumbung membentuk deret kedua kampung, berhadapan dengan rumah-rumah.' },
  specs: [{ en: 'Open floor', id: 'Lantai terbuka' }, { en: 'Store above', id: 'Ruang simpan di atas' }],
};

const BUILDINGS = [
  {
    id: 'ruma_bolon', def: makeRuma({ ...BOLON, seed: 70 }), at: [XS[1], ROW_Z], rot: 0, zone: 'ruma',
    name: 'Ruma Bolon', alias: 'Jabu bolon · ruma sitolumbea', en: { en: 'Great house', id: 'Rumah besar' },
    desc: { en: 'The largest and most fully carved house of the village, entered from underneath through a hatch in the floor.', id: 'Rumah terbesar dan paling lengkap ukirannya di kampung, dimasuki dari bawah melalui pintu di lantai.' },
    fn: { en: 'The house of the extended family. Four to six families live in its single room.', id: 'Rumah keluarga besar. Empat sampai enam keluarga tinggal di ruangnya yang tunggal.' },
    meaning: { en: 'It is read as three worlds: banua toru below for the animals, banua tonga for people, banua ginjang in the roof for the gods and the ancestors.', id: 'Rumah ini dibaca sebagai tiga dunia: banua toru di bawah untuk hewan, banua tonga untuk manusia, banua ginjang di atap untuk para dewa dan leluhur.' },
    specs: [`${2 * BOLON.w} × ${2 * BOLON.l} m`, { en: 'Floor +1.75 m', id: 'Lantai +1,75 m' }, { en: 'No partitions', id: 'Tanpa sekat' }],
  },
  { id: 'ruma_1', def: makeRuma({ ...RUMA, seed: 71 }), at: [XS[0], ROW_Z], rot: 0, name: 'Ruma I', ...RUMA_TEXT },
  { id: 'ruma_2', def: makeRuma({ ...RUMA, seed: 72 }), at: [XS[2], ROW_Z], rot: 0, name: 'Ruma II', ...RUMA_TEXT },
  ...XS.map((x, i) => ({ id: `sopo_${i + 1}`, def: makeSopo({ seed: 81 + i }), at: [x, SOPO_Z], rot: Math.PI, name: `Sopo ${['I', 'II', 'III'][i]}`, ...SOPO_TEXT })),
  {
    id: 'parik', def: parik, at: [0, 0], rot: 0, zone: 'batas',
    name: 'Parik & Bahal', alias: 'Benteng dan gerbang', en: { en: 'Rampart and gate', id: 'Benteng dan gerbang' },
    desc: { en: 'An earth rampart planted with bamboo round the whole village, with one gate and a banyan tree outside it.', id: 'Benteng tanah bertanam bambu yang mengelilingi seluruh kampung, dengan satu gerbang dan pohon hariara di luarnya.' },
    fn: { en: 'Encloses and protects the village.', id: 'Melingkupi dan melindungi kampung.' },
    meaning: { en: 'The rampart makes the huta a rectangle set apart from the fields around it.', id: 'Benteng menjadikan huta sebuah persegi panjang yang terpisah dari ladang di sekitarnya.' },
    specs: [`${2 * HUTA.x} × ${2 * HUTA.z} m`, { en: '1 gate', id: '1 gerbang' }],
  },
  {
    id: 'alaman', def: alaman, at: [0, 0], rot: 0, zone: 'tanah',
    name: 'Alaman', alias: 'Halaman huta', en: { en: 'Village yard', id: 'Halaman kampung' },
    desc: { en: 'The broad yard between the two rows of buildings.', id: 'Pelataran lebar di antara dua deret bangunan.' },
    fn: { en: 'For play, for drying crops, and for the ceremonies of the village.', id: 'Untuk bermain, menjemur hasil ladang, dan upacara-upacara kampung.' },
    meaning: { en: 'Everything in the village faces onto it.', id: 'Segala sesuatu di kampung menghadap ke arahnya.' },
    specs: [{ en: 'Between the rows', id: 'Di antara dua deret' }],
  },
];

export default {
  loading: { en: 'Carving the gorga…', id: 'Mengukir gorga…' },
  about: {
    title: { en: 'The Rumah Bolon of the Batak Toba', id: 'Rumah Bolon Batak Toba' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular village. The layout of the huta and the parts and ornaments of the house follow published descriptions, mostly of the villages on Samosir. Batak houses were set out in spans, cubits and paces, not metres, so no two are the same size: apart from the height of the posts, every dimension here is our own estimate.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah kampung tertentu. Tata letak huta serta bagian dan ornamen rumahnya mengikuti uraian yang telah terbit, kebanyakan tentang kampung-kampung di Samosir. Rumah Batak diukur dengan depa, jengkal, asta, dan langkah, bukan meter, sehingga tidak ada dua rumah yang sama ukurannya: selain tinggi tiang, semua ukuran di sini adalah perkiraan kami sendiri.' },
    paras: [
      { en: 'Rumah bolon, or jabu bolon, means “great house”: the house of an extended family among the Batak Toba, who live around Lake Toba in North Sumatra. It stands on thick posts under a saddle roof of black palm fibre whose two ends sweep up into peaks.', id: 'Rumah bolon, atau jabu bolon, berarti “rumah besar”: rumah keluarga besar orang Batak Toba, yang bermukim di sekitar Danau Toba di Sumatera Utara. Rumah ini berdiri di atas tiang-tiang besar di bawah atap pelana dari ijuk hitam yang kedua ujungnya menjulang menjadi puncak.' },
      { en: 'The house is one room with no partitions, shared by several families. The Batak Toba read it as three worlds: banua toru, the space under the floor, where the animals are kept; banua tonga, the floor, where people live; and banua ginjang, the roof, which belongs to the gods and the ancestors. In the kind of house held to be the most complete, the ruma sitolumbea, you enter from below, through a hatch in the floor.', id: 'Rumah ini berupa satu ruang tanpa sekat, yang dihuni bersama beberapa keluarga. Orang Batak Toba membacanya sebagai tiga dunia: banua toru, kolong di bawah lantai, tempat ternak; banua tonga, lantai, tempat manusia tinggal; dan banua ginjang, atap, milik para dewa dan leluhur. Pada jenis rumah yang dianggap paling lengkap, ruma sitolumbea, orang masuk dari bawah, melalui pintu di lantai.' },
      { en: 'The front is covered in gorga, carving painted in three colours: red, white and black. Its figures protect as much as they decorate: the horned ulu paung at the roof peak, the staring singa-singa at the corners, lizards and breasts along the wall. A house is said to have a soul, and gorga keeps it alive.', id: 'Bagian depannya dipenuhi gorga, ukiran yang dicat tiga warna: merah, putih, dan hitam. Sosok-sosoknya melindungi sekaligus menghias: ulu paung yang bertanduk di puncak atap, singa-singa yang melotot di sudut, cicak dan payudara di sepanjang dinding. Rumah dikatakan memiliki roh, dan gorga menjaganya tetap hidup.' },
      { en: 'Houses stand in a huta, a village of one row of houses facing one row of rice barns (sopo) across a yard, the alaman. An earth rampart planted with bamboo runs round it, with a single gate and a banyan tree before the gate. Today most of the surviving houses have zinc roofs in place of palm fibre.', id: 'Rumah-rumah berdiri di dalam huta, kampung berupa satu deret rumah yang berhadapan dengan satu deret lumbung padi (sopo) di seberang halaman, alaman. Benteng tanah bertanam bambu mengelilinginya, dengan satu gerbang dan pohon hariara di muka gerbang. Kini sebagian besar rumah yang tersisa beratap seng sebagai pengganti ijuk.' },
    ],
    // Checked sources (see docs/content-review/rumah-bolon.md), and books not yet checked.
    sources: [
      { text: 'Saragih, D. A., & Yulianto (2019). Kajian ornamen gorga di rumah adat Batak Toba. Jurnal Arsitektur ALUR 2(1).', url: 'https://ejournal.ust.ac.id/index.php/ALUR/article/view/368' },
      { text: 'Sihotang, K. M., Naibaho, P. D. R., & Aritonang, E. R. (2019). Tipologi fasad rumah adat Batak Toba. Jurnal Arsitektur ALUR 2(2), 13–21.', url: 'https://ejournal.ust.ac.id/index.php/ALUR/article/view/529' },
      { text: 'Naibaho, M. (2019). Makna simbol pada rumah adat etnik Batak Toba (ruma bolon) di Kabupaten Samosir. JOM FISIP 6(2).', url: 'https://jom.unri.ac.id/index.php/JOMFSIP/article/view/25546' },
    ],
    reading: [
      { text: 'Sitanggang, H. (1998). Arsitektur Tradisional Daerah Sumatera Utara. Jakarta: Departemen Pendidikan dan Kebudayaan.' },
      { text: 'Domenig, G. (2003). Consequences of functional change: granaries, granary-dwellings, and houses of the Toba Batak. In Schefold, Nas & Domenig (eds.), Indonesian Houses, vol. 1. Leiden: KITLV Press.' },
      { text: 'Sibeth, A. (1991). The Batak: Peoples of the Island of Sumatra. London: Thames and Hudson.' },
      { text: 'Napitupulu, S. P., et al. (1997). Arsitektur Tradisional Daerah Sumatera Utara. Jakarta: Departemen Pendidikan dan Kebudayaan.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: F + 1.3,
    views: { inside: { pos: [HUTA.x - 5, 1.7, 1], target: [0, 4, -4] } },
    overlay: {
      x0: -HUTA.x + 2, x1: HUTA.x - 2,
      zones: [
        { zone: 'ruma', z0: -HUTA.z + 1.5, z1: -1.5, text: { en: 'Ruma · the row of houses', id: 'Ruma · deretan rumah' } },
        { zone: 'tanah', z0: -1.5, z1: 5, text: { en: 'Alaman · the yard', id: 'Alaman · halaman' } },
        { zone: 'sopo', z0: 5, z1: HUTA.z - 1.5, text: { en: 'Sopo · the row of barns', id: 'Sopo · deretan lumbung' } },
      ],
      axis: { from: [HUTA.x + 6, 1.8], to: [-HUTA.x + 4, 1.8], text: { en: 'Bahal → alaman', id: 'Bahal → alaman' } },
    },
    // Guided walk from outside the gate into the great house.
    walk: {
      stops: [
        {
          title: 'Huta', local: { en: 'The village', id: 'Kampung' },
          pos: [HUTA.x + 15, 2.0, -7], target: [0, 4, 0],
          text: { en: 'From outside, a huta is a wall of earth topped with bamboo and, above it, a line of dark roof peaks. A banyan stands before the single gate.', id: 'Dari luar, huta tampak sebagai tembok tanah bermahkota bambu dan, di atasnya, sebaris puncak atap yang gelap. Sebatang hariara berdiri di muka satu-satunya gerbang.' },
        },
        {
          title: 'Alaman', local: { en: 'The yard', id: 'Halaman' },
          pos: [HUTA.x - 4, 1.7, 1.5], target: [-4, 3.5, 0.5], via: [[HUTA.x + 3, 1.7, 0]],
          text: { en: 'Through the gate the village opens: houses in a row on one side, their rice barns in a row on the other, and the long yard between, where crops dry, children play and feasts are held.', id: 'Melewati gerbang, kampung terbuka: rumah-rumah berderet di satu sisi, lumbung-lumbung padinya berderet di sisi lain, dan halaman panjang di antaranya, tempat hasil ladang dijemur, anak-anak bermain, dan pesta diadakan.' },
        },
        {
          title: 'Sopo', local: { en: 'The rice barns', id: 'Lumbung padi' }, buildings: ['sopo_1', 'sopo_2', 'sopo_3'],
          pos: [3.5, 1.7, 2.5], target: [0, 3.2, SOPO_Z],
          text: { en: 'Each barn faces the house it belongs to. The rice is kept high under the roof; the open floor beneath is a shaded place to sit and work.', id: 'Setiap lumbung menghadap rumah pemiliknya. Padi disimpan tinggi di bawah atap; lantai terbuka di bawahnya menjadi tempat teduh untuk duduk dan bekerja.' },
        },
        {
          title: 'Gorga', local: { en: 'The carved front', id: 'Wajah berukir' }, buildings: ['ruma_bolon'],
          pos: [3.2, 1.7, 6.2], target: [0, 4.6, ROW_Z + BOLON.l],
          text: { en: 'The front of the great house is carved and painted in red, white and black. A horned head looks down from the roof peak and staring faces guard the corners. There is no door.', id: 'Bagian depan rumah besar diukir dan dicat merah, putih, dan hitam. Kepala bertanduk memandang dari puncak atap dan wajah-wajah melotot menjaga sudutnya. Tidak ada pintu.' },
        },
        {
          title: 'Banua Toru', local: { en: 'Under the house', id: 'Di bawah rumah' },
          pos: [1.6, 1.2, ROW_Z + BOLON.l + 1.6], target: [0, 1.3, ROW_Z + BOLON.l - 2],
          text: { en: 'The way in is underneath. Between the first rows of posts a stair climbs to a hatch in the floor. Behind it, shut in by the rails, is the stall for the buffalo and pigs.', id: 'Jalan masuknya ada di bawah. Di antara deret-deret tiang pertama, sebuah tangga naik ke pintu di lantai. Di belakangnya, tertutup palang-palang, ada kandang kerbau dan babi.' },
        },
        {
          title: 'Banua Tonga', local: { en: 'The one room', id: 'Satu ruang' },
          pos: [0.9, F + 1.4, ROW_Z + BOLON.l - 3.4], target: [-0.3, F + 0.9, ROW_Z - BOLON.l],
          via: [[0, 1.3, ROW_Z + BOLON.l - 0.4], [0, F + 1.3, ROW_Z + BOLON.l - 2.1]],
          text: { en: 'You come up into one long room with no walls inside it. Four to six families live here, each in its own part of the floor, around the hearth. Overhead a rack crosses the room, and beyond it is the dark of the roof.', id: 'Anda muncul di satu ruang panjang tanpa dinding di dalamnya. Empat sampai enam keluarga tinggal di sini, masing-masing di bagian lantainya sendiri, mengelilingi tungku. Di atas kepala, para-para melintangi ruang, dan di baliknya gelap atap.' },
        },
        {
          title: { en: 'Reading the huta', id: 'Membaca huta' }, local: { en: 'From above', id: 'Dari atas' }, overlay: true,
          pos: [34, 34, 40], target: [2, 2, 0],
          text: { en: 'From above: the rampart and its bamboo, one gate, the row of houses, the row of barns, and the yard that both rows face.', id: 'Dari atas: benteng dan bambunya, satu gerbang, deretan rumah, deretan lumbung, dan halaman yang dihadapi keduanya.' },
        },
      ],
    },
  },

  slots: [
    { id: 'roof', label: 'Ijuk', tex: 'thatch', clay: '#d6d0c4' },
    { id: 'gorga', label: 'Gorga', tex: 'ukiran' },
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'plank', label: { en: 'Boards', id: 'Papan' }, tex: 'wood' },
    { id: 'bamboo', label: { en: 'Bamboo', id: 'Bambu' }, tex: null },
    { id: 'accent', label: { en: 'White paint', id: 'Cat putih' }, tex: null },
    { id: 'horn', label: { en: 'Horns', id: 'Tanduk' }, tex: null, glossy: true, ui: false },
    { id: 'dark', label: { en: 'Black', id: 'Hitam' }, tex: null, ui: false },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'earth', label: { en: 'Earth', id: 'Tanah' }, tex: 'stone', ui: false, clay: '#ddd6c8' },
    { id: 'leaf', label: { en: 'Leaves', id: 'Daun' }, tex: null, ui: false, clay: '#cfd3c2' },
    { id: 'yard', label: { en: 'Yard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
    { id: 'ground', label: { en: 'Ground', id: 'Tanah luar' }, tex: 'stone', ui: false, clay: '#e4e0d6' },
  ],
  presets: {
    sipalang: {
      label: { en: 'Gorga sipalang · mostly red', id: 'Gorga sipalang · dominan merah' }, rough: 0.9, metal: {},
      colors: { roof: '#2f2b28', gorga: '#9c3a2a', wood: '#5b4333', plank: '#74573f', bamboo: '#b89a62', accent: '#e9e2d0', horn: '#26221f', dark: '#1b1816', stone: '#8a867d', earth: '#8f7658', leaf: '#5c8246', yard: '#b3a184', ground: '#8a9866' },
    },
    silinggom: {
      label: { en: 'Gorga silinggom · mostly black', id: 'Gorga silinggom · dominan hitam' }, rough: 0.9, metal: {},
      colors: { roof: '#2f2b28', gorga: '#3a302b', wood: '#5b4333', plank: '#74573f', bamboo: '#b89a62', accent: '#e9e2d0', horn: '#26221f', dark: '#1b1816', stone: '#8a867d', earth: '#8f7658', leaf: '#5c8246', yard: '#b3a184', ground: '#8a9866' },
    },
    seng: {
      label: { en: 'Atap seng · zinc roof', id: 'Atap seng' }, rough: 0.55, metal: { roof: 0.6 }, tex: { roof: null },
      colors: { roof: '#8d5a48', gorga: '#9c3a2a', wood: '#5b4333', plank: '#74573f', bamboo: '#b89a62', accent: '#e9e2d0', horn: '#26221f', dark: '#1b1816', stone: '#8a867d', earth: '#8f7658', leaf: '#5c8246', yard: '#b3a184', ground: '#8a9866' },
    },
  },
};
