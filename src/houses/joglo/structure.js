// The joglo frame shared by the pendapa and the dalem: three column rings on umpak,
// sunduk & kili, blandar, tumpang sari, dhadha peksi, uleng, lambang sari and the three
// roof tiers with rafters, hips, ridge and crowns. Units are metres, floor at DIM.floorTop.
import { V, box, beam, frame, ring, lathe, slab, tierFaces, rafters, battens } from '../../lib/geometry.js';
import { umpak } from '../../lib/kit.js';

export const DIM = {
  floorTop: 0.6,
  guru: { x: 2.2, z: 1.9, top: 6.2, s: 0.32, base: 1.0 },
  pen:  { x: 5.2, z: 4.4, top: 4.85, s: 0.26, base: 1.0 },
  pit:  { x: 7.8, z: 6.8, top: 3.6, s: 0.22, base: 0.95 },
  // Roof tiers: eave rectangle (AX, AZ) at y0, upper edge (ix, iz) at y1.
  brunjung:  { AX: 3.6, AZ: 3.3, y0: 6.72, ix: 0.8, iz: 0, y1: 11.01 },
  penanggap: { AX: 6.2, AZ: 5.4, y0: 4.71, ix: 3.3, iz: 3.0, y1: 6.35 },
  penitih:   { AX: 9.0, AZ: 8.0, y0: 3.58, ix: 5.7, iz: 4.9, y1: 4.7 },
  slab: 0.1,
};

// Default part ids (the pendapa's); pass `ids` to merge pieces into fewer parts.
const IDS = {
  umpak: 'umpak', guru: 'saka_guru', pen: 'saka_penanggap', pit: 'saka_penitih',
  sunduk: 'sunduk_kili', blandar: 'blandar', tumpang: 'tumpang_sari', dadha: 'dadha_peksi',
  uleng: 'uleng', lambang: 'lambang_sari', usuk: 'usuk', dudur: 'dudur', molo: 'molo', mustaka: 'mustaka',
  brunjung: 'atap_brunjung', penanggap: 'atap_penanggap', penitih: 'atap_penitih',
};

export function jogloStructure(P, ids = {}) {
  const I = { ...IDS, ...ids };
  const { floorTop: F, guru, pen, pit } = DIM;

  // ── Columns and their umpak
  const guruPos = ring([-guru.x, guru.x], [-guru.z, guru.z], guru.x, guru.z);
  const penPos = ring([-pen.x, -guru.x, guru.x, pen.x], [-pen.z, -guru.z, guru.z, pen.z], pen.x, pen.z);
  const pitPos = ring(
    [-pit.x, -pen.x, -guru.x, guru.x, pen.x, pit.x],
    [-pit.z, -pen.z, -guru.z, guru.z, pen.z, pit.z], pit.x, pit.z);
  const columns = (id, pos, c, ur) => {
    for (const [x, z] of pos) {
      umpak(P(I.umpak), x, z, F, c.base - F, ur[0], ur[1]);
      P(id).add('wood', box(c.s, c.top - c.base, c.s, x, (c.top + c.base) / 2, z));
    }
  };
  columns(I.guru, guruPos, guru, [0.3, 0.42]);
  columns(I.pen, penPos, pen, [0.26, 0.36]);
  columns(I.pit, pitPos, pit, [0.22, 0.31]);

  // ── Sunduk (through-beams) and kili (wedges)
  const yS = guru.top - 1.0;
  const SK = P(I.sunduk);
  for (const z of [-guru.z, guru.z]) SK.add('wood', box(2 * guru.x + 0.7, 0.26, 0.12, 0, yS, z));
  for (const x of [-guru.x, guru.x]) SK.add('wood', box(0.12, 0.26, 2 * guru.z + 0.7, x, yS - 0.34, 0));
  for (const z of [-guru.z, guru.z]) for (const sx of [-1, 1]) SK.add('accent', box(0.05, 0.36, 0.16, sx * (guru.x + 0.27), yS, z));
  for (const x of [-guru.x, guru.x]) for (const sz of [-1, 1]) SK.add('accent', box(0.16, 0.36, 0.05, x, yS - 0.34, sz * (guru.z + 0.27)));

  // ── Blandar & pengeret ring beams
  frame(P(I.blandar), 'wood', guru.x, guru.z, guru.top + 0.11, 0.26, 0.22, 0.22);
  frame(P(I.blandar), 'wood', pen.x, pen.z, pen.top + 0.09, 0.2, 0.18, 0.18);
  frame(P(I.blandar), 'wood', pit.x, pit.z, pit.top + 0.08, 0.18, 0.16, 0.28);

  // ── Tumpang sari: five courses stepping outward
  const tsBase = guru.top + 0.22;
  for (let i = 0; i < 5; i++) {
    frame(P(I.tumpang), i % 2 ? 'accent' : 'carved',
      2.3 + 0.14 * i, 2.0 + 0.13 * i, tsBase + 0.09 + 0.18 * i, 0.26, 0.18, 0.08);
  }
  const tsTop = tsBase + 5 * 0.18;

  // ── Dhadha peksi across the middle
  P(I.dadha)
    .add('carved', box(2 * 2.3 + 0.26, 0.36, 0.3, 0, tsBase + 0.2, 0))
    .add('accent', box(2 * 2.3 - 0.3, 0.05, 0.34, 0, tsBase + 0.005, 0))
    .add('accent', box(0.5, 0.2, 0.36, 0, tsBase - 0.1, 0));

  // ── Uleng: inward stepped ceiling above the tumpang sari
  let ux = 2.62, uz = 2.41;
  for (let j = 0; j < 4; j++) {
    frame(P(I.uleng), j % 2 ? 'accent' : 'carved', ux, uz, tsTop + 0.08 + 0.16 * j, 0.22, 0.16, 0);
    if (j < 3) { ux -= 0.3; uz -= 0.28; }
  }
  P(I.uleng).add('accent', box(2 * ux + 0.22, 0.04, 2 * uz + 0.22, 0, tsTop + 0.64 + 0.02, 0));

  // ── Lambang sari: rings and short posts at the brunjung / penanggap junction
  const LS = P(I.lambang);
  const lx = 3.25, lz = 2.95;
  frame(LS, 'wood', lx, lz, 6.04, 0.14, 0.16, 0.05);
  frame(LS, 'wood', lx, lz, 6.86, 0.12, 0.14, 0.05);
  const posts = (half, place) => {
    const n = Math.round((2 * half) / 0.65);
    for (let k = 0; k <= n; k++) place(-half + (k * 2 * half) / n);
  };
  posts(lx, (x) => { for (const z of [-lz, lz]) LS.add('wood', box(0.08, 0.68, 0.08, x, 6.46, z)); });
  posts(lz, (z) => { for (const x of [-lx, lx]) LS.add('wood', box(0.08, 0.68, 0.08, x, 6.46, z)); });

  // ── Roof tiers: tiled slabs, rafters, battens, hips, caps
  let nRafters = 0, nBattens = 0;
  const t = DIM.slab;
  const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  for (const [id, tier] of [[I.brunjung, DIM.brunjung], [I.penanggap, DIM.penanggap], [I.penitih, DIM.penitih]]) {
    for (const q of tierFaces(tier)) {
      const s = slab(q, t);
      P(id).add('roof', s.top).add('plank', s.under);
      nRafters += rafters(P(I.usuk), q, t);
      nBattens += battens(P(I.usuk), q, t);
    }
    for (const [sx, sz] of corners) {
      const a = V(sx * tier.AX, tier.y0, sz * tier.AZ);
      const b = V(sx * tier.ix, tier.y1, sz * tier.iz);
      const dn = V(0, -(t + 0.12), 0), up = V(0, 0.05, 0);
      P(I.dudur).add('wood', beam(a.clone().add(dn), b.clone().add(dn), 0.14, 0.2));
      P(I.mustaka).add('ornament', beam(a.clone().add(up), b.clone().add(up), 0.2, 0.1, 0.05));
    }
  }

  // ── Molo (ridge beam) and ridge crown ornaments
  const B = DIM.brunjung;
  P(I.molo).add('wood', box(2 * B.ix + 0.5, 0.26, 0.2, 0, B.y1 - t - 0.14, 0));
  P(I.mustaka).add('ornament', box(2 * B.ix + 0.3, 0.16, 0.26, 0, B.y1 + 0.06, 0, 'stone', 1));
  const prof = [[0, 0], [0.2, 0], [0.22, 0.06], [0.14, 0.12], [0.12, 0.2], [0.24, 0.34], [0.2, 0.46],
    [0.1, 0.56], [0.07, 0.66], [0.12, 0.74], [0.05, 0.86], [0, 0.95]];
  for (const sx of [-1, 1]) P(I.mustaka).add('ornament', lathe(prof, V(sx * (B.ix + 0.05), B.y1 + 0.1, 0)));

  return { rafters: nRafters, battens: nBattens };
}
