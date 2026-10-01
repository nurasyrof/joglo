// The village (paraingu) around the houses: megalithic stone tombs in the plaza, the plaza
// itself and the dry-stone wall. Built directly in site coordinates.
import { reseed, partStore, box } from '../../lib/geometry.js';
import { wallRun } from '../../lib/kit.js';

export const VILLAGE = { x: 24, z: 21 };

// [x, z, rotation, scale, carved upright stone in front]
const TOMBS = [
  [-10, 1, 0.1, 1, true],
  [-4.5, -2.6, -0.2, 0.9, false],
  [1, 2.4, 0, 1.3, true],
  [6.5, -2.2, 0.15, 1, false],
  [11, 1.4, -0.1, 0.85, true],
];

// Geometry built around the origin, then turned and moved into place.
const place = (g, x, z, rot) => g.rotateY(rot).translate(x, 0, z);

function buildTombs() {
  reseed(707);
  const { parts, P } = partStore();
  for (const [x, z, rot, s, penji] of TOMBS) {
    const legH = 1.0 * s;
    if (s > 1.1) P('kubur_batu').add('stone', place(box(4.4, 0.3, 3.2, 0, 0.15, 0, 'stone', 1.2), x, z, rot));
    const base = s > 1.1 ? 0.3 : 0;
    for (const [dx, dz] of [[-1.1, -0.65], [1.1, -0.65], [-1.1, 0.65], [1.1, 0.65]]) {
      P('kubur_batu').add('stone', place(box(0.45 * s, legH, 0.45 * s, dx * s, base + legH / 2, dz * s, 'stone', 1.2), x, z, rot));
    }
    P('kubur_batu').add('stone', place(box(3.3 * s, 0.4 * s, 2.2 * s, 0, base + legH + 0.2 * s, 0, 'stone', 1.4), x, z, rot));
    if (penji) {
      const pz = 1.75 * s;
      P('penji').add('stone', place(box(0.7 * s, 1.7 * s, 0.26 * s, 0, base + 0.85 * s, pz, 'stone', 1), x, z, rot));
      P('penji').add('stone', place(box(0.95 * s, 0.22 * s, 0.32 * s, 0, base + 1.8 * s, pz, 'stone', 1), x, z, rot));
    }
  }
  return { parts, counts: {} };
}

function buildPlaza() {
  reseed(808);
  const { parts, P } = partStore();
  const { x: X, z: Z } = VILLAGE;
  P('natara').add('ground', box(2 * X - 0.6, 0.04, 2 * Z - 0.6, 0, 0.02, 0, 'world', 3));
  const W = P('pagar_batu');
  const wall = (o) => wallRun(W, 'stone', { y0: 0, h: 1.2, t: 0.9, mode: 'stone', ...o });
  for (const s of [-1, 1]) {
    wall({ axis: 'x', at: s * Z, from: -X, to: X });
    wall({ axis: 'z', at: s * X, from: -Z, to: Z, openings: [{ c: 0, w: 3.6, h: 1.2 }] });
  }
  return { parts, counts: {} };
}

export const tombs = {
  build: buildTombs,
  categories: [{ id: 'tomb', label: 'Ancestors', local: 'Marapu', color: '#8d8a82' }],
  parts: [
    {
      id: 'kubur_batu', cat: 'tomb', name: 'Kubur Batu', alias: 'Kubur megalitik', en: 'Megalithic tombs',
      explode: [0, 1.5, 0], anchor: [1, 2.4, 2.4], focusDir: [0.6, 0.45, 1],
      desc: 'Great stone slabs raised on stone legs, standing in the middle of the village. Each covers the grave of an ancestor or a noble family.',
      fn: 'Graves of the ancestors, kept at the heart of the village rather than outside it.',
      meaning: 'The dead stay among the living. Hauling a tomb stone from the quarry (tarik batu) can take hundreds of people and days of work, and is marked with feasting and buffalo sacrifice.',
      specs: ['5 tombs', 'Stone slabs on legs'],
    },
    {
      id: 'penji', cat: 'tomb', name: 'Penji', alias: 'Batu berdiri', en: 'Carved upright stones',
      explode: [0, 1.0, 1.5], anchor: [1, 3.2, 4.7], focusDir: [0.3, 0.3, 1],
      desc: 'An upright stone set in front of some tombs, often carved with figures and symbols of the family.',
      fn: 'Marks and honours the grave.',
      meaning: 'Its carvings tell of the status and story of the person buried there.',
      specs: ['3 stones'],
    },
  ],
  sectionY: 1.2,
  views: { inside: { pos: [-3, 1.7, 8], target: [1, 1.2, 2] } },
};

export const plaza = {
  build: buildPlaza,
  categories: [{ id: 'village', label: 'Village', local: 'Paraingu', color: '#a89a7c' }],
  parts: [
    {
      id: 'pagar_batu', cat: 'village', name: 'Pagar Batu', alias: 'Tembok batu', en: 'Dry-stone wall',
      explode: [0, 1.0, 0], anchor: [-23.5, 1.6, 8],
      desc: 'A wall of stacked stone without mortar around the whole village, with gaps for the paths in.',
      fn: 'Encloses and protects the village, which traditionally stands on high ground.',
      meaning: 'Villages were built to be defended; the wall still marks where the village and its ancestors begin.',
      specs: ['1.2 m high', '2 gateways'],
    },
    {
      id: 'natara', cat: 'village', name: 'Natara', alias: 'Halaman kampung', en: 'Village plaza', pick: false,
      explode: [0, 0, 0], anchor: [-16, 0.4, 0],
      desc: 'The open ground between the rows of houses, where the tombs stand.',
      fn: 'Space for ceremonies, gatherings, dances and the drying of harvest.',
      meaning: 'The shared centre of the village, between the houses of the clans and the graves of their ancestors.',
      specs: ['Earth & grass'],
    },
  ],
  sectionY: 0.8,
  views: { inside: { pos: [-26, 1.7, 0], target: [0, 2, 0] } },
};
