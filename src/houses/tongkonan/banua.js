// Tongkonan: the ancestral house of a Toraja family. A long house body on a frame of posts,
// under a saddle roof whose ends sweep up and out like a boat's prow. Read top to bottom it
// has three parts, like the cosmos: rattiang banua (roof), kale banua (body), sulluk banua (base).
// Local coordinates: the ridge runs along z, the front (north, with the horns) faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam, lathe, saddleRoof, saddleFrame, saddleGable } from '../../lib/geometry.js';
import { wallRun, opening } from '../../lib/kit.js';

const F = 2.3, WT = 4.3;              // floor and wall top
const BX = 2.0, BZ = 4.2;             // half-size of the house body
const XS = [-1.6, 1.6];
const ZS = [-3.9, -2.6, -1.3, 0, 1.3, 2.6, 3.9];
const ROOMS = 1.4;                    // partitions at z = ±1.4: tangdo' | sali | sumbung

const POT = [[0, 0], [0.15, 0], [0.22, 0.1], [0.24, 0.2], [0.18, 0.3], [0.2, 0.34], [0, 0.34]];

// A pair of buffalo horns facing +z, sweeping out and up in a wide crescent.
export function buffaloHorns(part, at, s = 1) {
  const pts = [[0.06, 0, 0], [0.3, 0.02, 0.06], [0.55, 0.14, 0.04], [0.68, 0.36, -0.04], [0.62, 0.52, -0.1]];
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => V(at.x + side * x * s, at.y + y * s, at.z + z * s)));
    part.add('horn', new THREE.TubeGeometry(curve, 18, 0.06 * s, 7, false));
  }
  part.add('bone', box(0.2 * s, 0.24 * s, 0.12 * s, at.x, at.y - 0.06 * s, at.z, 'stone', 1));
}

// The curved roof with its rafters and carved gables. Shared with the alang (rice barn).
export function torajaRoof(P, cfg, { roof = 'rattiang', ends = 'longa', frame = 'rangka_atap', gable = 'para', gableSlot = 'passura', gableAt, gableBottom }) {
  const r = saddleRoof({ axis: 'z', cx: 0, cz: 0, ends: 'both', gamma: 1, p: 2.2, pinch: 0.4, converge: false, split: 0.55, ...cfg });
  P(roof).add('roof', r.main);
  if (r.horn) P(ends).add('roof', r.horn);
  const nRafters = saddleFrame(P(frame), r, { maxRise: 0.5 });
  for (const z of [gableAt, -gableAt]) {
    const s = z / cfg.len;
    P(gable).add(gableSlot, saddleGable(r, z, r.width(s), gableBottom));
  }
  return { roof: r, rafters: nRafters };
}

export function makeTongkonan({ horns = 10, H = 4.2, seed = 1 } = {}) {
  const ROOF = { len: 8.4, yR: 6.4, yE: 3.6, H, d0: 3.4, t: 0.45 };
  const ridgeAt = (z) => ROOF.yR + H * Math.pow(Math.abs(z) / ROOF.len, 2.2);
  const POST_Z = 7.0;

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    // ── Sulluk banua: posts on flat stones, tied by stacked beams in both directions
    const S = P('sulluk_banua');
    for (const x of XS) for (const z of ZS) {
      S.add('stone', box(0.55, 0.18, 0.55, x, 0.09, z, 'stone', 1));
      S.add('wood', box(0.26, F - 0.3, 0.26, x, 0.18 + (F - 0.3) / 2, z));
    }
    for (const y of [0.75, 1.45]) {
      for (const x of XS) S.add('wood', box(0.2, 0.24, 2 * BZ - 0.2, x, y, 0));
      for (const z of ZS) S.add('wood', box(2 * BX - 0.6, 0.2, 0.16, 0, y + 0.24, z));
    }
    for (const x of XS) S.add('wood', box(0.3, 0.3, 2 * BZ + 0.6, x, F - 0.27, 0));

    // ── A'riri posi': the navel post at the centre of the house
    P('ariri_posi')
      .add('stone', box(0.5, 0.2, 0.5, 0, 0.1, 0, 'stone', 1))
      .add('wood', new THREE.CylinderGeometry(0.17, 0.19, WT - 0.2, 10).translate(0, 0.2 + (WT - 0.2) / 2, 0));

    // ── Lantai: joists and boards of the floor
    const L = P('lantai');
    for (const z of [-3.2, -1.6, 1.6, 3.2]) L.add('wood', box(2 * BX, 0.16, 0.14, 0, F - 0.2, z));
    L.add('plank', box(2 * BX, 0.1, 2 * BZ, 0, F - 0.05, 0, 'wood'));

    // ── Kale banua: carved walls (passura') with a small door at the front and shutters on the sides
    const D = P('dinding');
    const h = WT - F, wins = [-2.8, 0, 2.8];
    wallRun(D, 'passura', { axis: 'x', at: BZ, from: -BX, to: BX, y0: F, h, t: 0.1, mode: 'world', openings: [{ c: 0, w: 0.8, h: 1.35 }] });
    wallRun(D, 'passura', { axis: 'x', at: -BZ, from: -BX, to: BX, y0: F, h, t: 0.1, mode: 'world' });
    for (const x of [-BX, BX]) {
      wallRun(D, 'passura', { axis: 'z', at: x, from: -BZ, to: BZ, y0: F, h, t: 0.1, mode: 'world', openings: wins.map((c) => ({ c, w: 0.5, h: 0.5, sill: 0.95 })) });
      for (const c of wins) D.add('accent', box(0.05, 0.56, 0.56, x * 1.03, F + 1.2, c));
    }
    for (const x of [-BX, BX]) for (const z of [-BZ, BZ]) D.add('wood', box(0.2, h + 0.1, 0.2, x, F + h / 2, z));
    for (const y of [F + 0.05, WT]) {
      for (const z of [-BZ, BZ]) D.add('wood', box(2 * BX + 0.2, 0.14, 0.16, 0, y, z));
      for (const x of [-BX, BX]) D.add('wood', box(0.16, 0.14, 2 * BZ + 0.2, x, y, 0));
    }
    opening(D, { at: BZ, c: 0, w: 0.8, h: 1.35, y0: F, leaves: 1, open: 0.9, t: 0.1, leafSlot: 'accent' });

    // ── Ladder up to the front door
    const T = P('tangga');
    const a = V(0, 0.05, BZ + 2.0), b = V(0, F, BZ + 0.15);
    for (const x of [-0.32, 0.32]) T.add('wood', beam(a.clone().setX(x), b.clone().setX(x), 0.09, 0.14));
    for (let k = 1; k <= 6; k++) {
      const p = a.clone().lerp(b, k / 7);
      T.add('wood', box(0.64, 0.05, 0.14, 0, p.y, p.z));
    }
    T.add('stone', box(1.0, 0.14, 0.6, 0, 0.07, BZ + 2.2, 'stone', 1));

    // ── Tangdo', sali, sumbung: two partitions divide the house into three rooms
    const R = P('ruang');
    for (const z of [ROOMS, -ROOMS]) {
      wallRun(R, 'plank', { axis: 'x', at: z, from: -BX + 0.05, to: BX - 0.05, y0: F, h: h - 0.1, t: 0.06, openings: [{ c: 0.95, w: 0.7, h: 1.5 }] });
    }
    R.add('plank', box(2 * BX - 0.1, 0.06, 2 * BZ - 0.1, 0, WT - 0.1, 0, 'wood'));

    // ── Dapo': the hearth in the middle room, with its cooking pots
    const H0 = P('dapo');
    H0.add('wood', box(1.0, 0.14, 1.0, -1.2, F + 0.07, -0.3));
    H0.add('stone', box(0.86, 0.12, 0.86, -1.2, F + 0.16, -0.3, 'stone', 1));
    for (const [x, z] of [[-1.42, -0.5], [-1.0, -0.1], [-0.98, -0.55]]) H0.add('stone', box(0.16, 0.18, 0.16, x, F + 0.3, z, 'stone', 1));
    H0.add('accent', lathe(POT, V(-1.2, F + 0.38, -0.3), null, 14));
    H0.add('wood', box(1.1, 0.06, 0.8, -1.2, WT - 0.7, -0.3));

    // ── Rattiang banua: the curved roof of layered bamboo, its rafters and carved gables
    const { rafters } = torajaRoof(P, ROOF, { gableAt: BZ + 0.08, gableBottom: WT });

    // ── Tulak somba: free-standing posts under the projecting ends of the roof
    const TS = P('tulak_somba');
    for (const z of [POST_Z, -POST_Z]) {
      const top = ridgeAt(z) - ROOF.t - 0.1;
      TS.add('stone', box(0.6, 0.2, 0.6, 0, 0.1, z, 'stone', 1));
      TS.add('wood', box(0.34, top - 0.2, 0.34, 0, 0.2 + (top - 0.2) / 2, z));
      TS.add('wood', box(1.4, 0.22, 0.3, 0, top - 0.11, z));
    }

    // ── Tanduk tedong: buffalo horns stacked up the front post, one pair for each buffalo sacrificed
    const HN = P('tanduk');
    const z0 = POST_Z + 0.2;
    for (let k = 0; k < horns; k++) {
      const s = 1 - k * 0.025;
      buffaloHorns(HN, V(0, 2.2 + k * 0.42, z0), s);
    }

    // ── Kabongo' and katik: a carved buffalo head on the front, and the long-necked bird above it
    const K = P('kabongo');
    const kz = BZ + 0.22, ky = WT + 0.2;
    K.add('accent', box(0.42, 0.62, 0.3, 0, ky, kz, 'stone', 1));
    K.add('accent', box(0.32, 0.22, 0.32, 0, ky - 0.36, kz + 0.06, 'stone', 1));
    for (const x of [-0.14, 0.14]) K.add('bone', box(0.07, 0.07, 0.03, x, ky + 0.06, kz + 0.16, 'stone', 1));
    buffaloHorns(K, V(0, ky + 0.24, kz + 0.05), 1.15);

    const B = P('katik');
    const neck = new THREE.CatmullRomCurve3([V(0, WT + 0.9, BZ + 0.15), V(0, WT + 1.5, BZ + 0.35), V(0, WT + 2.0, BZ + 0.85), V(0, WT + 2.2, BZ + 1.35)]);
    B.add('accent', new THREE.TubeGeometry(neck, 20, 0.08, 8, false));
    B.add('accent', box(0.2, 0.26, 0.34, 0, WT + 2.25, BZ + 1.45, 'stone', 1));
    B.add('bone', new THREE.ConeGeometry(0.06, 0.32, 8).rotateX(Math.PI / 2).translate(0, WT + 2.22, BZ + 1.75));
    B.add('accent', box(0.05, 0.22, 0.12, 0, WT + 2.46, BZ + 1.42, 'stone', 1));

    return { parts, counts: { rafters, horns, posts: XS.length * ZS.length } };
  }

  const len = ROOF.len, tip = ROOF.yR + H;
  return {
    build,
    categories: CATEGORIES,
    parts: [
      {
        id: 'sulluk_banua', cat: 'base', name: 'Sulluk Banua', alias: 'Kolong & tiang', en: 'Base of posts and beams',
        explode: [0, 0, 0], anchor: [1.6, 1.2, 2.6], focusDir: [1, 0.25, 0.6],
        desc: 'Square timber posts standing on flat stones, locked together by heavy beams that run through them in both directions.',
        fn: 'Lift the house well above the ground. Resting on stones and held by beams rather than nails, the frame can move a little without breaking.',
        meaning: 'The lowest of the house’s three parts, linked to the underworld. The space beneath was used to keep buffalo and pigs.',
        specs: ['{posts} posts on stones', 'Floor +2.3 m'],
      },
      {
        id: 'ariri_posi', cat: 'base', name: 'A’riri Posi’', alias: 'Tiang pusat', en: 'Navel post',
        explode: [0, 0, 0], anchor: [0, 1.4, 0], focusDir: [1, 0.2, 0.3],
        desc: 'A round post at the centre of the house, standing apart from the grid of the other posts.',
        fn: 'Marks the middle of the house; it rises from the ground up into the middle room.',
        meaning: 'Posi’ means navel. Like a navel, it ties the house to its origin: the place the family comes from.',
        specs: ['1 post', 'Centre of the house'],
      },
      {
        id: 'tangga', cat: 'base', name: 'Tangga', alias: 'Eran', en: 'Ladder',
        explode: [0, 0, 1.6], anchor: [0.4, 1.2, BZ + 1.0], focusDir: [0.8, 0.3, 1],
        desc: 'A steep timber ladder up to the small door in the front wall.',
        fn: 'The only way into the house, under the shelter of the projecting roof.',
        meaning: 'Entering means climbing up, away from the ground and the world below.',
        specs: ['7 rungs'],
      },
      {
        id: 'lantai', cat: 'body', name: 'Lantai', alias: 'Sali', en: 'Floor',
        explode: [0, 1.0, 0], anchor: [-1.4, F + 0.05, 3.2],
        desc: 'Thick boards laid over the floor joists, running the length of the house.',
        fn: 'The living floor of the house, high above the ground.',
        meaning: 'The base of kale banua, the middle world where the family lives.',
        specs: [`${2 * BX} × ${2 * BZ} m`],
      },
      {
        id: 'dinding', cat: 'body', name: 'Dinding Passura’', alias: 'Kale banua', en: 'Carved walls',
        explode: [0, 2.0, 0], anchor: [BX, 3.6, 1.4], focusDir: [1, 0.2, 0.4],
        desc: 'Wall panels carved and painted with passura’, motifs in red, black, white and yellow. There is a small door at the front and small shuttered windows on the sides.',
        fn: 'Enclose the house. The openings are kept small, so the inside stays dark and warm.',
        meaning: 'Each motif has a name and a meaning. Pa’ barre allo, the sun, stands for the source of life; pa’ tedong, the buffalo, for prosperity. The colours are often read as life (red), death (black), purity (white) and God’s grace (yellow).',
        specs: ['Passura’ carving', '1 door · 6 windows'],
      },
      {
        id: 'ruang', cat: 'body', name: 'Tangdo’, Sali & Sumbung', alias: 'Tiga ruang', en: 'The three rooms',
        explode: [0, 2.8, 0], anchor: [-1.0, 3.4, -2.8], focusDir: [-0.4, 0.8, 0.3],
        desc: 'Inside, two partitions divide the house into three rooms: tangdo’ at the front, sali in the middle and sumbung at the back.',
        fn: 'Tangdo’ is used for resting, receiving guests and offerings; sali for cooking, eating and work; sumbung, at the back, is for the head of the family. When a family member dies, the body is kept in the house, often for months, until the funeral.',
        meaning: 'The rooms follow the house from north to south, the direction of the gods towards the direction of the ancestors.',
        specs: ['3 rooms', 'Low ceiling'],
      },
      {
        id: 'dapo', cat: 'body', name: 'Dapo’', alias: 'Tungku', en: 'Hearth',
        explode: [0, 3.4, 0], anchor: [-1.2, F + 0.6, -0.3], focusDir: [-0.6, 0.7, 0.5],
        desc: 'A fireplace of stones in a box of earth, in the middle room, with a rack for firewood above.',
        fn: 'Cooking and warmth. Smoke rises into the roof and keeps the bamboo dry.',
        meaning: 'The fire at the heart of the household.',
        specs: ['3 stones'],
      },
      {
        id: 'rattiang', cat: 'roof', name: 'Rattiang Banua', alias: 'Atap', en: 'Roof', roof: true,
        explode: [0, 4.2, 0], anchor: [2.6, 5.4, 0], focusDir: [1, 0.5, 0.2],
        desc: 'A huge saddle roof built from layers of split bamboo, laid in courses that can be more than half a metre thick. Old roofs are often green with moss and ferns.',
        fn: 'Sheds the heavy rain of the highlands. The ridge sags in the middle and rises towards both ends.',
        meaning: 'The highest of the three parts, linked to the upper world. Its shape is said by some to recall boats in which the ancestors came, and by others the horns of a buffalo.',
        specs: ['Layered bamboo', '{rafters} rafters'],
      },
      {
        id: 'longa', cat: 'roof', name: 'Longa', alias: 'Ujung atap', en: 'Projecting roof ends', roof: true,
        explode: [0, 5.0, 0], anchor: [0, tip - 1.4, len - 0.6], focusDir: [1, 0.4, 0.6],
        desc: 'The ends of the roof sweep out far beyond the walls at the front and back, rising steeply to their tips.',
        fn: 'Shelter the ladder and the space in front of the house, and the ends of the gables.',
        meaning: 'The upswept prow makes the house visible from far away; the more important the tongkonan, the more dramatic its roof.',
        specs: [`Tip +${tip.toFixed(1)} m`],
      },
      {
        id: 'para', cat: 'roof', name: 'Dinding Ujung', alias: 'Tebeng', en: 'Carved gables',
        explode: [0, 3.6, 0], anchor: [1.2, WT + 1.2, BZ + 0.1], focusDir: [0.5, 0.2, 1],
        desc: 'Triangular panels of carved and painted passura’ closing the front and back of the roof above the walls.',
        fn: 'Close the roof space at the ends.',
        meaning: 'The front gable is the face of the house, where the family shows its finest carving.',
        specs: ['Passura’ carving'],
      },
      {
        id: 'rangka_atap', cat: 'roof', name: 'Rangka Atap', alias: 'Kasau & bubungan', en: 'Roof frame',
        explode: [0, 3.0, 0], anchor: [-1.4, 5.6, -2], focusDir: [-1, 0.5, 0.2],
        desc: 'A ridge beam and pairs of rafters carrying the bamboo layers.',
        fn: 'Holds the shape of the curved roof.',
        meaning: 'Hidden under the bamboo, it is the skeleton of the roof.',
        specs: ['{rafters} rafters'],
      },
      {
        id: 'tulak_somba', cat: 'roof', lift: false, name: 'Tulak Somba', alias: 'Tiang penyangga', en: 'Roof-end posts',
        explode: [0, 0, 0], anchor: [0, 3.2, -POST_Z], focusDir: [1, 0.3, -0.6],
        desc: 'Tall free-standing posts under the front and back ends of the roof, with a crossbeam at the top.',
        fn: 'Carry the weight of the projecting roof ends so they do not sag.',
        meaning: 'The front post is where the family displays the horns of its sacrificed buffalo.',
        specs: ['2 posts'],
      },
      {
        id: 'tanduk', cat: 'ornament', name: 'Tanduk Tedong', alias: 'Tanduk kerbau', en: 'Buffalo horns',
        explode: [0, 0, 1.4], anchor: [0.5, 2.2 + horns * 0.21, POST_Z + 0.3], focusDir: [0.7, 0.2, 1],
        desc: 'Horns of buffalo stacked up the front post, one pair above the other.',
        fn: 'Each pair comes from a buffalo sacrificed at a funeral (Rambu Solo’) held by the family.',
        meaning: 'A record of the family’s ceremonies and its standing: the more horns, the more honoured the house.',
        specs: ['{horns} pairs'],
      },
      {
        id: 'kabongo', cat: 'ornament', name: 'Kabongo’', alias: 'Kepala kerbau', en: 'Carved buffalo head',
        explode: [0, 0.6, 1.4], anchor: [0.4, WT + 0.2, BZ + 0.4], focusDir: [0.5, 0.15, 1],
        desc: 'A carved wooden buffalo head with real horns, mounted on the front of the house above the door.',
        fn: 'Marks the front of a tongkonan of standing.',
        meaning: 'The buffalo is the symbol of wealth and status in Toraja, and of the sacrifices that carry the dead to the afterlife.',
        specs: ['Carved wood', 'Real horns'],
      },
      {
        id: 'katik', cat: 'ornament', lift: true, name: 'Katik', alias: 'Burung', en: 'Long-necked bird',
        explode: [0, 4.4, 1.0], anchor: [0, WT + 2.2, BZ + 1.4], focusDir: [0.6, 0.2, 1],
        desc: 'A carved bird with a long curving neck, rising from the front gable above the buffalo head.',
        fn: 'Crowns the front of the house.',
        meaning: 'Often described as a mythical bird or a rooster: a guardian of the house and a sign of the family’s high standing.',
        specs: ['Carved wood'],
      },
    ],
    sectionY: 3.3,
    views: { inside: { pos: [1.2, 3.9, 3.6], target: [-1.0, 3.2, -1.0] } },
  };
}

const CATEGORIES = [
  { id: 'base',     label: 'Base',     local: 'Sulluk banua',   color: '#9a948a' },
  { id: 'body',     label: 'Body',     local: 'Kale banua',     color: '#b3402f' },
  { id: 'roof',     label: 'Roof',     local: 'Rattiang banua', color: '#6f8a5a' },
  { id: 'ornament', label: 'Ornament', local: 'Ukiran',         color: '#d9a63a' },
];

