// Pringgitan: the connecting hall between the pendapa and the dalem, where wayang kulit is staged.
// Local coordinates: long side along x, front (towards the pendapa) facing +z.
import { reseed, partStore, box, frame, lathe, V } from '../../../lib/geometry.js';
import { plinth, umpak, columns, grid, span, hipRoof } from '../../../lib/kit.js';
import * as THREE from 'three';

const FLOOR = 0.7;
const LAMP = [[0, 0], [0.12, 0.02], [0.16, 0.08], [0.1, 0.14], [0.04, 0.22], [0, 0.26]];

function build() {
  reseed(707);
  const { parts, P } = partStore();
  plinth(P('bebatur'), { w: 16.4, d: 7.9, h: FLOOR });

  const pos = grid(span(-7.2, 7.2, 2.4), [-2.8, 2.8]);
  for (const [x, z] of pos) umpak(P('bebatur'), x, z, FLOOR, 0.3, 0.22, 0.3);
  columns(P('saka'), pos, FLOOR + 0.3, 3.4, 0.22);
  frame(P('saka'), 'wood', 7.2, 2.8, 3.49, 0.18, 0.18, 0.25);

  const counts = hipRoof(P, [{ AX: 8.8, AZ: 4.1, y0: 3.1, ix: 5.2, iz: 0, y1: 5.4 }], { roof: 'atap', frame: 'usuk', caps: 'atap' });

  // ── Kelir: wayang screen on its banana-trunk base, with the blencong lamp in front
  const K = P('kelir');
  for (const x of [-2.7, 2.7]) K.add('wood', box(0.1, 2.6, 0.1, x, FLOOR + 1.3, 0.4));
  K.add('plaster', box(5.2, 1.8, 0.02, 0, FLOOR + 1.55, 0.4));
  for (const y of [FLOOR + 0.62, FLOOR + 2.48]) K.add('accent', box(5.3, 0.08, 0.05, 0, y, 0.4));
  K.add('bamboo', new THREE.CylinderGeometry(0.16, 0.16, 5.4, 12).rotateZ(Math.PI / 2).translate(0, FLOOR + 0.16, 0.4));
  K.add('wood', box(0.03, 0.5, 0.03, 0, 3.15, 1.6));
  K.add('ornament', lathe(LAMP, V(0, 2.65, 1.6), null, 12));

  return { parts, counts };
}

const CATEGORIES = [
  { id: 'base',   label: { en: 'Foundation', id: 'Fondasi' }, local: 'Dasar',  color: '#9a948a' },
  { id: 'frame',  label: { en: 'Structure', id: 'Struktur' },  local: 'Rangka', color: '#b27a45' },
  { id: 'fixture', label: { en: 'Fittings', id: 'Perlengkapan' },  local: 'Piranti', color: '#dcab52' },
  { id: 'roof',   label: { en: 'Roof', id: 'Atap' },       local: 'Atap',   color: '#cf5b3f' },
];

const PARTS = [
  {
    id: 'bebatur', cat: 'base', name: 'Bebatur', alias: 'Umpak', en: { en: 'Plinth and column bases', id: 'Bebatur dan umpak' },
    explode: [0, 0, 0], anchor: [-5, 0.45, 4.0],
    desc: { en: 'A stone plinth slightly higher than the pendapa, with an umpak under each column.', id: 'Bebatur batu yang sedikit lebih tinggi dari pendapa, dengan umpak di bawah setiap tiang.' },
    fn: { en: 'Bridges the floor levels of the pendapa in front and the dalem behind.', id: 'Menjembatani ketinggian lantai pendapa di depan dan dalem di belakang.' },
    meaning: { en: 'Moving from pendapa to pringgitan to dalem, the floor rises a little at each step inward.', id: 'Dari pendapa ke pringgitan lalu ke dalem, lantai sedikit naik di setiap langkah ke dalam.' },
    specs: [{ en: 'Floor +0.70 m', id: 'Lantai +0,70 m' }, '14 umpak'],
  },
  {
    id: 'saka', cat: 'frame', name: 'Saka & Blandar', alias: 'Rangka', en: { en: 'Columns and ring beam', id: 'Tiang dan balok keliling' },
    explode: [0, 1.6, 0], anchor: [4.8, 2.4, 2.8],
    desc: { en: 'Two rows of columns tied by a ring beam, carrying a single hipped roof.', id: 'Dua baris tiang yang diikat balok keliling, memikul satu atap limasan.' },
    fn: { en: 'A light open frame: the pringgitan is a passage and a stage rather than a closed room.', id: 'Rangka terbuka yang ringan: pringgitan adalah lorong dan panggung, bukan ruang tertutup.' },
    meaning: { en: 'Its simpler frame shows that it serves the buildings on either side.', id: 'Rangkanya yang lebih sederhana menunjukkan bahwa ia melayani bangunan di kedua sisinya.' },
    specs: [{ en: '14 columns', id: '14 tiang' }, { en: '1 ring beam', id: '1 balok keliling' }],
  },
  {
    id: 'kelir', cat: 'fixture', name: 'Kelir', alias: 'Kelir & blencong', en: { en: 'Wayang screen', id: 'Kelir wayang' },
    explode: [0, 1.2, 2.5], anchor: [2.2, 2.6, 0.5], focusDir: [0.3, 0.2, 1],
    desc: { en: 'The white cloth screen for a wayang kulit performance, set up on a banana trunk (gedebog) into which the puppets are stuck, lit by the blencong oil lamp. It is put up for performances rather than left standing.', id: 'Layar kain putih untuk pertunjukan wayang kulit, dipasang di atas batang pisang (gedebog) tempat wayang ditancapkan, diterangi lampu minyak blencong. Kelir dipasang saat pertunjukan saja, tidak dibiarkan berdiri.' },
    fn: { en: 'The dalang sits between lamp and screen and brings the puppets to life as shadows.', id: 'Dalang duduk di antara lampu dan layar, menghidupkan wayang sebagai bayangan.' },
    meaning: { en: 'The pringgitan takes its name from ringgit, an old word for the wayang puppets.', id: 'Nama pringgitan berasal dari ringgit, kata lama untuk wayang.' },
    specs: [{ en: 'Set up for performances', id: 'Dipasang saat pertunjukan' }],
  },
  {
    id: 'usuk', cat: 'roof', name: 'Usuk & Dudur', alias: 'Rangka atap', en: { en: 'Rafters and hips', id: 'Usuk dan jurai' },
    explode: [0, 4.0, 0], anchor: [4.0, 3.8, 3.2],
    desc: { en: 'Rafters, battens, hip rafters and ridge beam of the hipped roof.', id: 'Usuk, reng, jurai, dan balok bubungan atap limasan.' },
    fn: { en: 'Carry the clay tiles.', id: 'Memikul genteng tanah liat.' },
    meaning: { en: 'The same rafter system as the joglo roofs, on a simpler shape.', id: 'Sistem usuk yang sama dengan atap joglo, pada bentuk yang lebih sederhana.' },
    specs: [{ en: '{rafters} rafters', id: '{rafters} usuk' }, { en: '{battens} battens', id: '{battens} reng' }],
  },
  {
    id: 'atap', cat: 'roof', name: 'Atap Limasan', alias: 'Limasan', en: { en: 'Hipped roof', id: 'Atap limasan' }, roof: true,
    explode: [0, 5.5, 0], anchor: [0, 4.9, 1.6],
    desc: { en: 'A limasan roof: four slopes meeting at a short ridge, lower than the joglo roofs on either side.', id: 'Atap limasan: empat bidang miring yang bertemu di bubungan pendek, lebih rendah dari atap joglo di kedua sisinya.' },
    fn: { en: 'Covers the space between pendapa and dalem; its eaves tuck under theirs.', id: 'Menaungi ruang antara pendapa dan dalem; tritisannya terselip di bawah tritisan keduanya.' },
    meaning: { en: 'Roof form shows rank: the limasan sits a step below the joglo in the Javanese hierarchy of roofs.', id: 'Bentuk atap menunjukkan kedudukan: dalam hierarki atap Jawa, limasan berada setingkat di bawah joglo.' },
    specs: [{ en: '1 tier', id: '1 susun' }, { en: 'Clay tiles', id: 'Genteng tanah liat' }],
  },
];

export default { build, categories: CATEGORIES, parts: PARTS, sectionY: 1.8, views: { inside: { pos: [-5.5, 2.0, 2.2], target: [0, 2.1, 0.4] } } };
