// Rumah Krong Bade (Aceh): a rumoh Aceh in its yard, with the krong padé (rice granary)
// beside it, a bamboo fence and a roofed gateway.
// Site coordinates: x runs east, north is +z. The house lies east–west and faces north.
import { rumoh, GEOM } from './rumoh.js';
import { krong, yard, YARD } from './pekarangan.js';

const ZONES = [
  { id: 'rumoh',      label: { en: 'House', id: 'Rumah' },        local: 'Rumoh Aceh', color: '#b0624a' },
  { id: 'lumbung',    label: { en: 'Granary', id: 'Lumbung' },    local: 'Krong padé', color: '#c58a4a' },
  { id: 'pekarangan', label: { en: 'Yard', id: 'Pekarangan' },    local: 'Pekarangan', color: '#7f8a6a' },
];

const { F, MID, ROWS, X, Z } = GEOM;
const E = F + 1.6;

const BUILDINGS = [
  {
    id: 'rumoh', def: rumoh, at: [0, 0], rot: 0, zone: 'rumoh',
    name: 'Rumoh Aceh', alias: 'Rumah Krong Bade', en: { en: 'Acehnese house', id: 'Rumah Aceh' },
    desc: { en: 'A long timber house on 24 round posts, its ridge running east–west, entered by a steep stair on the north side.', id: 'Rumah kayu memanjang di atas 24 tiang bulat, bubungannya membujur timur–barat, dimasuki lewat tangga curam di sisi utara.' },
    fn: { en: 'Home of one family. The front gallery is for men and guests, the raised middle for the bedrooms, the back gallery for women and the kitchen.', id: 'Rumah satu keluarga. Serambi depan untuk kaum lelaki dan tamu, bagian tengah yang ditinggikan untuk kamar tidur, serambi belakang untuk kaum perempuan dan dapur.' },
    meaning: { en: 'The house grows by its ruang, the bays between posts: three, five, seven, up to ten. This one has five.', id: 'Rumah bertambah besar menurut ruang-nya, petak di antara tiang: tiga, lima, tujuh, hingga sepuluh. Rumah ini lima ruang.' },
    specs: [`${(2 * X).toFixed(1)} × ${(2 * Z).toFixed(1)} m`, { en: '24 posts', id: '24 tiang' }, { en: '5 ruang', id: '5 ruang' }],
  },
  {
    id: 'krong', def: krong, at: [0, 0], rot: 0, zone: 'lumbung',
    name: 'Krong Padé', alias: 'Lumbung padi', en: { en: 'Rice granary', id: 'Lumbung padi' },
    desc: { en: 'A small rice store beside the house: a bamboo bin on a raised floor, under its own little roof.', id: 'Penyimpanan padi kecil di samping rumah: wadah bambu di atas lantai panggung, di bawah atapnya sendiri.' },
    fn: { en: 'Holds the family’s rice in the husk.', id: 'Menyimpan padi keluarga yang masih berkulit.' },
    meaning: { en: 'Unlike the granaries of Java, an Acehnese granary keeps unhusked rice.', id: 'Berbeda dengan lumbung di Jawa, lumbung Aceh menyimpan padi yang masih berkulit.' },
    specs: [{ en: 'Unhusked rice', id: 'Padi berkulit' }],
  },
  {
    id: 'pekarangan', def: yard, at: [0, 0], rot: 0, zone: 'pekarangan',
    name: 'Pekarangan & Keupaleh', alias: 'Halaman dan gerbang', en: { en: 'Yard and gateway', id: 'Halaman dan gerbang' },
    desc: { en: 'The fenced yard round the house, with shade trees and a roofed gateway on the north side.', id: 'Halaman berpagar di sekeliling rumah, dengan pohon peneduh dan gerbang beratap di sisi utara.' },
    fn: { en: 'Daily work, drying, children’s play, and room for guests at feasts.', id: 'Pekerjaan sehari-hari, menjemur, bermain anak-anak, dan tempat tamu saat kenduri.' },
    meaning: { en: 'The yard and its fence mark one household’s ground in the gampong.', id: 'Halaman dan pagarnya menandai tanah satu rumah tangga di gampong.' },
    specs: [`${2 * YARD.x} × ${YARD.z1 - YARD.z0} m`],
  },
];

export default {
  loading: { en: 'Pegging the frame…', id: 'Memasang pasak…' },
  about: {
    title: { en: 'The Rumoh Aceh', id: 'Rumoh Aceh' },
    method: { en: 'This is a reconstruction of an ideal type, not a record of a particular house. The post grid (four rows, 2.5 m apart), the door and window sizes, the layout of the three parts and the east–west orientation follow published descriptions; the heights, the roof and the yard are our own estimates. Houses were measured in the old Acehnese units, so real ones differ in size.', id: 'Ini adalah rekonstruksi tipe ideal, bukan rekaman sebuah rumah tertentu. Grid tiangnya (empat baris, berjarak 2,5 m), ukuran pintu dan jendela, tata letak tiga bagiannya, dan arah timur–baratnya mengikuti uraian yang telah terbit; tinggi, atap, dan halamannya adalah perkiraan kami sendiri. Rumah diukur dengan satuan lama Aceh, sehingga ukuran rumah yang nyata beragam.' },
    paras: [
      { en: 'The rumoh Aceh is the traditional house of the Acehnese, at the northern tip of Sumatra. Elsewhere in Indonesia it is often called Krong Bade, a name that seems to come from krong padé, the rice granary that stands beside it.', id: 'Rumoh Aceh adalah rumah tradisional orang Aceh, di ujung utara Sumatera. Di tempat lain di Indonesia rumah ini sering disebut Krong Bade, nama yang tampaknya berasal dari krong padé, lumbung padi yang berdiri di sampingnya.' },
      { en: 'It is a long house of timber on round posts set out in four rows. Every house lies east–west, so that its gables point towards the qibla, and is entered on the long side. Across its depth it has three parts: the seuramoe keue at the front, for men and guests; the rumoh inong in the middle, raised half a metre, with the bedrooms; and the seuramoe likot at the back, for women and the kitchen.', id: 'Rumah ini berupa rumah kayu memanjang di atas tiang-tiang bulat yang tersusun dalam empat baris. Setiap rumah membujur timur–barat, sehingga gunungannya mengarah ke kiblat, dan dimasuki dari sisi panjangnya. Dari depan ke belakang ada tiga bagian: seuramoe keue di depan, untuk kaum lelaki dan tamu; rumoh inong di tengah, ditinggikan setengah meter, dengan kamar-kamar tidur; dan seuramoe likot di belakang, untuk kaum perempuan dan dapur.' },
      { en: 'A house is put together with pegs and without nails, and is counted by its posts, always an even number. Two of them, the tameh raja and the tameh putroe, are honoured above the rest. The house passes down to the daughters, and a father begins gathering timber for one when his daughter is still a child.', id: 'Rumah dirakit dengan pasak tanpa paku, dan dihitung menurut tiangnya, selalu genap. Dua di antaranya, tameh raja dan tameh putroe, dimuliakan di atas yang lain. Rumah diwariskan kepada anak perempuan, dan seorang ayah mulai mengumpulkan kayu untuknya ketika putrinya masih kanak-kanak.' },
      { en: 'Few original houses survive. Timber has become scarce, the houses are costly to keep, and many have been altered: zinc roofs, rooms added underneath and kitchens built on behind.', id: 'Rumah asli yang tersisa sedikit. Kayu makin langka, rumah ini mahal perawatannya, dan banyak yang telah diubah: atap seng, ruang tambahan di kolong, dan dapur yang dibangun di belakang.' },
    ],
    // Checked sources (see docs/content-review/krong-bade.md), and books not yet checked.
    sources: [
      { text: 'Andriani, D., Muliana, E., & Olivia, S. (2025). Pudarnya jati diri arsitektur khas Indonesia (studi kasus bangunan-bangunan dengan penerapan arsitektur rumoh Aceh di Kota Lhokseumawe). Jurnal Vastutara 1(1), 28–39.', url: 'https://ejournal.uinsaizu.ac.id/index.php/vastutara' },
      { text: 'Hendra A. (2021). Transformasi ruang pada rumoh Aceh. Arsir 5(2), 164–176.', url: 'https://jurnal.um-palembang.ac.id/arsir/article/view/3812' },
      { text: { en: 'Rumoh Aceh. Wikipedia (for the works it cites: Schefold, Nas & Domenig 2003; Snouck Hurgronje 1893; Waterson 2006).', id: 'Rumoh Aceh. Wikipedia (untuk karya yang dirujuknya: Schefold, Nas & Domenig 2003; Snouck Hurgronje 1893; Waterson 2006).' }, url: 'https://en.wikipedia.org/wiki/Rumoh_Aceh' },
    ],
    reading: [
      { text: 'Snouck Hurgronje, C. (1893). De Atjèhers, deel I. Leiden: Brill. (English: The Achehnese, 1906.)' },
      { text: 'Schefold, R., Nas, P. J. M., & Domenig, G. (eds.) (2003). Indonesian Houses: Tradition and Transformation in Vernacular Architecture, vol. 1. Leiden: KITLV Press.' },
      { text: 'Yusriadi (2013). Arsitektur Rumah Aceh. Banda Aceh: Majelis Adat Aceh.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: MID + 1.2,
    views: { inside: { pos: [5, 1.7, YARD.z1 + 4], target: [0, 4, 0] } },
    overlay: {
      x0: -X, x1: X,
      zones: [
        { zone: 'rumoh', z0: ROWS[1], z1: Z, text: { en: 'Seuramoe keue · men, guests', id: 'Seuramoe keue · lelaki, tamu' } },
        { zone: 'lumbung', z0: ROWS[2], z1: ROWS[1], text: { en: 'Rumoh inong · bedrooms, raised', id: 'Rumoh inong · kamar tidur, ditinggikan' } },
        { zone: 'pekarangan', z0: -Z, z1: ROWS[2], text: { en: 'Seuramoe likot · women, kitchen', id: 'Seuramoe likot · perempuan, dapur' } },
      ],
      axis: { from: [X + 6, 0], to: [-X - 6, 0], text: { en: 'East → west · towards the qibla', id: 'Timur → barat · ke arah kiblat' } },
    },
    // Guided walk from the gateway into the house and through its three parts.
    walk: {
      stops: [
        {
          title: 'Rumoh Aceh', local: { en: 'The house in its yard', id: 'Rumah di halamannya' },
          pos: [4, 1.7, YARD.z1 + 5], target: [0, 4.5, 0],
          text: { en: 'Through the gateway is a long house high on round posts, its steep thatched roof running east to west, with the small rice granary beside it.', id: 'Di balik gerbang ada rumah panjang yang tinggi di atas tiang-tiang bulat, atap rumbianya yang curam membujur dari timur ke barat, dengan lumbung padi kecil di sampingnya.' },
        },
        {
          title: 'Yup Moh', local: { en: 'Under the house', id: 'Di kolong rumah' },
          pos: [-1.5, 1.4, Z + 1.8], target: [-3.6, 0.9, 0], via: [[0, 1.6, YARD.z1 - 3]],
          text: { en: 'The floor is two and a half metres up. Underneath is a shaded room without walls: a bench to sit on, a loom for weaving songket, a place for children to play.', id: 'Lantainya dua setengah meter di atas tanah. Di bawahnya ada ruang teduh tanpa dinding: bangku untuk duduk, alat tenun songket, tempat anak-anak bermain.' },
        },
        {
          title: 'Seuramoe Keue', local: { en: 'The front gallery', id: 'Serambi depan' },
          pos: [3.8, E, ROWS[0] - 0.4], target: [-4, F + 1.2, ROWS[0] - 0.9], via: [[0, 1.6, Z + 2.6], [0, E, Z + 0.5], [0, E, ROWS[0]]],
          text: { en: 'Up the stair and through the door is the front gallery, running the whole length of the house. Guests are received here, the boys of the house sleep here, and at a feast the meal is served here.', id: 'Naik tangga dan melewati pintu, ada serambi depan yang membentang sepanjang rumah. Tamu diterima di sini, anak laki-laki tidur di sini, dan saat kenduri hidangan disajikan di sini.' },
        },
        {
          title: 'Tameh Raja', local: { en: 'The king post', id: 'Tiang raja' },
          pos: [0.3, E, ROWS[1] + 0.9], target: [-1.25, F + 1.4, ROWS[1]],
          text: { en: 'Two posts stand out from the rest: the tameh raja here on the north side of the bedrooms, and the tameh putroe on the south, with a piece of gold set into it.', id: 'Dua tiang istimewa di antara yang lain: tameh raja di sini, di sisi utara kamar-kamar tidur, dan tameh putroe di sisi selatan, dengan sepotong emas tersisip di dalamnya.' },
        },
        {
          title: 'Rumoh Inong', local: { en: 'The raised middle', id: 'Bagian tengah' },
          pos: [0.3, MID + 1.6, 0.6], target: [-4.2, MID + 0.7, -0.2], via: [[0, MID + 1.6, ROWS[1] + 0.3]],
          text: { en: 'A step up leads into the middle of the house, half a metre higher. A passage runs between two bedrooms: the jurei to the west for the parents, the anjong to the east for the daughter.', id: 'Satu anak tangga mengantar ke bagian tengah rumah, setengah meter lebih tinggi. Sebuah lorong membentang di antara dua kamar tidur: jurei di barat untuk orang tua, anjong di timur untuk anak gadis.' },
        },
        {
          title: 'Seuramoe Likot', local: { en: 'The back gallery', id: 'Serambi belakang' },
          pos: [-2, E, ROWS[3] + 0.9], target: [4.6, F + 0.6, ROWS[3] + 0.2], via: [[0, MID + 1.6, ROWS[2] - 0.2]],
          text: { en: 'Behind is the back gallery, the women’s side, where the family cooks and eats and where women guests are received. It is the most private part of the house.', id: 'Di belakang ada serambi belakang, sisi kaum perempuan, tempat keluarga memasak dan makan serta tempat tamu perempuan diterima. Inilah bagian rumah yang paling privat.' },
        },
        {
          title: { en: 'Reading the house', id: 'Membaca rumah' }, local: { en: 'From above', id: 'Dari atas' }, overlay: true,
          pos: [22, 26, 24], target: [0, 2, 0],
          text: { en: 'From above: the long axis pointing west to Mecca, and three bands from front to back, from the public gallery of the men through the raised bedrooms to the private gallery of the women.', id: 'Dari atas: sumbu panjang yang mengarah ke barat, ke Mekkah, dan tiga lajur dari depan ke belakang, dari serambi publik kaum lelaki, melewati kamar-kamar yang ditinggikan, hingga serambi privat kaum perempuan.' },
        },
      ],
    },
  },

  slots: [
    { id: 'roof', label: { en: 'Thatch', id: 'Rumbia' }, tex: 'thatch', clay: '#dcd4c6' },
    { id: 'gorga', label: { en: 'Carving', id: 'Ukiran' }, tex: 'ukiran' },
    { id: 'wood', label: { en: 'Timber', id: 'Kayu' }, tex: 'wood' },
    { id: 'plank', label: { en: 'Boards', id: 'Papan' }, tex: 'wood' },
    { id: 'bamboo', label: { en: 'Woven bamboo', id: 'Anyaman bambu' }, tex: 'bamboo' },
    { id: 'rattan', label: { en: 'Rattan', id: 'Rotan' }, tex: null, ui: false },
    { id: 'accent', label: { en: 'Cloth', id: 'Kain' }, tex: null },
    { id: 'ornament', label: { en: 'Ridge', id: 'Bubungan' }, tex: null, ui: false },
    { id: 'stone', label: { en: 'Stone', id: 'Batu' }, tex: 'stone', clay: '#d2cdc5' },
    { id: 'earth', label: { en: 'Clay', id: 'Tanah liat' }, tex: null, ui: false },
    { id: 'leaf', label: { en: 'Leaves', id: 'Daun' }, tex: null, ui: false, clay: '#cfd3c2' },
    { id: 'yard', label: { en: 'Yard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
    { id: 'ground', label: { en: 'Ground', id: 'Tanah' }, tex: 'stone', ui: false, clay: '#e4e0d6' },
  ],
  presets: {
    rumbia: {
      label: { en: 'Rumbia · sago thatch', id: 'Rumbia · atap rumbia' }, rough: 0.9, metal: {},
      colors: { roof: '#9b8458', gorga: '#7a5236', wood: '#5c4331', plank: '#7a5c42', bamboo: '#c2a571', rattan: '#b89a62', accent: '#a83a2c', ornament: '#5a4836', stone: '#8a867d', earth: '#8f5f3e', leaf: '#5d8447', yard: '#b8a786', ground: '#8a9866' },
    },
    cat: {
      label: { en: 'Cat · painted carving', id: 'Cat · ukiran berwarna' }, rough: 0.8, metal: {},
      colors: { roof: '#8d7a56', gorga: '#2f6a4a', wood: '#5c4331', plank: '#6e4f37', bamboo: '#c2a571', rattan: '#b89a62', accent: '#c4a033', ornament: '#5a4836', stone: '#8a867d', earth: '#8f5f3e', leaf: '#5d8447', yard: '#b8a786', ground: '#8a9866' },
    },
    seng: {
      label: { en: 'Atap seng · zinc roof', id: 'Atap seng' }, rough: 0.55, metal: { roof: 0.6 }, tex: { roof: null },
      colors: { roof: '#9aa0a6', gorga: '#7a5236', wood: '#5c4331', plank: '#7a5c42', bamboo: '#c2a571', rattan: '#b89a62', accent: '#a83a2c', ornament: '#5a4836', stone: '#8a867d', earth: '#8f5f3e', leaf: '#5d8447', yard: '#b8a786', ground: '#8a9866' },
    },
  },
};
