// The Rumah Gadang itself: the Minangkabau family house at the centre of the compound.
// Units are metres; y is up, the house runs along x, the front faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam, hexa, lathe, saddleRoof, saddleFrame, saddleGable } from '../../lib/geometry.js';
import { wallRun, opening as doorway } from '../../lib/kit.js';
import { CATEGORIES, COMPONENTS } from './parts.js';

const FLOOR = 2.0, WALL_TOP = 4.5, FLARE = 0.4;
const XS = [-8.4, -6, -3.6, -1.2, 1.2, 3.6, 6, 8.4];
const ZS = [-3.6, -1.2, 1.2, 3.6];
const WX = 8.75, WZ = 3.95;                     // wall outer faces at floor level
const LEAN = Math.atan(FLARE / (WALL_TOP - FLOOR));

const END = { axis: 'x', cz: 0, len: 3.2, yR: 7.0, yE: 4.6, H: 3.8, d0: 5.0, t: 0.3 };
const ROOFS = {
  main:  { axis: 'x', cx: 0, cz: 0, len: 6.8, yR: 8.0, yE: 4.75, H: 4.2, d0: 5.1, ends: 'both', t: 0.3 },
  right: { ...END, cx: 8.0, ends: 'pos' },
  left:  { ...END, cx: -8.0, ends: 'neg' },
  porch: { axis: 'z', cx: 0, cz: 5.0, len: 2.4, yR: 5.6, yE: 4.1, H: 3.4, d0: 2.0, ends: 'pos', t: 0.25, nu: 40, nv: 12 },
};

const SPIRE = [[0, 0], [0.09, 0], [0.1, 0.1], [0.05, 0.2], [0.08, 0.3], [0.04, 0.42], [0.06, 0.5], [0.02, 0.75], [0, 1.0]];
const JAR = [[0, 0], [0.16, 0], [0.26, 0.12], [0.3, 0.3], [0.24, 0.5], [0.15, 0.58], [0.17, 0.64], [0, 0.64]];

// Leaning wall panel between the floor and the wall top on one side of the house.
function wall(side) {
  const t = 0.08;
  const lo = side === 'z+' || side === 'z-' ? WZ : WX, hi = lo + FLARE;
  const spanLo = side[0] === 'z' ? WX : WZ, spanHi = spanLo + FLARE;
  const sgn = side[1] === '+' ? 1 : -1;
  const P = (along, out, y) => (side[0] === 'z' ? V(along, y, sgn * out) : V(sgn * out, y, along));
  const bottom = [P(-spanLo, lo - t, FLOOR), P(spanLo, lo - t, FLOOR), P(spanLo, lo, FLOOR), P(-spanLo, lo, FLOOR)];
  const top = [P(-spanHi, hi - t, WALL_TOP), P(spanHi, hi - t, WALL_TOP), P(spanHi, hi, WALL_TOP), P(-spanHi, hi, WALL_TOP)];
  const uvf = side[0] === 'z' ? (p) => [p.x / 1.2, p.y / 1.2] : (p) => [p.z / 1.2, p.y / 1.2];
  return hexa(bottom, top, uvf);
}

// Where the outer wall surface is at height y.
const wallOut = (base, y) => base + FLARE * ((y - FLOOR) / (WALL_TOP - FLOOR));

// A window or door on the front (+z) or an end wall (±x), tilted to match the wall's lean.
function opening(part, face, along, y, w, h, leaves = 2) {
  const place = (g, off) => {
    if (face === 'z+') g.rotateX(LEAN).translate(along, y, wallOut(WZ, y) + off);
    else { const s = face === 'x+' ? 1 : -1; g.rotateZ(-s * LEAN).translate(s * (wallOut(WX, y) + off), y, along); }
    return g;
  };
  const dims = (a, b, c) => (face === 'z+' ? [a, b, c] : [c, b, a]);
  part.add('wood', place(new THREE.BoxGeometry(...dims(w + 0.18, h + 0.18, 0.06)), 0.03));
  const lw = w / leaves;
  for (let k = 0; k < leaves; k++) {
    const g = new THREE.BoxGeometry(...dims(lw - 0.03, h, 0.05));
    const off = -w / 2 + lw * (k + 0.5);
    if (face === 'z+') g.translate(off, 0, 0); else g.translate(0, 0, off);
    part.add('accent', place(g, 0.07));
  }
}

// Metal spires on the tips of a gonjong roof (shared with the rangkiang).
export function finials(part, roof, scale = 1) {
  for (const { at, dir } of roof.tips) {
    const prof = SPIRE.map(([r, y]) => [r * scale, y * scale]);
    part.add('metal', lathe(prof, at.clone().addScaledVector(dir, -0.15 * scale), dir, 10));
  }
}

function build() {
  reseed(19930);
  const { parts, P } = partStore();

  // ── Batu sandi and tiang
  for (const x of XS) for (const z of ZS) {
    P('batu_sandi').add('stone', box(0.55, 0.2, 0.55, x, 0.1, z, 'stone', 1));
    const inner = Math.abs(z) < 2;
    const top = inner ? 5.4 : WALL_TOP + 0.2;
    P('tiang').add('wood', new THREE.CylinderGeometry(0.15, 0.16, top - 0.2, 8).translate(x, 0.2 + (top - 0.2) / 2, z));
  }

  // ── Rasuak (through the columns under the floor) and paran (over the column heads)
  const RP = P('rasuak_paran');
  for (const z of ZS) RP.add('wood', box(17.3, 0.22, 0.16, 0, 1.76, z));
  for (const x of XS) RP.add('wood', box(0.16, 0.2, 7.9, x, 1.52, 0));
  for (const z of ZS) {
    const inner = Math.abs(z) < 2;
    RP.add('wood', box(17.6, 0.2, 0.18, 0, inner ? 5.3 : WALL_TOP + 0.1, z));
  }
  for (const x of XS) RP.add('wood', box(0.18, 0.18, 7.6, x, 5.15, 0));

  // ── Lantai
  P('lantai').add('plank', box(17.5, 0.1, 7.9, 0, FLOOR - 0.05, 0, 'wood'));

  // ── Walls: carved front and ends, woven bamboo back
  P('dinding_ukiran').add('ukiran', wall('z+')).add('ukiran', wall('x+')).add('ukiran', wall('x-'));
  P('dinding_sasak').add('bamboo', wall('z-'));

  // ── Door and windows
  const J = P('jendela');
  for (const x of [-7.2, -4.8, -2.4, 2.4, 4.8, 7.2]) opening(J, 'z+', x, 3.35, 1.0, 1.2);
  for (const face of ['x+', 'x-']) for (const z of [-1.6, 1.6]) opening(J, face, z, 3.35, 1.0, 1.2);
  opening(J, 'z+', 0, 3.05, 1.1, 2.0);

  // ── Tangga: porch, railings, stair, foot-washing jar
  const T = P('tangga');
  const pz0 = WZ, pz1 = 5.85;
  T.add('plank', box(3.2, 0.12, pz1 - pz0, 0, FLOOR - 0.06, (pz0 + pz1) / 2, 'wood'));
  for (const x of [-1.5, 1.5]) {
    T.add('stone', box(0.45, 0.18, 0.45, x, 0.09, pz1 - 0.1, 'stone', 1));
    T.add('wood', new THREE.CylinderGeometry(0.12, 0.13, 4.75, 8).translate(x, 0.18 + 4.75 / 2, pz1 - 0.1));
    T.add('wood', box(0.07, 0.07, pz1 - pz0, x * 1.03, FLOOR + 0.8, (pz0 + pz1) / 2));
    for (let z = pz0 + 0.3; z < pz1 - 0.1; z += 0.35) T.add('wood', box(0.05, 0.8, 0.05, x * 1.03, FLOOR + 0.4, z));
  }
  for (const s of [-1, 1]) {
    T.add('wood', box(0.8, 0.07, 0.07, s * 1.15, FLOOR + 0.8, pz1));
    for (const x of [0.85, 1.15, 1.45]) T.add('wood', box(0.05, 0.8, 0.05, s * x, FLOOR + 0.4, pz1));
  }
  T.add('wood', box(3.3, 0.16, 0.14, 0, 4.95, pz1 - 0.1));
  const steps = 8, run = 0.26, rise = FLOOR / steps;
  for (let k = 1; k < steps; k++) T.add('plank', box(1.3, 0.06, 0.3, 0, FLOOR - k * rise, pz1 + k * run - 0.13, 'wood'));
  for (const x of [-0.68, 0.68]) T.add('wood', beam(V(x, FLOOR, pz1), V(x, 0.05, pz1 + steps * run), 0.08, 0.2));
  T.add('stone', box(1.7, 0.12, 0.7, 0, 0.06, pz1 + steps * run + 0.3, 'stone', 1));
  T.add('accent', lathe(JAR, V(1.35, 0, pz1 + steps * run + 0.2), null, 18));

  // ── Roofs, rafters, gables, finials
  const built = {};
  let nKasau = 0;
  for (const [key, cfg] of Object.entries(ROOFS)) {
    const roof = saddleRoof(cfg);
    built[key] = roof;
    if (roof.main) P('atap_ijuak').add('thatch', roof.main);
    if (roof.horn) P('gonjong').add('thatch', roof.horn);
    nKasau += saddleFrame(P('kasau'), roof);
    finials(P('gonjong'), roof);
  }
  P('singok')
    .add('ukiran', saddleGable(built.right, WX + FLARE - 0.03, WZ + FLARE, WALL_TOP))
    .add('ukiran', saddleGable(built.left, -(WX + FLARE - 0.03), WZ + FLARE, WALL_TOP))
    .add('ukiran', saddleGable(built.porch, pz1 - 0.1, 1.55, 5.03));

  // ── Biliak: sleeping rooms along the back of the hall, one per bay between the columns
  const B = P('biliak');
  const bz = -1.2, bh = 2.3;
  const bays = XS.slice(0, -1).map((x, i) => (x + XS[i + 1]) / 2);
  wallRun(B, 'plank', { axis: 'x', at: bz, from: XS[0], to: XS.at(-1), y0: FLOOR, h: bh, t: 0.06, openings: bays.map((c) => ({ c, w: 0.8, h: 1.9 })) });
  for (const c of bays) doorway(B, { at: bz, c, w: 0.8, h: 1.9, y0: FLOOR, leaves: 1, open: 0.5, t: 0.06, leafSlot: 'accent', frameSlot: 'wood' });
  for (const x of XS) wallRun(B, 'plank', { axis: 'z', at: x, from: -WZ + 0.1, to: bz, y0: FLOOR, h: bh, t: 0.06 });

  return { parts, counts: { kasau: nKasau } };
}

export default {
  build,
  categories: CATEGORIES,
  parts: COMPONENTS,
  sectionY: 3.3,
  views: { inside: { pos: [-6.6, 3.6, 2.6], target: [5, 3.0, -1.3] } },
};
