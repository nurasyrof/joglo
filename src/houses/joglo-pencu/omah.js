// Omah: the main house of a Kudus pencu compound. The jogosatru (front hall) behind the
// carved front gebyok, then the raised dalem with the rong-rongan and the gedongan, all under
// the tall pencu roof. Local coordinates: front (south, towards the yard) faces +z.
import { reseed, partStore, box, beam, frame, lathe, slab, tierFaces, rafters, battens, gablePanel, V } from '../../lib/geometry.js';
import { plinth, steps, umpak, columns, wallRun, opening } from '../../lib/kit.js';
import { gebyokFace, konsol, kere } from './kit.js';
import { CATEGORIES, PARTS } from './omah-parts.js';

// Five floor levels, from the yard (0) up to the gedongan.
export const FLOOR = { porch: 0.45, jogo: 0.7, dalem: 1.15, gedong: 1.35 };
const WX = 6.0, WZ = 5.4;          // outer walls
const ZD = 2.7;                    // gebyok dalem: jogosatru in front, dalem behind
const ZG = -2.6, GX = 2.6;         // gedongan front wall and half-width
const WT = 3.7;                    // top of the outer walls
const DT = 4.0;                    // top of the gebyok dalem and gedongan
const GURU = { x: 1.9, z: 1.7, top: 5.75, s: 0.3 };
const T = 0.1;
const PENCU = { AX: 3.0, AZ: 2.75, y0: 6.45, ix: 0.3, iz: 0, y1: 11.4 };
const PENANGGAP = { AX: 6.6, AZ: 6.0, y0: 3.75, ix: 2.5, iz: 2.22, y1: 6.5 };
const TRITIS = { z0: 5.85, y0: 3.62, z1: 7.3, y1: 3.2, x: 6.6 };

const GUNUNGAN = [[-0.3, 0], [0.3, 0], [0.24, 0.16], [0.13, 0.34], [0.16, 0.48], [0.05, 0.62], [0, 0.82], [-0.05, 0.62], [-0.16, 0.48], [-0.13, 0.34], [-0.24, 0.16]];
const WAYANG = [[-0.1, 0], [0.1, 0], [0.08, 0.18], [0.03, 0.34], [-0.03, 0.34], [-0.08, 0.18]];
const KODOK = [[0, 0], [0.07, 0], [0.08, 0.05], [0.05, 0.1], [0, 0.11]];

// A crest (jenggeran) over a doorway: a carved board with an arched top, in a wall along x.
function jenggeran(part, slot, { c, w, y, h, at }) {
  const pts = [];
  for (let k = 0; k <= 16; k++) {
    const u = -w / 2 + (k * w) / 16;
    pts.push([c + u, y + h * (0.45 + 0.55 * Math.cos((Math.PI * u) / w))]);
  }
  part.add(slot, gablePanel([[c + w / 2, y], [c - w / 2, y], ...pts], 0.05, 'z', at));
}

function build() {
  reseed(30117);
  const { parts, P } = partStore();
  const { porch, jogo, dalem, gedong } = FLOOR;

  // ── Bebatur: stone plinth, the tritisan porch in front and the steps (bancik) up to it
  plinth(P('bebatur'), { w: 12.6, d: 11.4, h: jogo });
  P('bebatur')
    .add('stone', box(12.6, porch, 1.4, 0, porch / 2, 6.4, 'stone', 1.5))
    .add('floor', box(12.4, 0.04, 1.3, 0, porch + 0.02, 6.4, 'world', 1));
  steps(P('bebatur'), { z: 7.1, w: 2.6, h: porch, n: 2 });

  // ── Geladakan: the dalem's raised timber floor on joists and sleepers
  const GL = P('geladakan');
  GL.add('plank', box(2 * WX - 0.24, 0.05, ZD - (-WZ) - 0.12, 0, dalem - 0.025, (ZD - WZ + 0.12) / 2, 'wood'));
  for (let z = -WZ + 0.4; z < ZD; z += 0.6) GL.add('wood', box(2 * WX - 0.3, 0.12, 0.1, 0, dalem - 0.11, z));
  for (const x of [-4.5, -1.5, 1.5, 4.5]) GL.add('wood', box(0.16, dalem - 0.17 - jogo, ZD + WZ - 0.3, x, (jogo + dalem - 0.17) / 2, (ZD - WZ) / 2));
  GL.add('wood', box(2 * WX - 0.2, dalem - jogo, 0.08, 0, (jogo + dalem) / 2, ZD + 0.06));

  // ── Soko guru on tall umpak that rise above the floor
  const guruPos = [[-GURU.x, -GURU.z], [GURU.x, -GURU.z], [-GURU.x, GURU.z], [GURU.x, GURU.z]];
  for (const [x, z] of guruPos) {
    umpak(P('umpak'), x, z, jogo, 0.95, 0.24, 0.36);
    P('soko_guru').add('wood', box(GURU.s, GURU.top - jogo - 0.95, GURU.s, x, (GURU.top + jogo + 0.95) / 2, z));
  }

  // ── Saka: front-wall columns, the columns of the gebyok dalem and the gedongan corners
  const frontXs = [-6, -4.25, -2.5, -0.95, 0.95, 2.5, 4.25, 6];
  for (const x of frontXs) umpak(P('umpak'), x, WZ, jogo, 0.18, 0.13, 0.17);
  columns(P('saka'), frontXs.map((x) => [x, WZ]), jogo + 0.18, WT, 0.18);
  columns(P('saka'), [[-6, ZD], [-3.5, ZD], [3.5, ZD], [6, ZD], [-6, -WZ], [6, -WZ]], dalem, DT, 0.18);
  columns(P('saka'), [[-0.92, ZD], [0.92, ZD]], dalem, DT + 0.25, 0.26);
  columns(P('saka'), [[-GX, ZG], [GX, ZG]], gedong, DT, 0.16);

  // ── Tiang tunggal: the single post in front of the dalem door, under the end of its konsol
  umpak(P('tiang_tunggal'), -0.92, 3.4, jogo, 0.22, 0.12, 0.16);
  P('tiang_tunggal').add('wood', box(0.16, 3.82 - jogo - 0.22, 0.16, -0.92, (3.82 + jogo + 0.22) / 2, 3.4));

  // ── Blandar: ring beam on the outer walls, the big beam over the gebyok dalem, the
  // gedongan lintel and the eave beams of the front and back tritisan
  const BL = P('blandar');
  frame(BL, 'wood', WX, WZ, WT + 0.1, 0.2, 0.2, 0.15);
  BL.add('carved', box(7.4, 0.26, 0.22, 0, DT + 0.38, ZD));
  BL.add('wood', box(2 * GX + 0.2, 0.18, 0.16, 0, DT + 0.09, ZG));
  for (const s of [1, -1]) BL.add('wood', box(2 * TRITIS.x - 0.2, 0.16, 0.14, 0, 3.0, s * 6.85));

  // ── Konsol: brackets carrying the tritisan, and the big pair at the dalem door
  for (const x of frontXs) konsol(P('konsol'), x, WZ + 0.09, 2.98, 1.42);
  for (const x of [-6, -3, 0, 3, 6]) konsol(P('konsol'), x, -WZ - 0.11, 2.98, -1.42, { slot: 'wood' });
  for (const x of [-0.92, 0.92]) konsol(P('konsol'), x, ZD + 0.13, DT + 0.18, 0.62, { w: 0.16, h: 0.22 });

  // ── Gebyok jogosatru: the carved front wall. A kupu tarung double door in the middle,
  // a sliding gebyok (gebyok geser) either side with a kere screen outside it.
  const FG = P('gebyok_jogosatru');
  const doorH = 2.25, gw = 1.3;
  const fOpen = [{ c: 0, w: 1.5, h: doorH }, { c: -1.725, w: gw, h: doorH }, { c: 1.725, w: gw, h: doorH }];
  wallRun(FG, 'wood', { axis: 'x', at: WZ, from: -WX, to: WX, y0: jogo, h: WT - jogo, t: 0.1, openings: fOpen });
  opening(FG, { at: WZ, c: 0, w: 1.5, h: doorH, y0: jogo, leaves: 2, open: 1.2, t: 0.1, leafSlot: 'carved' });
  jenggeran(FG, 'accent', { c: 0, w: 1.7, y: jogo + doorH + 0.1, h: 0.55, at: WZ + 0.08 });
  for (const s of [-1, 1]) {
    // the gebyok geser, slid halfway open behind the fixed wall
    const gx = s * (1.725 + gw * 0.45);
    FG.add('wood', box(gw, doorH, 0.05, gx, jogo + doorH / 2, WZ - 0.09));
    gebyokFace(FG, { from: gx - gw / 2, to: gx + gw / 2, at: WZ - 0.09, y0: jogo, y1: jogo + doorH, dir: -1, cols: 3, plain: true });
    for (const [a, b] of [[2.5, 4.25], [4.25, 6]]) gebyokFace(FG, { from: s > 0 ? a : -b, to: s > 0 ? b : -a, at: WZ, y0: jogo, y1: WT, cols: 5 });
    gebyokFace(FG, { from: s > 0 ? 0.85 : -2.6, to: s > 0 ? 2.6 : -0.85, at: WZ, y0: jogo + doorH + 0.08, y1: WT, cols: 4 });
  }
  const K = P('kere');
  for (const s of [-1, 1]) kere(K, { c: s * 1.725, w: gw + 0.06, at: WZ, top: jogo + doorH });

  // ── Tembok: masonry side and back walls, with a side door to the pawon passage
  const TB = P('tembok');
  for (const s of [-1, 1]) {
    wallRun(TB, 'plaster', { axis: 'z', at: s * WX, from: -WZ, to: WZ - 0.1, y0: jogo, h: WT - jogo, t: 0.24, mode: 'stone', openings: s < 0 ? [{ c: 3.8, w: 0.9, h: 2.1 }] : [] });
  }
  wallRun(TB, 'plaster', { axis: 'x', at: -WZ, from: -WX, to: WX, y0: jogo, h: WT - jogo, t: 0.24, mode: 'stone' });
  TB.add('wood', box(0.06, 2.1, 0.88, -WX + 0.15, jogo + 1.05, 3.8));

  // ── Gebyok dalem: the finer carved wall between jogosatru and dalem, four units and the
  // main door, raised on the dalem floor and reached by a bancik step
  const DG = P('gebyok_dalem');
  wallRun(DG, 'wood', { axis: 'x', at: ZD, from: -WX, to: WX, y0: dalem, h: DT - dalem, t: 0.12, openings: [{ c: 0, w: 1.45, h: 2.4 }] });
  opening(DG, { at: ZD, c: 0, w: 1.45, h: 2.4, y0: dalem, leaves: 2, open: 1.25, t: 0.12, leafSlot: 'carved' });
  for (const [a, b] of [[1.05, 3.5], [3.5, 6]]) for (const s of [-1, 1]) {
    gebyokFace(DG, { from: s > 0 ? a : -b, to: s > 0 ? b : -a, at: ZD, y0: dalem, y1: DT, cols: 5, rich: true });
  }
  jenggeran(DG, 'accent', { c: 0, w: 1.6, y: dalem + 2.48, h: 0.42, at: ZD + 0.09 });
  DG.add('stone', box(1.9, dalem - jogo - 0.05, 0.42, 0, (jogo + dalem - 0.05) / 2, ZD + 0.27, 'stone', 1));

  // ── Gedongan: the inner room behind the rong-rongan, with a sliding kupu tarung door,
  // a gebyok unit either side and a large carved crest (jenggeran) over it
  const G = P('gedongan');
  G.add('plank', box(2 * GX, gedong - dalem, ZG + WZ - 0.12, 0, (dalem + gedong) / 2, (ZG - WZ + 0.12) / 2, 'wood'));
  wallRun(G, 'wood', { axis: 'x', at: ZG, from: -GX, to: GX, y0: gedong, h: DT - gedong, t: 0.1, openings: [{ c: 0, w: 1.4, h: 2.2 }] });
  for (const s of [-1, 1]) {
    G.add('carved', box(0.62, 2.2, 0.05, s * 0.58, gedong + 1.1, ZG + 0.08));
    gebyokFace(G, { from: s > 0 ? 0.7 : -GX, to: s > 0 ? GX : -0.7, at: ZG, y0: gedong, y1: DT, cols: 3, rich: true });
    wallRun(G, 'plank', { axis: 'z', at: s * GX, from: -WZ + 0.12, to: ZG, y0: gedong, h: DT - gedong, t: 0.08 });
    G.add('accent', box(0.08, DT - gedong, 0.3, s * (GX + 0.06), (DT + gedong) / 2, ZG + 0.16));
  }
  jenggeran(G, 'accent', { c: 0, w: 2 * GX + 0.3, y: DT - 0.1, h: 0.7, at: ZG + 0.1 });
  // the bed inside, with its four posts and canopy frame
  G.add('carved', box(1.7, 0.45, 2.0, 0, gedong + 0.225, -4.2));
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) G.add('carved', box(0.07, 1.9, 0.07, sx * 0.82, gedong + 0.45 + 0.95, -4.2 + sz * 0.97));
  frame(G, 'carved', 0.82, 0.97, gedong + 2.37, 0.07, 0.08);

  // ── Sunduk & kili through the soko guru, santen up to the pengeret, and the blandar
  // (along x) and pengeret (across) on top of them
  const SK = P('sunduk_kili');
  const yS = GURU.top - 1.0;
  for (const z of [-GURU.z, GURU.z]) SK.add('wood', box(2 * GURU.x + 0.6, 0.24, 0.12, 0, yS, z));
  for (const x of [-GURU.x, GURU.x]) SK.add('wood', box(0.12, 0.24, 2 * GURU.z + 0.6, x, yS - 0.32, 0));
  for (const z of [-GURU.z, GURU.z]) for (const s of [-1, 1]) SK.add('accent', box(0.05, 0.34, 0.15, s * (GURU.x + 0.24), yS, z));
  for (const x of [-GURU.x, GURU.x]) for (const s of [-1, 1]) SK.add('accent', box(0.15, 0.34, 0.05, x, yS - 0.32, s * (GURU.z + 0.24)));
  const sBot = yS - 0.32 + 0.12;
  for (const x of [-GURU.x, GURU.x]) P('santen').add('carved', box(0.12, GURU.top - sBot, 0.16, x, (GURU.top + sBot) / 2, 0));
  for (const z of [-GURU.z, GURU.z]) P('blandar').add('carved', box(2 * GURU.x + 0.66, 0.2, 0.26, 0, GURU.top + 0.1, z));
  for (const x of [-GURU.x, GURU.x]) P('pengeret').add('carved', box(0.26, 0.2, 2 * GURU.z + 0.66, x, GURU.top + 0.1, 0));

  // ── Rong-rongan: three courses of tumpang sari
  // stepping out, then the luweng: seven courses stepping in, closed by a ceiling board
  const RR = P('rong_rongan');
  const tsBase = GURU.top + 0.2;
  for (let i = 0; i < 3; i++) frame(RR, i % 2 ? 'accent' : 'carved', 2.05 + 0.225 * i, 1.85 + 0.185 * i, tsBase + 0.085 + 0.17 * i, 0.24, 0.17, 0.06);
  const lwBase = tsBase + 0.51;
  let lx = 2.3, lz = 2.05;
  for (let j = 0; j < 7; j++) {
    frame(RR, j % 2 ? 'accent' : 'carved', lx, lz, lwBase + 0.065 + 0.13 * j, 0.2, 0.13, 0);
    if (j < 6) { lx -= 0.19; lz -= 0.17; }
  }
  RR.add('accent', box(2 * lx + 0.2, 0.04, 2 * lz + 0.2, 0, lwBase + 0.93, 0));
  RR.add('carved', box(2 * GURU.x + 0.26, 0.3, 0.26, 0, tsBase + 0.15, 0));

  // ── Roof: the pencu, the penanggap all round, and the tritisan front and back
  let nRafters = 0, nBattens = 0;
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const GD = P('gendheng');
  const kodok = (a, b) => {
    const len = a.distanceTo(b), n = Math.floor(len / 0.5);
    for (let k = 1; k < n; k++) GD.add('ornament', lathe(KODOK, a.clone().lerp(b, k / n).add(V(0, 0.08, 0)), null, 8));
  };
  for (const [id, tier] of [['atap_pencu', PENCU], ['atap_penanggap', PENANGGAP]]) {
    for (const q of tierFaces(tier)) {
      const s = slab(q, T);
      P(id).add('roof', s.top).add('plank', s.under);
      nRafters += rafters(P('usuk'), q, T);
      nBattens += battens(P('usuk'), q, T);
    }
    for (const [sx, sz] of corners) {
      const a = V(sx * tier.AX, tier.y0, sz * tier.AZ), b = V(sx * tier.ix, tier.y1, sz * tier.iz);
      P('usuk').add('wood', beam(a.clone().add(V(0, -(T + 0.12), 0)), b.clone().add(V(0, -(T + 0.12), 0)), 0.14, 0.2));
      GD.add('ornament', beam(a.clone().add(V(0, 0.05, 0)), b.clone().add(V(0, 0.05, 0)), 0.18, 0.09, 0.04));
      kodok(a.clone().add(V(0, 0.05, 0)), b.clone().add(V(0, 0.05, 0)));
      GD.add('ornament', gablePanel(WAYANG.map(([u, y]) => [u, y + tier.y0 + 0.08]), 0.05, 'x', a.x * 1.01).translate(0, 0, a.z));
    }
  }
  for (const s of [1, -1]) {
    const { z0, y0, z1, y1, x } = TRITIS;
    const q = s > 0
      ? [V(-x, y1, z1), V(x, y1, z1), V(x, y0, z0), V(-x, y0, z0)]
      : [V(x, y1, -z1), V(-x, y1, -z1), V(-x, y0, -z0), V(x, y0, -z0)];
    const sl = slab(q, T);
    P('tritisan').add('roof', sl.top).add('plank', sl.under);
    nRafters += rafters(P('usuk'), q, T);
    nBattens += battens(P('usuk'), q, T);
  }

  // Molo, ridge cap, and the crown: a gunungan in the middle flanked by two wayang tiles
  const moloY = PENCU.y1 - T - 0.14;
  P('usuk').add('wood', box(2 * PENCU.ix + 0.5, 0.26, 0.2, 0, moloY, 0));
  // Ander: two posts on short pengeret above the luweng ceiling, holding up the molo
  const aBase = lwBase + 0.95;
  for (const x of [-0.3, 0.3]) {
    P('pengeret').add('wood', box(0.14, 0.16, 2 * lz + 0.3, x, aBase + 0.08, 0));
    P('ander').add('wood', box(0.14, moloY - 0.13 - (aBase + 0.16), 0.14, x, (moloY - 0.13 + aBase + 0.16) / 2, 0));
  }
  GD.add('ornament', box(2 * PENCU.ix + 0.3, 0.14, 0.24, 0, PENCU.y1 + 0.05, 0, 'stone', 1));
  GD.add('ornament', gablePanel(GUNUNGAN.map(([u, y]) => [u, y + PENCU.y1 + 0.1]), 0.07, 'z', 0));
  for (const sx of [-1, 1]) GD.add('ornament', gablePanel(WAYANG.map(([u, y]) => [u + sx * 0.42, y + PENCU.y1 + 0.1]), 0.06, 'z', 0));

  return { parts, counts: { rafters: nRafters, battens: nBattens } };
}

export default {
  build,
  categories: CATEGORIES,
  parts: PARTS,
  sectionY: 2.4,
  views: { inside: { pos: [3.4, 2.8, 2.3], target: [0, 4.6, -1.6] } },
};
