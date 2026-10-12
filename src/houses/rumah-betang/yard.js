// In front of the betang: the monuments to the dead of the Kaharingan religion (sandung,
// sapundu, pantar), the yard, and the river the house faces. Built in site coordinates.
import * as THREE from 'three';
import { V, reseed, rand, partStore, box, beam, gablePanel } from '../../lib/geometry.js';
import { post } from './kit.js';

export const SITE = { x0: -24, x1: 24, z0: -17, z1: 28, river: 21 };
const SANDUNG = [-10, 13.5];
const SAPUNDU = [[-6.6, 12.2, 2.3], [-5.3, 13.0, 2.0], [-7.6, 13.6, 2.5]];
const PANTAR = [[-13.2, 12.2, 9.5], [-12.2, 15.6, 8.2]];

// A carved figure standing on a post, turned on the lathe: legs, body, shoulders, head, hat.
const FIGURE = [[0.13, 0], [0.13, 0.42], [0.1, 0.45], [0.12, 0.5], [0.15, 0.72], [0.17, 0.95], [0.1, 1.0], [0.08, 1.04], [0.12, 1.1], [0.13, 1.22], [0.09, 1.3], [0.16, 1.32], [0.05, 1.46], [0, 1.47]];

function buildDead() {
  reseed(911);
  const { parts, P } = partStore();

  // Sandung: a small house for the bones, raised on posts, with a gable roof and ridge horns
  const [sx, sz] = SANDUNG, S = P('sandung'), y = 1.9;
  for (const dx of [-0.38, 0.38]) for (const dz of [-0.22, 0.22]) S.add('wood', post(0.07, 0, y, sx + dx, sz + dz));
  S.add('wood', box(1.25, 0.1, 0.85, sx, y + 0.05, sz));
  S.add('ornament', box(1.05, 0.55, 0.66, sx, y + 0.375, sz, 'stone', 1));
  S.add('dark', box(0.26, 0.3, 0.02, sx, y + 0.34, sz + 0.34, 'stone', 1));
  const rz = 0.52, ry = y + 0.65, top = y + 1.05;
  for (const s of [-1, 1]) {
    const g = new THREE.BufferGeometry().setFromPoints([V(sx - 0.72, ry, sz + s * rz), V(sx + 0.72, ry, sz + s * rz), V(sx + 0.72, top, sz), V(sx - 0.72, ry, sz + s * rz), V(sx + 0.72, top, sz), V(sx - 0.72, top, sz)]);
    g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1.4, 0, 1.4, 0.6, 0, 0, 1.4, 0.6, 0, 0.6], 2));
    g.computeVertexNormals();
    S.add('roof', g);
    S.add('ornament', gablePanel([[-rz + 0.06, ry], [rz - 0.06, ry], [0, top - 0.04]], 0.03, 'x', sx + s * 0.55).translate(0, 0, sz));
    S.add('ornament', beam(V(sx + s * 0.7, top - 0.02, sz), V(sx + s * 1.0, top + 0.28, sz), 0.05, 0.07));
  }
  S.add('ornament', box(1.5, 0.06, 0.08, sx, top + 0.01, sz, 'stone', 1));

  // Sapundu: carved figures on posts
  for (const [x, z, h] of SAPUNDU) {
    P('sapundu').add('wood', post(0.12, 0, h - 1.4, x, z));
    P('sapundu').add('ornament', new THREE.LatheGeometry(FIGURE.map(([r, yy]) => new THREE.Vector2(r, yy)), 10).rotateY(rand() * 3).translate(x, h - 1.42, z));
  }

  // Pantar: very tall ironwood poles, each topped with a small carving
  for (const [x, z, h] of PANTAR) {
    P('pantar').add('wood', new THREE.CylinderGeometry(0.07, 0.11, h, 8).translate(x, h / 2, z));
    P('pantar').add('ornament', box(0.5, 0.08, 0.1, x, h + 0.04, z, 'stone', 1));
    P('pantar').add('ornament', box(0.12, 0.26, 0.1, x + 0.18, h + 0.2, z, 'stone', 1));
  }
  return { parts, counts: { sapundu: SAPUNDU.length, pantar: PANTAR.length } };
}

function buildYard() {
  reseed(912);
  const { parts, P } = partStore();
  const { x0, x1, z0, z1, river } = SITE;
  P('halaman').add('ground', box(x1 - x0, 0.04, river - z0, (x0 + x1) / 2, 0.02, (z0 + river) / 2, 'world', 3));
  P('sungai').add('water', box(x1 - x0, 0.02, z1 - river, (x0 + x1) / 2, 0.01, (river + z1) / 2, 'stone', 1));
  // Batang: a landing of logs at the bank, where boats tie up and people bathe
  for (let k = 0; k < 5; k++) P('sungai').add('wood', new THREE.CylinderGeometry(0.16, 0.18, 5.2, 8).rotateZ(Math.PI / 2).translate(0.3 * (k % 2), 0.06, river + 0.5 + k * 0.36));
  return { parts, counts: {} };
}

export const leluhur = {
  build: buildDead,
  categories: [{ id: 'leluhur', label: { en: 'The dead', id: 'Leluhur' }, local: 'Kaharingan', color: '#8d8a82' }],
  parts: [
    {
      id: 'sandung', cat: 'leluhur', name: 'Sandung', alias: 'Rumah tulang', en: { en: 'Bone house', id: 'Rumah tulang' },
      explode: [0, 0.8, 0], anchor: [SANDUNG[0], 3.6, SANDUNG[1]], focusDir: [0.5, 0.3, 1],
      desc: { en: 'A small wooden house raised on posts in front of the betang, shaped like a betang in miniature.', id: 'Rumah kayu kecil di atas tiang di depan betang, berbentuk seperti betang mini.' },
      fn: { en: 'It holds the bones of the family’s dead, placed here at the end of the tiwah, the second funeral.', id: 'Menyimpan tulang-belulang anggota keluarga yang telah meninggal, yang ditempatkan di sini pada akhir tiwah, upacara kematian tahap kedua.' },
      meaning: { en: 'Only after the tiwah has the soul reached the village of the dead. The sandung is its house, standing beside the house of the living.', id: 'Baru setelah tiwah arwah sampai di negeri arwah. Sandung adalah rumahnya, yang berdiri di samping rumah orang yang hidup.' },
      specs: [{ en: 'Ironwood', id: 'Kayu ulin' }, { en: 'On 4 posts', id: 'Di atas 4 tiang' }],
    },
    {
      id: 'sapundu', cat: 'leluhur', name: 'Sapundu', alias: 'Tiang kurban', en: { en: 'Carved posts', id: 'Tiang berukir' },
      explode: [0, 0.8, 0], anchor: [-6.6, 2.8, 12.2], focusDir: [0.5, 0.3, 1],
      desc: { en: 'Ironwood posts carved into human figures, standing near the sandung.', id: 'Tiang ulin yang diukir menjadi sosok manusia, berdiri di dekat sandung.' },
      fn: { en: 'At a tiwah the buffalo or cattle to be sacrificed are tied to them.', id: 'Dalam tiwah, kerbau atau sapi yang akan dikurbankan diikat pada tiang ini.' },
      meaning: { en: 'Each one remains afterwards as a marker of a tiwah held for someone of this house.', id: 'Masing-masing tetap berdiri sesudahnya sebagai penanda tiwah yang pernah diadakan bagi seorang penghuni rumah ini.' }, interp: true,
      specs: [{ en: '{sapundu} posts', id: '{sapundu} tiang' }],
    },
    {
      id: 'pantar', cat: 'leluhur', name: 'Pantar', alias: 'Tiang pantar', en: { en: 'Tall poles', id: 'Tiang tinggi' },
      explode: [0, 0.8, 0], anchor: [-13.2, 10.2, 12.2], focusDir: [0.5, 0.2, 1],
      desc: { en: 'Slender ironwood poles several times a person’s height, raised in front of the house.', id: 'Tiang ulin ramping setinggi beberapa kali tinggi orang, didirikan di depan rumah.' },
      fn: { en: 'With the sandung and sapundu they are raised to honour members of the family who have died.', id: 'Bersama sandung dan sapundu, tiang ini didirikan untuk menghormati anggota keluarga yang telah meninggal.' },
      meaning: { en: 'Their height points the way upwards, to the world above.', id: 'Tingginya menunjukkan jalan ke atas, menuju alam atas.' }, interp: true,
      specs: [{ en: '{pantar} poles', id: '{pantar} tiang' }],
    },
  ],
  sectionY: 1.6,
  views: { inside: { pos: [-4, 1.7, 19], target: [-9.5, 2.4, 13] } },
};

export const yard = {
  build: buildYard,
  categories: [{ id: 'tapak', label: { en: 'Ground and river', id: 'Tanah dan sungai' }, local: 'Halaman', color: '#7f8a6a' }],
  parts: [
    {
      id: 'halaman', cat: 'tapak', name: 'Halaman', alias: 'Halaman betang', en: { en: 'Yard', id: 'Halaman' }, pick: false,
      explode: [0, 0, 0], anchor: [10, 0.4, 14],
      desc: { en: 'The open ground between the house and the river bank.', id: 'Tanah lapang di antara rumah dan tepi sungai.' },
      fn: { en: 'Where the monuments to the dead stand and ceremonies are held.', id: 'Tempat berdirinya bangunan bagi orang mati dan berlangsungnya upacara.' },
      meaning: { en: 'The house looks across it to the river.', id: 'Rumah memandang melintasinya ke arah sungai.' },
      specs: [`${SITE.x1 - SITE.x0} × ${SITE.river - SITE.z0} m`],
    },
    {
      id: 'sungai', cat: 'tapak', name: 'Sungai', alias: 'Sungai di depan rumah', en: { en: 'River', id: 'Sungai' },
      explode: [0, 0, 0], anchor: [0, 0.6, SITE.river + 1.2], focusDir: [0.3, 0.5, 1],
      desc: { en: 'The river in front of the house, with a landing of logs at the bank.', id: 'Sungai di depan rumah, dengan titian batang kayu di tepinya.' },
      fn: { en: 'The road to everywhere else, and the place for water, bathing and washing.', id: 'Jalan menuju ke mana pun, sekaligus tempat mengambil air, mandi, dan mencuci.' },
      meaning: { en: 'A betang is always built beside a river and faces it; upstream and downstream are its main directions.', id: 'Betang selalu dibangun di tepi sungai dan menghadapnya; hulu dan hilir adalah arah utamanya.' },
      specs: [{ en: 'Faces the river', id: 'Menghadap sungai' }],
    },
  ],
  sectionY: 0.6,
  views: { inside: { pos: [6, 1.7, 19.5], target: [0, 4, 0] } },
};
