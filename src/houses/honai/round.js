// The round house of the silimo: the men's pilamo and the women's ebe-ai are built the same
// way and differ in size. A ring of split planks set in the ground, four posts around the
// hearth, a sleeping floor above it and a dome of grass over everything.
// Local coordinates: the door faces +z.
import * as THREE from 'three';
import { V, reseed, rand, partStore, box, beam, beamPath, frame } from '../../lib/geometry.js';
import { T, cyl, disc, tieRing, hearth } from './kit.js';

const WH = 1.45;        // wall height
const YE = 1.08;        // the thatch hangs down to here, over the top of the wall
const LOFT = 1.34;      // top of the upper floor
const POST = 0.5;       // the four posts stand at (±POST, ±POST)
const DOOR = { w: 0.6, h: 0.95 };

export function makeRound({ r = 2.0, seed = 11, men = false } = {}) {
  const YA = r + 1.0;                 // top of the dome
  const RE = r + 0.45;                // radius of the eaves
  // Dome profile from the eaves (a = 0) to the top (a = π/2), outside and inside the thatch.
  const dome = (a, inner) => {
    const c = Math.max(0, Math.cos(a)), s = Math.sin(a);
    return [(RE - (inner ? T : 0)) * Math.pow(c, 0.8), YE + (YA - (inner ? T : 0) - YE) * Math.pow(s, 0.9)];
  };
  const a0 = Math.asin(Math.pow((WH - YE) / (YA - T - YE), 1 / 0.9));   // where the dome sits on the wall

  function build() {
    reseed(seed);
    const { parts, P } = partStore();
    const gap = 2 * Math.asin((DOOR.w / 2 + 0.07) / r);

    // ── Lower room: grass floor, plank wall, lashings, hearth and the four posts
    P('lantai').add('yard', disc(r + 0.25, 0, 0.03));
    P('lantai').add('grass', disc(r - 0.06, 0.03, 0.03));

    const W = P('dinding');
    const n = Math.round((2 * Math.PI * r) / 0.17);
    let planks = 0;
    for (let k = 0; k < n; k++) {
      const a = ((k + 0.5) / n) * 2 * Math.PI;
      const over = Math.min(a, 2 * Math.PI - a) < gap / 2;
      const h = WH + (rand() - 0.5) * 0.08, y0 = over ? DOOR.h + 0.08 : 0;
      W.add('wood', box((2 * Math.PI * r) / n - 0.012, h - y0, 0.05, 0, (h + y0) / 2, r).rotateY(a));
      planks++;
    }
    for (const s of [-1, 1]) W.add('wood', box(0.08, DOOR.h + 0.08, 0.1, s * (DOOR.w / 2 + 0.04), (DOOR.h + 0.08) / 2, r - 0.01));
    W.add('wood', box(DOOR.w + 0.3, 0.08, 0.11, 0, DOOR.h + 0.04, r - 0.01));
    W.add('wood', box(DOOR.w, 0.16, 0.06, 0, 0.08, r - 0.01));                       // sill to step over

    for (const y of [0.4, 1.15]) P('tali').add('rope', tieRing(r + 0.035, y, gap));
    P('tali').add('rope', tieRing(r + 0.035, WH - 0.08, 0));

    hearth(P('tungku'), 0, 0);

    const top = YA - T - 0.38;
    for (const x of [-POST, POST]) for (const z of [-POST, POST]) {
      P('tiang').add('stone', box(0.3, 0.05, 0.3, x, 0.03, z, 'stone', 1));
      P('tiang').add('wood', cyl(0.07, top - 0.05, x, 0.05, z));
    }
    frame(P('tiang'), 'wood', POST, POST, top, 0.07, 0.07, 0.14);

    // ── Upper floor: beams on the posts, cane decking and a layer of grass to sleep on
    const U = P('loteng');
    const chord = (d, rr = r - 0.05) => Math.sqrt(Math.max(0, rr * rr - d * d));
    for (const z of [-POST - 0.08, POST + 0.08]) U.add('wood', box(2 * chord(z), 0.1, 0.1, 0, LOFT - 0.2, z));
    for (let x = -r + 0.35; x < r - 0.2; x += 0.55) U.add('wood', box(0.07, 0.07, 2 * chord(x), x, LOFT - 0.115, 0));
    // Decking in strips along x, leaving the opening you climb through just inside the door.
    const hole = { x: 0.36, z0: r - 1.3, z1: r - 0.62 };
    const strips = (slot, y, t, w, rr) => {
      for (let z = -rr + w / 2; z < rr; z += w) {
        const half = chord(z, rr);
        if (half < 0.1) continue;
        const runs = z > hole.z0 && z < hole.z1 ? [[-half, -hole.x], [hole.x, half]] : [[-half, half]];
        for (const [x0, x1] of runs) if (x1 - x0 > 0.05) U.add(slot, box(x1 - x0, t, w - 0.008, (x0 + x1) / 2, y + t / 2, z, 'world', 1));
      }
    };
    strips('cane', LOFT - 0.08, 0.04, 0.11, r - 0.07);
    strips('grass', LOFT - 0.04, 0.04, 0.34, r - 0.16);

    // ── Roof: pole rafters tied like an umbrella, cane hoops, and the grass dome
    const R = P('rangka_atap');
    const nR = Math.round((2 * Math.PI * r) / 0.75);
    for (let k = 0; k < nR; k++) {
      const phi = (k / nR) * 2 * Math.PI;
      const pts = [0, 0.25, 0.5, 0.75, 1].map((f) => {
        const [rr, y] = dome(a0 + f * (Math.PI / 2 - 0.12 - a0), true);
        return V((rr - 0.04) * Math.sin(phi), y - 0.03, (rr - 0.04) * Math.cos(phi));
      });
      for (const g of beamPath(pts, 0.05, 0.05)) R.add('wood', g);
    }
    for (const f of [0.02, 0.32, 0.58, 0.82]) {
      const [rr, y] = dome(a0 + f * (Math.PI / 2 - a0), true);
      R.add('cane', tieRing(rr - 0.09, y - 0.07, 0, 0.022));
    }

    const N = 22, profile = [];
    for (let k = 0; k <= N; k++) profile.push(dome((k / N) * (Math.PI / 2), false));
    for (let k = N; k >= 0; k--) profile.push(dome((k / N) * (Math.PI / 2), true));
    profile.push(profile[0]);
    const shell = new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), 48);
    const uv = shell.attributes.uv, around = Math.round((2 * Math.PI * RE) / 1.2), down = (2 * 1.3 * YA) / 1.2;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * around, uv.getY(i) * down);
    P('atap').add('thatch', shell);
    // A shaggy fringe at the eaves and the tied tuft at the top
    const fringe = [[RE - 0.06, YE + 0.32], [RE + 0.05, YE - 0.1], [RE - 0.12, YE - 0.1], [RE - 0.2, YE + 0.25]];
    P('atap').add('thatch', new THREE.LatheGeometry(fringe.map(([x, y]) => new THREE.Vector2(x, y)), 48));
    const tuft = [[0.001, YA - 0.06], [0.17, YA - 0.03], [0.1, YA + 0.12], [0.13, YA + 0.19], [0.001, YA + 0.25]];
    P('atap').add('thatch', new THREE.LatheGeometry(tuft.map(([x, y]) => new THREE.Vector2(x, y)), 12));
    P('atap').add('rope', tieRing(0.11, YA + 0.12, 0, 0.014));

    return { parts, counts: { planks, rafters: nR } };
  }

  return {
    build, categories: CATEGORIES, parts: partsFor({ r, men, top: YA }), sectionY: 1.0,
    views: { inside: { pos: [0, 0.78, r - 0.4], target: [0, 0.42, -r * 0.5] } },
  };
}

const CATEGORIES = [
  { id: 'bawah', label: { en: 'Lower room', id: 'Ruang bawah' }, local: 'Lantai dasar', color: '#c58a4a' },
  { id: 'atas',  label: { en: 'Sleeping floor', id: 'Lantai tidur' }, local: 'Lantai atas', color: '#8f7a5a' },
  { id: 'atap',  label: { en: 'Roof', id: 'Atap' }, local: 'Atap', color: '#a9935a' },
];

const m = (n) => n.toFixed(1);

// Anatomy text. `men` picks the wording for the pilamo or the ebe-ai.
const partsFor = ({ r, men, top }) => [
  {
    id: 'lantai', cat: 'bawah', name: 'Lantai Rumput', alias: 'Lantai dasar', en: { en: 'Grass floor', id: 'Lantai rumput' }, pick: false,
    explode: [0, 0, 0], anchor: [-r * 0.55, 0.3, r * 0.3],
    desc: { en: 'The floor is the bare earth, covered with a layer of fine dry grass.', id: 'Lantainya tanah, dilapisi rumput kering yang halus.' },
    fn: { en: 'The grass takes the place of a mat: people sit on it around the fire.', id: 'Rumput itu menggantikan tikar: orang duduk di atasnya mengelilingi api.' },
    meaning: { en: 'The same grass is used twice: the coarse stalks go on the roof, the fine ones on the floor.', id: 'Rumput yang sama dipakai dua kali: batang yang kasar untuk atap, yang halus untuk lantai.' },
    specs: [{ en: `Ø ${m(2 * r)} m`, id: `Ø ${m(2 * r)} m` }, { en: 'Fine alang-alang', id: 'Alang-alang halus' }],
  },
  {
    id: 'dinding', cat: 'bawah', name: 'Dinding Papan', alias: 'Papan belah', en: { en: 'Plank wall and door', id: 'Dinding papan dan pintu' },
    explode: [0, 0, 0], anchor: [r * 0.75, 1.0, r * 0.75], focusDir: [0.5, 0.25, 1],
    desc: { en: 'A closed ring of planks split with an axe and set upright in the ground, with one low door and no windows.', id: 'Lingkaran rapat dari papan yang dibelah dengan kapak dan ditanam tegak di tanah, dengan satu pintu rendah dan tanpa jendela.' },
    fn: { en: 'Keeps out the cold wind of the valley and holds in the heat of the fire. You stoop to get through the door.', id: 'Menahan angin dingin lembah dan menyimpan panas api. Orang harus membungkuk untuk melewati pintunya.' },
    meaning: { en: 'With no windows, nobody outside can see or easily hear what happens inside.', id: 'Tanpa jendela, orang di luar tidak dapat melihat atau mudah mendengar apa yang terjadi di dalam.' },
    specs: [{ en: '{planks} planks', id: '{planks} papan' }, { en: 'No windows', id: 'Tanpa jendela' }, { en: '1 low door', id: '1 pintu rendah' }],
  },
  {
    id: 'tali', cat: 'bawah', name: 'Mulele', alias: 'Tali pengikat', en: { en: 'Lashings', id: 'Tali pengikat' },
    explode: [0, 0, 0], anchor: [-r * 0.72, 1.15, r * 0.72], focusDir: [-0.5, 0.2, 1],
    desc: { en: 'Bands of vine or rattan tied round the wall, binding the planks to one another.', id: 'Lilitan tali dari rotan atau tumbuhan merambat yang mengikat keliling dinding, menyatukan papan-papannya.' },
    fn: { en: 'The whole house is tied, not nailed. Ties come in three thicknesses, chosen by what they have to hold.', id: 'Seluruh rumah diikat, bukan dipaku. Tali tersedia dalam tiga ukuran, dipilih menurut apa yang harus ditahannya.' },
    meaning: { en: 'Everything in the house comes from the forest and grassland nearby, so it can be repaired or rebuilt with what is at hand.', id: 'Semua bahan rumah berasal dari hutan dan padang rumput di sekitarnya, sehingga dapat diperbaiki atau dibangun ulang dengan apa yang ada.' },
    specs: [{ en: 'No nails', id: 'Tanpa paku' }, { en: '3 sizes of tie', id: '3 ukuran tali' }],
  },
  {
    id: 'tungku', cat: 'bawah', name: 'Tungku', alias: 'Perapian', en: { en: 'Hearth', id: 'Tungku' },
    explode: [0, 0, 0], anchor: [0, 0.45, 0], focusDir: [0.4, 0.5, 1],
    desc: { en: 'A fire in the middle of the earth floor, between the four posts.', id: 'Api di tengah lantai tanah, di antara empat tiang.' },
    fn: { en: 'It is lit in the late afternoon. The warm air rises to the floor above and stays there through the night.', id: 'Dinyalakan menjelang sore. Udara hangatnya naik ke lantai atas dan bertahan di sana sepanjang malam.' },
    meaning: men
      ? { en: 'The men sit around this fire in the evening, and the many people sleeping above add their own warmth.', id: 'Para lelaki duduk mengelilingi api ini pada malam hari, dan banyaknya orang yang tidur di atas menambah kehangatan.' }
      : { en: 'A mother and her children share this fire, which is lit when it is needed.', id: 'Seorang ibu dan anak-anaknya berbagi api ini, yang dinyalakan saat diperlukan.' },
    specs: [{ en: 'Centre of the floor', id: 'Di tengah lantai' }],
  },
  {
    id: 'tiang', cat: 'bawah', name: 'Tiang Tengah', alias: 'Empat tiang utama', en: { en: 'Four centre posts', id: 'Empat tiang tengah' },
    explode: [0, 0, 0], anchor: [POST, 1.0, POST], focusDir: [0.6, 0.3, 1],
    desc: { en: 'Four posts set in a square around the hearth, rising through the upper floor to the roof.', id: 'Empat tiang yang ditanam membentuk bujur sangkar di sekeliling tungku, menembus lantai atas hingga ke atap.' },
    fn: { en: 'They carry the upper floor and the top of the roof, so the thin plank wall has little to hold up.', id: 'Tiang-tiang ini memikul lantai atas dan puncak atap, sehingga dinding papan yang tipis tidak banyak menanggung beban.' },
    meaning: { en: 'The fire sits inside the square of posts, at the centre of the house.', id: 'Api berada di dalam bujur sangkar tiang, di pusat rumah.' }, interp: true,
    specs: [{ en: '4 posts', id: '4 tiang' }, { en: '≈ 1 m apart', id: 'Berjarak ≈ 1 m' }],
  },
  {
    id: 'loteng', cat: 'atas', name: 'Lantai Atas', alias: 'Tempat tidur', en: { en: 'Sleeping floor', id: 'Lantai tidur' },
    explode: [0, 1.5, 0], anchor: [-r * 0.5, LOFT + 0.25, -r * 0.3], focusDir: [0.4, 0.9, 1],
    desc: { en: 'A second floor of thin canes on timber beams, covered with grass and reached through an opening just inside the door.', id: 'Lantai kedua dari bilah-bilah kecil di atas balok kayu, dilapisi rumput dan dicapai lewat lubang tepat di balik pintu.' },
    fn: { en: 'This is where people sleep. The roof comes down past its edge, so the warm air from the fire is trapped around the sleepers.', id: 'Di sinilah orang tidur. Atap turun melewati tepinya, sehingga udara hangat dari api terperangkap di sekitar orang yang tidur.' },
    meaning: men
      ? { en: 'The house is made to the size of the men who sleep in it, which is why the pilamo is a little wider than the ebe-ai.', id: 'Rumah dibuat seukuran tubuh para lelaki yang tidur di dalamnya; itu sebabnya pilamo sedikit lebih lebar daripada ebe-ai.' }
      : { en: 'The house is made to the size of the people who sleep in it, which is why the ebe-ai is a little narrower than the pilamo.', id: 'Rumah dibuat seukuran tubuh penghuni yang tidur di dalamnya; itu sebabnya ebe-ai sedikit lebih sempit daripada pilamo.' },
    specs: [{ en: `Floor +${m(LOFT)} m`, id: `Lantai +${m(LOFT)} m` }, { en: 'Cane and grass', id: 'Bilah dan rumput' }],
  },
  {
    id: 'rangka_atap', cat: 'atap', name: 'Rangka Atap', alias: 'Kayu buah', en: { en: 'Roof frame', id: 'Rangka atap' }, lift: true,
    explode: [0, 3.0, 0], anchor: [r * 0.6, top - 0.9, r * 0.6],
    desc: { en: 'Thin poles bent from the top of the wall up to the centre, tied to hoops of cane.', id: 'Batang-batang kayu kecil yang dilengkungkan dari puncak dinding ke tengah, diikat pada gelang-gelang dari bilah.' },
    fn: { en: 'Arranged in a circle like the ribs of an umbrella, they give the roof its dome and carry the grass.', id: 'Disusun melingkar seperti rusuk payung, rangka ini membentuk kubah atap dan memikul rumputnya.' },
    meaning: { en: 'A house is built by the owner’s relatives working together, and the work ends with a shared meal.', id: 'Rumah dibangun bersama oleh kerabat pemiliknya, dan pekerjaan itu diakhiri dengan makan bersama.' },
    specs: [{ en: '{rafters} poles', id: '{rafters} batang' }, { en: 'Tied, not nailed', id: 'Diikat, tanpa paku' }],
  },
  {
    id: 'atap', cat: 'atap', name: 'Atap Alang-alang', alias: 'Wareke', en: { en: 'Grass dome', id: 'Kubah alang-alang' }, roof: true, lift: true,
    explode: [0, 4.6, 0], anchor: [0, top + 0.2, r * 0.4],
    desc: { en: 'A thick dome of coarse alang-alang grass (wareke) that comes down over the top of the wall.', id: 'Kubah tebal dari alang-alang kasar (wareke) yang turun menutupi bagian atas dinding.' },
    fn: { en: 'It closes the join between wall and roof all the way round, so cold air cannot get in and warm air cannot get out.', id: 'Atap menutup rapat pertemuan dinding dan atap di sekelilingnya, sehingga udara dingin tidak masuk dan udara hangat tidak keluar.' },
    meaning: { en: 'The round, low shape is an answer to the cold nights of a valley 1,600 m above the sea.', id: 'Bentuknya yang bundar dan rendah adalah jawaban atas malam yang dingin di lembah setinggi 1.600 m di atas laut.' },
    specs: [{ en: `Top +${m(top)} m`, id: `Puncak +${m(top)} m` }, { en: 'Coarse alang-alang', id: 'Alang-alang kasar' }],
  },
];
