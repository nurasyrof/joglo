// Joglo (Yogyakarta): a complete Javanese omah compound.
// Site coordinates: the regol and the front of the compound face +z; the central axis is x = 0.
import pendapa from './buildings/pendapa.js';
import pringgitan from './buildings/pringgitan.js';
import dalem from './buildings/dalem.js';
import gandhok from './buildings/gandhok.js';
import gadri from './buildings/gadri.js';
import pawon from './buildings/pawon.js';
import pekiwan from './buildings/pekiwan.js';
import regol from './buildings/regol.js';

const ZONES = [
  { id: 'public',    label: { en: 'Public', id: 'Publik' },    local: 'Ngarep', color: '#dcab52' },
  { id: 'threshold', label: { en: 'Threshold', id: 'Ambang' }, local: 'Tengah', color: '#e08a4a' },
  { id: 'family',    label: { en: 'Family', id: 'Keluarga' },    local: 'Njero',  color: '#cf5b3f' },
  { id: 'service',   label: { en: 'Service', id: 'Servis' },   local: 'Mburi',  color: '#7fa37a' },
  { id: 'boundary',  label: { en: 'Boundary', id: 'Batas' },  local: 'Wates',  color: '#9a948a' },
];

const BUILDINGS = [
  {
    id: 'pendapa', def: pendapa, at: [0, 6], rot: 0, zone: 'public',
    name: 'Pendapa', alias: 'Pendhapa', en: { en: 'Open reception pavilion', id: 'Pendapa terbuka untuk menerima tamu' },
    desc: { en: 'The large open pavilion at the front of the compound, under a three-tier joglo roof carried by four saka guru.', id: 'Bangunan terbuka yang luas di bagian depan kompleks, di bawah atap joglo tiga susun yang dipikul empat saka guru.' },
    fn: { en: 'Where the family receives guests and holds meetings, ceremonies, dances and gamelan performances.', id: 'Tempat keluarga menerima tamu serta menggelar pertemuan, upacara, tari, dan pergelaran gamelan.' },
    meaning: { en: 'The public face of the household: open on all sides, it shows hospitality and standing to the community.', id: 'Wajah publik rumah tangga: terbuka di semua sisi, menunjukkan keramahan dan kedudukan keluarga kepada masyarakat.' },
    specs: ['16.6 × 14.6 m', { en: 'Joglo roof', id: 'Atap joglo' }, { en: 'No walls', id: 'Tanpa dinding' }],
  },
  {
    id: 'pringgitan', def: pringgitan, at: [0, -5.95], rot: 0, zone: 'threshold',
    name: 'Pringgitan', alias: 'Paringgitan', en: { en: 'Connecting hall', id: 'Ruang penghubung' },
    desc: { en: 'A narrower hall between the pendapa and the dalem, under a lower limasan roof.', id: 'Ruang yang lebih sempit di antara pendapa dan dalem, di bawah atap limasan yang lebih rendah.' },
    fn: { en: 'The passage from the public pendapa to the private dalem, and the place where wayang kulit shadow plays are staged.', id: 'Peralihan dari pendapa yang publik ke dalem yang privat, sekaligus tempat pertunjukan wayang kulit.' },
    meaning: { en: 'Its name comes from ringgit (wayang puppet). It is the threshold between guests and family.', id: 'Namanya berasal dari ringgit (wayang). Ia adalah ambang antara tamu dan keluarga.' },
    specs: ['16.4 × 7.9 m', { en: 'Limasan roof', id: 'Atap limasan' }],
  },
  {
    id: 'dalem', def: dalem, at: [0, -17], rot: 0, zone: 'family',
    name: 'Dalem', alias: 'Dalem ageng', en: { en: 'Main family house', id: 'Rumah induk keluarga' },
    desc: { en: 'The enclosed heart of the compound: a joglo like the pendapa, but walled in with a carved gebyok front, with three senthong rooms at the back.', id: 'Jantung kompleks yang tertutup: joglo seperti pendapa, tetapi berdinding dengan gebyok berukir di depan dan tiga senthong di belakang.' },
    fn: { en: 'Home of the family. Guests rarely go further than the pringgitan.', id: 'Tempat tinggal keluarga. Tamu jarang masuk lebih jauh dari pringgitan.' },
    meaning: { en: 'The most private and sacred building. The central axis of the compound ends at its senthong tengah.', id: 'Bangunan yang paling privat dan sakral. Sumbu tengah kompleks berakhir di senthong tengahnya.' },
    specs: ['17.0 × 14.8 m', { en: 'Joglo roof', id: 'Atap joglo' }, '3 senthong'],
  },
  {
    id: 'gandhok_kiwa', def: gandhok, at: [-15.5, -17], rot: Math.PI / 2, zone: 'family',
    name: 'Gandhok Kiwa', alias: 'Gandhok', en: { en: 'Left side wing', id: 'Sayap kiri' },
    desc: { en: 'A long wing along one side of the dalem, with a row of rooms opening onto the family yard.', id: 'Sayap panjang di satu sisi dalem, dengan deretan kamar yang membuka ke halaman keluarga.' },
    fn: { en: 'Extra bedrooms for family members and guests, and storage.', id: 'Kamar tambahan untuk anggota keluarga dan tamu, serta tempat menyimpan barang.' },
    meaning: { en: 'The wings frame the dalem and enclose a private yard around it.', id: 'Kedua sayap membingkai dalem dan melingkupi halaman privat di sekelilingnya.' },
    specs: ['18.4 × 6.4 m', { en: 'Kampung roof', id: 'Atap kampung' }],
  },
  {
    id: 'gandhok_tengen', def: gandhok, at: [15.5, -17], rot: -Math.PI / 2, zone: 'family',
    name: 'Gandhok Tengen', alias: 'Gandhok', en: { en: 'Right side wing', id: 'Sayap kanan' },
    desc: { en: 'The matching wing on the other side of the dalem.', id: 'Sayap pasangannya di sisi lain dalem.' },
    fn: { en: 'Extra bedrooms and storage.', id: 'Kamar tambahan dan tempat menyimpan barang.' },
    meaning: { en: 'Paired wings give the compound its balanced, symmetrical plan.', id: 'Sepasang sayap memberi kompleks denah yang seimbang dan simetris.' },
    specs: ['18.4 × 6.4 m', { en: 'Kampung roof', id: 'Atap kampung' }],
  },
  {
    id: 'gadri', def: gadri, at: [0, -28.3], rot: 0, zone: 'family',
    name: 'Gadri', alias: 'Gadri', en: { en: 'Family room', id: 'Ruang keluarga' },
    desc: { en: 'An open-fronted room behind the dalem.', id: 'Ruang dengan bagian depan terbuka di belakang dalem.' },
    fn: { en: 'Often used for family meals and daily life; in some houses it is part of the kitchen area.', id: 'Sering dipakai untuk makan bersama dan kegiatan sehari-hari; di beberapa rumah ia menjadi bagian dari area dapur.' },
    meaning: { en: 'Everyday life happens at the back, away from the formal front and the sacred dalem.', id: 'Kehidupan sehari-hari berlangsung di belakang, jauh dari bagian depan yang resmi dan dalem yang sakral.' },
    specs: ['14.4 × 6.6 m', { en: 'Limasan roof', id: 'Atap limasan' }],
  },
  {
    id: 'pawon', def: pawon, at: [-13.5, -31.5], rot: 0, zone: 'service',
    name: 'Pawon', alias: 'Pawon', en: { en: 'Kitchen', id: 'Dapur' },
    desc: { en: 'The kitchen, with woven bamboo walls and a clay wood-fired stove (luweng).', id: 'Dapur berdinding anyaman bambu dengan tungku kayu bakar dari tanah liat (luweng).' },
    fn: { en: 'Cooking for the household.', id: 'Memasak untuk rumah tangga.' },
    meaning: { en: 'Smoke, fire and daily work are kept at the back of the compound.', id: 'Asap, api, dan pekerjaan sehari-hari ditempatkan di belakang kompleks.' },
    specs: ['9.4 × 6.4 m', { en: 'Kampung roof', id: 'Atap kampung' }],
  },
  {
    id: 'pekiwan', def: pekiwan, at: [13.5, -32], rot: 0, zone: 'service',
    name: 'Pekiwan', alias: 'Pekiwan & sumur', en: { en: 'Well and washroom', id: 'Sumur dan kamar mandi' },
    desc: { en: 'The well with its small roof and an open bamboo bathing enclosure.', id: 'Sumur dengan atap kecilnya dan bilik mandi bambu yang terbuka.' },
    fn: { en: 'Water for bathing, washing and cooking.', id: 'Air untuk mandi, mencuci, dan memasak.' },
    meaning: { en: 'Placed in the far back corner, the least formal part of the compound.', id: 'Terletak di sudut paling belakang, bagian kompleks yang paling tidak resmi.' },
    specs: [{ en: 'Well', id: 'Sumur' }, { en: 'Bathing enclosure', id: 'Bilik mandi' }],
  },
  {
    id: 'regol', def: regol, at: [0, 0], rot: 0, zone: 'boundary',
    name: 'Regol & Pagar', alias: 'Regol, pagar, seketheng', en: { en: 'Gate, walls and courtyard', id: 'Gerbang, pagar, dan halaman' },
    desc: { en: 'The perimeter wall with its gateway, the seketheng walls dividing front from back, and the open courtyard.', id: 'Pagar keliling dengan gerbangnya, tembok seketheng yang memisahkan depan dari belakang, dan halaman terbuka.' },
    fn: { en: 'Enclose the compound and control movement from the street to the family areas.', id: 'Melingkupi kompleks dan mengatur pergerakan dari jalan menuju area keluarga.' },
    meaning: { en: 'Every threshold (regol, then seketheng, then gebyok) takes you one step deeper into the household.', id: 'Setiap ambang (regol, lalu seketheng, lalu gebyok) membawa Anda selangkah lebih dalam ke rumah tangga.' },
    specs: ['46 × 57 m', { en: '1 gate', id: '1 gerbang' }, '2 seketheng'],
  },
];

export default {
  loading: { en: 'Laying out the omah…', id: 'Menata omah…' },
  about: {
    title: { en: 'The Joglo of Yogyakarta', id: 'Joglo Yogyakarta' },
    paras: [
      { en: 'The joglo is the most prestigious form of the traditional Javanese house. Its steep central roof over four master columns was once reserved for the nobility (priyayi) and the courts of Yogyakarta and Surakarta.', id: 'Joglo adalah bentuk rumah tradisional Jawa yang paling bergengsi. Atap tengahnya yang curam di atas empat tiang utama dulu diperuntukkan bagi kaum bangsawan (priyayi) dan keraton Yogyakarta serta Surakarta.' },
      { en: 'A joglo is not one building but a compound (omah) laid out along a central axis, from public to private. The regol gate opens onto a courtyard and the open pendapa, where guests are received. Behind it the pringgitan, a stage for wayang, leads to the enclosed dalem, the family’s home, whose three senthong rooms close the axis. Side wings (gandhok), a family room (gadri), the kitchen (pawon) and the well (pekiwan) complete it.', id: 'Joglo bukan satu bangunan, melainkan sebuah kompleks (omah) yang ditata di sepanjang sumbu tengah, dari publik ke privat. Gerbang regol membuka ke halaman dan pendapa terbuka, tempat tamu diterima. Di belakangnya, pringgitan, panggung untuk wayang, menuju dalem yang tertutup, tempat tinggal keluarga, yang tiga senthongnya menutup sumbu itu. Sayap samping (gandhok), ruang keluarga (gadri), dapur (pawon), dan sumur (pekiwan) melengkapinya.' },
      { en: 'The frame is held together by timber joints rather than nails and rests on stone bases, so it can be taken apart and rebuilt elsewhere. In the 2006 Yogyakarta earthquake, the stiff core around the four saka guru generally held up better than the lighter outer frame.', id: 'Rangkanya disatukan dengan sambungan kayu, bukan paku, dan bertumpu di atas umpak batu, sehingga bisa dibongkar dan didirikan kembali di tempat lain. Dalam gempa Yogyakarta 2006, inti yang kaku di sekeliling empat saka guru umumnya bertahan lebih baik daripada rangka luar yang lebih ringan.' },
      { en: 'This model is an idealised compound for learning. Real households vary widely in size, layout and which buildings they have.', id: 'Model ini adalah kompleks yang diidealkan untuk belajar. Rumah sebenarnya sangat beragam dalam ukuran, tata letak, dan bangunan yang dimiliki.' },
    ],
  },

  site: {
    categories: ZONES,
    buildings: BUILDINGS,
    sectionY: 1.6,
    views: { inside: { pos: [0, 1.7, 18.3], target: [0, 3.2, 6] } },
    // Site logic overlay: bands from public (front) to service (back), and the central axis.
    overlay: {
      x0: -23, x1: 23,
      zones: [
        { zone: 'public', z0: -3, z1: 20, text: { en: 'Ngarep · public front', id: 'Ngarep · bagian depan yang publik' } },
        { zone: 'threshold', z0: -10, z1: -3, text: { en: 'Tengah · threshold', id: 'Tengah · ambang' } },
        { zone: 'family', z0: -25, z1: -10, text: { en: 'Njero · family', id: 'Njero · keluarga' } },
        { zone: 'service', z0: -37, z1: -25, text: { en: 'Mburi · service', id: 'Mburi · servis' } },
      ],
      axis: { from: [0, 20], to: [0, -22.6], text: { en: 'Central axis · regol → senthong tengah', id: 'Sumbu tengah · regol → senthong tengah' } },
    },
    // Guided walk along the central axis, from the street to the senthong tengah.
    // pos/target are camera position and look-at point in site coordinates (eye level ≈ floor + 1.65 m).
    // `buildings` glow while the stop is shown; use it only for views from outside.
    walk: {
      stops: [
        {
          title: 'Regol', local: { en: 'The gateway', id: 'Gerbang' }, buildings: ['regol'],
          pos: [0, 1.65, 31], target: [0, 2.4, 20],
          text: { en: 'A joglo household turns a plain wall to the street. The only formal way in is the regol, a gateway set on the compound’s central axis. Everything you are about to pass through lines up behind it.', id: 'Rumah tangga joglo hanya memperlihatkan tembok polos ke arah jalan. Satu-satunya jalan masuk resmi adalah regol, gerbang yang terletak di sumbu tengah kompleks. Semua yang akan Anda lewati berjajar di belakangnya.' },
        },
        {
          title: 'Latar', local: { en: 'The front courtyard', id: 'Halaman depan' },
          pos: [0, 1.65, 18.4], target: [0, 3.2, 6],
          text: { en: 'Inside the gate is the open courtyard, with a stone path leading straight to the pendapa. This front part of the compound, the ngarep, is the public side of the household, where visitors are welcome.', id: 'Di balik gerbang terbentang halaman terbuka, dengan jalan batu yang lurus menuju pendapa. Bagian depan kompleks ini, ngarep, adalah sisi publik rumah tangga, tempat tamu disambut.' },
        },
        {
          title: 'Pendapa', local: { en: 'Where guests are received', id: 'Tempat menerima tamu' },
          pos: [0.6, 2.25, 11.8], target: [0, 5.8, 5.5],
          text: { en: 'Step up under the pendapa. It has no walls: guests, meetings, dances and gamelan all happen here in full view. Look up: four saka guru carry the stepped tumpang sari and the steep roof above it.', id: 'Naiklah ke bawah pendapa. Ia tidak berdinding: tamu, pertemuan, tari, dan gamelan semuanya berlangsung di sini secara terbuka. Lihat ke atas: empat saka guru memikul tumpang sari yang berundak dan atap curam di atasnya.' },
        },
        {
          title: 'Pringgitan', local: { en: 'The threshold', id: 'Ambang' },
          pos: [-1.1, 2.3, 0.4], target: [0, 2.1, -5.5],
          text: { en: 'Behind the pendapa, the pringgitan links the public front to the family house. Wayang kulit is performed here, on a screen between the guests in the pendapa and the family behind. Most visitors go no further.', id: 'Di belakang pendapa, pringgitan menghubungkan bagian depan yang publik dengan rumah keluarga. Wayang kulit dipentaskan di sini, pada layar di antara tamu di pendapa dan keluarga di belakang. Kebanyakan tamu tidak masuk lebih jauh.' },
        },
        {
          title: 'Gebyok', local: { en: 'The family’s front wall', id: 'Dinding depan keluarga' },
          pos: [-0.4, 2.35, -7.4], target: [0, 2.2, -10.2], via: [[-3.4, 2.3, -3.6], [-3.3, 2.35, -6.5]],
          text: { en: 'The carved teak wall of the dalem closes off the view. Its central double door leads into the family house, open to the household and to honoured guests. Beyond it, the house is private.', id: 'Dinding jati berukir dari dalem menutup pandangan. Pintu ganda di tengahnya menuju rumah keluarga, terbuka bagi penghuni dan tamu terhormat. Di baliknya, rumah bersifat privat.' },
        },
        {
          title: 'Dalem', local: { en: 'The family house', id: 'Rumah keluarga' },
          pos: [0, 2.45, -12.2], target: [0, 2.0, -22], via: [[0, 2.4, -9.3]],
          text: { en: 'Inside is the same joglo frame as the pendapa, now enclosed. The floor is higher than the pendapa’s: every step inward has also been a step up. Ahead, three senthong rooms line the back wall.', id: 'Di dalamnya ada rangka joglo yang sama dengan pendapa, kini tertutup. Lantainya lebih tinggi daripada pendapa: setiap langkah ke dalam juga merupakan langkah naik. Di depan, tiga senthong berjajar di dinding belakang.' },
        },
        {
          title: 'Senthong Tengah', local: { en: 'The end of the axis', id: 'Ujung sumbu' },
          pos: [1.4, 2.45, -16.9], target: [0, 1.8, -22.6],
          text: { en: 'The middle room holds the krobongan, dedicated to Dewi Sri, goddess of rice and fertility, with the loro blonyo pair in front of it. The line that began at the regol ends here, in the most sacred place in the house.', id: 'Ruang tengah ini berisi krobongan yang dipersembahkan kepada Dewi Sri, dewi padi dan kesuburan, dengan sepasang loro blonyo di depannya. Garis yang dimulai dari regol berakhir di sini, di tempat paling sakral di rumah.' },
        },
        {
          title: 'Mburi', local: { en: 'The working back', id: 'Bagian belakang untuk bekerja' }, buildings: ['gandhok_kiwa', 'gandhok_tengen', 'gadri', 'pawon', 'pekiwan'],
          pos: [0, 17, -54], target: [0, 1.5, -26], via: [[0, 14, -24]],
          text: { en: 'Around and behind the dalem are the everyday buildings: the gandhok wings with their rooms, the gadri where the family eats, the pawon kitchen and the well. The seketheng walls keep this side of life out of guests’ sight.', id: 'Di sekitar dan di belakang dalem terdapat bangunan-bangunan keseharian: sayap gandhok dengan kamar-kamarnya, gadri tempat keluarga makan, dapur pawon, dan sumur. Tembok seketheng menyembunyikan sisi kehidupan ini dari pandangan tamu.' },
        },
        {
          title: { en: 'From public to private', id: 'Dari publik ke privat' }, local: { en: 'Reading the whole omah', id: 'Membaca seluruh omah' }, overlay: true,
          pos: [0, 140, 15], target: [0, 0, 10],
          text: { en: 'Seen from above, the plan is a sequence of thresholds: regol, pendapa, pringgitan, gebyok and senthong. Each one is deeper, higher and more private than the last.', id: 'Dilihat dari atas, denahnya adalah rangkaian ambang: regol, pendapa, pringgitan, gebyok, dan senthong. Setiap ambang lebih dalam, lebih tinggi, dan lebih privat dari sebelumnya.' },
        },
      ],
    },
  },

  // Material slots shared by every building. `tex` names a texture in viewer/materials.js.
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
    { id: 'bamboo', label: { en: 'Bamboo', id: 'Bambu' }, tex: 'bamboo', ui: false },
    { id: 'ground', label: { en: 'Courtyard', id: 'Halaman' }, tex: 'stone', ui: false, clay: '#ece8e0' },
  ],
  presets: {
    natural: {
      label: { en: 'Jati alami · natural teak', id: 'Jati alami' }, rough: 0.72, metal: { accent: 0.1 },
      colors: { wood: '#8b5a32', carved: '#7a4a28', accent: '#a8773f', roof: '#b4603f', ornament: '#9c4a30', plaster: '#e8dfd0', stone: '#8a857c', floor: '#c2ae90', plank: '#9c7049', bamboo: '#c9a773', ground: '#c7b594' },
    },
    kraton: {
      label: { en: 'Kraton · painted & gilded', id: 'Kraton · dicat & diprada' }, rough: 0.55, metal: { accent: 0.8 },
      colors: { wood: '#5e3a22', carved: '#2d5a44', accent: '#d8aa4c', roof: '#9a4a32', ornament: '#c99a3c', plaster: '#f2eee6', stone: '#6d6a64', floor: '#dcd4c4', plank: '#77553c', bamboo: '#c2a06c', ground: '#d4c6a8' },
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
