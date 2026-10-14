// Anatomy text for a mbaru niang. `main` picks the wording for the niang gendang.

export const CATEGORIES = [
  { id: 'bawah',  label: { en: 'Foundation', id: 'Fondasi' },        local: 'Bawah',   color: '#7f8a6a' },
  { id: 'lutur',  label: { en: 'Living floor', id: 'Lantai hunian' }, local: 'Lutur',   color: '#c58a4a' },
  { id: 'atas',   label: { en: 'Upper levels', id: 'Tingkat atas' },  local: 'Lobo',    color: '#8f7a5a' },
  { id: 'atap',   label: { en: 'Roof', id: 'Atap' },                  local: 'Wuwung',  color: '#6f675c' },
];

const m = (n) => n.toFixed(1);

export const partsFor = ({ r, top, rooms, main, levelY }) => [
  {
    id: 'fondasi', cat: 'bawah', name: 'Fondasi', alias: 'Tiang bawah', en: { en: 'Foundation posts', id: 'Tiang fondasi' },
    explode: [0, 0, 0], anchor: [r * 0.55, 0.5, r * 0.75], focusDir: [0.5, 0.1, 1],
    desc: { en: 'Short posts set in the ground under the floor, each wrapped in black palm fibre (ijuk) where it enters the earth.', id: 'Tiang-tiang pendek yang ditanam di bawah lantai, masing-masing dibalut ijuk pada bagian yang masuk ke tanah.' },
    fn: { en: 'They hold the floor about a metre off the ground. The fibre wrapping keeps damp from the timber.', id: 'Tiang ini menahan lantai kira-kira semeter di atas tanah. Balutan ijuk melindungi kayu dari lembap.' },
    meaning: { en: 'Building starts with the weri watu ceremony, which asks the ancestors that the foundation stand firm.', id: 'Pembangunan dimulai dengan upacara weri watu, yang memohon kepada leluhur agar fondasi berdiri kokoh.' },
    specs: [{ en: '{footings} posts', id: '{footings} tiang' }, { en: 'Wrapped in ijuk', id: 'Dibalut ijuk' }],
  },
  {
    id: 'lutur', cat: 'lutur', name: 'Lutur', alias: 'Bale-bale', en: { en: 'Living floor', id: 'Lantai hunian' },
    explode: [0, 0.6, 0], anchor: [-r * 0.3, 1.2, r * 0.5],
    desc: { en: 'A round floor of boards, bound at its edge by a hoop of rattan. The open front half is the lutur proper.', id: 'Lantai papan berbentuk lingkaran, diikat di tepinya oleh gelang rotan. Separuh bagian depan yang terbuka adalah lutur.' },
    fn: { en: 'The front is the shared, public part of the house, where guests sit and sleep. The family side lies behind it.', id: 'Bagian depan adalah ruang bersama dan publik, tempat tamu duduk dan tidur. Bagian keluarga berada di belakangnya.' },
    meaning: { en: 'The round floor is read as a sign of harmony and fairness among the families who share the house.', id: 'Lantai yang bundar dibaca sebagai lambang keharmonisan dan keadilan di antara keluarga-keluarga penghuni rumah.' },
    specs: [{ en: `Ø ${2 * r} m`, id: `Ø ${2 * r} m` }, { en: 'Floor +1 m', id: 'Lantai +1 m' }],
  },
  {
    id: 'siri', cat: 'lutur', name: 'Siri Bongkok', alias: 'Sembilan tiang', en: { en: 'Nine posts', id: 'Sembilan tiang' },
    explode: [0, 0, 0], anchor: [0, 3.2, 0.3], focusDir: [0.4, 0.3, 1],
    desc: { en: 'One main post of worok wood at the exact centre, the siri bongkok, with eight more standing in a ring around it.', id: 'Satu tiang utama dari kayu worok tepat di tengah, siri bongkok, dengan delapan tiang lain yang berdiri melingkarinya.' },
    fn: { en: 'The centre post runs to the very top of the roof; the ring carries the levels above.', id: 'Tiang tengah menerus hingga ke puncak atap; tiang-tiang yang melingkar memikul tingkat-tingkat di atasnya.' },
    meaning: { en: 'The nine posts are likened to the nine months before a birth. Raising the centre post has a ceremony of its own, derek siri bongkok.', id: 'Sembilan tiang diibaratkan sembilan bulan menjelang kelahiran. Pendirian tiang tengah memiliki upacara tersendiri, derek siri bongkok.' },
    specs: [{ en: '1 + 8 posts', id: '1 + 8 tiang' }, { en: 'Worok wood', id: 'Kayu worok' }],
  },
  {
    id: 'sapo', cat: 'lutur', name: 'Sapo', alias: 'Perapian', en: { en: 'Hearth', id: 'Tungku' },
    explode: [0, 0.6, 0], anchor: [0, 3.0, -r * 0.16], focusDir: [0.4, 0.5, 1],
    desc: { en: 'A box of earth set into the board floor near the centre, with three stones and a bamboo rack above it.', id: 'Kotak berisi tanah yang dipasang di lantai papan dekat pusat rumah, dengan tiga batu dan para-para bambu di atasnya.' },
    fn: { en: 'All the families of the house cook here. Its smoke rises through the levels and dries what is stored on them.', id: 'Semua keluarga penghuni rumah memasak di sini. Asapnya naik melewati tingkat-tingkat dan mengeringkan apa yang disimpan di sana.' },
    meaning: { en: 'The fire and the cooking belong to the private, family side of the floor.', id: 'Api dan kegiatan memasak termasuk sisi privat lantai ini, sisi keluarga.' },
    specs: [{ en: '1 hearth', id: '1 tungku' }, { en: 'Bamboo rack', id: 'Para-para bambu' }],
  },
  {
    id: 'loang', cat: 'lutur', name: 'Loang', alias: 'Kamar keluarga', en: { en: 'Family rooms', id: 'Kamar keluarga' },
    explode: [0, 2.0, 0], anchor: [-r * 0.6, 2.6, -r * 0.35], focusDir: [-0.5, 0.6, 0.6],
    desc: { en: 'Small rooms divided by plank walls, set in an arc round the back of the floor under the low part of the roof.', id: 'Kamar-kamar kecil bersekat papan, tersusun melengkung di bagian belakang lantai di bawah atap yang rendah.' },
    fn: { en: 'Each room is the sleeping place of one family.', id: 'Setiap kamar adalah tempat tidur satu keluarga.' },
    meaning: main
      ? { en: 'Eight families share the drum house, and the elders of the village live here.', id: 'Delapan keluarga berbagi rumah gendang, dan para tetua kampung tinggal di sini.' }
      : { en: 'Six families share each of the other houses.', id: 'Enam keluarga berbagi setiap rumah lainnya.' },
    specs: [{ en: `${rooms} rooms`, id: `${rooms} kamar` }],
  },
  {
    id: 'para', cat: 'lutur', name: 'Para & Tibing', alias: 'Pintu dan tangga masuk', en: { en: 'Door and entrance', id: 'Pintu dan jalan masuk' },
    explode: [0, 0.6, 2.5], anchor: [0.9, 3.4, r - 0.6], focusDir: [0.5, 0.2, 1],
    desc: { en: 'The roof is lifted at one point to make an entrance: a few steps up, a door (para), and plank walls (tibing) at either side closing the gap under the raised roof.', id: 'Atap diangkat di satu titik untuk membentuk jalan masuk: beberapa anak tangga, sebuah pintu (para), dan dinding papan (tibing) di kiri-kanannya yang menutup celah di bawah atap yang terangkat.' },
    fn: { en: 'The only opening in the house, and its only walls. Everywhere else the roof is the wall.', id: 'Satu-satunya bukaan rumah, dan satu-satunya dindingnya. Di bagian lain, atap itulah dindingnya.' },
    meaning: main
      ? { en: 'A gong hangs by the door of the drum house. Every door in the village faces the compang.', id: 'Sebuah gong tergantung di dekat pintu rumah gendang. Semua pintu di kampung menghadap compang.' }
      : { en: 'Every door in the village faces the compang at its centre.', id: 'Semua pintu di kampung menghadap compang di pusatnya.' },
    specs: [{ en: '1 door', id: '1 pintu' }, { en: 'Plank side walls', id: 'Dinding samping papan' }],
  },
  {
    id: 'tingkat', cat: 'atas', name: 'Lobo · Lentar · Lempa Rae · Hekang Kode', alias: 'Empat tingkat atas', en: { en: 'Four upper levels', id: 'Empat tingkat atas' },
    explode: [0, 3.2, 0], anchor: [r * 0.3, levelY[1] + 0.3, 0], focusDir: [0.5, 0.5, 1],
    desc: { en: 'Four board floors one above another inside the cone, each smaller than the one below and reached by a bamboo ladder.', id: 'Empat lantai papan yang bersusun di dalam kerucut, masing-masing lebih kecil daripada yang di bawahnya dan dicapai dengan tangga bambu.' },
    fn: { en: 'Lobo holds food and everyday goods; lentar the seed for the next planting, maize, rice and beans; lempa rae the reserve for a bad year; hekang kode, at the top, the offerings to the ancestors.', id: 'Lobo menyimpan bahan makanan dan barang sehari-hari; lentar menyimpan benih untuk musim tanam berikutnya, jagung, padi, dan kacang-kacangan; lempa rae menyimpan cadangan untuk masa paceklik; hekang kode, di puncak, tempat sesaji bagi leluhur.' },
    meaning: { en: 'With the living floor they make five levels, likened to the growth of a child in the womb. The higher the level, the less often it is entered.', id: 'Bersama lantai hunian, semuanya menjadi lima tingkat, yang diibaratkan pertumbuhan janin dalam kandungan. Makin tinggi tingkatnya, makin jarang dimasuki.' },
    specs: [{ en: '4 levels', id: '4 tingkat' }, { en: `Top floor +${m(levelY[3])} m`, id: `Lantai teratas +${m(levelY[3])} m` }, { en: '{upper} posts', id: '{upper} tiang' }],
  },
  {
    id: 'buku', cat: 'atap', name: 'Buku', alias: 'Rangka atap bambu', en: { en: 'Roof ribs', id: 'Rusuk atap' }, lift: true,
    explode: [0, 5.5, 0], anchor: [r * 0.55, top * 0.5, r * 0.4],
    desc: { en: 'More than a hundred bamboo poles running from the eaves to the top, tied to hoops of rattan.', id: 'Lebih dari seratus batang bambu yang membentang dari tepi atap ke puncak, diikat pada gelang-gelang rotan.' },
    fn: { en: 'The outer frame to which the bundles of thatch are tied.', id: 'Rangka terluar tempat ikatan-ikatan penutup atap dipasang.' },
    meaning: { en: 'Nothing is nailed: the whole house is bound with rattan, and tying off the roof has its own ceremony, raket bobong.', id: 'Tidak ada yang dipaku: seluruh rumah diikat dengan rotan, dan pengikatan ujung atap memiliki upacaranya sendiri, raket bobong.' },
    specs: [{ en: '{ribs} bamboo ribs', id: '{ribs} rusuk bambu' }, { en: 'Rattan ties', id: 'Ikatan rotan' }],
  },
  {
    id: 'wehang', cat: 'atap', name: 'Wehang', alias: 'Wuwung · penutup atap', en: { en: 'Thatch', id: 'Penutup atap' }, roof: true, lift: true,
    explode: [0, 8, 0], anchor: [0, top * 0.62, r * 0.42],
    desc: { en: 'A cover of alang-alang grass and palm fibre (ijuk), tied on in long sheets from the top almost to the ground.', id: 'Penutup dari alang-alang dan ijuk, diikatkan dalam lembaran-lembaran panjang dari puncak hingga hampir menyentuh tanah.' },
    fn: { en: 'Roof and wall in one. It sheds the heavy mountain rain and keeps the warmth of the fire in.', id: 'Atap sekaligus dinding. Penutup ini mengalirkan hujan lebat pegunungan dan menyimpan hangat api.' },
    meaning: { en: 'The cone tapering to a point is read as the tie between people and God.', id: 'Kerucut yang meruncing ke atas dibaca sebagai lambang hubungan manusia dengan Tuhan.' },
    specs: [{ en: `Peak +${top} m`, id: `Puncak +${top} m` }, { en: 'Grass and ijuk', id: 'Alang-alang dan ijuk' }],
  },
  {
    id: 'ngando', cat: 'atap', name: 'Ngando', alias: 'Puncak atap', en: { en: 'Roof peak', id: 'Puncak atap' }, lift: true,
    explode: [0, 9.5, 0], anchor: [0.3, top + 1.2, 0], focusDir: [0.6, 0.2, 1],
    desc: main
      ? { en: 'The tip of the centre post above the roof, capped with bundles of palm fibre and, on the drum house, a pair of buffalo horns.', id: 'Ujung tiang tengah di atas atap, ditutup ikatan-ikatan ijuk dan, pada rumah gendang, sepasang tanduk kerbau.' }
      : { en: 'The tip of the centre post above the roof, capped with bundles of palm fibre.', id: 'Ujung tiang tengah di atas atap, ditutup ikatan-ikatan ijuk.' },
    fn: { en: 'Seals the point where all the ribs meet, the place most exposed to rain.', id: 'Menutup titik pertemuan semua rusuk, bagian yang paling terbuka terhadap hujan.' },
    meaning: main
      ? { en: 'The horns mark this as the drum house, the ceremonial centre of the village.', id: 'Tanduk itu menandai rumah ini sebagai rumah gendang, pusat upacara kampung.' }
      : { en: 'The highest point of the house, above the level kept for the ancestors.', id: 'Titik tertinggi rumah, di atas tingkat yang diperuntukkan bagi leluhur.' },
    ...(main ? {} : { interp: true }),
    specs: [{ en: '3 bundles of ijuk', id: '3 ikatan ijuk' }],
  },
];
