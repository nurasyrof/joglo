// Anatomy text for the ruma and the sopo. The categories are the three worlds the Batak
// Toba read into the house: banua toru below, banua tonga in the middle, banua ginjang above.

export const RUMA_CATEGORIES = [
  { id: 'toru',    label: { en: 'Lower world', id: 'Dunia bawah' },  local: 'Banua toru',    color: '#7f8a6a' },
  { id: 'tonga',   label: { en: 'Middle world', id: 'Dunia tengah' }, local: 'Banua tonga',   color: '#c58a4a' },
  { id: 'ginjang', label: { en: 'Upper world', id: 'Dunia atas' },   local: 'Banua ginjang', color: '#b0624a' },
];

const F = 1.75, WH = 1.5;

export const rumaParts = ({ w, l, rise }) => [
  {
    id: 'tiang', cat: 'toru', name: 'Tiang & Palang', alias: 'Kaki rumah', en: { en: 'Posts and rails', id: 'Tiang dan palang' },
    explode: [0, 0, 0], anchor: [w, 1.0, l * 0.4], focusDir: [1, 0.15, 0.6],
    desc: { en: 'Round timber posts more than 40 cm thick and about 1.75 m high, standing on flat stones and joined to one another by rails that pass through them.', id: 'Tiang kayu bulat bergaris tengah lebih dari 40 cm dan setinggi kira-kira 1,75 m, berdiri di atas batu pipih dan dihubungkan satu sama lain oleh palang yang menembusnya.' },
    fn: { en: 'They carry the whole house. The timbers lock into one another, and rattan and palm fibre are used for the ties.', id: 'Tiang-tiang ini memikul seluruh rumah. Kayu-kayunya saling mengunci, dan rotan serta ijuk dipakai sebagai pengikat.' },
    meaning: { en: 'The legs of the house, each one linked to the next, are read as marsiadapari: working together to reach a shared goal.', id: 'Kaki-kaki rumah, yang saling terhubung satu dengan yang lain, dibaca sebagai marsiadapari: bekerja sama untuk mencapai tujuan bersama.' },
    specs: [{ en: '{posts} posts', id: '{posts} tiang' }, { en: '1.75 m high', id: 'Tinggi 1,75 m' }, { en: 'Ø > 40 cm', id: 'Ø > 40 cm' }],
  },
  {
    id: 'kolong', cat: 'toru', name: 'Kolong', alias: 'Kandang ternak', en: { en: 'Space under the house', id: 'Kolong rumah' }, pick: false,
    explode: [0, 0, 0], anchor: [-w * 0.5, 0.5, -l * 0.3],
    desc: { en: 'The ground between the posts, closed in by the rails.', id: 'Tanah di antara tiang-tiang, yang tertutup oleh palang-palangnya.' },
    fn: { en: 'The stall for the animals: buffalo and pigs, which matter in every ceremony.', id: 'Kandang ternak: kerbau dan babi, yang penting dalam setiap upacara adat.' },
    meaning: { en: 'Banua toru, the lower world. As the place of animals it stands for the coarse traits a person should not carry.', id: 'Banua toru, dunia bawah. Sebagai tempat hewan, ia melambangkan sifat-sifat buruk yang tidak semestinya ada dalam diri manusia.' },
    specs: [{ en: 'Animal stall', id: 'Kandang ternak' }],
  },
  {
    id: 'tangga', cat: 'toru', name: 'Tangga & Pintu Lantai', alias: 'Pintu sitolumbea', en: { en: 'Stair and floor hatch', id: 'Tangga dan pintu lantai' },
    explode: [0, 0, 2.2], anchor: [0.6, 1.2, l - 1.0], focusDir: [0.8, 0.2, 1],
    desc: { en: 'A stair set under the house between the front posts and the next row, coming up through a hatch in the floor.', id: 'Tangga yang dipasang di bawah rumah di antara tiang depan dan deret berikutnya, muncul melalui pintu di lantai.' },
    fn: { en: 'You go in from underneath. The front wall has no door and no window.', id: 'Orang masuk dari bawah. Dinding depan tidak berpintu dan tidak berjendela.' },
    meaning: { en: 'This is the mark of the ruma sitolumbea, thought of as the female house and the most complete kind. The other kind, sisampuran, has its stair and door on the outside.', id: 'Inilah ciri ruma sitolumbea, yang dianggap sebagai rumah betina dan jenis yang paling lengkap. Jenis lainnya, sisampuran, memiliki tangga dan pintu di luar.' },
    specs: [{ en: 'Hatch in the floor', id: 'Pintu di lantai' }, { en: 'No front door', id: 'Tanpa pintu depan' }],
  },
  {
    id: 'papan', cat: 'tonga', name: 'Papan', alias: 'Lantai', en: { en: 'Floor', id: 'Lantai' },
    explode: [0, 1.4, 0], anchor: [-w * 0.5, F + 0.3, 1],
    desc: { en: 'A floor of boards on stiff cross beams (gulang-gulang), one open room with no partitions.', id: 'Lantai papan di atas balok melintang yang kaku (gulang-gulang), satu ruang terbuka tanpa sekat.' },
    fn: { en: 'Several families live and sleep on this one floor, each in its own part of it.', id: 'Beberapa keluarga tinggal dan tidur di lantai yang satu ini, masing-masing di bagiannya sendiri.' },
    meaning: { en: 'Banua tonga, the world of people. With four to six families and no walls between them, respect and good manners are what divide the room.', id: 'Banua tonga, dunia manusia. Dengan empat sampai enam keluarga tanpa dinding pemisah, rasa hormat dan sopan santunlah yang membagi ruang.' },
    specs: [{ en: `${2 * w} × ${2 * l} m`, id: `${2 * w} × ${2 * l} m` }, { en: 'No partitions', id: 'Tanpa sekat' }],
  },
  {
    id: 'dorpi', cat: 'tonga', name: 'Dorpi', alias: 'Dinding papan', en: { en: 'Leaning walls', id: 'Dinding miring' },
    explode: [0, 1.4, 0], anchor: [w + 0.3, F + 1.0, -1], focusDir: [1, 0.2, 0.4],
    desc: { en: 'Low plank walls at the sides and back that lean outwards from the floor to the roof.', id: 'Dinding papan yang rendah di sisi dan belakang, miring ke luar dari lantai ke atap.' },
    fn: { en: 'They close the room under the deep eaves and leave the floor clear right to its edge.', id: 'Dinding ini menutup ruang di bawah tritisan yang lebar dan membiarkan lantai lapang hingga ke tepinya.' },
    meaning: { en: 'With the roof they give the house its outline, widest at the eaves.', id: 'Bersama atap, dinding ini memberi rumah garis luarnya, yang paling lebar di tritisan.' }, interp: true,
    specs: [{ en: `Walls ${WH} m`, id: `Dinding ${WH} m` }, { en: 'Planks', id: 'Papan' }],
  },
  {
    id: 'dorpi_jolo', cat: 'tonga', name: 'Dorpi Jolo', alias: 'Dinding depan bergorga', en: { en: 'Carved front', id: 'Dinding depan berukir' },
    explode: [0, 1.4, 2.6], anchor: [0, F + 2.6, l + 1.0], focusDir: [0.4, 0.2, 1],
    desc: { en: 'The front wall and the tiers of boards that step forward above it, covered with gorga: carving painted in red, white and black.', id: 'Dinding depan dan susunan papan yang menjorok bertingkat di atasnya, dipenuhi gorga: ukiran yang dicat merah, putih, dan hitam.' },
    fn: { en: 'The face of the house. Among the motifs are adop-adop (breasts) and boraspati (lizards), four of each on either side.', id: 'Wajah rumah. Di antara motifnya ada adop-adop (payudara) dan boraspati (cicak), masing-masing empat di tiap sisi.' },
    meaning: { en: 'The house has a soul (tondi), and gorga keeps it strong: it is there so that the house “looks alive”, not only to look well. A carved house is a jabu gorga; a plain one is a jabu batara siang.', id: 'Rumah memiliki roh (tondi), dan gorga menjaga kekuatannya: gorga ada agar rumah “tampak hidup”, bukan sekadar agar indah. Rumah yang berukir disebut jabu gorga; yang polos disebut jabu batara siang.' },
    specs: [{ en: 'Red, white, black', id: 'Merah, putih, hitam' }, { en: '4 + 4 adop-adop', id: '4 + 4 adop-adop' }],
  },
  {
    id: 'singa', cat: 'tonga', name: 'Singa-singa', alias: 'Ukiran sudut depan', en: { en: 'Guardian heads', id: 'Kepala penjaga' },
    explode: [0, 1.4, 2.6], anchor: [w - 0.1, F + 0.8, l + 0.7], focusDir: [0.7, 0.2, 1],
    desc: { en: 'A carved face with staring eyes at each front corner, left and right. Despite the name it is not a lion but a kneeling human figure.', id: 'Wajah berukir dengan mata melotot di tiap sudut depan, kiri dan kanan. Meski namanya demikian, ia bukan singa melainkan sosok manusia yang berlutut.' },
    fn: { en: 'It is believed to guard the house from evil spirits.', id: 'Dipercaya menjaga rumah dari roh-roh jahat.' },
    meaning: { en: 'Singa-singa stands for justice under the law, and for truth.', id: 'Singa-singa melambangkan keadilan hukum dan kebenaran.' },
    specs: [{ en: '2 heads', id: '2 kepala' }],
  },
  {
    id: 'tataring', cat: 'tonga', name: 'Tungku & Para-para', alias: 'Perapian dan para-para', en: { en: 'Hearth and rack', id: 'Tungku dan para-para' },
    explode: [0, 2.4, 0], anchor: [0, F + 0.9, -l * 0.3], focusDir: [0.5, 0.6, 1],
    desc: { en: 'The cooking fire, towards the back of the floor, with a hole (talaga) beside it and a rack (para-para) across the house above.', id: 'Api tempat memasak, agak ke belakang lantai, dengan sebuah lubang (talaga) di dekatnya dan para-para yang melintang di atasnya.' },
    fn: { en: 'Sweepings go out through the talaga. The para-para holds spare palm fibre for patching the roof, and under it rattan and tools are kept.', id: 'Sapuan lantai dibuang melalui talaga. Para-para menyimpan ijuk cadangan untuk menyisip atap yang bocor, dan di bawahnya disimpan rotan serta alat-alat.' },
    meaning: { en: 'A saying takes the talaga as its picture: what is swept down the hole is gone, and so should a neighbour’s offence be forgotten.', id: 'Sebuah ungkapan memakai talaga sebagai kiasan: apa yang disapu ke lubang itu lenyap, demikian pula kesalahan sesama hendaknya dilupakan.' },
    specs: [{ en: '1 hearth', id: '1 tungku' }, { en: 'Talaga', id: 'Talaga' }],
  },
  {
    id: 'songkor', cat: 'tonga', name: 'Songkor & Pangabang', alias: 'Panggung depan dan belakang', en: { en: 'Front and back galleries', id: 'Panggung depan dan belakang' },
    explode: [0, 3.4, 0], anchor: [0, F + WH + 0.7, l - 0.3], focusDir: [0.4, 0.7, 1],
    desc: { en: 'Two platforms inside the roof, like balconies: the songkor at the front and the pangabang at the back.', id: 'Dua panggung di dalam atap, mirip balkon: songkor di depan dan pangabang di belakang.' },
    fn: { en: 'At a feast the musicians who play the gondang sit on the songkor; at other times farm tools are kept there. Rice is stored on the pangabang, in baskets.', id: 'Saat pesta, para penabuh gondang duduk di songkor; pada waktu lain alat pertanian disimpan di sana. Padi disimpan di pangabang, dalam bakul.' },
    meaning: { en: 'Music from the front and rice at the back: both are kept above the heads of the people.', id: 'Musik dari depan dan padi di belakang: keduanya ditempatkan di atas kepala penghuninya.' }, interp: true,
    specs: [{ en: '2 galleries', id: '2 panggung' }],
  },
  {
    id: 'rangka_atap', cat: 'ginjang', name: 'Rangka Atap', alias: 'Rangka bambu dan kayu', en: { en: 'Roof frame', id: 'Rangka atap' }, lift: true,
    explode: [0, 5, 0], anchor: [w * 0.6, F + WH + rise * 0.6, 1],
    desc: { en: 'A frame of timber and bamboo that follows the sagging, rising line of the ridge.', id: 'Rangka dari kayu dan bambu yang mengikuti garis bubungan yang melendut lalu menaik.' },
    fn: { en: 'Carries the thick palm-fibre roof.', id: 'Memikul atap ijuk yang tebal.' },
    meaning: { en: 'A house is put up by the community working together, after its site has been agreed and marked.', id: 'Rumah didirikan bersama oleh masyarakat, setelah tempatnya dimusyawarahkan dan ditandai.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }, { en: 'Bamboo and timber', id: 'Bambu dan kayu' }],
  },
  {
    id: 'atap', cat: 'ginjang', name: 'Atap Ijuk', alias: 'Atap pelana ijuk', en: { en: 'Saddle roof', id: 'Atap pelana' }, roof: true, lift: true,
    explode: [0, 6.6, 0], anchor: [0, F + WH + rise + 0.6, 0],
    desc: { en: 'A saddle roof of black palm fibre (ijuk) laid in three layers. Its two peaks reach out over the ends of the house, the front one further and the back one higher.', id: 'Atap pelana dari ijuk hitam yang dipasang tiga lapis. Kedua ujungnya menjorok melewati ujung rumah; yang depan lebih panjang dan yang belakang lebih tinggi.' },
    fn: { en: 'Sheds the rain of the highlands and shades the walls under deep eaves.', id: 'Mengalirkan hujan dataran tinggi dan meneduhi dinding di bawah tritisan yang lebar.' },
    meaning: { en: 'Banua ginjang, the upper world. The higher back peak carries a hope: that the children of the house will rise higher than their parents.', id: 'Banua ginjang, dunia atas. Ujung belakang yang lebih tinggi membawa harapan: kelak anak-anak pemilik rumah lebih tinggi derajatnya daripada orang tuanya.' },
    specs: [{ en: 'Ijuk in 3 layers', id: 'Ijuk 3 lapis' }, { en: 'Back peak higher', id: 'Ujung belakang lebih tinggi' }],
  },
  {
    id: 'ulu_paung', cat: 'ginjang', name: 'Ulu Paung', alias: 'Hiasan puncak depan', en: { en: 'Horned head', id: 'Kepala bertanduk' }, lift: true,
    explode: [0, 7.6, 1.2], anchor: [0.4, F + WH + rise * 1.75, l + 1.4], focusDir: [0.5, 0.1, 1],
    desc: { en: 'A horned head set at the front peak of the roof, with a stern face.', id: 'Kepala bertanduk yang dipasang di puncak atap bagian depan, dengan raut muka yang berwibawa.' },
    fn: { en: 'It is there to protect everyone in the house from evil spirits that might come in.', id: 'Dipasang untuk melindungi seisi rumah dari gangguan roh jahat yang hendak masuk.' },
    meaning: { en: 'Its horns stand for strength, and for many descendants.', id: 'Tanduknya melambangkan kekuatan dan banyaknya keturunan.' },
    specs: [{ en: 'Front peak', id: 'Puncak depan' }],
  },
];

export const sopoParts = ({ w, l }) => [
  {
    id: 'tiang', cat: 'toru', name: 'Tiang', alias: 'Tiang sopo', en: { en: 'Posts', id: 'Tiang' },
    explode: [0, 0, 0], anchor: [w, 1.6, l * 0.5], focusDir: [1, 0.2, 0.6],
    desc: { en: 'Six tall posts on flat stones, each with a wide wooden disc near the top.', id: 'Enam tiang tinggi di atas batu pipih, masing-masing dengan piringan kayu lebar di dekat puncaknya.' },
    fn: { en: 'They lift the rice store well above the ground; the discs stop rats climbing into it.', id: 'Tiang-tiang ini mengangkat lumbung jauh dari tanah; piringannya menghalangi tikus memanjat masuk.' },
    meaning: { en: 'A sopo is built with the same care as a house, and may be carved like one.', id: 'Sopo dibangun dengan kesungguhan yang sama seperti rumah, dan dapat diukir seperti rumah.' },
    specs: [{ en: '{posts} posts', id: '{posts} tiang' }],
    interp: true,
  },
  {
    id: 'balai', cat: 'toru', name: 'Balai Sopo', alias: 'Lantai terbuka', en: { en: 'Open floor', id: 'Lantai terbuka' },
    explode: [0, 0, 0], anchor: [0, 1.3, l * 0.5], focusDir: [0.5, 0.4, 1],
    desc: { en: 'A low floor between the posts, open on every side.', id: 'Lantai rendah di antara tiang-tiang, terbuka di semua sisi.' },
    fn: { en: 'A shaded place to sit, work and talk, looking across the yard at the houses.', id: 'Tempat teduh untuk duduk, bekerja, dan bercakap, menghadap rumah-rumah di seberang halaman.' },
    meaning: { en: 'The sopo is the public side of the village; the house opposite is the private one.', id: 'Sopo adalah sisi publik kampung; rumah di seberangnya adalah sisi privat.' },
    specs: [{ en: 'No walls', id: 'Tanpa dinding' }],
    interp: true,
  },
  {
    id: 'lumbung', cat: 'tonga', name: 'Lumbung', alias: 'Ruang simpan padi', en: { en: 'Rice store', id: 'Ruang simpan padi' },
    explode: [0, 1.8, 0], anchor: [0, 4.0, l + 0.4], focusDir: [0.4, 0.3, 1],
    desc: { en: 'A closed box of leaning plank walls under the roof, with carved ends.', id: 'Kotak tertutup berdinding papan miring di bawah atap, dengan kedua ujung berukir.' },
    fn: { en: 'The rice of the family in the house opposite is kept here.', id: 'Padi keluarga di rumah seberang disimpan di sini.' },
    meaning: { en: 'Houses and barns face each other across the yard, so each family looks out at its own store.', id: 'Rumah dan lumbung saling berhadapan melintasi halaman, sehingga setiap keluarga memandang lumbungnya sendiri.' },
    specs: [{ en: `${2 * w} × ${2 * l} m`, id: `${2 * w} × ${2 * l} m` }],
  },
  {
    id: 'rangka_atap', cat: 'ginjang', name: 'Rangka Atap', alias: 'Rangka bambu', en: { en: 'Roof frame', id: 'Rangka atap' }, lift: true,
    explode: [0, 4, 0], anchor: [w * 0.5, 6.2, 0.6],
    desc: { en: 'The same frame of timber and bamboo as the house, on a smaller scale.', id: 'Rangka kayu dan bambu yang sama seperti rumah, dalam ukuran yang lebih kecil.' },
    fn: { en: 'Carries the palm-fibre roof.', id: 'Memikul atap ijuk.' },
    meaning: { en: 'Barn and house are built to one pattern.', id: 'Lumbung dan rumah dibangun menurut satu pola.' }, interp: true,
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'ginjang', name: 'Atap Ijuk', alias: 'Atap pelana ijuk', en: { en: 'Saddle roof', id: 'Atap pelana' }, roof: true, lift: true,
    explode: [0, 5.4, 0], anchor: [0, 7.4, 0],
    desc: { en: 'A saddle roof of palm fibre, shaped like the roof of the house.', id: 'Atap pelana dari ijuk, berbentuk seperti atap rumah.' },
    fn: { en: 'Keeps the rice dry.', id: 'Menjaga padi tetap kering.' },
    meaning: { en: 'From a distance a row of sopo and a row of houses look alike; only the open floor tells them apart.', id: 'Dari kejauhan, deretan sopo dan deretan rumah tampak serupa; hanya lantai terbukanya yang membedakan.' }, interp: true,
    specs: [{ en: 'Ijuk', id: 'Ijuk' }],
  },
];
