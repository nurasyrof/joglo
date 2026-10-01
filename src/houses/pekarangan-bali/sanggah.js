// Sanggah (merajan): the family temple in the kaja-kangin corner of the compound.
// Built in site coordinates: kaja (mountain) is −z, kangin (sunrise) is +x.
import { V, reseed, partStore, box, frame, slab, tierFaces } from '../../lib/geometry.js';
import { wallRun } from '../../lib/kit.js';

export const SANGGAH = { x0: 5, x1: 14.6, z0: -14.6, z1: -5, gate: 9.5 };

// Build a piece around the origin (front +z), then turn it to `rot` and move it to (x, z).
function placed(P, x, z, rot, fn) {
  const { parts, P: Q } = partStore();
  fn(Q);
  for (const [id, part] of Object.entries(parts)) {
    for (const [slot, list] of Object.entries(part.parts)) {
      for (const g of list) P(id).add(slot, g.rotateY(rot).translate(x, 0, z));
    }
  }
}

// Small hipped roof of black ijuk, as used on shrines.
function ijukRoof(part, { AX, AZ, y0, y1, ix = 0, iz = 0, t = 0.16 }) {
  for (const q of tierFaces({ AX, AZ, y0, ix, iz, y1 })) {
    const s = slab(q, t);
    part.add('ijuk', s.top).add('bamboo', s.under);
  }
}

function build() {
  reseed(909);
  const { parts, P } = partStore();
  const { x0, x1, z0, z1, gate } = SANGGAH;

  // ── Penyengker: walls of the sanggah with its kori (gateway) facing the courtyard
  const W = P('penyengker');
  const h = 1.6;
  wallRun(W, 'bata', { axis: 'z', at: x0, from: z0, to: z1, y0: 0, h, t: 0.3, mode: 'world' });
  wallRun(W, 'bata', { axis: 'x', at: z1, from: x0, to: x1, y0: 0, h, t: 0.3, mode: 'world', openings: [{ c: gate, w: 1.2, h }] });
  W.add('paras', box(0.42, 0.12, z1 - z0, x0, h + 0.06, (z0 + z1) / 2, 'stone', 1));
  for (const [a, b] of [[x0, gate - 0.6], [gate + 0.6, x1]]) W.add('paras', box(b - a, 0.12, 0.42, (a + b) / 2, h + 0.06, z1, 'stone', 1));
  for (const s of [-1, 1]) {
    W.add('paras', box(0.7, 2.4, 0.7, gate + s * 0.95, 1.2, z1, 'stone', 1));
    W.add('paras', box(0.85, 0.16, 0.85, gate + s * 0.95, 2.48, z1, 'stone', 1));
  }
  W.add('paras', box(2.6, 0.3, 0.8, gate, 2.65, z1, 'stone', 1));
  placed(P, gate, z1, 0, (Q) => ijukRoof(Q('penyengker'), { AX: 1.5, AZ: 0.75, y0: 2.75, y1: 3.4, ix: 0.75 }));

  // ── Padmasari: stone throne shrine in the kaja-kangin corner, facing the courtyard
  placed(P, 13.1, -13.1, -Math.PI / 4, (Q) => {
    const S = Q('padmasari');
    S.add('paras', box(1.9, 0.5, 1.9, 0, 0.25, 0, 'stone', 1));
    S.add('paras', box(1.55, 0.6, 1.55, 0, 0.8, 0, 'stone', 1));
    S.add('bata', box(1.2, 0.8, 1.2, 0, 1.5, 0, 'world', 1));
    S.add('paras', box(1.45, 0.16, 1.45, 0, 1.98, 0, 'stone', 1));
    S.add('paras', box(1.0, 0.95, 0.18, 0, 2.5, -0.55, 'stone', 1));
    for (const sx of [-1, 1]) S.add('paras', box(0.15, 0.55, 0.9, sx * 0.6, 2.3, -0.1, 'stone', 1));
    S.add('accent', box(0.7, 0.5, 0.03, 0, 2.55, -0.45));
  });

  // ── Kemulan rong tiga: shrine with three chambers on a stone base, against the kangin wall
  placed(P, 13.1, -9.4, -Math.PI / 2, (Q) => {
    const K = Q('kemulan');
    K.add('paras', box(2.3, 1.0, 1.3, 0, 0.5, 0, 'stone', 1));
    K.add('wood', box(1.9, 0.95, 0.95, 0, 1.48, 0));
    for (const x of [-0.62, 0, 0.62]) K.add('accent', box(0.46, 0.62, 0.04, x, 1.46, 0.48));
    for (const [x, z] of [[-0.95, -0.47], [0.95, -0.47], [-0.95, 0.47], [0.95, 0.47]]) K.add('wood', box(0.1, 0.95, 0.1, x, 1.48, z));
    ijukRoof(K, { AX: 1.35, AZ: 0.85, y0: 1.9, y1: 2.75, ix: 0.5 });
  });

  // ── Taksu: pillar shrine against the kaja wall
  placed(P, 7.4, -13.6, 0, (Q) => {
    const T = Q('taksu');
    T.add('paras', box(0.85, 1.15, 0.85, 0, 0.575, 0, 'stone', 1));
    T.add('wood', box(0.7, 0.6, 0.6, 0, 1.45, 0));
    T.add('accent', box(0.36, 0.42, 0.03, 0, 1.44, 0.31));
    ijukRoof(T, { AX: 0.6, AZ: 0.55, y0: 1.7, y1: 2.35, ix: 0.05 });
  });

  // ── Piasan: open pavilion where offerings are prepared
  placed(P, 8.6, -9.0, 0, (Q) => {
    const A = Q('piasan');
    A.add('paras', box(2.8, 0.5, 2.2, 0, 0.25, 0, 'stone', 1));
    A.add('plank', box(2.3, 0.08, 1.7, 0, 0.9, 0, 'wood'));
    for (const [x, z] of [[-1.15, -0.85], [1.15, -0.85], [-1.15, 0.85], [1.15, 0.85]]) {
      A.add('wood', box(0.14, 2.0, 0.14, x, 1.5, z));
    }
    frame(A, 'wood', 1.15, 0.85, 2.55, 0.13, 0.14, 0.2);
    ijukRoof(A, { AX: 1.85, AZ: 1.5, y0: 2.4, y1: 3.6, ix: 0.35, t: 0.2 });
  });

  // ── Natar: paved ground inside the sanggah
  P('natar').add('paras', box(x1 - x0 - 0.4, 0.05, z1 - z0 - 0.4, (x0 + x1) / 2, 0.025, (z0 + z1) / 2, 'stone', 1));
  return { parts, counts: {} };
}

export const sanggah = {
  build,
  categories: [
    { id: 'wall', label: 'Enclosure', local: 'Penyengker', color: '#9a948a' },
    { id: 'shrine', label: 'Shrines', local: 'Pelinggih', color: '#d9a441' },
  ],
  parts: [
    {
      id: 'penyengker', cat: 'wall', name: 'Penyengker & Kori', alias: 'Tembok & gerbang', en: 'Temple walls and gateway',
      explode: [0, 0.8, 0], anchor: [9.5, 3.2, -4.6], focusDir: [-0.3, 0.4, 1],
      desc: 'Brick walls around the family temple with a gateway (kori) of carved paras under a small ijuk roof.',
      fn: 'Separate the sacred ground of the sanggah from the rest of the compound.',
      meaning: 'Entering through the kori is a step from the world of the household into a sacred space.',
      specs: ['1.6 m walls', '1 kori'],
    },
    {
      id: 'padmasari', cat: 'shrine', name: 'Padmasari', alias: 'Padmasana kecil', en: 'Stone throne shrine',
      explode: [0, 1.2, 0], anchor: [13.1, 3.2, -13.1], focusDir: [-0.6, 0.35, 0.7],
      desc: 'A tall stone shrine in the form of an open throne, standing in the corner closest to the mountain and the sunrise.',
      fn: 'A seat for Sang Hyang Widhi, God in the Balinese Hindu faith, where offerings are placed.',
      meaning: 'An empty throne: the divine is honoured without being depicted.',
      specs: ['Paras & brick', 'Kaja-kangin corner'],
    },
    {
      id: 'kemulan', cat: 'shrine', name: 'Kemulan Rong Tiga', alias: 'Sanggah kemulan', en: 'Shrine with three chambers',
      explode: [0, 1.2, 0], anchor: [12.6, 3.0, -9.4], focusDir: [-1, 0.35, 0.2],
      desc: 'A wooden shrine with three small chambers (rong tiga) on a stone base, under a black ijuk roof.',
      fn: 'Honours the family’s deified ancestors.',
      meaning: 'The ancestors of the household remain present at the heart of its temple.',
      specs: ['3 chambers', 'Ijuk roof'],
    },
    {
      id: 'taksu', cat: 'shrine', name: 'Taksu', alias: 'Pelinggih taksu', en: 'Shrine of inspiration',
      explode: [0, 1.0, 0], anchor: [7.4, 2.7, -13.4],
      desc: 'A small shrine on a stone pillar.',
      fn: 'Honours taksu: the spiritual power that gives a person charisma, skill and inspiration.',
      meaning: 'Dancers, artists and healers pray here for taksu in their work.',
      specs: ['Pillar shrine'],
    },
    {
      id: 'piasan', cat: 'shrine', name: 'Piasan', alias: 'Bale piasan', en: 'Offering pavilion',
      explode: [0, 1.2, 0], anchor: [8.6, 3.2, -8.2],
      desc: 'An open pavilion with a raised platform under an ijuk roof.',
      fn: 'Offerings are arranged and laid out here during temple ceremonies.',
      meaning: 'A place to prepare for prayer, between the gateway and the shrines.',
      specs: ['4 posts', 'Ijuk roof'],
    },
    {
      id: 'natar', cat: 'wall', name: 'Natar Sanggah', alias: 'Halaman pura', en: 'Temple court', pick: false,
      explode: [0, 0, 0], anchor: [6, 0.3, -6],
      desc: 'The paved court inside the temple walls.', fn: 'Space for prayer and ceremonies.',
      meaning: 'Kept clean and quiet, apart from the bustle of the household.', specs: ['Paras paving'],
    },
  ],
  sectionY: 1.0,
  views: { inside: { pos: [7.0, 1.7, -6.2], target: [12.2, 1.6, -12] } },
};
