// The ground of the settlement: the yard between the houses and barns, and the rante,
// the field of standing stones where funerals are held. Built in site coordinates.
import * as THREE from 'three';
import { reseed, rand, partStore, box } from '../../lib/geometry.js';

export const SITE = { x0: -36, x1: 20, z0: -14, z1: 22 };
export const RANTE = { x: -28, z: 3, r: 5.5 };
export const ROW_XS = [-12, 0, 12];
const YARD_EDGES = [-4.0, 2.0];

function buildRante() {
  reseed(1201);
  const { parts, P } = partStore();
  const { x: cx, z: cz, r } = RANTE;
  P('lapangan').add('ground', box(2 * r + 3, 0.05, 2 * r + 4, cx, 0.025, cz, 'world', 2));
  // Simbuang batu: rough menhirs of very different heights, in a loose arc
  const n = 11;
  for (let k = 0; k < n; k++) {
    const a = -Math.PI * 0.85 + (k / (n - 1)) * Math.PI * 1.7;
    const h = 1.4 + rand() * 3.4 + (k % 4 === 1 ? 1.2 : 0);
    const w = 0.35 + rand() * 0.35;
    const g = new THREE.CylinderGeometry(w * 0.55, w, h, 6, 1);
    g.scale(1, 1, 0.6 + rand() * 0.3).rotateY(rand() * Math.PI).rotateZ((rand() - 0.5) * 0.12);
    g.translate(cx + Math.cos(a) * r * (0.85 + rand() * 0.2), h / 2, cz + Math.sin(a) * r * (0.85 + rand() * 0.2));
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w * 3, uv.getY(i) * h);
    P('simbuang').add('stone', g);
  }
  return { parts, counts: { stones: n } };
}

function buildYard() {
  reseed(1202);
  const { parts, P } = partStore();
  const { x0, x1, z0, z1 } = SITE;
  P('halaman').add('ground', box(x1 - x0, 0.04, z1 - z0, (x0 + x1) / 2, 0.02, (z0 + z1) / 2, 'world', 3));
  // Low stone edges along both sides of the yard, open in front of every house and barn
  const K = P('batu_pembatas');
  for (const z of YARD_EDGES) {
    let cur = -18;
    for (const gap of [...ROW_XS, 99]) {
      const to = Math.min(gap - 1.6, 18);
      if (to - cur > 0.2) K.add('stone', box(to - cur, 0.3, 0.45, (cur + to) / 2, 0.15, z, 'stone', 1));
      cur = gap + 1.6;
    }
  }
  return { parts, counts: {} };
}

export const rante = {
  build: buildRante,
  categories: [{ id: 'rante', label: 'Funeral field', local: 'Rante', color: '#8d8a82' }],
  parts: [
    {
      id: 'simbuang', cat: 'rante', name: 'Simbuang Batu', alias: 'Menhir', en: 'Standing stones',
      explode: [0, 1.2, 0], anchor: [RANTE.x + 1, 4.6, RANTE.z - RANTE.r], focusDir: [0.8, 0.4, 1],
      desc: 'Rough stones standing upright in the field, some of them several metres tall.',
      fn: 'Each stone is raised during the funeral of a person of high standing.',
      meaning: 'A stone for the dead that outlasts the ceremony. Their number and size show how great the funerals held here have been.',
      specs: ['{stones} stones'],
    },
    {
      id: 'lapangan', cat: 'rante', name: 'Rante', alias: 'Lapangan upacara', en: 'Ceremonial field', pick: false,
      explode: [0, 0, 0], anchor: [RANTE.x, 0.4, RANTE.z + 2],
      desc: 'The open field around the stones.',
      fn: 'Where the great funeral ceremonies (Rambu Solo’) take place, with temporary shelters for the guests and the sacrifice of buffalo.',
      meaning: 'Funerals are the most important ceremonies in Toraja life: only after them does the dead person truly leave for Puya, the land of souls.',
      specs: ['Open ground'],
    },
  ],
  sectionY: 1.6,
  views: { inside: { pos: [RANTE.x + 9, 1.7, RANTE.z + 8], target: [RANTE.x, 2.2, RANTE.z] } },
};

export const yard = {
  build: buildYard,
  categories: [{ id: 'yard', label: 'Yard', local: 'Halaman', color: '#a89a7c' }],
  parts: [
    {
      id: 'halaman', cat: 'yard', name: 'Halaman', alias: 'Halaman tongkonan', en: 'Yard', pick: false,
      explode: [0, 0, 0], anchor: [0, 0.4, 0],
      desc: 'The long open yard between the row of houses and the row of barns.',
      fn: 'For drying rice, daily work and the ceremonies of the family.',
      meaning: 'Houses and barns face each other across it, each tongkonan with its alang opposite.',
      specs: [`${SITE.x1 - SITE.x0} × ${SITE.z1 - SITE.z0} m`],
    },
    {
      id: 'batu_pembatas', cat: 'yard', name: 'Batu Pembatas', alias: 'Tepi halaman', en: 'Stone edging',
      explode: [0, 0.6, 0], anchor: [-6, 0.6, 2.0], focusDir: [0.4, 0.6, 1],
      desc: 'Low lines of stone along both sides of the yard, open in front of each house and barn.',
      fn: 'Mark out the yard between the two rows.',
      meaning: 'The yard is shared ground, framed by the houses on one side and their barns on the other.',
      specs: ['2 rows'],
    },
  ],
  sectionY: 0.6,
  views: { inside: { pos: [24, 1.7, 2], target: [0, 2, 2] } },
};
