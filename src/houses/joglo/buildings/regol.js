// Regol, pagar, seketheng and latar: the compound's gate, walls and courtyard.
// Built directly in site coordinates (the front of the compound faces +z).
import { reseed, partStore, box } from '../../../lib/geometry.js';
import { mergeStore, gableRoof, wallRun, opening } from '../../../lib/kit.js';

export const BOUNDS = { x: 23, front: 20, back: -37 };
const H = 2.2, T = 0.35;

function cap(part, axis, at, from, to) {
  const len = to - from, mid = (from + to) / 2;
  part.add('stone', axis === 'x' ? box(len, 0.12, T + 0.15, mid, H + 0.06, at, 'stone', 1) : box(T + 0.15, 0.12, len, at, H + 0.06, mid, 'stone', 1));
}

function build() {
  reseed(1212);
  const { parts, P } = partStore();
  const { x: X, front: F, back: Bk } = BOUNDS;

  // ── Pagar: perimeter wall with a gap for the regol
  const W = P('pagar');
  wallRun(W, 'plaster', { axis: 'x', at: F, from: -X, to: X, y0: 0, h: H, t: T, mode: 'stone', openings: [{ c: 0, w: 6.0, h: H }] });
  wallRun(W, 'plaster', { axis: 'x', at: Bk, from: -X, to: X, y0: 0, h: H, t: T, mode: 'stone' });
  for (const s of [-1, 1]) wallRun(W, 'plaster', { axis: 'z', at: s * X, from: Bk, to: F, y0: 0, h: H, t: T, mode: 'stone' });
  cap(W, 'x', F, -X, -3); cap(W, 'x', F, 3, X); cap(W, 'x', Bk, -X, X);
  for (const s of [-1, 1]) cap(W, 'z', s * X, Bk, F);

  // ── Regol: gateway with brick piers, double doors and a small tiled roof
  const G = P('regol');
  for (const s of [-1, 1]) {
    G.add('plaster', box(1.0, 3.0, 1.0, s * 2.5, 1.5, F, 'stone', 1));
    G.add('stone', box(1.2, 0.15, 1.2, s * 2.5, 3.07, F, 'stone', 1));
  }
  opening(G, { at: F, c: 0, w: 4.0, h: 2.5, y0: 0, leaves: 2, open: 1.3, t: 0.3 });
  const roof = partStore();
  gableRoof(roof.P, { AX: 3.4, AZ: 1.25, y0: 3.0, y1: 3.85, t: 0.08, roof: 'regol', frame: 'regol' });
  mergeStore(P, roof.parts, { dz: F });

  // ── Seketheng: walls with small doors dividing the front courtyard from the side yards
  const S = P('seketheng');
  for (const s of [-1, 1]) {
    const [a, b] = s < 0 ? [-X, -10] : [10, X];
    wallRun(S, 'plaster', { axis: 'x', at: -3, from: a, to: b, y0: 0, h: H, t: 0.25, mode: 'stone', openings: [{ c: s * 16.5, w: 1.0, h: 2.0 }] });
    opening(S, { at: -3, c: s * 16.5, w: 1.0, h: 2.0, y0: 0, leaves: 1, open: 0.9, t: 0.25 });
    cap(S, 'x', -3, a, b);
  }

  // ── Latar: sandy courtyard with a stone path from the regol to the pendapa steps
  P('latar').add('ground', box(2 * X - 0.4, 0.04, F - Bk - 0.4, 0, 0.02, (F + Bk) / 2, 'world', 3));
  for (let z = F - 0.8; z > 14.5; z -= 0.95) P('latar').add('stone', box(2.4, 0.06, 0.7, 0, 0.05, z, 'stone', 1));

  return { parts, counts: {} };
}

const CATEGORIES = [
  { id: 'gate',  label: 'Gate & walls', local: 'Regol', color: '#9a948a' },
  { id: 'yard',  label: 'Courtyard',    local: 'Latar', color: '#c9b48a' },
];

const PARTS = [
  {
    id: 'regol', cat: 'gate', name: 'Regol', alias: 'Gapura', en: 'Gateway',
    explode: [0, 1.6, 0], anchor: [2.6, 3.4, 20.4], focusDir: [0.5, 0.25, 1],
    desc: 'The formal gateway in the front wall, with brick piers, heavy double doors and a small tiled roof.',
    fn: 'The one ceremonial way in, lined up with the pendapa and the central axis of the house.',
    meaning: 'Passing the regol means leaving the street and entering the family’s ordered world.',
    specs: ['4 m opening', 'Double doors'],
  },
  {
    id: 'pagar', cat: 'gate', name: 'Pagar', alias: 'Pagar tembok', en: 'Compound wall',
    explode: [0, 0.8, 0], anchor: [-22.8, 2.4, 4],
    desc: 'A whitewashed masonry wall around the whole compound.', fn: 'Encloses the household and its yards.',
    meaning: 'Draws a clear line between the outside world and the household.',
    specs: ['2.2 m high', '46 × 57 m'],
  },
  {
    id: 'seketheng', cat: 'gate', name: 'Seketheng', alias: 'Tembok seketheng', en: 'Dividing walls',
    explode: [0, 1.2, 0], anchor: [16.5, 2.4, -2.8],
    desc: 'Walls with small doors that divide the front courtyard from the side yards around the dalem.',
    fn: 'Control who can move from the public front to the family areas at the back.',
    meaning: 'A second threshold: guests stay in front, family and servants pass through.',
    specs: ['2 walls', '2 doors'],
  },
  {
    id: 'latar', cat: 'yard', name: 'Latar', alias: 'Halaman', en: 'Courtyard', pick: false,
    explode: [0, 0, 0], anchor: [-8, 0.3, 17],
    desc: 'The open sandy courtyard, with a stone path from the regol to the pendapa steps.',
    fn: 'Space for arrivals, gatherings and ceremonies in front of the pendapa.',
    meaning: 'The open ground in front of the house is part of the sequence from public to private.',
    specs: ['Sand & stone'],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.2, views: { inside: { pos: [0, 1.7, 26], target: [0, 2.5, 18] } } };
