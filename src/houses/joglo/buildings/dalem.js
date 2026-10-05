// Dalem (dalem ageng): the enclosed family house behind the pendapa.
// Same joglo frame as the pendapa, on a higher floor, walled in with a carved gebyok front
// and three senthong rooms at the back. Local coordinates: front (towards the pringgitan) +z.
import { reseed, partStore, box, lathe, V } from '../../../lib/geometry.js';
import { mergeStore, plinth, wallRun, opening } from '../../../lib/kit.js';
import { jogloStructure, DIM } from '../structure.js';

const FLOOR = 0.8;
const DY = FLOOR - DIM.floorTop;          // the shared frame is designed for a 0.6 m floor
const WALL_TOP = DIM.pit.top + DY;
const WX = DIM.pit.x, WZ = DIM.pit.z;     // walls run along the outer column ring
const SENTHONG_Z = -DIM.pen.z;            // partition in front of the three senthong

const FIGURE = [[0, 0], [0.18, 0], [0.2, 0.05], [0.16, 0.25], [0.12, 0.4], [0.09, 0.48], [0.1, 0.56], [0.07, 0.66], [0, 0.72]];

function build() {
  reseed(5151);
  const { parts, P } = partStore();

  plinth(P('bebatur'), { w: 17.0, d: 14.8, h: FLOOR });

  // The joglo frame, with the smaller pieces merged into fewer parts.
  const frameStore = partStore();
  const counts = jogloStructure(frameStore.P, {
    pen: 'saka', pit: 'saka', sunduk: 'rangka', blandar: 'rangka', lambang: 'rangka',
    dadha: 'tumpang_sari', uleng: 'tumpang_sari', dudur: 'usuk', molo: 'usuk',
    mustaka: 'atap', brunjung: 'atap', penanggap: 'atap', penitih: 'atap',
  });
  mergeStore(P, frameStore.parts, { dy: DY });

  const h = WALL_TOP - FLOOR;

  // ── Gebyok: carved teak front wall with a double door and two side doors
  const front = [{ c: 0, w: 1.8, h: 2.4 }, { c: -4.0, w: 1.0, h: 2.1 }, { c: 4.0, w: 1.0, h: 2.1 }];
  const G = P('gebyok');
  wallRun(G, 'carved', { axis: 'x', at: WZ, from: -WX, to: WX, y0: FLOOR, h, t: 0.14, openings: front });
  opening(G, { at: WZ, c: 0, w: 1.8, h: 2.4, y0: FLOOR, leaves: 2, open: 1.25, t: 0.14, leafSlot: 'carved' });
  for (const c of [-4.0, 4.0]) opening(G, { at: WZ, c, w: 1.0, h: 2.1, y0: FLOOR, leaves: 1, t: 0.14, leafSlot: 'carved' });
  for (let x = -WX + 0.35; x < WX - 0.2; x += 0.75) {
    if (front.some((o) => Math.abs(x - o.c) < o.w / 2 + 0.14)) continue;
    G.add('wood', box(0.07, h - 0.1, 0.03, x, FLOOR + h / 2, WZ + 0.085));
  }
  G.add('accent', box(2 * WX - 0.2, 0.16, 0.05, 0, WALL_TOP - 0.25, WZ + 0.09));

  // ── Side and back walls of teak boards, with barred windows on the sides
  const D = P('dinding');
  wallRun(D, 'plank', { axis: 'x', at: -WZ, from: -WX, to: WX, y0: FLOOR, h, t: 0.14 });
  for (const s of [-1, 1]) {
    wallRun(D, 'plank', { axis: 'z', at: s * WX, from: -WZ, to: WZ, y0: FLOOR, h, t: 0.14, openings: [{ c: 3.15, w: 1.0, h: 1.0, sill: 1.0 }] });
    for (const z of [2.85, 3.15, 3.45]) D.add('wood', box(0.04, 1.0, 0.04, s * WX, FLOOR + 1.5, z));
  }

  // ── Senthong: carved partition with kiwa / tengah / tengen rooms behind it
  const S = P('senthong');
  const rooms = [{ c: -3.9, w: 0.9, h: 2.1 }, { c: 0, w: 2.4, h: 2.6 }, { c: 3.9, w: 0.9, h: 2.1 }];
  wallRun(S, 'carved', { axis: 'x', at: SENTHONG_Z, from: -WX, to: WX, y0: FLOOR, h, t: 0.12, openings: rooms });
  for (const c of [-3.9, 3.9]) opening(S, { at: SENTHONG_Z, c, w: 0.9, h: 2.1, y0: FLOOR, leaves: 1, open: 1.0, leafSlot: 'carved' });
  opening(S, { at: SENTHONG_Z, c: 0, w: 2.4, h: 2.6, y0: FLOOR, leaves: 0 });
  S.add('accent', box(2.7, 0.3, 0.06, 0, FLOOR + 2.6 + 0.25, SENTHONG_Z + 0.09));
  for (const x of [-2.6, 2.6]) wallRun(S, 'plank', { axis: 'z', at: x, from: -WZ, to: SENTHONG_Z, y0: FLOOR, h, t: 0.1 });

  // ── Krobongan in the senthong tengah, with loro blonyo figures in front
  const K = P('krobongan');
  const kz = -5.75;
  K.add('carved', box(2.2, 0.45, 1.5, 0, FLOOR + 0.225, kz));
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) K.add('carved', box(0.07, 1.95, 0.07, sx * 1.05, FLOOR + 0.45 + 0.975, kz + sz * 0.7));
  K.add('carved', box(2.2, 0.08, 0.08, 0, FLOOR + 2.4, kz + 0.7)).add('carved', box(2.2, 0.08, 0.08, 0, FLOOR + 2.4, kz - 0.7));
  K.add('accent', box(2.1, 1.9, 0.03, 0, FLOOR + 1.4, kz - 0.68));
  for (const s of [-1, 1]) K.add('accent', box(0.03, 1.9, 1.35, s * 1.03, FLOOR + 1.4, kz));
  K.add('accent', box(2.2, 0.35, 0.03, 0, FLOOR + 2.2, kz + 0.72));
  for (const s of [-1, 1]) K.add('ornament', lathe(FIGURE, V(s * 0.35, FLOOR, SENTHONG_Z + 0.55), null, 14));

  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',     label: { en: 'Foundation', id: 'Fondasi' }, local: 'Dasar',  color: '#9a948a' },
  { id: 'column',   label: { en: 'Columns', id: 'Tiang' },    local: 'Saka',   color: '#b27a45' },
  { id: 'frame',    label: { en: 'Frame', id: 'Rangka' },      local: 'Rangka', color: '#dcab52' },
  { id: 'walls',    label: { en: 'Walls', id: 'Dinding' },      local: 'Dinding', color: '#d9c7a0' },
  { id: 'interior', label: { en: 'Interior', id: 'Interior' },   local: 'Jero',   color: '#b3674a' },
  { id: 'roof',     label: { en: 'Roof', id: 'Atap' },       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Undhak', en: { en: 'Raised plinth', id: 'Bebatur yang ditinggikan' },
    explode: [0, 0, 0], anchor: [0, 0.45, 7.4],
    desc: { en: 'The dalem stands on a stone plinth higher than the pendapa’s.', id: 'Dalem berdiri di atas bebatur batu yang lebih tinggi daripada bebatur pendapa.' },
    fn: { en: 'Lifts the family rooms above ground damp and flooding.', id: 'Mengangkat ruang-ruang keluarga di atas tanah yang lembap dan genangan air.' },
    meaning: { en: 'The floor rises as you move inward: each step deeper into the compound is also a step up, towards the most private and honoured space.', id: 'Lantai makin tinggi saat kita masuk ke dalam: setiap langkah lebih dalam ke kompleks juga merupakan langkah naik, menuju ruang yang paling privat dan terhormat.' },
    specs: [{ en: 'Floor +0.80 m', id: 'Lantai +0,80 m' }, '17.0 × 14.8 m'],
  },
  {
    id: 'umpak', cat: 'base', name: 'Umpak', alias: 'Ompak', en: { en: 'Stone column bases', id: 'Alas tiang dari batu' },
    explode: [0, 1.3, 0], anchor: [5.2, 1.2, 4.4],
    desc: { en: 'Truncated-pyramid stones under every column, as in the pendapa.', id: 'Batu berbentuk limas terpancung di bawah setiap tiang, seperti di pendapa.' },
    fn: { en: 'Keep the posts off the damp ground and out of reach of termites.', id: 'Menjauhkan tiang dari tanah yang lembap dan dari jangkauan rayap.' },
    meaning: { en: 'The same foundation as the pendapa: the whole omah rests on stone rather than being rooted in the ground.', id: 'Fondasinya sama dengan pendapa: seluruh omah bertumpu di atas batu, tidak ditanam ke dalam tanah.' },
    specs: [{ en: '36 bases', id: '36 umpak' }, { en: 'Andesite', id: 'Andesit' }],
  },
  {
    id: 'saka_guru', cat: 'column', name: 'Saka Guru', alias: 'Soko guru', en: { en: 'Four master columns', id: 'Empat tiang utama' },
    explode: [0, 2.6, 0], anchor: [2.2, 4.4, 1.9], focusDir: [0.9, 0.25, 1],
    desc: { en: 'The four central teak columns carry the tumpang sari and the high brunjung roof, just as in the pendapa.', id: 'Empat tiang jati di tengah memikul tumpang sari dan atap brunjung yang tinggi, sama seperti di pendapa.' },
    fn: { en: 'The main load path of the dalem’s roof.', id: 'Jalur beban utama atap dalem.' },
    meaning: { en: 'They mark the sacred centre of the family house, the four directions around the pancer.', id: 'Keempatnya menandai pusat sakral rumah keluarga: empat arah di sekeliling pancer.' },
    specs: [{ en: '4 columns', id: '4 tiang' }, '32 × 32 cm'],
  },
  {
    id: 'saka', cat: 'column', name: 'Saka Penanggap & Penitih', alias: 'Saka pinggir', en: { en: 'Outer column rings', id: 'Barisan tiang luar' },
    explode: [0, 2.6, 0], anchor: [-5.2, 3.2, 4.4],
    desc: { en: 'Two rings of shorter columns around the saka guru. The outer ring is built into the walls.', id: 'Dua lingkar tiang yang lebih pendek di sekeliling saka guru. Lingkar terluar menyatu dengan dinding.' },
    fn: { en: 'Carry the middle and lower roof tiers and frame the walls and senthong partition.', id: 'Memikul susun atap tengah dan bawah, serta menjadi rangka dinding dan sekat senthong.' },
    meaning: { en: 'Rings around a centre, like the pendapa: the order of the house repeats in every building.', id: 'Lingkar-lingkar di sekeliling pusat, seperti di pendapa: tatanan rumah berulang di setiap bangunan.' },
    specs: [{ en: '32 columns', id: '32 tiang' }],
  },
  {
    id: 'rangka', cat: 'frame', name: 'Blandar, Sunduk & Lambang Gantung', alias: 'Rangka', en: { en: 'Beams and ties', id: 'Balok dan pengikat' },
    explode: [0, 4.7, 0], anchor: [0, 5.1, 4.4],
    desc: { en: 'The ring beams (blandar and pengeret), through-beams with wedges (sunduk and kili), and the lambang gantung posts between the roof tiers.', id: 'Balok keliling (blandar dan pengeret), balok tembus dengan pasak baji (sunduk dan kili), serta tiang lambang gantung di antara susun atap.' },
    fn: { en: 'Tie the columns into rigid frames without nails and carry the roof tiers.', id: 'Mengikat tiang-tiang menjadi rangka kaku tanpa paku dan memikul susun atap.' },
    meaning: { en: 'Knock-down joinery: the whole dalem can be dismantled and rebuilt elsewhere.', id: 'Sambungan bongkar-pasang: seluruh dalem dapat dibongkar dan didirikan kembali di tempat lain.' },
    specs: [{ en: 'Pegged joints', id: 'Sambungan pasak' }, { en: 'No nails', id: 'Tanpa paku' }],
  },
  {
    id: 'tumpang_sari', cat: 'frame', name: 'Tumpang Sari', alias: 'Tumpangsari', en: { en: 'Stepped beam stack & ceiling', id: 'Susunan balok bertingkat & langit-langit' },
    explode: [0, 6.9, 0], anchor: [0, 7.15, 2.6], focusDir: [0.5, -0.55, 1],
    desc: { en: 'The stepped beam courses over the saka guru, with the dhadha peksi beam and the uleng ceiling above.', id: 'Susunan balok bertingkat di atas saka guru, dengan balok dhadha peksi dan langit-langit uleng di atasnya.' },
    fn: { en: 'Cantilevers outward to carry the steep brunjung roof on only four columns.', id: 'Menjorok ke luar untuk memikul atap brunjung yang curam hanya di atas empat tiang.' },
    meaning: { en: 'The most decorated part of the frame, usually carved and gilded.', id: 'Bagian rangka yang paling banyak dihias, biasanya diukir dan diprada.' },
    specs: [{ en: '5 courses', id: '5 susun' }, 'Dhadha peksi', { en: 'Uleng ceiling', id: 'Langit-langit uleng' }],
  },
  {
    id: 'gebyok', cat: 'walls', name: 'Gebyok', alias: 'Gebyog', en: { en: 'Carved teak front wall', id: 'Dinding depan dari jati berukir' },
    explode: [0, 2.6, 4], anchor: [-5.8, 2.5, 6.95],
    desc: { en: 'The front wall of the dalem, facing the pringgitan, is a screen of carved teak panels with a large double door in the middle and smaller doors either side.', id: 'Dinding depan dalem yang menghadap pringgitan berupa sekat panel jati berukir, dengan pintu ganda besar di tengah dan pintu-pintu lebih kecil di kedua sisinya.' },
    fn: { en: 'Closes off the family house from the public front of the compound while still letting air through its carving.', id: 'Menutup rumah keluarga dari bagian depan kompleks yang publik, sambil tetap mengalirkan udara melalui ukirannya.' },
    meaning: { en: 'The gebyok is the family’s formal face: the richness of its carving shows the household’s standing.', id: 'Gebyok adalah wajah resmi keluarga: kekayaan ukirannya menunjukkan kedudukan rumah tangga.' },
    specs: [{ en: '3 doors', id: '3 pintu' }, { en: 'Carved teak', id: 'Jati berukir' }],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Dinding papan', en: { en: 'Side and back walls', id: 'Dinding samping dan belakang' },
    explode: [0, 5.2, 0], anchor: [7.9, 2.4, -1.2], focusDir: [1, 0.3, 0.3],
    desc: { en: 'Walls of teak boards on the sides and back, with barred windows high on the side walls.', id: 'Dinding papan jati di samping dan belakang, dengan jendela berjeruji di bagian atas dinding samping.' },
    fn: { en: 'Enclose the family rooms; the high windows light the hall while keeping it private.', id: 'Menutup ruang keluarga; jendela yang tinggi menerangi ruang sambil tetap menjaga privasinya.' },
    meaning: { en: 'The dalem looks inward. Its openings face the pringgitan and the family, not the street.', id: 'Dalem menghadap ke dalam. Bukaannya mengarah ke pringgitan dan keluarga, bukan ke jalan.' },
    specs: [{ en: 'Teak boards', id: 'Papan jati' }, { en: '2 windows', id: '2 jendela' }],
  },
  {
    id: 'senthong', cat: 'interior', name: 'Senthong', alias: 'Kiwa · tengah · tengen', en: { en: 'Three back rooms', id: 'Tiga ruang belakang' },
    explode: [0, 3.6, -2], anchor: [-5.0, 2.4, -4.4], focusDir: [0.3, 0.35, 1],
    desc: { en: 'Three rooms along the back of the dalem: senthong kiwa (left), senthong tengah (middle) and senthong tengen (right). The side rooms are used for sleeping and storage.', id: 'Tiga ruang di sepanjang bagian belakang dalem: senthong kiwa (kiri), senthong tengah, dan senthong tengen (kanan). Ruang di kedua sisi dipakai untuk tidur dan menyimpan barang.' },
    fn: { en: 'Private rooms for the family, separated from the open hall by a carved partition.', id: 'Ruang privat keluarga, dipisahkan dari ruang terbuka oleh sekat berukir.' },
    meaning: { en: 'The senthong tengah, in the middle, is the most sacred room of the whole compound, where the central axis of the house ends.', id: 'Senthong tengah adalah ruang paling sakral di seluruh kompleks, tempat sumbu tengah rumah berakhir.' },
    specs: [{ en: '3 rooms', id: '3 ruang' }, { en: 'Carved partition', id: 'Sekat berukir' }],
  },
  {
    id: 'krobongan', cat: 'interior', name: 'Krobongan', alias: 'Pasren', en: { en: 'Sacred bed in the senthong tengah', id: 'Tempat tidur sakral di senthong tengah' },
    explode: [0, 1.8, 0], anchor: [0, 1.7, -5.0], focusDir: [0.25, 0.3, 1],
    desc: { en: 'A draped, bed-like platform inside the senthong tengah. A pair of loro blonyo figures, a seated bride and groom, sits in front of it.', id: 'Balai berbentuk tempat tidur yang berkelambu di dalam senthong tengah. Sepasang patung loro blonyo, pengantin pria dan wanita yang duduk, diletakkan di depannya.' },
    fn: { en: 'Not used for everyday sleeping; it is kept as a symbolic resting place at the heart of the house.', id: 'Tidak dipakai untuk tidur sehari-hari; ia dijaga sebagai tempat beristirahat simbolis di jantung rumah.' },
    meaning: { en: 'Dedicated to Dewi Sri, goddess of rice and fertility, as a prayer for the family’s prosperity. The loro blonyo stand for a harmonious marriage.', id: 'Dipersembahkan kepada Dewi Sri, dewi padi dan kesuburan, sebagai doa bagi kesejahteraan keluarga. Loro blonyo melambangkan perkawinan yang rukun.' },
    specs: [{ en: 'Draped platform', id: 'Balai berkelambu' }, { en: 'Loro blonyo pair', id: 'Sepasang loro blonyo' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk, Dudur & Molo', alias: 'Rangka atap', en: { en: 'Rafters, hips and ridge', id: 'Usuk, jurai, dan bubungan' },
    explode: [0, 9.7, 0], anchor: [4.4, 5.95, 3.9],
    desc: { en: 'Rafters, battens and hip rafters of the three roof tiers, and the molo ridge beam at the top.', id: 'Usuk, reng, dan jurai dari ketiga susun atap, serta balok bubungan molo di puncaknya.' },
    fn: { en: 'Carry the clay tiles and give each tier its pitch.', id: 'Memikul genteng tanah liat dan memberi kemiringan pada setiap susun.' },
    meaning: { en: 'The raising of the molo is marked with the munggah molo ceremony.', id: 'Pemasangan molo ditandai dengan upacara munggah molo.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }, { en: '{battens} battens', id: '{battens} reng' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Joglo', alias: 'Brunjung · penanggap · penitih', en: { en: 'Three-tier roof', id: 'Atap tiga susun' }, roof: true,
    explode: [0, 12.8, 0], anchor: [0, 9.4, 1.4],
    desc: { en: 'The same three-tier joglo roof as the pendapa, with ridge crowns on top.', id: 'Atap joglo tiga susun yang sama dengan pendapa, dengan mahkota bubungan di atasnya.' },
    fn: { en: 'Sheds rain and shades the walls with deep eaves.', id: 'Mengalirkan air hujan dan meneduhi dinding dengan tritisan yang lebar.' },
    meaning: { en: 'Giving the dalem a joglo roof, like the pendapa’s, marks it as a house of high standing.', id: 'Atap joglo pada dalem, seperti pada pendapa, menandainya sebagai rumah berkedudukan tinggi.' },
    specs: [{ en: '3 tiers', id: '3 susun' }, { en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default {
  build,
  categories: CATEGORIES,
  parts: PARTS,
  sectionY: 2.2,
  views: { inside: { pos: [0.8, 2.4, 5.0], target: [0, 2.0, -5.6] } },
};
