// Sisir: a timber outbuilding across the yard from the omah, for work and storage.
// Local coordinates: long side along x, doors facing +z (towards the yard).
import { reseed, partStore, box, frame } from '../../lib/geometry.js';
import { plinth, columns, grid, gableRoof, wallRun, opening } from '../../lib/kit.js';

const FL = 0.3, TOP = 2.75, WX = 4.0, WZ = 2.1;

function build() {
  reseed(60441);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 2 * WX + 0.4, d: 2 * WZ + 0.4, h: FL, floor: 'ground' });

  columns(P('saka'), grid([-WX, -WX / 2, 0, WX / 2, WX], [-WZ, WZ]), FL, TOP, 0.16);
  frame(P('saka'), 'wood', WX, WZ, TOP + 0.07, 0.15, 0.14, 0.25);

  // Board walls; two wide double doors open the front to the yard
  const D = P('dinding');
  const doors = [{ c: -WX / 2, w: 1.6, h: 2.1 }, { c: WX / 2, w: 1.6, h: 2.1 }];
  wallRun(D, 'plank', { axis: 'x', at: WZ, from: -WX, to: WX, y0: FL, h: TOP - FL, t: 0.08, openings: doors });
  opening(D, { at: WZ, c: -WX / 2, w: 1.6, h: 2.1, y0: FL, leaves: 2, open: 1.3, t: 0.08 });
  opening(D, { at: WZ, c: WX / 2, w: 1.6, h: 2.1, y0: FL, leaves: 2, open: 0.2, t: 0.08 });
  wallRun(D, 'plank', { axis: 'x', at: -WZ, from: -WX, to: WX, y0: FL, h: TOP - FL, t: 0.08 });
  for (const x of [-WX, WX]) wallRun(D, 'plank', { axis: 'z', at: x, from: -WZ, to: WZ, y0: FL, h: TOP - FL, t: 0.08 });

  // Goods inside: a work bench and stacked sacks
  P('isi').add('wood', box(2.0, 0.08, 0.7, -WX / 2, FL + 0.8, -1.3)).add('wood', box(1.9, 0.76, 0.06, -WX / 2, FL + 0.38, -1.55));
  for (let k = 0; k < 6; k++) P('isi').add('bamboo', box(0.7, 0.32, 0.5, WX / 2 - 0.8 + (k % 3) * 0.75, FL + 0.16 + Math.floor(k / 3) * 0.33, -1.4, 'world', 1));

  const counts = gableRoof(P, {
    AX: WX + 0.6, AZ: WZ + 0.65, y0: TOP - 0.02, y1: TOP + 1.9, roof: 'atap', frame: 'usuk',
    gable: 'dinding', gableSlot: 'plank', gableBase: TOP + 0.14, gableAt: WX,
  });
  return { parts, counts };
}

const CATEGORIES = [
  { id: 'body', label: { en: 'Building', id: 'Bangunan' }, local: 'Sisir', color: '#b27a45' },
  { id: 'roof', label: { en: 'Roof', id: 'Atap' },         local: 'Atap',  color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'body', name: 'Bebatur', alias: 'Lantai', en: { en: 'Low plinth', id: 'Bebatur rendah' },
    explode: [0, 0, 0], anchor: [3.2, 0.35, 2.4],
    desc: { en: 'A low stone plinth with an earth floor.', id: 'Bebatur batu yang rendah dengan lantai tanah.' },
    fn: { en: 'Keeps stored goods off the damp ground.', id: 'Menjauhkan barang simpanan dari tanah yang lembap.' },
    meaning: { en: 'The lowest floor of the compound’s buildings.', id: 'Lantai terendah di antara bangunan-bangunan di kompleks ini.' }, interp: true,
    specs: [{ en: 'Floor +0.30 m', id: 'Lantai +0,30 m' }],
  },
  {
    id: 'saka', cat: 'body', name: 'Saka', alias: 'Rangka', en: { en: 'Columns and ring beam', id: 'Tiang dan balok keliling' },
    explode: [0, 1.2, 0], anchor: [4.0, 2.2, 2.1],
    desc: { en: 'A plain timber frame of ten columns and a ring beam.', id: 'Rangka kayu polos dari sepuluh tiang dan balok keliling.' },
    fn: { en: 'Carries the roof.', id: 'Memikul atap.' },
    meaning: { en: 'Built for use rather than show.', id: 'Dibangun untuk dipakai, bukan untuk dipamerkan.' }, interp: true,
    specs: [{ en: '10 columns', id: '10 tiang' }],
  },
  {
    id: 'dinding', cat: 'body', name: 'Dinding Papan', alias: 'Dinding', en: { en: 'Board walls and doors', id: 'Dinding papan dan pintu' },
    explode: [0, 0.4, 1.6], anchor: [-3.2, 1.8, 2.2], focusDir: [0, 0.2, 1],
    desc: { en: 'Walls of timber boards with two wide double doors facing the yard.', id: 'Dinding papan kayu dengan dua pintu ganda yang lebar menghadap halaman.' },
    fn: { en: 'Wide doors to move goods and work in and out.', id: 'Pintu lebar untuk memindahkan barang dan pekerjaan keluar-masuk.' },
    meaning: { en: 'Kudus was a town of merchants and makers; the sisir is where the household’s trade could be carried on at home.', id: 'Kudus adalah kota para pedagang dan perajin; di sisir inilah usaha rumah tangga bisa dijalankan dari rumah.' },
    specs: [{ en: '2 double doors', id: '2 pintu ganda' }],
  },
  {
    id: 'isi', cat: 'body', name: 'Isi', alias: 'Barang', en: { en: 'Bench and goods', id: 'Meja kerja dan barang' }, interp: true,
    explode: [0, 1.0, 0], anchor: [2.0, 1.2, -1.4], focusDir: [0.2, 0.5, 1],
    desc: { en: 'A work bench and stacked sacks, to suggest what the sisir was used for. Not based on a particular house.', id: 'Meja kerja dan tumpukan karung, untuk menggambarkan kegunaan sisir. Tidak didasarkan pada rumah tertentu.' },
    fn: { en: 'Work and storage.', id: 'Tempat kerja dan penyimpanan.' },
    meaning: { en: 'An illustration only.', id: 'Hanya ilustrasi.' },
    specs: [{ en: 'Illustrative', id: 'Ilustrasi' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Molo', alias: 'Rangka atap', en: { en: 'Rafters and ridge', id: 'Usuk dan bubungan' },
    explode: [0, 2.8, 0], anchor: [2.2, 3.6, 1.6],
    desc: { en: 'Rafters, battens and ridge beam.', id: 'Usuk, reng, dan balok bubungan.' },
    fn: { en: 'Carry the clay tiles.', id: 'Memikul genteng.' },
    meaning: { en: 'The same simple roof frame as the pawon’s.', id: 'Rangka atap sederhana yang sama dengan pawon.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Kampung', alias: 'Kampung', en: { en: 'Gable roof', id: 'Atap pelana' }, roof: true,
    explode: [0, 3.8, 0], anchor: [0, 4.2, 1.2],
    desc: { en: 'A kampung (gable) roof of clay tiles.', id: 'Atap kampung (pelana) dari genteng tanah liat.' },
    fn: { en: 'Covers the workshop and store.', id: 'Menaungi tempat kerja dan gudang.' },
    meaning: { en: 'Like the pekiwan, the sisir has a kampung roof: only the omah has the pencu.', id: 'Seperti pekiwan, sisir beratap kampung: hanya omah yang beratap pencu.' },
    specs: [{ en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.4, views: { inside: { pos: [-3.2, 1.65, 1.4], target: [2.0, 1.0, -1.4] } } };
