// Bale: the Balinese pavilion, one adjustable builder for every bale in the compound.
// Parts follow Tri Angga: the base (nista angga), the body (madya angga) and the head (utama angga).
// Local coordinates: front (steps) facing +z, the side that faces the natah.
import { V, reseed, partStore, box, beam, frame, lathe, slab, tierFaces, rafters } from '../../lib/geometry.js';
import { steps, wallRun, opening } from '../../lib/kit.js';

const MURDA = [[0, 0], [0.16, 0], [0.18, 0.08], [0.1, 0.2], [0.14, 0.32], [0.07, 0.48], [0.09, 0.56], [0.03, 0.78], [0, 0.85]];

// Raised plinth of red brick with paras (soft sandstone) foot, cap and steps on the front.
export function bebaturan(part, { w, d, h, x = 0, z = 0, stepW = 1.4, front = true }) {
  part.add('paras', box(w + 0.24, 0.14, d + 0.24, x, 0.07, z, 'stone', 1))
    .add('bata', box(w, h - 0.26, d, x, 0.14 + (h - 0.26) / 2, z, 'world', 1))
    .add('paras', box(w + 0.12, 0.12, d + 0.12, x, h - 0.06, z, 'stone', 1));
  if (front && h > 0.25) steps(part, { x, z: z + d / 2 + 0.06, w: stepW, h, n: Math.max(1, Math.round(h / 0.22)), run: 0.3, slot: 'paras' });
}

// Steep hipped thatch roof whose eaves sit on the beams over the posts.
// px / pz: half-extents of the posts, o: overhang beyond them, k: pitch (rise per run).
export function hipDims({ px, pz, o, k, top }) {
  const AX = px + o, AZ = pz + o;
  const y0 = top + 0.42 - o * k;
  return { AX, AZ, y0, y1: y0 + k * Math.min(AX, AZ), ix: Math.max(0, AX - AZ), iz: Math.max(0, AZ - AX) };
}

export function thatchHip(P, { px, pz, o, k, top, mat = 'thatch', t = 0.3, roof = 'atap', frame: frameId = 'iga_iga', crown = 'murda' }) {
  const tier = hipDims({ px, pz, o, k, top });
  const { AX, AZ, y0, y1, ix, iz } = tier;
  let n = 0;
  for (const q of tierFaces(tier)) {
    const s = slab(q, t);
    P(roof).add(mat, s.top).add('bamboo', s.under);
    n += rafters(P(frameId), q, t, 'bamboo');
  }
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    P(roof).add(mat, beam(V(sx * AX, y0 + 0.05, sz * AZ), V(sx * ix, y1 + 0.05, sz * iz), 0.26, 0.14, 0.04));
  }
  if (ix > 0) P(roof).add(mat, box(2 * ix + 0.3, 0.18, 0.34, 0, y1 + 0.05, 0));
  if (iz > 0) P(roof).add(mat, box(0.34, 0.18, 2 * iz + 0.3, 0, y1 + 0.05, 0));
  if (crown) P(crown).add('paras', lathe(MURDA, V(0, y1 + 0.1, 0), null, 12));
  return { ...tier, rafters: n };
}

// The roof's underside height at horizontal distance `inset` inside the eave line.
const undersideAt = (r, k, inset) => r.y0 + k * inset - 0.42;

/**
 * cfg: {
 *   posts: [[x, z]…], plinth: { w, d, h }, postH, o (overhang), k (pitch),
 *   walls: { x, back, front, door: {c,w,h}, windows: [c…] } | null,
 *   platforms: [{ x, z, w, d, h }], extra(P, ctx) for building-specific pieces,
 *   text: { … per-part overrides }, seed
 * }
 */
export function makeBale(cfg) {
  const { posts, plinth, postH = 2.6, o = 0.8, k = 1.4, walls = null, platforms = [], extra = null, seed = 1, roofMat = 'thatch' } = cfg;
  const px = Math.max(...posts.map(([x]) => Math.abs(x)));
  const pz = Math.max(...posts.map(([, z]) => Math.abs(z)));
  const F = plinth.h, top = F + postH;
  const roof = hipDims({ px, pz, o, k, top });   // roof shape, used by build() and the part anchors

  function build() {
    reseed(seed);
    const { parts, P } = partStore();
    bebaturan(P('bebaturan'), { ...plinth, stepW: Math.min(1.6, plinth.w * 0.4) });

    for (const [x, z] of posts) {
      P('saka').add('paras', box(0.34, 0.3, 0.34, x, F + 0.15, z, 'stone', 1));
      P('saka').add('wood', box(0.17, postH - 0.3, 0.17, x, F + 0.3 + (postH - 0.3) / 2, z));
    }
    frame(P('saka'), 'wood', px, pz, top + 0.09, 0.16, 0.18, 0.25);

    const built = thatchHip(P, { px, pz, o, k, top, mat: roofMat });

    if (walls) {
      const D = P('dinding');
      const wt = Math.min(top - 0.1, undersideAt(roof, k, o - (walls.x - px)) - 0.1);
      const h = wt - F;
      wallRun(D, 'bata', { axis: 'x', at: walls.back, from: -walls.x, to: walls.x, y0: F, h, t: 0.22, mode: 'world' });
      for (const s of [-1, 1]) wallRun(D, 'bata', { axis: 'z', at: s * walls.x, from: walls.back, to: walls.front, y0: F, h, t: 0.22, mode: 'world' });
      const ops = [walls.door, ...(walls.windows || []).map((c) => ({ c, w: 0.7, h: 0.7, sill: 1.0 }))];
      wallRun(D, 'bata', { axis: 'x', at: walls.front, from: -walls.x, to: walls.x, y0: F, h, t: 0.22, mode: 'world', openings: ops });
      opening(D, { at: walls.front, c: walls.door.c, w: walls.door.w, h: walls.door.h, y0: F, leaves: 2, open: 1.0, t: 0.22, leafSlot: 'accent' });
      for (const c of walls.windows || []) opening(D, { at: walls.front, c, w: 0.7, h: 0.7, y0: F + 1.0, leaves: 2, t: 0.22, leafSlot: 'wood' });
      // paras band along the top of the walls
      D.add('paras', box(2 * walls.x + 0.26, 0.14, 0.3, 0, wt + 0.02, walls.back));
      for (const s of [-1, 1]) D.add('paras', box(0.3, 0.14, walls.front - walls.back + 0.26, s * walls.x, wt + 0.02, (walls.front + walls.back) / 2));
    }

    for (const pl of platforms) {
      const B = P('bale_bale');
      B.add('plank', box(pl.w, 0.1, pl.d, pl.x, F + pl.h, pl.z, 'wood'));
      for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
        B.add('wood', box(0.1, pl.h - 0.05, 0.1, pl.x + dx * (pl.w / 2 - 0.08), F + (pl.h - 0.05) / 2, pl.z + dz * (pl.d / 2 - 0.08)));
      }
    }

    extra?.(P, { F, top, roof, px, pz });
    return { parts, counts: { posts: posts.length, rafters: built.rafters } };
  }

  const T = cfg.text || {};
  const parts = [
    {
      id: 'bebaturan', cat: 'nista', name: 'Bebaturan', alias: 'Bataran', en: 'Raised plinth',
      explode: [0, 0, 0], anchor: [-plinth.w / 2 + 0.3, F * 0.6, plinth.d / 2],
      desc: 'A raised base of red brick, edged with carved paras sandstone and reached by steps on the side facing the courtyard.',
      fn: 'Lifts the floor above rain, splash and damp ground.',
      meaning: 'The feet (nista angga) of the building in Tri Angga, which reads a building like a body: base, body and head. More important bale stand higher.',
      specs: [`Floor +${F.toFixed(2)} m`, ...(T.plinthSpecs || [])],
    },
    {
      id: 'saka', cat: 'madya', name: 'Saka & Lambang', alias: 'Sesaka, sendi, lambang-sineb', en: 'Posts and beams',
      explode: [0, 1.4, 0], anchor: [px, F + postH * 0.6, pz],
      desc: 'Timber posts (saka) standing on stone bases (sendi), tied at the top by paired beams (lambang and sineb).',
      fn: 'Carry the roof. The number of posts gives a bale its name: sakepat (4), sakenem (6), sakutus (8), tiang sanga (9) or saka roras (12).',
      meaning: 'Part of the body (madya angga) of the building.',
      specs: [`${posts.length} posts`, ...(T.postName ? [T.postName] : [])],
    },
    ...(walls ? [{
      id: 'dinding', cat: 'madya', name: 'Tembok', alias: 'Dinding bata', en: 'Brick walls and door',
      explode: [0, 2.2, 0], anchor: [-walls.x, F + 1.3, 0], focusDir: [-1, 0.3, 0.6],
      desc: T.walls || 'Walls of red brick with a band of carved paras, a carved double door and small windows.',
      fn: T.wallsFn || 'Close the room for sleeping and for keeping valuables safe.',
      meaning: T.wallsMeaning || 'Only the most private bale is closed in; the others stay open to the courtyard.',
      specs: ['Red brick', 'Carved door'],
    }] : []),
    ...(platforms.length ? [{
      id: 'bale_bale', cat: 'madya', name: 'Bale-bale', alias: 'Pelangkan', en: 'Raised platforms',
      explode: [0, 1.0, 1.8], anchor: [platforms[0].x, F + platforms[0].h + 0.3, platforms[0].z],
      desc: T.platforms || 'Wide timber platforms raised above the floor, for sitting, working and sleeping.',
      fn: T.platformsFn || 'Most of life in a bale happens on these platforms rather than on the floor.',
      meaning: T.platformsMeaning || 'They are furniture and room at once in an open pavilion.',
      specs: [`${platforms.length} platform${platforms.length > 1 ? 's' : ''}`],
    }] : []),
    ...(T.extraParts || []),
    {
      id: 'iga_iga', cat: 'utama', name: 'Iga-iga', alias: 'Usuk bambu', en: 'Bamboo rafters', lift: true,
      explode: [0, 3.2, 0], anchor: [px + 0.3, roof.y0 + 0.6, pz + 0.3],
      desc: 'Bamboo rafters running from the ridge down to the eaves, named iga-iga, “ribs”.',
      fn: 'Carry the thick thatch.',
      meaning: 'Like ribs, they give the head of the building its shape.',
      specs: ['{rafters} rafters'],
    },
    {
      id: 'atap', cat: 'utama', name: 'Raab', alias: 'Atap alang-alang', en: 'Thatched roof', roof: true, lift: true,
      explode: [0, 4.2, 0], anchor: [0, (roof.y0 + roof.y1) / 2, roof.AZ * 0.5],
      desc: 'A steep hipped roof of alang-alang grass thatch, overhanging the posts on every side.',
      fn: 'Sheds heavy rain quickly and keeps the platforms beneath shaded and cool.',
      meaning: 'The head (utama angga) of the building, closest to the heavens.',
      specs: ['Alang-alang thatch'],
    },
    {
      id: 'murda', cat: 'utama', name: 'Murda', alias: 'Puncak', en: 'Roof crown', lift: true,
      explode: [0, 5.0, 0], anchor: [0.3, roof.y1 + 0.7, 0],
      desc: 'A carved ornament crowning the top of the roof.',
      fn: 'Caps and protects the point where the hips meet.',
      meaning: 'The highest point of the building.',
      specs: ['Paras'],
    },
  ];

  return {
    build,
    categories: [
      { id: 'nista', label: 'Base', local: 'Nista angga', color: '#9a948a' },
      { id: 'madya', label: 'Body', local: 'Madya angga', color: '#c58a4a' },
      { id: 'utama', label: 'Head', local: 'Utama angga', color: '#b0624a' },
    ],
    parts,
    sectionY: F + 1.2,
    views: { inside: { pos: cfg.inside?.pos || [px + 0.4, F + 1.5, pz + o + 1.5], target: cfg.inside?.target || [0, F + 1.0, -pz * 0.5] } },
  };
}
