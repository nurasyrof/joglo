// Mbaru niang: the cone house of Wae Rebo. A round floor on short posts, nine posts
// inside, four storage levels above the living floor, and a roof of grass and palm fibre
// that comes down almost to the ground. The niang gendang (drum house) and the niang gena
// are built alike and differ in size.
// Local coordinates: the door faces +z.
import * as THREE from 'three';
import { V, reseed, partStore, box, beam } from '../../lib/geometry.js';
import { partsFor, CATEGORIES } from './niang-parts.js';

const FLOOR = 1.0;        // living floor above the ground
const EAVE = 0.75;        // the roof stops this far above the ground
const T = 0.3;            // thatch thickness
const LEVELS = [0.2, 0.37, 0.53, 0.67];   // the four upper floors, as fractions of the height above the floor

const cyl = (r, y0, y1, x, z, seg = 8) => new THREE.CylinderGeometry(r, r, y1 - y0, seg).translate(x, (y0 + y1) / 2, z);
const hoop = (r, y, tube = 0.03) => new THREE.TorusGeometry(r, tube, 5, 64).rotateX(Math.PI / 2).translate(0, y, 0);
const polar = (r, a) => [r * Math.sin(a), r * Math.cos(a)];      // angle measured from the door (+z)

// A straight run of upright planks between two points.
function wall(part, slot, [ax, az], [bx, bz], y0, h, t = 0.04) {
  const len = Math.hypot(bx - ax, bz - az);
  if (len < 0.05) return;
  part.add(slot, box(len, h, t, 0, y0 + h / 2, 0).rotateY(Math.atan2(-(bz - az), bx - ax)).translate((ax + bx) / 2, 0, (az + bz) / 2));
}

// A round floor of boards laid along x; `skip(x, z)` leaves openings.
function deck(part, slot, r, y, w = 0.25, t = 0.04, hole = null) {
  let n = 0;
  for (let z = -r + w / 2; z < r; z += w) {
    const half = Math.sqrt(Math.max(0, r * r - z * z));
    if (half < 0.1) continue;
    const runs = hole && z > hole.z0 && z < hole.z1 ? [[-half, hole.x0], [hole.x1, half]] : [[-half, half]];
    for (const [x0, x1] of runs) if (x1 - x0 > 0.05) part.add(slot, box(x1 - x0, t, w - 0.01, (x0 + x1) / 2, y - t / 2, z));
    n++;
  }
  return n;
}

function horns(part, at, s = 1) {
  const pts = [[0, 0, 0], [0.22, 0.04, 0], [0.42, 0.2, 0], [0.5, 0.45, 0], [0.45, 0.62, 0]];
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y]) => V(at.x + side * x * s, at.y + y * s, at.z)));
    part.add('horn', new THREE.TubeGeometry(curve, 14, 0.045 * s, 6, false));
  }
}

export function makeNiang({ r = 5.5, top = 12.5, rooms = 6, main = false, seed = 51 } = {}) {
  const RE = r + 0.5;
  const rAt = (y) => RE * Math.pow(Math.max(0, (top - y) / (top - EAVE)), 0.9);     // roof radius at height y
  const levelY = LEVELS.map((f) => FLOOR + f * (top - FLOOR));
  const levelR = levelY.map((y) => rAt(y) - T - 0.3);
  const DOOR = { z: r - 0.9, w: 1.1, h: 1.8 };
  const YD = FLOOR + 2.9;                           // the roof is lifted up to here over the door
  const RI = r * 0.55;                              // the rooms lie between this radius and the roof
  const RP = r * 0.34;                              // ring of the eight posts round the centre

  function build() {
    reseed(seed);
    const { parts, P } = partStore();

    // ── Foundation: short posts wrapped in palm fibre where they enter the ground
    const Fd = P('fondasi');
    let footings = 0;
    for (const [rr, n] of [[r - 0.5, 16], [r * 0.6, 8]]) for (let k = 0; k < n; k++) {
      const [x, z] = polar(rr, ((k + 0.5) / n) * 2 * Math.PI);
      Fd.add('wood', cyl(0.11, 0, FLOOR - 0.2, x, z));
      Fd.add('ijuk', cyl(0.15, 0, 0.45, x, z));
      footings++;
    }
    for (const rr of [r - 0.5, r * 0.6]) Fd.add('wood', hoop(rr, FLOOR - 0.14, 0.06));
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI;
      const [x, z] = polar(r - 0.2, a);
      Fd.add('wood', beam(V(x, FLOOR - 0.07, z), V(-x, FLOOR - 0.07, -z), 0.08, 0.1));
    }

    // ── Lutur: the living floor, the nine posts, the hearth and the rooms
    const boards = deck(P('lutur'), 'plank', r - 0.05, FLOOR);
    P('lutur').add('rattan', hoop(r - 0.05, FLOOR - 0.02, 0.035));
    P('lutur').add('plank', box(DOOR.w + 1.0, 0.04, 1.3, 0, FLOOR - 0.02, r + 0.35));     // threshold under the lifted roof

    const S = P('siri');
    S.add('wood', cyl(0.17, 0, top - 0.5, 0, 0, 10));
    for (let k = 0; k < 8; k++) {
      const [x, z] = polar(RP, ((k + 0.5) / 8) * 2 * Math.PI);
      S.add('wood', cyl(0.12, 0, levelY[1], x, z));
    }
    S.add('wood', hoop(RP, levelY[0] - 0.12, 0.06));

    const Sp = P('sapo');
    const hz = -RP * 0.45;
    Sp.add('plank', box(1.3, 0.12, 1.3, 0, FLOOR + 0.06, hz));
    Sp.add('earth', box(1.14, 0.06, 1.14, 0, FLOOR + 0.14, hz, 'world', 1));
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2 + 0.5;
      Sp.add('stone', new THREE.DodecahedronGeometry(0.1, 0).scale(1, 1.3, 1).translate(Math.cos(a) * 0.22, FLOOR + 0.28, hz + Math.sin(a) * 0.22));
    }
    for (const sx of [-0.6, 0.6]) for (const sz of [-0.6, 0.6]) Sp.add('wood', cyl(0.04, FLOOR, FLOOR + 1.75, sx, hz + sz, 6));
    for (let k = 0; k < 7; k++) Sp.add('bamboo', new THREE.CylinderGeometry(0.025, 0.025, 1.3, 6).rotateZ(Math.PI / 2).translate(0, FLOOR + 1.75, hz - 0.6 + k * 0.2));

    // Rooms round the back, each a family's; their doors open towards the fire
    const L = P('loang');
    const span = (230 * Math.PI) / 180, a0 = Math.PI - span / 2;
    for (let k = 0; k <= rooms; k++) {
      const a = a0 + (k / rooms) * span;
      wall(L, 'plank', polar(RI, a), polar(r - 0.35, a), FLOOR, 1.75);
      if (k === rooms) break;
      const a1 = a0 + ((k + 1) / rooms) * span, am = (a + a1) / 2, da = 0.36 / RI;
      wall(L, 'plank', polar(RI, a), polar(RI, am - da), FLOOR, 1.75);
      wall(L, 'plank', polar(RI, am + da), polar(RI, a1), FLOOR, 1.75);
    }

    // ── The way in: steps, a door, and plank walls where the roof is lifted
    const D = P('para');
    for (let k = 0; k < 4; k++) D.add('plank', box(1.5, 0.05, 0.3, 0, FLOOR - (k + 1) * (FLOOR / 5), r + 1.05 + k * 0.3));
    for (const s of [-1, 1]) {
      D.add('wood', beam(V(s * 0.8, FLOOR - 0.1, r + 0.85), V(s * 0.8, 0.02, r + 2.25), 0.07, 0.14));
      D.add('wood', cyl(0.07, FLOOR, YD - 0.15, s * (DOOR.w / 2 + 0.07), DOOR.z, 8));
      D.add('plank', box(DOOR.w / 2 - 0.02, DOOR.h, 0.04, -s * (DOOR.w / 4), FLOOR + DOOR.h / 2, 0).rotateY(-s * 1.2).translate(s * (DOOR.w / 2), 0, DOOR.z));
      // Tibing: the side walls that close the roof where it is raised
      wall(D, 'plank', [s * 1.25, DOOR.z], [s * 1.25, r + 0.75], FLOOR - 0.6, YD - FLOOR + 0.3);
      wall(D, 'plank', [s * (DOOR.w / 2 + 0.14), DOOR.z], [s * 1.25, DOOR.z], FLOOR, YD - FLOOR - 0.2);
    }
    D.add('plank', box(DOOR.w + 0.3, YD - FLOOR - DOOR.h - 0.2, 0.04, 0, (YD - 0.2 + FLOOR + DOOR.h) / 2, DOOR.z));
    if (main) {
      // The gong that hangs by the door of the drum house
      D.add('horn', new THREE.CylinderGeometry(0.24, 0.24, 0.06, 20).rotateX(Math.PI / 2).translate(0.95, FLOOR + 1.35, DOOR.z + 0.12));
      D.add('horn', new THREE.SphereGeometry(0.07, 10, 8).translate(0.95, FLOOR + 1.35, DOOR.z + 0.16));
    }

    // ── The four levels above: lobo, lentar, lempa rae, hekang kode
    const U = P('tingkat');
    levelY.forEach((y, i) => {
      const rr = levelR[i];
      const hole = i === 0 ? { x0: RP + 0.5, x1: RP + 1.35, z0: -0.45, z1: 0.45 } : { x0: 0.45, x1: 1.1, z0: -0.4, z1: 0.4 };
      deck(U, 'plank', rr, y, 0.25, 0.04, hole);
      U.add('rattan', hoop(rr, y - 0.02, 0.03));
      for (let k = 0; k < 6; k++) {
        const [x, z] = polar(rr - 0.05, (k / 6) * Math.PI);
        U.add('wood', beam(V(x, y - 0.1, z), V(-x, y - 0.1, -z), 0.07, 0.09));
      }
    });
    let upper = 0;
    for (const i of [0, 1]) for (let k = 0; k < 8; k++) {
      const [x, z] = polar(levelR[i + 1] * 0.82, (k / 8) * 2 * Math.PI);
      U.add('wood', cyl(0.08, levelY[i], levelY[i + 1] - 0.14, x, z));
      upper++;
    }
    // One bamboo ladder from the living floor up to the lobo
    const lx = RP + 0.9;
    for (const s of [-1, 1]) U.add('bamboo', beam(V(lx + 1.3, FLOOR, s * 0.25), V(lx, levelY[0] + 0.5, s * 0.25), 0.07, 0.07));
    for (let k = 1; k <= 7; k++) {
      const f = k / 8.3;
      U.add('bamboo', new THREE.CylinderGeometry(0.025, 0.025, 0.6, 6).rotateX(Math.PI / 2).translate(lx + 1.3 * (1 - f), FLOOR + f * (levelY[0] + 0.5 - FLOOR), 0));
    }

    // ── Roof: bamboo ribs tied to rattan hoops, a cover of grass and palm fibre, the ngando
    const Bk = P('buku');
    const ribs = 116, gap = 2 * Math.asin(1.3 / RE);
    const yMid = EAVE + (top - EAVE) * 0.45, yTop = top - 0.9;
    for (let k = 0; k < ribs; k++) {
      const a = ((k + 0.5) / ribs) * 2 * Math.PI;
      const low = Math.min(a, 2 * Math.PI - a) < gap / 2 ? YD : EAVE + 0.05;
      const pt = (y) => { const [x, z] = polar(rAt(y) - T - 0.04, a); return V(x, y, z); };
      Bk.add('bamboo', beam(pt(low), pt(yMid), 0.045, 0.045));
      Bk.add('bamboo', beam(pt(yMid), pt(yTop), 0.045, 0.045));
    }
    for (const f of [0.12, 0.3, 0.48, 0.66, 0.82]) {
      const y = EAVE + f * (top - EAVE);
      if (y > YD) Bk.add('rattan', hoop(rAt(y) - T - 0.1, y, 0.03));
    }

    const W = P('wehang');
    const profile = (y0, y1, n) => {
      const out = [], inn = [];
      for (let k = 0; k <= n; k++) {
        const y = y0 + ((y1 - y0) * k) / n;
        out.push(new THREE.Vector2(Math.max(0.001, rAt(y)), y));
        inn.unshift(new THREE.Vector2(Math.max(0.001, rAt(y) - T), y - (y > top - 1 ? T : 0)));
      }
      return [...out, ...inn, out[0]];
    };
    const scaleUV = (g, around) => {
      const uv = g.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * around, uv.getY(i) * ((2 * top) / 1.2));
      return g;
    };
    W.add('thatch', scaleUV(new THREE.LatheGeometry(profile(EAVE, YD, 6), 60, gap / 2, 2 * Math.PI - gap), Math.round((2 * Math.PI * RE) / 1.2)));
    W.add('thatch', scaleUV(new THREE.LatheGeometry(profile(YD, top, 22), 60), Math.round((2 * Math.PI * RE) / 1.2)));
    // The lifted flap over the door
    const rd = rAt(YD), half = 1.45;
    const flap = new THREE.BufferGeometry().setFromPoints([
      V(-half, YD + 0.02, rd - 0.25), V(half, YD + 0.02, rd - 0.25), V(half, YD - 0.75, r + 1.25),
      V(-half, YD + 0.02, rd - 0.25), V(half, YD - 0.75, r + 1.25), V(-half, YD - 0.75, r + 1.25),
    ]);
    flap.setAttribute('uv', new THREE.Float32BufferAttribute([0, 1.6, 2.4, 1.6, 2.4, 0, 0, 1.6, 2.4, 0, 0, 0], 2));
    flap.computeVertexNormals();
    W.add('thatch', flap);
    W.add('thatch', box(2 * half, 0.22, 0.3, 0, YD - 0.8, r + 1.2));

    const N = P('ngando');
    N.add('wood', cyl(0.07, top - 0.6, top + 1.5, 0, 0, 8));
    const cap = [[0.02, top + 0.75], [0.3, top + 0.1], [0.5, top - 0.75], [0.36, top - 0.8], [0.02, top + 0.2]];
    N.add('ijuk', new THREE.LatheGeometry(cap.map(([x, y]) => new THREE.Vector2(x, y)), 16));
    for (const y of [top - 0.35, top + 0.05, top + 0.45]) N.add('rattan', hoop(0.5 - (y - top + 0.75) * 0.3, y, 0.025));
    if (main) horns(N, V(0, top + 0.95, 0), 1.1);

    return { parts, counts: { footings, boards, rooms, upper, ribs } };
  }

  return {
    build, categories: CATEGORIES, parts: partsFor({ r, top, rooms, main, levelY }), sectionY: FLOOR + 1.5,
    views: { inside: { pos: [0.6, FLOOR + 1.5, r - 1.9], target: [0, FLOOR + 1.3, -r * 0.5] } },
  };
}
