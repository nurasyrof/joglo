// Honai (Baliem Valley, Highland Papua): a silimo, the fenced compound of a Hubula (Dani)
// family. The men's round house stands at the head of a long yard facing the gate; the
// women's round houses, the long kitchen and the pig sty line its sides.
// Site coordinates: the yard runs along z, with the gate at +z and the pilamo at −z.
import { makeRound } from './round.js';
import { hunila, wamdabu } from './long.js';
import { fences, yard, BOUNDS } from './yard.js';

const ZONES = [
  { id: 'laki',      label: { en: 'Men', id: 'Laki-laki' },       local: 'Pilamo',  color: '#b0624a' },
  { id: 'perempuan', label: { en: 'Women', id: 'Perempuan' },     local: 'Ebe-ai',  color: '#c58a4a' },
  { id: 'bersama',   label: { en: 'Shared', id: 'Bersama' },      local: 'Hunila',  color: '#8f7a5a' },
  { id: 'silimo',    label: { en: 'Compound', id: 'Kompleks' },   local: 'Silimo',  color: '#7f8a6a' },
];

const R_MEN = 2.0, R_WOMEN = 1.75;
const EBEAI_X = 4.4, HUNILA_AT = [-4.6, -0.8], STY_AT = [-4.9, 7.4];
const FACE_WEST = -Math.PI / 2, FACE_EAST = Math.PI / 2;

const EBEAI = {
  zone: 'perempuan', alias: 'Honai perempuan', en: { en: 'Women’s house', id: 'Rumah perempuan' },
  desc: { en: 'A round house like the pilamo but a little smaller, with the same hearth below and sleeping floor above.', id: 'Rumah bundar seperti pilamo tetapi sedikit lebih kecil, dengan tungku di bawah dan lantai tidur di atas yang sama.' },
  fn: { en: 'Home of one wife and her children. Each wife of the household has an ebe-ai of her own, and her husband visits her there.', id: 'Rumah seorang istri dan anak-anaknya. Setiap istri dalam keluarga memiliki ebe-ai sendiri, dan suaminya mengunjunginya di sana.' },
  meaning: { en: 'Men, women and children sleep in separate buildings, so the compound, not any one house, is the family home.', id: 'Laki-laki, perempuan, dan anak-anak tidur di bangunan terpisah, sehingga kompleks inilah, bukan salah satu rumahnya, yang menjadi rumah keluarga.' },
  specs: [{ en: `Ø ${2 * R_WOMEN} m`, id: `Ø ${2 * R_WOMEN} m` }, { en: '2 floors', id: '2 lantai' }],
};

const BUILDINGS = [
  {
    id: 'pilamo', def: makeRound({ r: R_MEN, seed: 11, men: true }), at: [0, -8], rot: 0, zone: 'laki',
    name: 'Pilamo', alias: 'Honai laki-laki', en: { en: 'Men’s house', id: 'Rumah laki-laki' },
    desc: { en: 'The largest round house, standing alone at the narrow head of the yard with its door towards the gate.', id: 'Rumah bundar terbesar, berdiri sendiri di ujung halaman yang sempit dengan pintu menghadap gerbang.' },
    fn: { en: 'The men and older boys of the compound sleep here, and it is where they meet and talk. Sacred objects are kept in a pilamo adat.', id: 'Para lelaki dan anak laki-laki yang lebih besar tidur di sini, dan di sinilah mereka berkumpul dan berbicara. Benda-benda sakral disimpan di pilamo adat.' },
    meaning: { en: 'From its place at the head of the compound the men can watch the whole yard and everyone who comes through the gate. Women and strangers do not freely enter a pilamo adat.', id: 'Dari tempatnya di kepala kompleks, para lelaki dapat mengawasi seluruh halaman dan setiap orang yang masuk lewat gerbang. Perempuan dan orang asing tidak bebas memasuki pilamo adat.' },
    specs: [{ en: `Ø ${2 * R_MEN} m`, id: `Ø ${2 * R_MEN} m` }, { en: '2 floors', id: '2 lantai' }],
  },
  { id: 'ebeai_1', def: makeRound({ r: R_WOMEN, seed: 21 }), at: [EBEAI_X, -3.2], rot: FACE_WEST, name: 'Ebe-ai I', ...EBEAI },
  { id: 'ebeai_2', def: makeRound({ r: R_WOMEN, seed: 22 }), at: [EBEAI_X, 1.0], rot: FACE_WEST, name: 'Ebe-ai II', ...EBEAI },
  { id: 'ebeai_3', def: makeRound({ r: R_WOMEN, seed: 23 }), at: [EBEAI_X, 5.2], rot: FACE_WEST, name: 'Ebe-ai III', ...EBEAI },
  {
    id: 'hunila', def: hunila, at: HUNILA_AT, rot: FACE_EAST, zone: 'bersama',
    name: 'Hunila', alias: 'Dapur', en: { en: 'Common kitchen', id: 'Dapur bersama' },
    desc: { en: 'A long rectangular building down one side of the yard, with a row of cooking fires inside.', id: 'Bangunan persegi panjang di salah satu sisi halaman, dengan sederet tungku masak di dalamnya.' },
    fn: { en: 'The one kitchen of the compound, where food is cooked and eaten.', id: 'Satu-satunya dapur kompleks, tempat makanan dimasak dan dimakan.' },
    meaning: { en: 'It is a shared room: with the yard, the kitchen is where the men and women of the silimo spend time together.', id: 'Dapur adalah ruang bersama: bersama halaman, di sinilah laki-laki dan perempuan silimo menghabiskan waktu bersama.' },
    specs: [hunila.dims, { en: '3 fires', id: '3 tungku' }],
  },
  {
    id: 'wamdabu', def: wamdabu, at: STY_AT, rot: FACE_EAST, zone: 'bersama',
    name: 'Wamdabu', alias: 'Wamai · kandang babi', en: { en: 'Pig sty', id: 'Kandang babi' },
    desc: { en: 'A low rectangular building near the gate, divided into stalls.', id: 'Bangunan persegi yang rendah di dekat gerbang, dibagi menjadi petak-petak.' },
    fn: { en: 'The pigs are let out to forage by day and shut in here at night.', id: 'Babi dilepas mencari makan pada siang hari dan dikurung di sini pada malam hari.' },
    meaning: { en: 'Pigs are kept inside the fences with the family, because they are its most valuable possession.', id: 'Babi dipelihara di dalam pagar bersama keluarga, karena merupakan harta yang paling berharga.' },
    specs: [wamdabu.dims, { en: '4 stalls', id: '4 petak' }],
  },
  {
    id: 'pagar', def: fences, at: [0, 0], rot: 0, zone: 'silimo',
    name: 'Leget & Gapura', alias: 'Pagar dan gerbang', en: { en: 'Fences and gate', id: 'Pagar dan gerbang' },
    desc: { en: 'Two fences of split timber, one inside the other, with a single gate through both.', id: 'Dua lapis pagar dari kayu belah, satu di dalam yang lain, dengan satu gerbang yang menembus keduanya.' },
    fn: { en: 'They hold the pigs in, mark the family’s ground and leave one guarded way in.', id: 'Pagar menahan babi, menandai tanah keluarga, dan menyisakan satu jalan masuk yang dijaga.' },
    meaning: { en: 'The fences make the compound a place that can be defended.', id: 'Pagar menjadikan kompleks ini tempat yang dapat dipertahankan.' },
    specs: [{ en: '2 fences', id: '2 lapis pagar' }, { en: '1 gate', id: '1 gerbang' }],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'silimo',
    name: 'Halaman & Kebun', alias: 'Halaman silimo', en: { en: 'Yard and garden', id: 'Halaman dan kebun' },
    desc: { en: 'The open yard in the middle of the compound and the banana garden between the two fences.', id: 'Halaman terbuka di tengah kompleks dan kebun pisang di antara kedua pagar.' },
    fn: { en: 'Daily life, work and ceremonies happen in the yard; the garden gives food close to the houses.', id: 'Kehidupan sehari-hari, pekerjaan, dan upacara berlangsung di halaman; kebun menyediakan pangan di dekat rumah.' },
    meaning: { en: 'The yard is the common ground that every building of the silimo faces.', id: 'Halaman adalah ruang bersama yang dihadapi setiap bangunan silimo.' },
    specs: [`${2 * BOUNDS.x} × ${BOUNDS.z1 - BOUNDS.z0} m`],
  },
];

export default {
  loading: { en: 'Thatching the domes…', id: 'Mengatapi kubah…' },
  about: {
    title: { en: 'The Honai of the Baliem Valley', id: 'Honai Lembah Baliem' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular compound. The layout and the size of the round houses follow Salipu and Santoso’s (2023) study of a silimo at Kumugima; the construction is put together from general descriptions. Compounds differ in the number of women’s houses and in how the buildings are arranged, and apart from the diameters the dimensions here are our own estimates.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah kompleks tertentu. Tata letak dan ukuran rumah bundarnya mengikuti kajian Salipu dan Santoso (2023) atas sebuah silimo di Kumugima; konstruksinya dirangkai dari uraian-uraian umum. Setiap kompleks berbeda dalam jumlah rumah perempuan dan susunan bangunannya, dan selain diameter, ukuran di sini adalah perkiraan kami sendiri.' },
    paras: [
      { en: 'Honai is the name most Indonesians know for the round, grass-domed houses of the central highlands of Papua. In the Baliem Valley, the home of the Hubula (the Grand Valley Dani), a honai never stands alone. It is one building of a silimo, a fenced compound where an extended family lives.', id: 'Honai adalah nama yang paling dikenal orang Indonesia untuk rumah bundar berkubah rumput di pegunungan tengah Papua. Di Lembah Baliem, tanah orang Hubula (Dani Lembah Besar), sebuah honai tidak pernah berdiri sendiri. Ia adalah salah satu bangunan dalam silimo, kompleks berpagar tempat sebuah keluarga besar tinggal.' },
      { en: 'A silimo has four kinds of building around a long yard. The pilamo, the men’s house, stands at the head of the yard, facing the gate. Along the sides are the ebe-ai, a round house for each wife and her children; the hunila, a long kitchen shared by everyone; and the wamdabu, the pig sty. The round buildings are for sleeping, the rectangular ones for cooking and for the pigs.', id: 'Sebuah silimo memiliki empat jenis bangunan di sekeliling halaman yang memanjang. Pilamo, rumah laki-laki, berdiri di kepala halaman, menghadap gerbang. Di sisi-sisinya ada ebe-ai, rumah bundar bagi setiap istri dan anak-anaknya; hunila, dapur panjang yang dipakai bersama; dan wamdabu, kandang babi. Bangunan bundar untuk tidur, bangunan persegi untuk memasak dan untuk babi.' },
      { en: 'The valley floor lies about 1,600 m above the sea and the nights are cold. A round house answers that with almost nothing: a windowless ring of planks, a fire in the middle of the floor, and a second floor under a thick dome of grass where the heat of the fire collects and people sleep. Everything is tied, not nailed, and comes from the forest and grassland nearby.', id: 'Dasar lembah berada sekitar 1.600 m di atas laut dan malamnya dingin. Rumah bundar menjawabnya dengan sangat sedikit bahan: lingkaran papan tanpa jendela, api di tengah lantai, dan lantai kedua di bawah kubah rumput yang tebal, tempat panas api terkumpul dan orang tidur. Semuanya diikat, bukan dipaku, dan berasal dari hutan serta padang rumput di sekitarnya.' },
      { en: 'The layout was shaped by warfare between clans, which is no longer permitted: two fences, one gate, and the men’s house placed to watch it. Today some honai have windows, nails or zinc roofs.', id: 'Tata letaknya dibentuk oleh perang antarklen, yang kini tidak lagi diizinkan: dua lapis pagar, satu gerbang, dan rumah laki-laki yang ditempatkan untuk mengawasinya. Kini sebagian honai berjendela, berpaku, atau beratap seng.' },
    ],
    // Checked sources (see docs/content-review/honai.md), and books not yet checked.
    sources: [
      { text: 'Salipu, M. A., & Santoso, I. (2023). Penerapan konsep keamanan & kenyamanan dalam permukiman tradisional silimo di Lembah Baliem. Border: Jurnal Arsitektur 5(2).', url: 'https://border.upnjatim.ac.id/index.php/border/article/view/102-117' },
      { text: 'Heider, K. G. Dani: Settlements. Encyclopedia of World Cultures, vol. II: Oceania.', url: 'https://www.everyculture.com/Oceania/Dani-Settlements.html' },
      { text: { en: 'Rumah Honai. Wikipedia bahasa Indonesia (for the works it cites: Utami 2021, Trifena 2018).', id: 'Rumah Honai. Wikipedia bahasa Indonesia (untuk karya yang dirujuknya: Utami 2021, Trifena 2018).' }, url: 'https://id.wikipedia.org/wiki/Rumah_Honai' },
    ],
    reading: [
      { text: 'Heider, K. G. (1970). The Dugum Dani: A Papuan Culture in the Highlands of West New Guinea. Chicago: Aldine.' },
      { text: { en: 'Salipu, M. A. (2020). Permukiman Silimo sebagai simbol perwujudan sistem keamanan dan kenyamanan suku Hubula di Lembah Baliem. Dissertation, Universitas Cenderawasih.', id: 'Salipu, M. A. (2020). Permukiman Silimo sebagai simbol perwujudan sistem keamanan dan kenyamanan suku Hubula di Lembah Baliem. Disertasi, Universitas Cenderawasih.' } },
      { text: 'Trifena, F. (2018). Rumah Bundar. Jakarta: Badan Pengembangan dan Pembinaan Bahasa.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.0,
    views: { inside: { pos: [0, 1.6, 15], target: [0, 1.2, -8] } },
    overlay: {
      x0: -7, x1: 7,
      zones: [
        { zone: 'laki', x0: -4.5, x1: 4.5, z0: -11.6, z1: -5.2, text: { en: 'Pilamo · the men, watching the gate', id: 'Pilamo · laki-laki, mengawasi gerbang' } },
        { zone: 'perempuan', x0: 2, x1: 7, z0: -5.2, z1: 7.6, text: { en: 'Ebe-ai · one for each wife', id: 'Ebe-ai · satu untuk setiap istri' } },
        { zone: 'bersama', x0: -7, x1: -2, z0: -5.2, z1: 10.5, text: { en: 'Hunila & wamdabu · shared', id: 'Hunila & wamdabu · bersama' } },
        { zone: 'silimo', x0: -2, x1: 2, z0: -5.2, z1: 12.5, text: { en: 'Yard', id: 'Halaman' } },
      ],
      axis: { from: [0, 17], to: [0, -5.8], text: { en: 'Gate → door of the pilamo', id: 'Gerbang → pintu pilamo' } },
    },
    // Guided walk from outside the fences to the sleeping floor of the pilamo.
    walk: {
      stops: [
        {
          title: 'Silimo', local: { en: 'The compound', id: 'Kompleks' },
          pos: [5, 2.2, 24], target: [0, 1.2, 2],
          text: { en: 'From outside you see fences and a few low domes of grass. A silimo is the home of one extended family: several houses around a yard, shut in by two rings of fence.', id: 'Dari luar yang tampak hanyalah pagar dan beberapa kubah rumput yang rendah. Silimo adalah rumah satu keluarga besar: beberapa rumah di sekeliling halaman, dilingkupi dua lapis pagar.' },
        },
        {
          title: 'Gapura', local: { en: 'The only way in', id: 'Satu-satunya jalan masuk' }, buildings: ['pilamo'],
          pos: [0, 1.5, 13.6], target: [0, 1.2, -8],
          text: { en: 'There is one gate. Straight ahead, at the far end of the yard, the door of the men’s house looks back at you: nobody comes in without being seen.', id: 'Hanya ada satu gerbang. Lurus di depan, di ujung halaman, pintu rumah laki-laki menatap balik ke arah Anda: tak seorang pun masuk tanpa terlihat.' },
        },
        {
          title: 'Ebe-ai & Hunila', local: { en: 'The sides of the yard', id: 'Sisi-sisi halaman' }, buildings: ['ebeai_1', 'ebeai_2', 'ebeai_3', 'hunila'],
          pos: [0, 1.5, 9], target: [0.6, 0.9, -1],
          text: { en: 'On one side stand the women’s houses, one for each wife and her children. On the other is the long kitchen, where everyone cooks and eats, and beside the gate the sty for the pigs.', id: 'Di satu sisi berdiri rumah-rumah perempuan, satu untuk setiap istri dan anak-anaknya. Di sisi lain ada dapur panjang, tempat semua orang memasak dan makan, dan di dekat gerbang kandang untuk babi.' },
        },
        {
          title: 'Pilamo', local: { en: 'The men’s house', id: 'Rumah laki-laki' }, buildings: ['pilamo'],
          pos: [1.2, 1.3, -3.4], target: [0, 1.3, -8],
          text: { en: 'The pilamo is a ring of split planks under a dome of grass, about four metres across. It has no windows and one door, so low that you stoop to enter.', id: 'Pilamo adalah lingkaran papan belah di bawah kubah rumput, selebar kira-kira empat meter. Tanpa jendela dan hanya berpintu satu, begitu rendah sehingga orang harus membungkuk untuk masuk.' },
        },
        {
          title: 'Tungku', local: { en: 'Around the fire', id: 'Mengelilingi api' },
          pos: [0, 0.78, -6.4], target: [0, 0.42, -9], via: [[0, 0.75, -5.4]],
          text: { en: 'Inside it is dark and close. A fire burns between four posts in the middle of a floor of dry grass, and the ceiling is the sleeping floor, just above your head as you sit.', id: 'Di dalam gelap dan sempit. Api menyala di antara empat tiang di tengah lantai berumput kering, dan langit-langitnya adalah lantai tidur, tepat di atas kepala saat duduk.' },
        },
        {
          title: { en: 'Sleeping floor', id: 'Lantai tidur' }, local: { en: 'Under the dome', id: 'Di bawah kubah' },
          pos: [0, 1.95, -6.95], target: [-0.4, 1.7, -9.2], via: [[0, 0.8, -6.95]],
          text: { en: 'Up through the opening is where the men sleep. The roof comes down past the edge of the floor, and the warmth of the evening fire stays under it until morning.', id: 'Naik melalui lubang, di sinilah para lelaki tidur. Atap turun melewati tepi lantai, dan hangat api senja bertahan di bawahnya hingga pagi.' },
        },
        {
          title: { en: 'Reading the silimo', id: 'Membaca silimo' }, local: { en: 'From above', id: 'Dari atas' }, overlay: true,
          pos: [17, 22, 26], target: [0, 0.5, 0],
          text: { en: 'From above the order is clear: the men at the head, the women along one side, the shared kitchen and the pigs along the other, and a straight line of sight from the pilamo to the gate.', id: 'Dari atas tatanannya jelas: laki-laki di kepala, perempuan di satu sisi, dapur bersama dan babi di sisi lain, serta garis pandang lurus dari pilamo ke gerbang.' },
        },
      ],
    },
  },

  slots: [
    { id: 'thatch', label: { en: 'Thatch', id: 'Alang-alang' }, tex: 'thatch', clay: '#dcd4c6' },
    { id: 'wood', label: { en: 'Planks and poles', id: 'Papan dan kayu' }, tex: 'wood' },
    { id: 'cane', label: { en: 'Cane', id: 'Bilah' }, tex: 'bamboo' },
    { id: 'grass', label: { en: 'Floor grass', id: 'Rumput lantai' }, tex: 'thatch' },
    { id: 'rope', label: { en: 'Lashings', id: 'Tali pengikat' }, tex: null },
    { id: 'leaf', label: { en: 'Banana leaves', id: 'Daun pisang' }, tex: null, ui: false, clay: '#cfd3c2' },
    { id: 'stem', label: { en: 'Banana stems', id: 'Batang pisang' }, tex: null, ui: false, clay: '#d6d8cc' },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', ui: false, clay: '#d2cdc5' },
    { id: 'ash', label: { en: 'Ash', id: 'Abu' }, tex: null, ui: false },
    { id: 'yard', label: { en: 'Yard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
    { id: 'ground', label: { en: 'Ground', id: 'Tanah' }, tex: 'stone', ui: false, clay: '#e4e0d6' },
  ],
  presets: {
    baru: {
      label: { en: 'Baru · fresh thatch', id: 'Baru · alang-alang baru' }, rough: 0.9, metal: {},
      colors: { thatch: '#b59c66', wood: '#7a5a3e', cane: '#c2a571', grass: '#c9b47c', rope: '#5d4a34', leaf: '#5f8a45', stem: '#8a9a5c', stone: '#8f8a80', ash: '#4a4541', yard: '#b3a184', ground: '#8f9a6a' },
    },
    asap: {
      label: { en: 'Tua · weathered and smoked', id: 'Tua · lapuk dan berasap' }, rough: 0.95, metal: {},
      colors: { thatch: '#8a8272', wood: '#55453a', cane: '#8f7d5e', grass: '#a3946c', rope: '#463a2c', leaf: '#557a42', stem: '#7f8c58', stone: '#85827b', ash: '#3d3936', yard: '#a3957c', ground: '#858f66' },
    },
    seng: {
      label: { en: 'Atap seng · zinc roof', id: 'Atap seng' }, rough: 0.55, metal: { thatch: 0.6 }, tex: { thatch: null },
      colors: { thatch: '#9aa0a6', wood: '#6f543c', cane: '#b89a66', grass: '#c9b47c', rope: '#5d4a34', leaf: '#5f8a45', stem: '#8a9a5c', stone: '#8f8a80', ash: '#4a4541', yard: '#b3a184', ground: '#8f9a6a' },
    },
  },
};
