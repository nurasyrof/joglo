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
        id: 'sulluk_banua', cat: 'base', name: 'Sulluk Banua', alias: 'Kolong & tiang', en: { en: 'Base of posts and beams', id: 'Kaki dari tiang dan balok' },
        explode: [0, 0, 0], anchor: [1.6, 1.2, 2.6], focusDir: [1, 0.25, 0.6],
        desc: { en: 'Square timber posts standing on flat stones, locked together by heavy beams that run through them in both directions.', id: 'Tiang kayu persegi yang berdiri di atas batu pipih, dikunci oleh balok-balok berat yang menembusnya ke dua arah.' },
        fn: { en: 'Lift the house well above the ground. Resting on stones and held by beams rather than nails, the frame can move a little without breaking.', id: 'Mengangkat rumah tinggi di atas tanah. Karena bertumpu di atas batu dan diikat balok, bukan paku, rangkanya dapat sedikit bergerak tanpa patah.' },
        meaning: { en: 'The lowest of the house’s three parts, linked to the underworld. The space beneath was used to keep buffalo and pigs.', id: 'Bagian terendah dari tiga bagian rumah, terhubung dengan dunia bawah. Ruang di bawahnya dahulu dipakai untuk memelihara kerbau dan babi.' },
        specs: [{ en: '{posts} posts on stones', id: '{posts} tiang di atas batu' }, { en: 'Floor +2.3 m', id: 'Lantai +2,3 m' }],
      },
      {
        id: 'ariri_posi', cat: 'base', name: 'A’riri Posi’', alias: 'Tiang pusat', en: { en: 'Navel post', id: 'Tiang pusat' },
        explode: [0, 0, 0], anchor: [0, 1.4, 0], focusDir: [1, 0.2, 0.3],
        desc: { en: 'A round post at the centre of the house, standing apart from the grid of the other posts.', id: 'Tiang bulat di tengah rumah, terpisah dari deretan tiang lainnya.' },
        fn: { en: 'Marks the middle of the house; it rises from the ground up into the middle room.', id: 'Menandai bagian tengah rumah; tiang ini naik dari tanah hingga ke ruang tengah.' },
        meaning: { en: 'Posi’ means navel. Like a navel, it ties the house to its origin: the place the family comes from.', id: 'Posi’ berarti pusar. Seperti pusar, tiang ini mengikat rumah pada asalnya: tempat keluarga berasal.' },
        specs: [{ en: '1 post', id: '1 tiang' }, { en: 'Centre of the house', id: 'Pusat rumah' }],
      },
      {
        id: 'tangga', cat: 'base', name: 'Tangga', alias: 'Eran', en: { en: 'Ladder', id: 'Tangga' },
        explode: [0, 0, 1.6], anchor: [0.4, 1.2, BZ + 1.0], focusDir: [0.8, 0.3, 1],
        desc: { en: 'A steep timber ladder up to the small door in the front wall.', id: 'Tangga kayu yang curam menuju pintu kecil di dinding depan.' },
        fn: { en: 'The only way into the house, under the shelter of the projecting roof.', id: 'Satu-satunya jalan masuk ke rumah, di bawah naungan atap yang menjorok.' },
        meaning: { en: 'Entering means climbing up, away from the ground and the world below.', id: 'Masuk berarti naik, menjauh dari tanah dan dunia bawah.' },
        specs: [{ en: '7 rungs', id: '7 anak tangga' }],
      },
      {
        id: 'lantai', cat: 'body', name: 'Lantai', alias: 'Sali', en: { en: 'Floor', id: 'Lantai' },
        explode: [0, 1.0, 0], anchor: [-1.4, F + 0.05, 3.2],
        desc: { en: 'Thick boards laid over the floor joists, running the length of the house.', id: 'Papan tebal yang dipasang di atas gelagar lantai, memanjang sepanjang rumah.' },
        fn: { en: 'The living floor of the house, high above the ground.', id: 'Lantai hunian rumah, tinggi di atas tanah.' },
        meaning: { en: 'The base of kale banua, the middle world where the family lives.', id: 'Dasar kale banua, dunia tengah tempat keluarga tinggal.' },
        specs: [`${2 * BX} × ${2 * BZ} m`],
      },
      {
        id: 'dinding', cat: 'body', name: 'Dinding Passura’', alias: 'Kale banua', en: { en: 'Carved walls', id: 'Dinding berukir' },
        explode: [0, 2.0, 0], anchor: [BX, 3.6, 1.4], focusDir: [1, 0.2, 0.4],
        desc: { en: 'Wall panels carved and painted with passura’, motifs in red, black, white and yellow. There is a small door at the front and small shuttered windows on the sides.', id: 'Panel dinding berukir dan berwarna dengan passura’, motif berwarna merah, hitam, putih, dan kuning. Ada pintu kecil di depan dan jendela kecil berdaun di kedua sisi.' },
        fn: { en: 'Enclose the house. The openings are kept small, so the inside stays dark and warm.', id: 'Menutup rumah. Bukaannya dibuat kecil sehingga bagian dalam tetap gelap dan hangat.' },
        meaning: { en: 'Each motif has a name and a meaning. Pa’ barre allo, the sun, stands for the source of life; pa’ tedong, the buffalo, for prosperity. The colours are often read as life (red), death (black), purity (white) and God’s grace (yellow).', id: 'Setiap motif memiliki nama dan makna. Pa’ barre allo, matahari, melambangkan sumber kehidupan; pa’ tedong, kerbau, melambangkan kemakmuran. Warnanya sering dimaknai sebagai kehidupan (merah), kematian (hitam), kesucian (putih), dan anugerah Tuhan (kuning).' },
        specs: [{ en: 'Passura’ carving', id: 'Ukiran passura’' }, { en: '1 door · 6 windows', id: '1 pintu · 6 jendela' }],
      },
      {
        id: 'ruang', cat: 'body', name: 'Tangdo’, Sali & Sumbung', alias: 'Tiga ruang', en: { en: 'The three rooms', id: 'Tiga ruang' },
        explode: [0, 2.8, 0], anchor: [-1.0, 3.4, -2.8], focusDir: [-0.4, 0.8, 0.3],
        desc: { en: 'Inside, two partitions divide the house into three rooms: tangdo’ at the front, sali in the middle and sumbung at the back.', id: 'Di dalam, dua sekat membagi rumah menjadi tiga ruang: tangdo’ di depan, sali di tengah, dan sumbung di belakang.' },
        fn: { en: 'Tangdo’ is used for resting, receiving guests and offerings; sali for cooking, eating and work; sumbung, at the back, is for the head of the family. When a family member dies, the body is kept in the house, often for months, until the funeral.', id: 'Tangdo’ dipakai untuk beristirahat, menerima tamu, dan sesaji; sali untuk memasak, makan, dan bekerja; sumbung, di belakang, untuk kepala keluarga. Jika ada anggota keluarga yang meninggal, jenazahnya disemayamkan di rumah, sering kali berbulan-bulan, sampai upacara pemakaman.' },
        meaning: { en: 'The rooms follow the house from north to south, the direction of the gods towards the direction of the ancestors.', id: 'Ruang-ruang berurutan dari utara ke selatan, dari arah para dewa menuju arah para leluhur.' },
        specs: [{ en: '3 rooms', id: '3 ruang' }, { en: 'Low ceiling', id: 'Langit-langit rendah' }],
      },
      {
        id: 'dapo', cat: 'body', name: 'Dapo’', alias: 'Tungku', en: { en: 'Hearth', id: 'Tungku' },
        explode: [0, 3.4, 0], anchor: [-1.2, F + 0.6, -0.3], focusDir: [-0.6, 0.7, 0.5],
        desc: { en: 'A fireplace of stones in a box of earth, in the middle room, with a rack for firewood above.', id: 'Perapian dari batu di dalam kotak tanah, di ruang tengah, dengan para-para kayu bakar di atasnya.' },
        fn: { en: 'Cooking and warmth. Smoke rises into the roof and keeps the bamboo dry.', id: 'Untuk memasak dan menghangatkan. Asapnya naik ke atap dan menjaga bambu tetap kering.' },
        meaning: { en: 'The fire at the heart of the household.', id: 'Api di jantung rumah tangga.' },
        specs: [{ en: '3 stones', id: '3 batu' }],
      },
      {
        id: 'rattiang', cat: 'roof', name: 'Rattiang Banua', alias: 'Atap', en: { en: 'Roof', id: 'Atap' }, roof: true,
        explode: [0, 4.2, 0], anchor: [2.6, 5.4, 0], focusDir: [1, 0.5, 0.2],
        desc: { en: 'A huge saddle roof built from layers of split bamboo, laid in courses that can be more than half a metre thick. Old roofs are often green with moss and ferns.', id: 'Atap pelana yang sangat besar dari lapisan bilah bambu, disusun hingga tebalnya bisa lebih dari setengah meter. Atap yang tua sering menghijau ditumbuhi lumut dan pakis.' },
        fn: { en: 'Sheds the heavy rain of the highlands. The ridge sags in the middle and rises towards both ends.', id: 'Mengalirkan hujan lebat dataran tinggi. Bubungannya melendut di tengah dan naik ke kedua ujungnya.' },
        meaning: { en: 'The highest of the three parts, linked to the upper world. Its shape is said by some to recall boats in which the ancestors came, and by others the horns of a buffalo.', id: 'Bagian tertinggi dari tiga bagian rumah, terhubung dengan dunia atas. Sebagian orang menyebut bentuknya mengingatkan pada perahu yang membawa para leluhur, sebagian lagi pada tanduk kerbau.' },
        specs: [{ en: 'Layered bamboo', id: 'Bambu berlapis' }, { en: '{rafters} rafters', id: '{rafters} kasau' }],
      },
      {
        id: 'longa', cat: 'roof', name: 'Longa', alias: 'Ujung atap', en: { en: 'Projecting roof ends', id: 'Ujung atap yang menjorok' }, roof: true,
        explode: [0, 5.0, 0], anchor: [0, tip - 1.4, len - 0.6], focusDir: [1, 0.4, 0.6],
        desc: { en: 'The ends of the roof sweep out far beyond the walls at the front and back, rising steeply to their tips.', id: 'Ujung-ujung atap menjorok jauh melewati dinding di depan dan belakang, naik dengan curam hingga ke puncaknya.' },
        fn: { en: 'Shelter the ladder and the space in front of the house, and the ends of the gables.', id: 'Menaungi tangga, ruang di depan rumah, dan ujung-ujung dinding segitiga.' },
        meaning: { en: 'The upswept prow makes the house visible from far away; the more important the tongkonan, the more dramatic its roof.', id: 'Haluan yang menjulang membuat rumah terlihat dari kejauhan; makin penting tongkonan, makin megah atapnya.' },
        specs: [{ en: `Tip +${tip.toFixed(1)} m`, id: `Puncak +${tip.toFixed(1)} m` }],
      },
      {
        id: 'para', cat: 'roof', name: 'Dinding Ujung', alias: 'Tebeng', en: { en: 'Carved gables', id: 'Dinding ujung berukir' },
        explode: [0, 3.6, 0], anchor: [1.2, WT + 1.2, BZ + 0.1], focusDir: [0.5, 0.2, 1],
        desc: { en: 'Triangular panels of carved and painted passura’ closing the front and back of the roof above the walls.', id: 'Panel segitiga berukir passura’ yang diwarnai, menutup bagian depan dan belakang atap di atas dinding.' },
        fn: { en: 'Close the roof space at the ends.', id: 'Menutup ruang atap di kedua ujungnya.' },
        meaning: { en: 'The front gable is the face of the house, where the family shows its finest carving.', id: 'Dinding ujung depan adalah wajah rumah, tempat keluarga memamerkan ukiran terbaiknya.' },
        specs: [{ en: 'Passura’ carving', id: 'Ukiran passura’' }],
      },
      {
        id: 'rangka_atap', cat: 'roof', name: 'Rangka Atap', alias: 'Kasau & bubungan', en: { en: 'Roof frame', id: 'Rangka atap' },
        explode: [0, 3.0, 0], anchor: [-1.4, 5.6, -2], focusDir: [-1, 0.5, 0.2],
        desc: { en: 'A ridge beam and pairs of rafters carrying the bamboo layers.', id: 'Balok bubungan dan pasangan-pasangan kasau yang memikul lapisan bambu.' },
        fn: { en: 'Holds the shape of the curved roof.', id: 'Menjaga bentuk atap yang melengkung.' },
        meaning: { en: 'Hidden under the bamboo, it is the skeleton of the roof.', id: 'Tersembunyi di bawah bambu, inilah kerangka atap.' },
        specs: [{ en: '{rafters} rafters', id: '{rafters} kasau' }],
      },
      {
        id: 'tulak_somba', cat: 'roof', lift: false, name: 'Tulak Somba', alias: 'Tiang penyangga', en: { en: 'Roof-end posts', id: 'Tiang penopang ujung atap' },
        explode: [0, 0, 0], anchor: [0, 3.2, -POST_Z], focusDir: [1, 0.3, -0.6],
        desc: { en: 'Tall free-standing posts under the front and back ends of the roof, with a crossbeam at the top.', id: 'Tiang tinggi yang berdiri sendiri di bawah ujung depan dan belakang atap, dengan balok melintang di puncaknya.' },
        fn: { en: 'Carry the weight of the projecting roof ends so they do not sag.', id: 'Memikul berat ujung atap yang menjorok agar tidak melendut.' },
        meaning: { en: 'The front post is where the family displays the horns of its sacrificed buffalo.', id: 'Tiang depan adalah tempat keluarga memajang tanduk kerbau yang telah dikurbankan.' },
        specs: [{ en: '2 posts', id: '2 tiang' }],
      },
      {
        id: 'tanduk', cat: 'ornament', name: 'Tanduk Tedong', alias: 'Tanduk kerbau', en: { en: 'Buffalo horns', id: 'Tanduk kerbau' },
        explode: [0, 0, 1.4], anchor: [0.5, 2.2 + horns * 0.21, POST_Z + 0.3], focusDir: [0.7, 0.2, 1],
        desc: { en: 'Horns of buffalo stacked up the front post, one pair above the other.', id: 'Tanduk-tanduk kerbau yang disusun di tiang depan, sepasang di atas sepasang.' },
        fn: { en: 'Each pair comes from a buffalo sacrificed at a funeral (Rambu Solo’) held by the family.', id: 'Setiap pasang berasal dari kerbau yang dikurbankan dalam upacara pemakaman (Rambu Solo’) yang diadakan keluarga.' },
        meaning: { en: 'A record of the family’s ceremonies and its standing: the more horns, the more honoured the house.', id: 'Catatan upacara dan kedudukan keluarga: makin banyak tanduknya, makin terhormat rumahnya.' },
        specs: [{ en: '{horns} pairs', id: '{horns} pasang' }],
      },
      {
        id: 'kabongo', cat: 'ornament', name: 'Kabongo’', alias: 'Kepala kerbau', en: { en: 'Carved buffalo head', id: 'Kepala kerbau berukir' },
        explode: [0, 0.6, 1.4], anchor: [0.4, WT + 0.2, BZ + 0.4], focusDir: [0.5, 0.15, 1],
        desc: { en: 'A carved wooden buffalo head with real horns, mounted on the front of the house above the door.', id: 'Kepala kerbau dari kayu berukir dengan tanduk asli, dipasang di bagian depan rumah di atas pintu.' },
        fn: { en: 'Marks the front of a tongkonan of standing.', id: 'Menandai bagian depan tongkonan yang berkedudukan tinggi.' },
        meaning: { en: 'The buffalo is the symbol of wealth and status in Toraja, and of the sacrifices that carry the dead to the afterlife.', id: 'Kerbau adalah lambang kekayaan dan status di Toraja, juga lambang kurban yang mengantar orang mati ke alam baka.' },
        specs: [{ en: 'Carved wood', id: 'Kayu berukir' }, { en: 'Real horns', id: 'Tanduk asli' }],
      },
      {
        id: 'katik', cat: 'ornament', lift: true, name: 'Katik', alias: 'Burung', en: { en: 'Long-necked bird', id: 'Burung berleher panjang' },
        explode: [0, 4.4, 1.0], anchor: [0, WT + 2.2, BZ + 1.4], focusDir: [0.6, 0.2, 1],
        desc: { en: 'A carved bird with a long curving neck, rising from the front gable above the buffalo head.', id: 'Burung berukir dengan leher panjang melengkung, menjulang dari dinding ujung depan di atas kepala kerbau.' },
        fn: { en: 'Crowns the front of the house.', id: 'Memahkotai bagian depan rumah.' },
        meaning: { en: 'Often described as a mythical bird or a rooster: a guardian of the house and a sign of the family’s high standing.', id: 'Sering digambarkan sebagai burung mitos atau ayam jantan: penjaga rumah dan tanda kedudukan tinggi keluarga.' },
        specs: [{ en: 'Carved wood', id: 'Kayu berukir' }],
      },
    ],
    sectionY: 3.3,
    views: { inside: { pos: [1.2, 3.9, 3.6], target: [-1.0, 3.2, -1.0] } },
  };
}

const CATEGORIES = [
  { id: 'base',     label: { en: 'Base', id: 'Kaki' },     local: 'Sulluk banua',   color: '#9a948a' },
  { id: 'body',     label: { en: 'Body', id: 'Badan' },     local: 'Kale banua',     color: '#b3402f' },
  { id: 'roof',     label: { en: 'Roof', id: 'Atap' },     local: 'Rattiang banua', color: '#6f8a5a' },
  { id: 'ornament', label: { en: 'Ornament', id: 'Ornamen' }, local: 'Ukiran',         color: '#d9a63a' },
];

