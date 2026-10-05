// Gadri: the everyday family room behind the dalem, used for eating and daily life.
// Local coordinates: long side along x, open front (towards the dalem) facing +z.
import { reseed, partStore, box, frame } from '../../../lib/geometry.js';
import { plinth, umpak, columns, grid, span, hipRoof, wallRun } from '../../../lib/kit.js';

const FLOOR = 0.6;

function build() {
  reseed(808);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 14.4, d: 6.6, h: FLOOR });

  const pos = grid(span(-6, 6, 2.4), [-2.4, 2.4]);
  for (const [x, z] of pos) umpak(P('bebatur'), x, z, FLOOR, 0.3, 0.2, 0.28);
  columns(P('saka'), pos, FLOOR + 0.3, 3.2, 0.2);
  frame(P('saka'), 'wood', 6, 2.4, 3.28, 0.16, 0.16, 0.25);

  wallRun(P('dinding'), 'plank', { axis: 'x', at: -2.4, from: -6, to: 6, y0: FLOOR, h: 2.6 });
  for (const x of [-6, 6]) wallRun(P('dinding'), 'plank', { axis: 'z', at: x, from: -2.4, to: 2.4, y0: FLOOR, h: 2.6 });

  // Two bamboo daybeds (amben)
  for (const x of [-3, 2.6]) {
    P('amben').add('bamboo', box(2.0, 0.08, 1.2, x, FLOOR + 0.45, -1.2));
    for (const [dx, dz] of [[-0.9, -0.5], [0.9, -0.5], [-0.9, 0.5], [0.9, 0.5]]) P('amben').add('bamboo', box(0.07, 0.42, 0.07, x + dx, FLOOR + 0.21, -1.2 + dz));
  }

  const counts = hipRoof(P, [{ AX: 7.6, AZ: 3.6, y0: 3.0, ix: 4.0, iz: 0, y1: 5.0 }], { roof: 'atap', frame: 'usuk', caps: 'atap' });
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',  label: { en: 'Foundation', id: 'Fondasi' }, local: 'Dasar',  color: '#9a948a' },
  { id: 'frame', label: { en: 'Structure', id: 'Struktur' },  local: 'Rangka', color: '#b27a45' },
  { id: 'walls', label: { en: 'Walls & fittings', id: 'Dinding & perlengkapan' }, local: 'Dinding', color: '#d9c7a0' },
  { id: 'roof',  label: { en: 'Roof', id: 'Atap' },       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Umpak', en: { en: 'Plinth and column bases', id: 'Bebatur dan umpak' },
    explode: [0, 0, 0], anchor: [-4.5, 0.4, 3.2],
    desc: { en: 'A low stone plinth with an umpak under each column.', id: 'Bebatur batu yang rendah dengan umpak di bawah setiap tiang.' },
    fn: { en: 'Keeps the family room dry.', id: 'Menjaga ruang keluarga tetap kering.' }, meaning: { en: 'A step down from the dalem: this is the everyday, not the ceremonial, side of the house.', id: 'Selangkah lebih rendah dari dalem: inilah sisi rumah untuk keseharian, bukan untuk upacara.' },
    specs: [{ en: 'Floor +0.60 m', id: 'Lantai +0,60 m' }],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: { en: 'Columns and ring beam', id: 'Tiang dan balok keliling' },
    explode: [0, 1.6, 0], anchor: [3.6, 2.4, 2.4],
    desc: { en: 'Two rows of columns and a ring beam under a hipped roof.', id: 'Dua baris tiang dan balok keliling di bawah atap limasan.' },
    fn: { en: 'A simple open frame for a working room.', id: 'Rangka terbuka yang sederhana untuk ruang kerja.' }, meaning: { en: 'Plainer than the dalem: no tumpang sari, no carving.', id: 'Lebih sederhana daripada dalem: tanpa tumpang sari, tanpa ukiran.' },
    specs: [{ en: '12 columns', id: '12 tiang' }],
  },
  {
    id: 'dinding', cat: 'walls', name: 'Dinding', alias: 'Dinding papan', en: { en: 'Back and side walls', id: 'Dinding belakang dan samping' },
    explode: [0, 2.6, -1.5], anchor: [0, 2.2, -2.4], focusDir: [0.3, 0.3, 1],
    desc: { en: 'Plank walls at the back and sides; the front stays open towards the dalem.', id: 'Dinding papan di belakang dan samping; bagian depannya terbuka ke arah dalem.' },
    fn: { en: 'Shelters the room while keeping it connected to the rest of the house.', id: 'Menaungi ruang sambil tetap menyatukannya dengan bagian rumah lainnya.' }, meaning: { en: 'The gadri faces inward, towards the family.', id: 'Gadri menghadap ke dalam, ke arah keluarga.' },
    specs: [{ en: 'Teak boards', id: 'Papan jati' }, { en: 'Open front', id: 'Depan terbuka' }],
  },
  {
    id: 'amben', cat: 'walls', name: 'Amben', alias: 'Bale-bale', en: { en: 'Bamboo daybeds', id: 'Amben bambu' },
    explode: [0, 1.4, 1.5], anchor: [-3, 1.2, -1.2],
    desc: { en: 'Low bamboo platforms used for sitting, eating and resting.', id: 'Balai-balai bambu yang rendah untuk duduk, makan, dan beristirahat.' },
    fn: { en: 'The family gathers, eats and naps here during the day.', id: 'Keluarga berkumpul, makan, dan tidur siang di sini.' }, meaning: { en: 'Everyday life happens here, away from the formal pendapa and the sacred dalem.', id: 'Kehidupan sehari-hari berlangsung di sini, jauh dari pendapa yang resmi dan dalem yang sakral.' },
    specs: [{ en: '2 daybeds', id: '2 amben' }, { en: 'Bamboo', id: 'Bambu' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Dudur', alias: 'Rangka atap', en: { en: 'Rafters and hips', id: 'Usuk dan jurai' },
    explode: [0, 4.0, 0], anchor: [3.6, 3.6, 3.0],
    desc: { en: 'Rafters, battens, hip rafters and ridge beam.', id: 'Usuk, reng, jurai, dan balok bubungan.' }, fn: { en: 'Carry the clay tiles.', id: 'Memikul genteng tanah liat.' }, meaning: { en: 'The same timber system as the rest of the compound.', id: 'Sistem kayu yang sama dengan bangunan lain di kompleks.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Limasan', alias: 'Limasan', en: { en: 'Hipped roof', id: 'Atap limasan' }, roof: true,
    explode: [0, 5.2, 0], anchor: [0, 4.6, 1.4],
    desc: { en: 'A limasan roof tucked under the eaves of the dalem.', id: 'Atap limasan yang terselip di bawah tritisan dalem.' }, fn: { en: 'Covers the family room.', id: 'Menaungi ruang keluarga.' },
    meaning: { en: 'A lower roof form for a lower-ranked space.', id: 'Bentuk atap yang lebih rendah untuk ruang yang lebih rendah tingkatannya.' },
    specs: [{ en: '1 tier', id: '1 susun' }, { en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.8, views: { inside: { pos: [-5.0, 1.7, 2.0], target: [2, 1.4, -1.5] } } };
