// Pagar and halaman: the plot's wall with its side gate, and the yard in the middle of it.
// Built directly in site coordinates (the house faces south, +z).
import { reseed, partStore, box } from '../../lib/geometry.js';
import { mergeStore, gableRoof, wallRun, opening } from '../../lib/kit.js';

export const PLOT = { x0: -14.6, x1: 10.4, z0: -14.2, z1: 13.8, gateZ: 4.6 };
const H = 2.4, T = 0.3;

function cap(part, axis, at, from, to) {
  const len = to - from, mid = (from + to) / 2;
  part.add('stone', axis === 'x' ? box(len, 0.12, T + 0.14, mid, H + 0.06, at, 'stone', 1) : box(T + 0.14, 0.12, len, at, H + 0.06, mid, 'stone', 1));
}

function build() {
  reseed(70551);
  const { parts, P } = partStore();
  const { x0, x1, z0, z1, gateZ } = PLOT;

  // ── Pagar: a plastered wall round the plot, with an opening for the gate in the east side
  const W = P('pagar');
  for (const z of [z0, z1]) { wallRun(W, 'plaster', { axis: 'x', at: z, from: x0, to: x1, y0: 0, h: H, t: T, mode: 'stone' }); cap(W, 'x', z, x0, x1); }
  wallRun(W, 'plaster', { axis: 'z', at: x0, from: z0, to: z1, y0: 0, h: H, t: T, mode: 'stone' });
  cap(W, 'z', x0, z0, z1);
  wallRun(W, 'plaster', { axis: 'z', at: x1, from: z0, to: z1, y0: 0, h: H, t: T, mode: 'stone', openings: [{ c: gateZ, w: 2.4, h: H }] });
  cap(W, 'z', x1, z0, gateZ - 1.2); cap(W, 'z', x1, gateZ + 1.2, z1);

  // ── Lawang: a small roofed gateway with double doors
  const G = P('lawang');
  for (const s of [-1, 1]) G.add('plaster', box(0.6, 2.9, 0.6, x1, 1.45, gateZ + s * 1.3, 'stone', 1));
  const doors = partStore();
  opening(doors.P('lawang'), { at: 0, c: 0, w: 2.0, h: 2.3, y0: 0, leaves: 2, open: 1.2, t: 0.25 });
  for (const part of Object.values(doors.parts)) for (const list of Object.values(part.parts)) for (const g of list) g.rotateY(Math.PI / 2).translate(x1, 0, gateZ);
  mergeStore(P, doors.parts);
  const roof = partStore();
  gableRoof(roof.P, { AX: 2.1, AZ: 0.9, y0: 2.85, y1: 3.6, t: 0.08, roof: 'lawang', frame: 'lawang' });
  for (const part of Object.values(roof.parts)) for (const list of Object.values(part.parts)) for (const g of list) g.rotateY(Math.PI / 2).translate(x1, 0, gateZ);
  mergeStore(P, roof.parts);

  // ── Halaman: the open yard, with a paved strip in front of the omah
  P('halaman').add('ground', box(x1 - x0 - 0.3, 0.04, z1 - z0 - 0.3, (x0 + x1) / 2, 0.02, (z0 + z1) / 2, 'world', 3));
  P('halaman').add('stone', box(14.6, 0.05, 2.2, 0, 0.045, 2.6, 'stone', 1.2));
  for (let x = x1 - 1.0; x > 1.6; x -= 0.95) P('halaman').add('stone', box(0.7, 0.06, 1.6, x, 0.05, gateZ, 'stone', 1));

  return { parts, counts: {} };
}

const CATEGORIES = [
  { id: 'gate', label: { en: 'Wall & gate', id: 'Pagar & lawang' }, local: 'Pagar', color: '#9a948a' },
  { id: 'yard', label: { en: 'Yard', id: 'Halaman' },              local: 'Latar', color: '#c9b48a' },
];

const PARTS = [
  {
    id: 'lawang', cat: 'gate', name: 'Lawang', alias: 'Gerbang samping', en: { en: 'Side gate', id: 'Gerbang samping' },
    explode: [1.6, 1.0, 0], anchor: [10.6, 3.4, 5.6], focusDir: [1, 0.25, 0.2],
    desc: { en: 'A small roofed gateway in the side wall, opening onto the lane.', id: 'Gerbang kecil beratap di tembok samping, membuka ke gang.' },
    fn: { en: 'The way in from the lane to the yard.', id: 'Jalan masuk dari gang ke halaman.' },
    meaning: { en: 'In the dense old town of Kudus Kulon, plots are reached from narrow lanes, often through the side. One studied house has two such gates, one on each side.', id: 'Di kota lama Kudus Kulon yang padat, kapling dicapai lewat gang-gang sempit, sering dari samping. Salah satu rumah yang diteliti memiliki dua gerbang seperti ini, satu di tiap sisi.' }, interp: true,
    specs: [{ en: '2 m opening', id: 'Bukaan 2 m' }, { en: 'Double doors', id: 'Pintu ganda' }],
  },
  {
    id: 'pagar', cat: 'gate', name: 'Pagar Kilungan', alias: 'Pagar', en: { en: 'Plot wall', id: 'Pagar kapling' },
    explode: [0, 0.8, 0], anchor: [-14.4, 2.6, 0], focusDir: [-1, 0.3, 0.3],
    desc: { en: 'A plastered masonry wall around the plot. Many, but not all, pencu houses have one.', id: 'Tembok berplester yang mengelilingi kapling. Banyak, tetapi tidak semua, rumah pencu memilikinya.' },
    fn: { en: 'Encloses the house, its yard and outbuildings as one household.', id: 'Melingkupi rumah, halaman, dan bangunan pelengkapnya sebagai satu rumah tangga.' },
    meaning: { en: 'The walls of neighbouring plots form the lanes of the old town.', id: 'Tembok kapling-kapling yang bersebelahan membentuk gang-gang kota lama.' }, interp: true,
    specs: [{ en: '2.4 m high', id: 'Tinggi 2,4 m' }, '25 × 28 m'],
  },
  {
    id: 'halaman', cat: 'yard', name: 'Halaman', alias: 'Latar', en: { en: 'The yard', id: 'Halaman' }, pick: false,
    explode: [0, 0, 0], anchor: [-3.5, 0.3, 6.5],
    desc: { en: 'The open yard in the middle of the plot, between the house on the north side and the outbuildings on the south.', id: 'Halaman terbuka di tengah kapling, di antara rumah di sisi utara dan bangunan pelengkap di sisi selatan.' },
    fn: { en: 'Everyday outdoor work and life, and the way between the house and the well.', id: 'Kegiatan sehari-hari di luar ruangan, serta jalan antara rumah dan sumur.' },
    meaning: { en: 'The house is set by its orientation, facing south across the yard, rather than by the lane outside.', id: 'Rumah ditata menurut arah hadapnya, menghadap ke selatan melintasi halaman, bukan menurut gang di luarnya.' },
    specs: [{ en: 'Earth & paving', id: 'Tanah & paving batu' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.2, views: { inside: { pos: [14, 1.7, 4.6], target: [6, 2.0, 4.6] } } };
