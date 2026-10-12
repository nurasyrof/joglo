// Rumah Betang (Central Kalimantan): the longhouse of the Dayak Ngaju, with its kitchen
// behind, the monuments to the dead in front, and the river it faces.
// Site coordinates: the house runs along x and faces +z, towards the river.
import { betang, LEN, DEP, BACK_DOORS } from './betang.js';
import { dapur, KITCHEN } from './dapur.js';
import { leluhur, yard, SITE } from './yard.js';
import { F } from './kit.js';

const ZONES = [
  { id: 'betang',  label: { en: 'Longhouse', id: 'Rumah panjang' }, local: 'Huma betang', color: '#c58a4a' },
  { id: 'dapur',   label: { en: 'Kitchen', id: 'Dapur' },           local: 'Dapur · karayan', color: '#8f7a5a' },
  { id: 'leluhur', label: { en: 'The dead', id: 'Leluhur' },        local: 'Sandung', color: '#8d8a82' },
  { id: 'tapak',   label: { en: 'Yard and river', id: 'Halaman dan sungai' }, local: 'Halaman', color: '#7f8a6a' },
];

const KITCHEN_AT = [BACK_DOORS.kitchen, -DEP - KITCHEN.deck - KITCHEN.L];
const E = F + 1.6;      // eye height on the floor

const BUILDINGS = [
  {
    id: 'betang', def: betang, at: [0, 0], rot: 0, zone: 'betang',
    name: 'Huma Betang', alias: 'Rumah panjang', en: { en: 'Longhouse', id: 'Rumah panjang' },
    desc: { en: 'One long house of ironwood, raised 2.3 m on posts under a single shingle roof, with one main stair and one main door in the middle of the front.', id: 'Satu rumah panjang dari kayu ulin, terangkat 2,3 m di atas tiang di bawah satu atap sirap, dengan satu tangga utama dan satu pintu utama di tengah bagian depan.' },
    fn: { en: 'Home to several related families at once. Each has a room; the hall in the middle belongs to everyone.', id: 'Dihuni beberapa keluarga berkerabat sekaligus. Masing-masing memiliki satu bilik; los di tengah adalah milik bersama.' },
    meaning: { en: 'The house is read as three worlds: the posts below for the lower world and its spirits, the walls and floor for the world of people, the roof for the upper world.', id: 'Rumah ini dibaca sebagai tiga alam: tiang di bawah untuk alam bawah dan roh-rohnya, dinding dan lantai untuk alam manusia, atap untuk alam atas.' },
    specs: [`${2 * LEN} × ${2 * DEP} m`, { en: 'Floor +2.3 m', id: 'Lantai +2,3 m' }, { en: '10 rooms', id: '10 bilik' }],
  },
  {
    id: 'dapur', def: dapur, at: KITCHEN_AT, rot: Math.PI / 2, zone: 'dapur',
    name: 'Dapur & Karayan', alias: 'Dapur bersama', en: { en: 'Kitchen and deck', id: 'Dapur dan karayan' },
    desc: { en: 'A separate building behind the house, reached across an open deck (karayan), with its roof turned at right angles to the main roof.', id: 'Bangunan terpisah di belakang rumah, dicapai melalui pelataran terbuka (karayan), dengan atap yang tegak lurus terhadap atap utama.' },
    fn: { en: 'All the families cook here, each at its own hearth.', id: 'Semua keluarga memasak di sini, masing-masing di tungkunya sendiri.' },
    meaning: { en: 'The kitchen is kept apart so that its work does not disturb the house and a fire there cannot easily spread.', id: 'Dapur dipisahkan agar kegiatannya tidak mengganggu rumah dan kebakaran di sana tidak mudah menjalar.' },
    specs: [{ en: 'Kitchen 6 × 8 m', id: 'Dapur 6 × 8 m' }, { en: '4 hearths', id: '4 tungku' }],
  },
  {
    id: 'leluhur', def: leluhur, at: [0, 0], rot: 0, zone: 'leluhur',
    name: 'Sandung, Sapundu & Pantar', alias: 'Bangunan tiwah', en: { en: 'Monuments to the dead', id: 'Bangunan bagi orang mati' },
    desc: { en: 'In front of the house stand a small bone house on posts, carved figure posts and tall poles.', id: 'Di depan rumah berdiri rumah tulang kecil di atas tiang, tiang-tiang berukir sosok, dan tiang-tiang tinggi.' },
    fn: { en: 'They belong to the tiwah, the great funeral of the Kaharingan religion, and honour the family’s dead.', id: 'Semuanya bagian dari tiwah, upacara kematian besar dalam agama Kaharingan, dan memuliakan anggota keluarga yang telah meninggal.' },
    meaning: { en: 'The dead are housed in sight of the living, between the betang and the river.', id: 'Orang mati dirumahkan dalam pandangan orang hidup, di antara betang dan sungai.' },
    specs: [{ en: '1 sandung', id: '1 sandung' }, { en: '3 sapundu', id: '3 sapundu' }, { en: '2 pantar', id: '2 pantar' }],
  },
  {
    id: 'halaman', def: yard, at: [0, 0], rot: 0, zone: 'tapak',
    name: 'Halaman & Sungai', alias: 'Tapak betang', en: { en: 'Yard and river', id: 'Halaman dan sungai' },
    desc: { en: 'The open ground in front of the house and the river beyond it.', id: 'Tanah lapang di depan rumah dan sungai di seberangnya.' },
    fn: { en: 'The river is the road and the water supply; the yard is where ceremonies are held.', id: 'Sungai adalah jalan dan sumber air; halaman adalah tempat upacara berlangsung.' },
    meaning: { en: 'A betang is always built on a river bank, facing the water.', id: 'Betang selalu dibangun di tepi sungai, menghadap air.' },
    specs: [`${SITE.x1 - SITE.x0} × ${SITE.z1 - SITE.z0} m`],
  },
];

export default {
  loading: { en: 'Raising the posts…', id: 'Mendirikan jihi…' },
  about: {
    title: { en: 'The Betang of the Dayak Ngaju', id: 'Betang Dayak Ngaju' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular house. Its size, room list and the dimensions of its timbers follow Restyanto’s (2012) measurements of Betang Toyoi at Tumbang Malahoi, built in 1869; the arrangement of the rooms, the kitchen and everything in the yard are our reconstruction from descriptions. Betang differ a great deal in length, and Betang Toyoi itself is about half the length it once was.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah rumah tertentu. Ukuran, daftar ruang, dan dimensi kayu-kayunya mengikuti pengukuran Restyanto (2012) atas Betang Toyoi di Tumbang Malahoi, yang dibangun pada 1869; susunan bilik, dapur, dan segala yang ada di halaman adalah rekonstruksi kami dari uraian. Panjang betang sangat beragam, dan Betang Toyoi sendiri kini tinggal sekitar setengah dari panjang semulanya.' },
    paras: [
      { en: 'Betang, or huma betang, is the longhouse of the Dayak Ngaju and their neighbours along the rivers of Central Kalimantan. One house held many related families. Betang ranged from about 30 m to as much as 150 m long, on posts three to five metres high.', id: 'Betang, atau huma betang, adalah rumah panjang orang Dayak Ngaju dan tetangga-tetangganya di sepanjang sungai-sungai Kalimantan Tengah. Satu rumah dihuni banyak keluarga berkerabat. Panjangnya berkisar dari sekitar 30 m hingga 150 m, di atas tiang setinggi tiga sampai lima meter.' },
      { en: 'The plan is simple. A large open hall (los) is shared by everyone and is where guests sleep; rooms (karung) for the families open off it. The kitchen is a separate building behind, joined to the house by an open deck called the karayan. The whole house is ironwood (ulin), originally put together with mortises, pegs and rattan ties and without a single nail.', id: 'Denahnya sederhana. Sebuah ruang besar terbuka (los) dipakai bersama dan menjadi tempat tamu menginap; bilik-bilik (karung) untuk keluarga membuka ke arahnya. Dapur adalah bangunan terpisah di belakang, dihubungkan dengan rumah oleh pelataran terbuka yang disebut karayan. Seluruh rumah terbuat dari kayu ulin, yang semula dirangkai dengan lubang-pen, pasak, dan ikatan rotan tanpa sebatang paku pun.' },
      { en: 'A betang stands on a river bank and faces the water. In front of it are the monuments of Kaharingan, the old religion of the Ngaju: the sandung, a small house for the bones of the dead; the sapundu, carved posts; and the tall pantar. They are raised for the tiwah, the second funeral that sends the soul on its way.', id: 'Betang berdiri di tepi sungai dan menghadap air. Di depannya ada bangunan-bangunan Kaharingan, agama lama orang Ngaju: sandung, rumah kecil bagi tulang-belulang orang mati; sapundu, tiang-tiang berukir; dan pantar yang tinggi. Semuanya didirikan untuk tiwah, upacara kematian tahap kedua yang mengantar arwah.' },
      { en: 'Very few betang are left, among them the houses at Tumbang Gagu, Tumbang Malahoi, Tumbang Korik and Tumbang Anoi. “Budaya betang”, living side by side under one roof, has outlived the buildings as an ideal in Central Kalimantan.', id: 'Betang yang tersisa sangat sedikit, di antaranya rumah di Tumbang Gagu, Tumbang Malahoi, Tumbang Korik, dan Tumbang Anoi. “Budaya betang”, hidup berdampingan di bawah satu atap, bertahan lebih lama daripada bangunannya sebagai cita-cita di Kalimantan Tengah.' },
    ],
    // Checked sources (see docs/content-review/rumah-betang.md), and books not yet checked.
    sources: [
      { text: 'Restyanto, Y. (2012). Ukuran elemen arsitektur Betang Toyoi. Jurnal Perspektif Arsitektur 7(2), 9–23.', url: 'https://e-journal.upr.ac.id/index.php/JTA/article/view/837' },
      { text: 'Guntur, M., Kurniawan, K. R., & Yunitha (2020). Betang, a traditional house of the Dayak Ngaju in Borneo: its space related to structure. SAHC 2020.', url: 'https://www.scipedia.com/public/Guntur_Kurniawan_2021a' },
      { text: 'Usop, T. B. (2014). Pelestarian arsitektur tradisional Dayak pada pengenalan ragam bentuk konstruksi dan teknologi tradisional Dayak di Kalimantan Tengah. Jurnal Perspektif Arsitektur 9(2).', url: 'https://e-journal.upr.ac.id/index.php/JTA/article/view/8956' },
      { text: 'Perkasa, P. (2010). Konservasi bangunan bersejarah di Desa Bahu Palawa. Jurnal Perspektif Arsitektur 5(1).', url: 'https://e-journal.upr.ac.id/index.php/JTA/article/view/803' },
    ],
    reading: [
      { text: 'Kampffmeyer, H. (1991). Die Langhäuser von Zentral-Kalimantan. München: Anacon.' },
      { text: 'Schärer, H. (1963). Ngaju Religion: The Conception of God among a South Borneo People. The Hague: Martinus Nijhoff.' },
      { text: 'Schiller, A. (1997). Small Sacrifices: Religious Change and Cultural Identity among the Ngaju of Indonesia. New York: Oxford University Press.' },
      { text: 'Iban, C., & Elfrida, T. (2017). Arsitektur religi pesta tiwah Dayak Ngaju sebagai daya tarik wisata budaya di Kalimantan Tengah. Atrium: Jurnal Arsitektur 3(2), 101–112.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: F + 1.4,
    views: { inside: { pos: [9, 1.7, 19.5], target: [0, 4, 0] } },
    overlay: {
      x0: -LEN, x1: LEN,
      zones: [
        { zone: 'betang', z0: -DEP, z1: DEP, text: { en: 'Betang · rooms at both ends, the hall between', id: 'Betang · bilik di kedua ujung, los di tengah' } },
        { zone: 'dapur', x0: 1, x1: 9, z0: -13.9, z1: -DEP, text: { en: 'Karayan & kitchen', id: 'Karayan & dapur' } },
        { zone: 'leluhur', x0: -15, x1: -3, z0: 10.5, z1: 17, text: { en: 'Sandung · sapundu · pantar', id: 'Sandung · sapundu · pantar' } },
        { zone: 'tapak', x0: SITE.x0, x1: SITE.x1, z0: SITE.river, z1: SITE.z1, text: { en: 'River', id: 'Sungai' } },
      ],
      axis: { from: [0, SITE.river], to: [0, DEP], text: { en: 'River → stair → door', id: 'Sungai → tangga → pintu' } },
    },
    // Guided walk from the river, through the house, to the kitchen.
    walk: {
      stops: [
        {
          title: 'Betang', local: { en: 'From the river', id: 'Dari sungai' },
          pos: [11, 1.7, 23.5], target: [0, 4, 0],
          text: { en: 'You arrive by river. The house stands along the bank, thirty-six metres of ironwood lifted above your head on posts, under one long roof.', id: 'Anda datang lewat sungai. Rumah berdiri memanjang di tepian, tiga puluh enam meter kayu ulin yang terangkat di atas kepala pada tiang-tiang, di bawah satu atap panjang.' },
        },
        {
          title: 'Sandung', local: { en: 'The house of the dead', id: 'Rumah orang mati' }, buildings: ['leluhur'],
          pos: [-4, 1.7, 19], target: [-9.5, 2.6, 13],
          text: { en: 'Before the house stand the dead. The small house on posts is the sandung, which holds their bones; the carved posts are sapundu and the tall poles pantar, all raised for the tiwah.', id: 'Di depan rumah berdiri orang-orang mati. Rumah kecil di atas tiang adalah sandung, yang menyimpan tulang-belulang mereka; tiang berukir adalah sapundu dan tiang tinggi adalah pantar, semuanya didirikan untuk tiwah.' },
        },
        {
          title: 'Hejan', local: { en: 'The main stair', id: 'Tangga utama' },
          pos: [3.2, 1.6, 11.6], target: [0, 2.7, 5],
          text: { en: 'One stair leads to one door. It is solid ironwood, in two flights of five and six steps, and a carved tiger stands on a post at each side.', id: 'Satu tangga menuju satu pintu. Tangga ini dari ulin utuh, dalam dua bagian berisi lima dan enam anak tangga, dan di tiap sisinya berdiri patung harimau di atas tiang.' },
        },
        {
          title: 'Los', local: { en: 'The hall', id: 'Ruang tengah' },
          pos: [-7.5, E, 2.9], target: [2, E - 0.2, -0.4], via: [[0, 2.2, 8.4], [0, E, 4.2]],
          text: { en: 'Inside is the los, a hall twenty metres long that everyone shares and where guests sleep. Four great posts stand in the middle, and the walls stop short of the roof to let the air through.', id: 'Di dalam terdapat los, ruang sepanjang dua puluh meter yang dipakai bersama dan tempat tamu menginap. Empat tiang agung berdiri di tengah, dan dinding tidak sampai ke atap agar udara mengalir.' },
        },
        {
          title: 'Karung', local: { en: 'The family rooms', id: 'Bilik keluarga' },
          pos: [10.9, E, 0], target: [17.6, E - 0.3, 0], via: [[7.5, E, 0]],
          text: { en: 'At each end a passage runs between four rooms. Each room is the home of one family: eight families under this roof, with a small room for guests and one for the heirlooms.', id: 'Di tiap ujung, sebuah lorong diapit empat bilik. Setiap bilik adalah rumah satu keluarga: delapan keluarga di bawah atap ini, dengan satu bilik kecil untuk tamu dan satu untuk pusaka.' },
        },
        {
          title: 'Karayan', local: { en: 'Out to the kitchen', id: 'Menuju dapur' }, buildings: ['dapur'],
          pos: [BACK_DOORS.kitchen, E, -DEP - 0.7], target: [BACK_DOORS.kitchen, E - 0.9, -13], via: [[7.5, E, 0], [BACK_DOORS.kitchen, E, -3.4]],
          text: { en: 'A back door opens onto the karayan, an open deck for resting and for drying rice and fish. Across it is the kitchen, a building of its own where every family has its hearth.', id: 'Pintu belakang membuka ke karayan, pelataran terbuka untuk beristirahat serta menjemur padi dan ikan. Di seberangnya ada dapur, bangunan tersendiri tempat setiap keluarga memiliki tungkunya.' },
        },
        {
          title: 'Jihi', local: { en: 'Under the floor', id: 'Di bawah lantai' },
          pos: [-9.5, 1.5, 8.2], target: [1, 1.7, -1],
          text: { en: 'Underneath is a forest of ironwood. The thick posts, the jihi, rise through the floor to the roof; the thinner tungket stop at the floor beams. In this reading of the house, this is the lower world.', id: 'Di bawahnya ada hutan kayu ulin. Tiang-tiang besar, jihi, menembus lantai hingga ke atap; tungket yang lebih kecil berhenti di balok lantai. Dalam pembacaan rumah ini, inilah alam bawah.' },
        },
        {
          title: { en: 'Reading the betang', id: 'Membaca betang' }, local: { en: 'From above', id: 'Dari atas' }, overlay: true,
          pos: [28, 30, 38], target: [0, 2, 2],
          text: { en: 'From above: the river, the dead in the yard, one stair to one door, the long house of the living, and the kitchen set apart behind it.', id: 'Dari atas: sungai, orang mati di halaman, satu tangga menuju satu pintu, rumah panjang orang hidup, dan dapur yang dipisahkan di belakangnya.' },
        },
      ],
    },
  },

  slots: [
    { id: 'roof', label: { en: 'Shingles', id: 'Sirap' }, tex: 'tile', clay: '#d6d0c4' },
    { id: 'wood', label: { en: 'Ironwood', id: 'Kayu ulin' }, tex: 'wood' },
    { id: 'bark', label: { en: 'Bark walls', id: 'Dinding kulit kayu' }, tex: 'wood' },
    { id: 'plank', label: { en: 'Boards', id: 'Papan' }, tex: 'wood' },
    { id: 'rattan', label: { en: 'Rattan', id: 'Rotan' }, tex: null },
    { id: 'ornament', label: { en: 'Carving', id: 'Ukiran' }, tex: null },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', ui: false, clay: '#d2cdc5' },
    { id: 'earth', label: { en: 'Clay', id: 'Tanah liat' }, tex: null, ui: false },
    { id: 'dark', label: { en: 'Openings', id: 'Lubang' }, tex: null, ui: false },
    { id: 'water', label: { en: 'River', id: 'Sungai' }, tex: null, ui: false, glossy: true, clay: '#d9dfe2' },
    { id: 'ground', label: { en: 'Ground', id: 'Tanah' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    tua: {
      label: { en: 'Tua · weathered ironwood', id: 'Tua · ulin lapuk' }, rough: 0.9, metal: {},
      colors: { roof: '#6f6a62', wood: '#5a4a3c', bark: '#7b6248', plank: '#6d5846', rattan: '#b89a62', ornament: '#4b3a2e', stone: '#8a857c', earth: '#8a5a3c', dark: '#1d1814', water: '#6d8387', ground: '#a69a7c' },
    },
    baru: {
      label: { en: 'Baru · fresh ironwood', id: 'Baru · ulin baru' }, rough: 0.8, metal: {},
      colors: { roof: '#8a6e52', wood: '#74543a', bark: '#94714c', plank: '#8a6a4a', rattan: '#cdb07a', ornament: '#5e4532', stone: '#8f8a80', earth: '#9a643f', dark: '#1d1814', water: '#6d8387', ground: '#b0a384' },
    },
    papan: {
      label: { en: 'Dinding papan · board walls', id: 'Dinding papan' }, rough: 0.85, metal: {},
      colors: { roof: '#6f6a62', wood: '#5a4a3c', bark: '#6d5846', plank: '#6d5846', rattan: '#6d5846', ornament: '#4b3a2e', stone: '#8a857c', earth: '#8a5a3c', dark: '#1d1814', water: '#6d8387', ground: '#a69a7c' },
    },
  },
};
