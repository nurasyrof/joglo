// The 3D viewer. A house is a site with one or more buildings; each building has parts.
// Two modes:
//   site      the whole compound: pick buildings, lift roofs, see the site-logic overlay
//   building  one building's anatomy: pick parts, explode, part cards (other buildings ghosted)
// Houses without a `site` definition are a single building and always open in building mode.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { texture, createMaterialFactory } from './materials.js';
import { FORMATS, export3D } from './exporter.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const CLAY_DEFAULT = '#e8e3da';
const HINTS = {
  site: 'Drag to orbit · Scroll to zoom · <b>Click a building</b> to learn about it · double-click to go inside',
  building: 'Drag to orbit · Right-drag to pan · Scroll to zoom · <b>Click any part</b> to learn about it',
};

// ── State ────────────────────────────────────────────────────────────
// View settings (style, lighting, section…) persist across houses and modes.
const S = {
  mode: 'site',
  explode: 1, explodeTarget: 1,
  style: 'realistic', roofOpacity: 1,
  section: { on: false, axis: 'x', pos: 0, flip: false, plane: true },
  preset: null, colors: {}, rough: 0.7, metal: {}, texOverride: {}, textures: true,
  time: 9.5, shadows: true, labels: false, siteLogic: false,
  // Building mode: selected / hovered / hidden parts of the current building.
  selected: null, hovered: null, focusMode: 'ghost', hidden: new Set(),
  // Site mode: selected / hovered / hidden buildings.
  selBld: null, hovBld: null, hiddenBld: new Set(),
};
let H = null;      // the loaded house
let cur = null;    // the building open in building mode
let active = false;
let loadToken = 0;
const inBuilding = () => S.mode === 'building';

// ── Renderer, scene, camera ──────────────────────────────────────────
const viewport = $('#viewport');
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.localClippingEnabled = true;
viewport.appendChild(renderer.domElement);
const anisotropy = renderer.capabilities.getMaxAnisotropy();

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.className = 'labels';
viewport.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.4;

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 600);
camera.position.set(44, 30, 50);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 9, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 180;
controls.maxPolarAngle = Math.PI * 0.92;
controls.autoRotateSpeed = 0.7;

// ── Lights, ground ───────────────────────────────────────────────────
const hemi = new THREE.HemisphereLight(0xf3ead8, 0x5a4a38, 0.6);
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.castShadow = true;
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
scene.add(hemi, sun, sun.target);

const groundAlpha = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  grd.addColorStop(0, '#fff'); grd.addColorStop(0.45, '#fff'); grd.addColorStop(1, '#000');
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
})();
const ground = new THREE.Mesh(
  new THREE.CircleGeometry(1, 72).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: '#8d7c63', roughness: 1, alphaMap: groundAlpha, transparent: true }));
ground.position.y = -0.002;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(1, 1, 0x4f86b8, 0x24476b);
grid.material.transparent = true;
grid.material.opacity = 0.5;
grid.visible = false;
scene.add(grid);

// ── Section plane + cap uniforms ─────────────────────────────────────
const sectionPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e5);
const capUniforms = { uCapOn: { value: 0 }, uCapColor: { value: new THREE.Vector3(0.84, 0.37, 0.26) } };
const MF = createMaterialFactory({ planes: [sectionPlane], capUniforms });

const secHelper = new THREE.Group();
secHelper.add(
  new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xe8a74a, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })),
  new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: 0xf0b95a, transparent: true, opacity: 0.9 })));
secHelper.visible = false;
scene.add(secHelper);

const root = new THREE.Group();
scene.add(root);

// ── Building the house ───────────────────────────────────────────────
function tag(text, color, cls, onClick) {
  const el = document.createElement('button');
  el.className = cls;
  el.textContent = text;
  el.style.setProperty('--c', color);
  el.addEventListener('click', (e) => { e.stopPropagation(); onClick(); });
  const obj = new CSS2DObject(el);
  obj.visible = false;
  return obj;
}

function buildBuilding(entry) {
  const def = entry.def;
  const built = def.build();
  const catById = Object.fromEntries(def.categories.map((c) => [c.id, c]));
  const fill = (s) => s.replace(/\{(\w+)\}/g, (m, k) => built.counts?.[k] ?? m);
  const group = new THREE.Group();
  group.name = entry.id;
  group.position.set(entry.at[0], 0, entry.at[1]);
  group.rotation.y = entry.rot || 0;
  root.add(group);
  const B = { ...entry, def, group, catById, comps: [], compById: {}, pickables: [], meshes: [] };

  for (const d of def.parts) {
    const part = built.parts[d.id];
    if (!part) { console.warn(`[${entry.id}] no geometry for part "${d.id}"`); continue; }
    const pg = new THREE.Group();
    pg.name = d.id;
    group.add(pg);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, clippingPlanes: [sectionPlane] });
    const c = { ...d, bld: B, specs: d.specs.map(fill), group: pg, meshes: [], edges: [], mats: [], edgeMat };
    for (const [slot, list] of Object.entries(part.parts)) {
      if (!H.slotById[slot]) console.warn(`[${entry.id}/${d.id}] undeclared material slot "${slot}"`);
      const geom = mergeGeometries(list, false);
      const mat = MF.make(slot, { bld: B.id, part: d.id });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = mesh.receiveShadow = true;
      mesh.userData = { bld: B.id, part: d.id, slot };
      pg.add(mesh);
      c.meshes.push(mesh);
      c.mats.push(mat);
      B.meshes.push(mesh);
      if (d.pick !== false) B.pickables.push(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 28), edgeMat);
      edges.visible = false;
      edges.raycast = () => {};
      pg.add(edges);
      c.edges.push(edges);
    }
    c.label = tag(d.name, catById[d.cat].color, 'tag', () => select(d.id, { focus: true }));
    c.label.position.set(...d.anchor);
    pg.add(c.label);
    B.comps.push(c);
    B.compById[d.id] = c;
  }

  // World bounds assembled (b0) and exploded (b1); explode vectors are local to the building.
  root.updateMatrixWorld(true);
  B.b0 = new THREE.Box3();
  B.b1 = new THREE.Box3();
  for (const c of B.comps) {
    const off = new THREE.Vector3(...c.explode).applyQuaternion(group.quaternion);
    for (const m of c.meshes) {
      const bb = new THREE.Box3().setFromObject(m);
      B.b0.union(bb);
      B.b1.union(bb.clone().translate(off));
    }
  }
  B.liftH = Math.max(3, B.b0.max.y * 0.75);
  if (!H.single) {
    const zone = H.zoneById[entry.zone];
    B.label = tag(entry.name, zone?.color || '#dcab52', 'tag bld-tag', () => select(B.id, { focus: true }));
    const c = B.b0.getCenter(new THREE.Vector3());
    B.label.position.set(c.x, B.b0.max.y + 0.8, c.z);
    root.add(B.label);
  }
  return B;
}

function buildOverlay(ov) {
  const g = new THREE.Group();
  g.visible = false;
  g.userData.labels = [];
  for (const z of ov.zones) {
    const col = H.zoneById[z.zone]?.color || '#ffffff';
    const w = ov.x1 - ov.x0, d = z.z1 - z.z0;
    const geo = new THREE.PlaneGeometry(w - 0.4, d - 0.4).rotateX(-Math.PI / 2);
    const plane = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, depthWrite: false }));
    plane.position.set((ov.x0 + ov.x1) / 2, 0.08, (z.z0 + z.z1) / 2);
    plane.renderOrder = 2;
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 }));
    edge.position.copy(plane.position);
    g.add(plane, edge);
    const l = tag(z.text, col, 'zone-tag', () => {});
    l.position.set(ov.x0 + 1.2, 0.4, z.z1 - 1.2);
    g.add(l);
    g.userData.labels.push(l);
  }
  if (ov.axis) {
    const [a, b] = [ov.axis.from, ov.axis.to].map(([x, z]) => new THREE.Vector3(x, 0.12, z));
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineDashedMaterial({ color: 0xfff4dc, dashSize: 0.9, gapSize: 0.5 }));
    line.computeLineDistances();
    g.add(line);
    const l = tag(ov.axis.text, '#fff4dc', 'zone-tag axis-tag', () => {});
    l.position.copy(a).lerp(b, 0.62).add(new THREE.Vector3(0, 0.5, 0));
    g.add(l);
    g.userData.labels.push(l);
  }
  root.add(g);
  return g;
}

function buildHouse(meta, def) {
  const site = def.site || {
    single: true, categories: [], sectionY: def.sectionY, views: def.views,
    buildings: [{ id: 'main', def, at: [0, 0], rot: 0, name: meta.name }],
  };
  H = {
    meta, def, site, single: !!site.single,
    slotById: Object.fromEntries(def.slots.map((s) => [s.id, s])),
    zoneById: Object.fromEntries((site.categories || []).map((z) => [z.id, z])),
    blds: [], bldById: {},
  };
  for (const entry of site.buildings) {
    const B = buildBuilding(entry);
    H.blds.push(B);
    H.bldById[B.id] = B;
  }
  H.pickables = H.blds.flatMap((B) => B.pickables);
  H.s0 = new THREE.Box3();
  H.s1 = new THREE.Box3();
  for (const B of H.blds) {
    H.s0.union(B.b0);
    for (const c of B.comps) for (const m of c.meshes) {
      const bb = new THREE.Box3().setFromObject(m);
      H.s1.union(c.cat === 'roof' ? bb.translate(new THREE.Vector3(0, B.liftH, 0)) : bb);
    }
  }
  H.overlay = site.overlay ? buildOverlay(site.overlay) : null;
}

function unloadHouse() {
  if (!H) return;
  for (const B of H.blds) {
    for (const c of B.comps) {
      for (const m of c.meshes) m.geometry.dispose();
      for (const e of c.edges) e.geometry.dispose();
      c.edgeMat.dispose();
      c.label.element.remove();
    }
    if (B.label) { B.label.element.remove(); root.remove(B.label); }
    root.remove(B.group);
  }
  if (H.overlay) {
    for (const l of H.overlay.userData.labels) l.element.remove();
    H.overlay.traverse((o) => { o.geometry?.dispose(); o.material?.dispose?.(); });
    root.remove(H.overlay);
  }
  MF.reset();
  H = null;
  cur = null;
}

function fitEnvironment() {
  const size = H.s0.getSize(new THREE.Vector3()), c = H.s0.getCenter(new THREE.Vector3());
  const ext = Math.max(size.x, size.z) / 2 + 3;
  const map = ext > 20 ? 4096 : 2048;
  if (sun.shadow.mapSize.x !== map) { sun.shadow.mapSize.set(map, map); sun.shadow.map?.dispose(); sun.shadow.map = null; }
  Object.assign(sun.shadow.camera, { left: -ext, right: ext, top: ext, bottom: -ext, near: 1, far: ext * 5 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.target.position.set(c.x, 3, c.z);
  const r = Math.max(60, ext * 2.6);
  ground.scale.setScalar(r);
  ground.position.set(c.x, -0.002, c.z);
  grid.scale.setScalar(Math.ceil(r * 1.2));
  grid.position.set(c.x, 0, c.z);
  setTime(S.time);
}

// Opens a house and, for compounds, optionally one of its buildings (by id).
export async function openHouse(meta, def, bldId = null) {
  active = true;
  document.body.classList.add('mode-viewer');
  if (H && H.meta.id === meta.id) {
    startLoop();
    showBuilding(bldId);
    return;
  }
  const token = ++loadToken;
  const loading = $('#loading');
  $('#loadingText').textContent = def.loading || 'Building…';
  loading.classList.remove('done');
  await new Promise((r) => setTimeout(r, 40));   // let the loading screen paint before the synchronous build
  if (token !== loadToken) return;

  unloadHouse();
  S.hiddenBld.clear();
  buildHouse(meta, def);
  fitEnvironment();
  $('#aboutTitle').textContent = def.about.title;
  $('#aboutBody').replaceChildren(...def.about.paras.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
  document.body.classList.toggle('single-building', H.single);
  document.body.classList.toggle('has-walk', !!H.site.walk);
  buildMaterialUI();
  setPreset(Object.keys(def.presets)[0]);

  const target = H.single ? H.blds[0] : H.bldById[bldId] || null;
  setMode(target ? 'building' : 'site', target, { intro: true });
  loading.classList.add('done');
  startLoop();
}

export function closeViewer() {
  if (W.on) stopWalk({ fly: false });
  active = false;
  loadToken++;
  document.body.classList.remove('mode-viewer', 'has-selection', 'show-left', 'show-right');
  $('#tooltip').classList.remove('on');
  openBldMenu(false);
  $('#about').open && $('#about').close();
}

// ── Modes ────────────────────────────────────────────────────────────
function showBuilding(bldId) {
  if (H.single) return;
  const B = H.bldById[bldId];
  if (B && (!inBuilding() || cur !== B)) setMode('building', B);
  else if (!B && inBuilding()) setMode('site');
}

function setMode(mode, B = null, { intro = false } = {}) {
  if (W.on) stopWalk({ fly: false });
  S.mode = mode;
  cur = mode === 'building' ? B : null;
  S.selected = S.hovered = S.selBld = S.hovBld = null;
  S.hidden.clear();
  document.body.classList.toggle('in-building', mode === 'building');
  document.body.classList.toggle('in-site', mode === 'site');
  document.body.classList.remove('has-selection');
  $('#hint').innerHTML = HINTS[mode];
  $('#search').value = '';
  openBldMenu(false);
  renderList();
  renderInfo();
  updateCrumb();
  updateModeUI();

  S.explode = intro ? 1 : 0;
  applyExplode();
  setExplode(intro ? 1 : 0);
  setSectionAxis(S.section.axis);
  applyMaterials();
  if (intro) {
    const far = viewPose('iso', 1);
    camera.position.copy(far.target).addScaledVector(far.pos.clone().sub(far.target), 1.3);
    controls.target.copy(far.target);
    tween = null;
    const token = loadToken;
    setTimeout(() => { if (token !== loadToken) return; setExplode(0); goView('iso', 2.6, 0); }, 450);
  } else goView('iso', 1.2);
}

function enterBuilding(id) { location.hash = `#/${H.meta.id}/${id}`; }
function backToSite() { if (!H.single) location.hash = `#/${H.meta.id}`; }

function updateModeUI() {
  const site = S.mode === 'site';
  $('#explodeTitle').textContent = site ? 'Roofs' : 'Explode';
  $('#explodeBtn').textContent = site ? 'Lift roofs' : 'Explode';
  $('#assembleBtn').textContent = site ? 'Lower roofs' : 'Assemble';
  $('#viewSeg [data-v=inside]').textContent = site ? 'Eye level' : 'Inside';
  $('#siteLogicRow').hidden = !(site && H.overlay);
  $('#focusSeg').hidden = site;
  $('#focusBtn').textContent = site ? 'Enter building →' : 'Focus';
  $('#exVisibleLabel').textContent = site ? 'Only visible buildings' : 'Only visible parts';
  $('#exExplodedLabel').textContent = site ? 'Keep roofs lifted' : 'Keep exploded layout';
  if (H.overlay) {
    H.overlay.visible = site && (S.siteLogic || W.overlay);
    for (const l of H.overlay.userData.labels) l.visible = H.overlay.visible;
  }
}

// ── Materials / display state ────────────────────────────────────────
function slotTexture(slot) {
  const override = S.texOverride[slot];
  return texture(override !== undefined ? override : H.slotById[slot]?.tex, anisotropy);
}
const compOf = (rec) => H.bldById[rec.comp.bld].compById[rec.comp.part];

function applyMaterials() {
  if (!H) return;
  const st = S.style, solid = st === 'realistic' || st === 'clay';
  for (const rec of MF.records) {
    const m = rec.mat, c = compOf(rec), B = c.bld, sd = H.slotById[rec.slot] || {};
    const col = st === 'clay' ? sd.clay || CLAY_DEFAULT : st === 'blueprint' ? '#1c4068' : S.colors[rec.slot] || '#cccccc';
    m.color.set(col);
    const map = st === 'realistic' && S.textures ? slotTexture(rec.slot) : null;
    if (m.map !== map) { m.map = map; m.needsUpdate = true; }
    m.roughness = st === 'clay' ? 0.92 : sd.glossy ? Math.max(0.2, S.rough - 0.35) : S.rough;
    m.metalness = st === 'realistic' ? S.metal[rec.slot] || 0 : 0;

    const isSel = inBuilding() && B === cur && S.selected === c.id;
    let op = st === 'xray' ? 0.16 : st === 'blueprint' ? 0.06 : 1;
    if (inBuilding() && B !== cur) op = Math.min(op, solid ? 0.07 : 0.025);
    if (c.roof && !isSel) op = Math.min(op, S.roofOpacity);
    // In site view, roofs fade as they lift so the floor plans show through.
    if (!inBuilding() && c.cat === 'roof') op = Math.min(op, 1 - 0.8 * S.explode);
    if (inBuilding() && B === cur && S.selected && !isSel && S.focusMode === 'ghost') op = Math.min(op, solid ? 0.1 : 0.04);
    if (isSel && !solid) op = 0.85;
    const tr = op < 0.999;
    if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
    m.opacity = op;
    m.depthWrite = !tr;
  }
  sun.castShadow = S.shadows && solid;
  for (const B of H.blds) for (const m of B.meshes) m.castShadow = m.material.opacity > 0.5;
  ground.visible = st !== 'blueprint';
  grid.visible = st === 'blueprint';
  document.body.classList.toggle('blueprint', st === 'blueprint');
  updateEdges();
  updateVisibility();
  updateEmissive();
}

function updateEdges() {
  if (!H) return;
  const st = S.style, lines = st === 'xray' || st === 'blueprint';
  for (const B of H.blds) for (const c of B.comps) {
    let sel, hov, show, op;
    if (inBuilding()) {
      const mine = B === cur;
      sel = mine && S.selected === c.id;
      hov = mine && S.hovered === c.id;
      show = mine && (lines || sel || (hov && lines));
      op = sel ? 0.95 : hov ? 0.8 : st === 'blueprint' ? 0.55 : 0.3;
      if (S.selected && !sel && S.focusMode === 'ghost') op *= 0.3;
    } else {
      sel = S.selBld === B.id;
      hov = S.hovBld === B.id;
      show = lines || sel;
      op = sel ? 0.7 : hov ? 0.6 : st === 'blueprint' ? 0.5 : 0.28;
    }
    c.edgeMat.color.set(sel ? '#ffcf6b' : hov ? '#ffe2a8' : st === 'blueprint' ? '#8ecbff' : '#f6e6c8');
    c.edgeMat.opacity = op;
    for (const e of c.edges) e.visible = show;
  }
}

function updateVisibility() {
  if (!H) return;
  const isolating = inBuilding() && S.selected && S.focusMode === 'isolate';
  for (const B of H.blds) {
    const hideB = S.hiddenBld.has(B.id) || (inBuilding() && B !== cur && isolating);
    B.group.visible = !hideB;
    if (B.label) {
      B.label.visible = S.labels && !inBuilding() && !hideB;
      B.label.element.classList.toggle('on', S.selBld === B.id);
    }
    for (const c of B.comps) {
      const mine = inBuilding() && B === cur;
      c.group.visible = !(mine && (S.hidden.has(c.id) || (isolating && S.selected !== c.id)));
      c.label.visible = S.labels && mine && c.group.visible && !hideB;
      c.label.element.classList.toggle('on', mine && S.selected === c.id);
    }
  }
  $$('.part').forEach((row) => row.classList.toggle('off', inBuilding() ? S.hidden.has(row.dataset.id) : S.hiddenBld.has(row.dataset.id)));
}

function updateEmissive() {
  if (!H) return;
  for (const B of H.blds) for (const c of B.comps) {
    const sel = inBuilding() ? B === cur && S.selected === c.id : S.selBld === B.id;
    const hov = inBuilding() ? B === cur && S.hovered === c.id : S.hovBld === B.id || W.hi.has(B.id);
    for (const m of c.mats) {
      m.emissive.set(sel ? '#ff9b2f' : hov ? '#ffc070' : '#000000');
      m.emissiveIntensity = sel ? 0.3 : hov ? 0.2 : 0;
    }
  }
}

// ── Explode (building) / lift roofs (site) ───────────────────────────
function applyExplode() {
  if (!H) return;
  for (const B of H.blds) for (const c of B.comps) {
    if (inBuilding() && B === cur) c.group.position.set(...c.explode).multiplyScalar(S.explode);
    else if (!inBuilding() && c.cat === 'roof') c.group.position.set(0, B.liftH * S.explode, 0);
    else c.group.position.set(0, 0, 0);
  }
  if (!inBuilding()) applyMaterials();
  if (S.section.on) updateSection();
}
function setExplode(v) {
  S.explodeTarget = v;
  setRange($('#explode'), Math.round(v * 100));
  $('#explodeOut').textContent = Math.round(v * 100) + '%';
}

// ── Bounds used by camera and section ────────────────────────────────
function activeBounds(ex) {
  const [a, b] = inBuilding() ? [cur.b0, cur.b1] : [H.s0, H.s1];
  return new THREE.Box3(a.min.clone().lerp(b.min, ex), a.max.clone().lerp(b.max, ex));
}

// ── Section ──────────────────────────────────────────────────────────
function sectionRange(axis) {
  const b0 = activeBounds(0), b1 = activeBounds(1);
  if (axis === 'y') {
    const sy = inBuilding() ? cur.def.sectionY : H.site.sectionY;
    return [0.2, +b1.max.y.toFixed(1), sy ?? b0.max.y / 3];
  }
  const lo = +(b0.min[axis] - 0.3).toFixed(1), hi = +(b0.max[axis] + 0.3).toFixed(1);
  const mid = (b0.min[axis] + b0.max[axis]) / 2;
  return [lo, hi, +mid.toFixed(1)];
}
function updateSection() {
  const s = S.section;
  capUniforms.uCapOn.value = s.on ? 1 : 0;
  if (!s.on || !H) {
    sectionPlane.normal.set(0, -1, 0);
    sectionPlane.constant = 1e5;
    secHelper.visible = false;
    return;
  }
  const sign = s.flip ? 1 : -1;
  const n = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] }[s.axis];
  sectionPlane.normal.set(n[0] * sign, n[1] * sign, n[2] * sign);
  sectionPlane.constant = -sign * s.pos;
  secHelper.visible = s.plane;
  secHelper.rotation.set(0, 0, 0);
  const b = activeBounds(S.explode), size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  if (s.axis === 'x') { secHelper.rotation.y = Math.PI / 2; secHelper.scale.set(size.z + 2, size.y + 2, 1); secHelper.position.set(s.pos, c.y, c.z); }
  if (s.axis === 'z') { secHelper.scale.set(size.x + 2, size.y + 2, 1); secHelper.position.set(c.x, c.y, s.pos); }
  if (s.axis === 'y') { secHelper.rotation.x = -Math.PI / 2; secHelper.scale.set(size.x + 2, size.z + 2, 1); secHelper.position.set(c.x, s.pos, c.z); }
}
function setSectionAxis(axis) {
  S.section.axis = axis;
  setSeg($('#axisSeg'), axis);
  if (!H) return;
  const [min, max, def] = sectionRange(axis);
  const r = $('#secPos');
  r.min = min; r.max = max;
  S.section.pos = def;
  setRange(r, def);
  $('#secOut').textContent = def.toFixed(1) + ' m';
  updateSection();
}

// ── Lighting / time of day ───────────────────────────────────────────
const cA = new THREE.Color(), cB = new THREE.Color();
const mix = (a, b, t) => cA.set(a).lerp(cB.set(b), t).getStyle();
function setTime(t) {
  S.time = t;
  const a = ((t - 6) / 12) * Math.PI;
  const el = Math.sin(a);
  const dir = new THREE.Vector3(Math.cos(a) * 0.9, Math.max(0.07, el), 0.5).normalize();
  sun.position.copy(dir).multiplyScalar(90).add(sun.target.position);
  const k = Math.min(1, el * 1.7);
  sun.color.set(mix('#ffb070', '#fff4e4', k));
  sun.intensity = 0.7 + 2.3 * Math.pow(el, 0.6);
  hemi.intensity = 0.3 + 0.55 * el;
  hemi.color.set(mix('#f6c7a0', '#eef0f2', k));
  viewport.style.setProperty('--sky-top', mix('#394064', '#86a9c4', Math.pow(el, 0.7)));
  viewport.style.setProperty('--sky-bot', mix('#f1a46d', '#efe5d3', k));
  const hh = Math.floor(t), mm = Math.round((t - hh) * 60);
  $('#timeOut').textContent = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

// ── Camera ───────────────────────────────────────────────────────────
let tween = null;
controls.addEventListener('start', () => { tween = null; if (W.auto) setWalkAuto(false); });
// Moves the camera to pos/target; `via` points bend the path (e.g. through a doorway).
function flyTo(pos, target, dur = 1, via = []) {
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: target.clone(), start: performance.now(), dur: dur * 1000 };
  if (via.length) tween.curve = new THREE.CatmullRomCurve3([tween.p0, ...via, tween.p1], false, 'centripetal');
}
function fitFov() {
  const vfov = THREE.MathUtils.degToRad(camera.fov);
  return Math.min(vfov, 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect));
}
const VIEW_DIRS = { iso: [21, 9, 24], front: [0, 2.2, 33], side: [37, 2.2, 0.01], top: [0, 42, 1.2] };
function viewPose(name, ex = S.explodeTarget) {
  const b = activeBounds(ex), size = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
  if (name === 'inside') {
    const lift = c.y - activeBounds(0).getCenter(new THREE.Vector3()).y;
    const v = inBuilding() ? cur.def.views?.inside : H.site.views?.inside;
    if (v) {
      const pos = new THREE.Vector3(...v.pos), target = new THREE.Vector3(...v.target);
      if (inBuilding()) { cur.group.localToWorld(pos); cur.group.localToWorld(target); }
      target.y += lift;
      return { pos, target };
    }
    name = 'iso';
  }
  const radius = name === 'top' ? Math.hypot(size.x, size.z) / 2 : size.length() / 2;
  const dist = (radius / Math.sin(fitFov() / 2)) * (name === 'top' ? 0.95 : 0.82);
  const T = name === 'top' ? new THREE.Vector3(c.x, 0, c.z) : new THREE.Vector3(c.x, b.min.y + size.y * 0.4, c.z);
  return { pos: T.clone().addScaledVector(new THREE.Vector3(...VIEW_DIRS[name]).normalize(), dist), target: T };
}
function goView(name, dur = 1, ex) {
  if (!H) return;
  const v = viewPose(name, ex);
  flyTo(v.pos, v.target, dur);
  setSeg($('#viewSeg'), name);
}
function boundsOf(objs) {
  const b = new THREE.Box3();
  for (const o of objs) if (o.visible !== false) b.expandByObject(o);
  return b;
}
function frameBox(box, dirOverride, hasCard = true) {
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const dist = Math.max(4, (sphere.radius / Math.sin(fitFov() / 2)) * 1.25);
  const dir = dirOverride ? dirOverride.clone().normalize() : camera.position.clone().sub(controls.target).normalize();
  // Drop the view slightly so the subject sits above the info card.
  const target = sphere.center.clone();
  if (hasCard) target.y -= dist * (camera.aspect < 0.8 ? 0.16 : 0.1);
  flyTo(target.clone().addScaledVector(dir, dist), target, 0.9);
}
function focusOn(id) {
  const c = cur.compById[id];
  c.group.updateMatrixWorld(true);
  // Frame where the part will be once the explode animation settles.
  const off = new THREE.Vector3(...c.explode).applyQuaternion(cur.group.quaternion).multiplyScalar(S.explodeTarget - S.explode);
  const dir = c.focusDir ? new THREE.Vector3(...c.focusDir).applyQuaternion(cur.group.quaternion) : null;
  frameBox(boundsOf(c.meshes).translate(off), dir);
}
function focusBuilding(id) {
  const B = H.bldById[id];
  frameBox(B.b0.clone(), null);
}
function fitAll() {
  root.updateMatrixWorld(true);
  const meshes = inBuilding() ? cur.comps.filter((c) => c.group.visible).flatMap((c) => c.meshes) : H.blds.filter((B) => B.group.visible).flatMap((B) => B.meshes);
  frameBox(boundsOf(meshes), null, false);
}
function dolly(f) {
  const off = camera.position.clone().sub(controls.target).multiplyScalar(f);
  flyTo(controls.target.clone().add(off), controls.target.clone(), 0.35);
}

// ── Picking ──────────────────────────────────────────────────────────
// Returns a part id (building mode) or a building id (site mode).
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(x, y) {
  if (!H) return null;
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  let fallback = null;
  for (const h of raycaster.intersectObjects(inBuilding() ? cur.pickables : H.pickables, false)) {
    const B = H.bldById[h.object.userData.bld], c = B.compById[h.object.userData.part];
    if (!B.group.visible || !c.group.visible) continue;
    if (S.section.on && sectionPlane.distanceToPoint(h.point) < 0) continue;
    const id = inBuilding() ? c.id : B.id;
    fallback ||= id;
    if (h.object.material.opacity >= 0.35) return id;
  }
  return fallback;
}

const tooltip = $('#tooltip');
const pointer = { x: 0, y: 0, buttons: 0, inside: false, dirty: false };
let downAt = null;
const cvs = renderer.domElement;
cvs.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; pointer.buttons = e.buttons; tooltip.classList.remove('on'); });
cvs.addEventListener('pointerup', (e) => {
  pointer.buttons = 0;
  if (!downAt || e.button !== 0) return;
  const moved = Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]);
  downAt = null;
  if (moved < 5 && !W.on) select(pick(e.clientX, e.clientY));
});
cvs.addEventListener('dblclick', (e) => {
  const id = W.on ? null : pick(e.clientX, e.clientY);
  if (!id) return;
  if (inBuilding()) { select(id); focusOn(id); } else enterBuilding(id);
});
cvs.addEventListener('pointermove', (e) => { Object.assign(pointer, { x: e.clientX, y: e.clientY, buttons: e.buttons, inside: true, dirty: true }); });
cvs.addEventListener('pointerleave', () => { pointer.inside = false; setHover(null); });

function setHover(id) {
  const prev = inBuilding() ? S.hovered : S.hovBld;
  if (id !== prev) {
    if (inBuilding()) S.hovered = id; else S.hovBld = id;
    updateEmissive();
    updateEdges();
    cvs.style.cursor = id ? 'pointer' : '';
  }
  if (id && pointer.inside) {
    const item = inBuilding() ? cur.compById[id] : H.bldById[id];
    tooltip.replaceChildren(item.name);
    const sm = document.createElement('small');
    sm.textContent = item.en;
    tooltip.append(sm);
    tooltip.style.left = pointer.x + 14 + 'px';
    tooltip.style.top = pointer.y + 16 + 'px';
    tooltip.classList.add('on');
  } else tooltip.classList.remove('on');
}

// ── Selection & info card ────────────────────────────────────────────
function select(id, { focus = false } = {}) {
  id = id || null;
  if (inBuilding()) S.selected = id; else S.selBld = id;
  document.body.classList.toggle('has-selection', !!id);
  $$('.part').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
  applyMaterials();
  renderInfo();
  if (id && focus) inBuilding() ? focusOn(id) : focusBuilding(id);
  if (id) $(`.part[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function listItems() { return inBuilding() ? cur.comps : H.blds; }
function step(d) {
  const list = listItems();
  const i = list.findIndex((c) => c.id === (inBuilding() ? S.selected : S.selBld));
  select(list[(i + d + list.length) % list.length].id, { focus: true });
}
function renderInfo() {
  const info = $('#info');
  const item = inBuilding() ? cur?.compById[S.selected] : H?.bldById[S.selBld];
  if (!item) { info.classList.add('hidden'); return; }
  const cat = inBuilding() ? cur.catById[item.cat] : H.zoneById[item.zone] || { label: 'Building', local: '', color: '#dcab52' };
  const list = listItems();
  info.classList.remove('hidden');
  info.style.setProperty('--c', cat.color);
  $('#infoCat').textContent = cat.local ? `${cat.label} · ${cat.local}` : cat.label;
  $('#infoIndex').textContent = `${list.indexOf(item) + 1} / ${list.length}`;
  $('#infoName').textContent = item.name;
  $('#infoEn').textContent = item.en;
  $('#infoAlias').textContent = item.alias;
  $('#infoDesc').textContent = item.desc;
  $('#infoFn').textContent = item.fn;
  $('#infoMeaning').textContent = item.meaning;
  $('#infoSpecs').replaceChildren(...item.specs.map((s) => { const el = document.createElement('span'); el.textContent = s; return el; }));
  info.scrollTop = 0;
}

// ── Left panel: building list (site) or part list (building) ─────────
const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const ENTER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
function renderList(filter = '') {
  if (!H) return;
  const list = $('#partList');
  list.replaceChildren();
  const q = filter.trim().toLowerCase();
  const site = !inBuilding();
  $('#panelTitle').textContent = site ? 'Compound' : 'Anatomy';
  $('#partCount').textContent = site ? `${H.blds.length} buildings` : `${cur.comps.length} parts`;
  $('#search').placeholder = site ? 'Search buildings…' : 'Search parts…';
  const groups = site ? H.site.categories : cur.def.categories;
  const items = site ? H.blds : cur.comps;
  const groupOf = (it) => (site ? it.zone : it.cat);
  for (const g of groups) {
    const rows = items.filter((it) => groupOf(it) === g.id && (!q || `${it.name} ${it.alias} ${it.en}`.toLowerCase().includes(q)));
    if (!rows.length) continue;
    const head = document.createElement('div');
    head.className = 'cat-head';
    head.textContent = g.label + ' ';
    const i = document.createElement('i');
    i.textContent = g.local;
    head.append(i);
    list.append(head);
    for (const it of rows) {
      const row = document.createElement('div');
      row.className = 'part';
      row.dataset.id = it.id;
      row.style.setProperty('--c', g.color);
      row.innerHTML = `<span class="dot"></span><span class="pname"><b></b><small></small></span>` +
        (site ? `<button class="eye go" title="Go inside">${ENTER}</button>` : '') +
        `<button class="eye" title="Show / hide">${EYE}</button>`;
      $('b', row).textContent = it.name;
      $('small', row).textContent = it.en;
      row.classList.toggle('active', (site ? S.selBld : S.selected) === it.id);
      row.classList.toggle('off', (site ? S.hiddenBld : S.hidden).has(it.id));
      row.addEventListener('click', () => { select(it.id, { focus: true }); document.body.classList.remove('show-left'); });
      row.addEventListener('dblclick', () => site && enterBuilding(it.id));
      $$('.eye', row).at(-1).addEventListener('click', (e) => { e.stopPropagation(); toggleHidden(it.id); });
      $('.go', row)?.addEventListener('click', (e) => { e.stopPropagation(); enterBuilding(it.id); });
      list.append(row);
    }
  }
}
function toggleHidden(id) {
  const set = inBuilding() ? S.hidden : S.hiddenBld;
  set.has(id) ? set.delete(id) : set.add(id);
  updateVisibility();
}

// ── Breadcrumb: building menu (compounds only) ───────────────────────
const bldMenu = $('#bldMenu');
function updateCrumb() {
  const show = H && !H.single && inBuilding();
  $('#crumb').hidden = !show;
  if (show) $('#bldName').textContent = cur.name;
}
function renderBldMenu() {
  const list = $('#bmList');
  list.replaceChildren();
  const add = (href, name, sub, color, isCur) => {
    const a = document.createElement('a');
    a.className = `hs-row ready${isCur ? ' current' : ''}`;
    a.href = href;
    a.innerHTML = '<span class="dot"></span><span class="hs-text"><b></b><small></small></span>';
    a.style.setProperty('--c', color);
    $('b', a).textContent = name;
    $('small', a).textContent = sub;
    list.append(a);
  };
  add(`#/${H.meta.id}`, 'Whole compound', 'Site view', '#f0c878', false);
  for (const z of H.site.categories) {
    const blds = H.blds.filter((B) => B.zone === z.id);
    if (!blds.length) continue;
    const head = document.createElement('div');
    head.className = 'hs-island';
    head.textContent = `${z.label} · ${z.local}`;
    list.append(head);
    for (const B of blds) add(`#/${H.meta.id}/${B.id}`, B.name, B.en, z.color, B === cur);
  }
}
function openBldMenu(open = true) {
  if (!bldMenu) return;
  bldMenu.classList.toggle('hidden', !open);
  $('#bldSwitch').setAttribute('aria-expanded', String(open));
  if (open) renderBldMenu();
}
$('#bldSwitch').addEventListener('click', (e) => { e.stopPropagation(); openBldMenu(bldMenu.classList.contains('hidden')); });
bldMenu.addEventListener('click', (e) => { if (e.target.closest('a')) openBldMenu(false); });
document.addEventListener('pointerdown', (e) => {
  if (!bldMenu.classList.contains('hidden') && !bldMenu.contains(e.target) && !$('#bldSwitch').contains(e.target)) openBldMenu(false);
});
$('#backToSite').addEventListener('click', backToSite);

// ── UI helpers ───────────────────────────────────────────────────────
function setRange(el, v) {
  el.value = v;
  el.style.setProperty('--p', ((v - el.min) / (el.max - el.min)) * 100 + '%');
}
function bindRange(id, fn) {
  const el = $('#' + id);
  const run = () => { setRange(el, +el.value); fn(+el.value); };
  el.addEventListener('input', run);
  setRange(el, +el.value);
}
function bindSeg(el, fn) {
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    setSeg(el, b.dataset.v);
    fn(b.dataset.v);
  });
}
function setSeg(el, v) { $$('button', el).forEach((b) => b.classList.toggle('on', b.dataset.v === v)); }
function bindSwitch(id, fn) { const el = $('#' + id); el.addEventListener('change', () => fn(el.checked)); }

// View
bindSeg($('#viewSeg'), (v) => goView(v));
bindSwitch('autoRotate', (v) => { controls.autoRotate = v; });
bindSwitch('labels', (v) => { S.labels = v; updateVisibility(); });

// Explode / lift roofs
bindRange('explode', (v) => { S.explodeTarget = v / 100; $('#explodeOut').textContent = v + '%'; });
$('#explodeBtn').addEventListener('click', () => { setExplode(1); goView('iso', 1.2); });
$('#assembleBtn').addEventListener('click', () => { setExplode(0); goView('iso', 1.2); });

// Display
const STYLES = ['realistic', 'clay', 'xray', 'blueprint'];
function setStyle(v) { S.style = v; setSeg($('#styleSeg'), v); applyMaterials(); }
bindSeg($('#styleSeg'), setStyle);
bindRange('roofOpacity', (v) => { S.roofOpacity = v / 100; $('#roofOut').textContent = v + '%'; applyMaterials(); });
bindSwitch('siteLogic', (v) => { S.siteLogic = v; updateModeUI(); });

// Section
function setSectionOn(v) {
  S.section.on = v;
  $('#secOn').checked = v;
  $('#secPos').disabled = !v;
  updateSection();
}
bindSwitch('secOn', setSectionOn);
bindSeg($('#axisSeg'), (v) => { setSectionAxis(v); if (!S.section.on) setSectionOn(true); });
bindRange('secPos', (v) => { S.section.pos = v; $('#secOut').textContent = v.toFixed(1) + ' m'; updateSection(); });
bindSwitch('secFlip', (v) => { S.section.flip = v; updateSection(); });
bindSwitch('secPlane', (v) => { S.section.plane = v; updateSection(); });

// Materials: the preset list and colour swatches are rebuilt for each house.
const presetSel = $('#preset');
function buildMaterialUI() {
  presetSel.replaceChildren(...Object.entries(H.def.presets).map(([k, p]) => new Option(p.label, k)));
  const custom = new Option('Custom', 'custom');
  custom.hidden = true;
  presetSel.append(custom);
  const swatches = $('#swatches');
  swatches.replaceChildren();
  for (const s of H.def.slots) {
    if (s.ui === false) continue;
    const lab = document.createElement('label');
    lab.className = 'sw';
    lab.innerHTML = `<input type="color" data-slot="${s.id}" /><span></span>`;
    $('span', lab).textContent = s.label;
    $('input', lab).addEventListener('input', (e) => {
      S.colors[s.id] = e.target.value;
      presetSel.value = 'custom';
      applyMaterials();
    });
    swatches.append(lab);
  }
}
function syncMaterialUI() {
  $$('input[data-slot]').forEach((el) => { el.value = S.colors[el.dataset.slot] || '#cccccc'; });
  setRange($('#rough'), Math.round(S.rough * 100));
  $('#roughOut').textContent = S.rough.toFixed(2);
}
function setPreset(k) {
  const p = H.def.presets[k];
  S.preset = k;
  S.colors = { ...p.colors };
  S.rough = p.rough;
  S.metal = { ...(p.metal || {}) };
  S.texOverride = { ...(p.tex || {}) };
  presetSel.value = k;
  syncMaterialUI();
  applyMaterials();
}
presetSel.addEventListener('change', () => { if (H.def.presets[presetSel.value]) setPreset(presetSel.value); });
bindRange('rough', (v) => { S.rough = v / 100; $('#roughOut').textContent = S.rough.toFixed(2); applyMaterials(); });
bindSwitch('textures', (v) => { S.textures = v; applyMaterials(); });

// Lighting
bindRange('time', setTime);
bindRange('exposure', (v) => { renderer.toneMappingExposure = v / 100; $('#expOut').textContent = (v / 100).toFixed(2); });
bindSwitch('shadows', (v) => { S.shadows = v; applyMaterials(); });

// Info card
$('#closeInfo').addEventListener('click', () => select(null));
$('#prevBtn').addEventListener('click', () => step(-1));
$('#nextBtn').addEventListener('click', () => step(1));
$('#focusBtn').addEventListener('click', () => {
  if (inBuilding()) S.selected && focusOn(S.selected);
  else if (S.selBld) enterBuilding(S.selBld);
});
bindSeg($('#focusSeg'), (v) => { S.focusMode = v; applyMaterials(); });

// Left panel
$('#search').addEventListener('input', (e) => renderList(e.target.value));
$('#showAll').addEventListener('click', () => { (inBuilding() ? S.hidden : S.hiddenBld).clear(); updateVisibility(); });

// About
const about = $('#about');
$('#aboutBtn').addEventListener('click', () => about.showModal());
$('.kbd-hint').addEventListener('click', () => about.showModal());

// Dock
$('#zoomIn').addEventListener('click', () => dolly(0.72));
$('#zoomOut').addEventListener('click', () => dolly(1.38));
$('#fitBtn').addEventListener('click', fitAll);
$('#fsBtn').addEventListener('click', () => {
  document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
});
$('#shotBtn').addEventListener('click', screenshot);
const fileBase = () => (inBuilding() && !H.single ? `${H.meta.id}-${cur.id}` : H.meta.id);
function screenshot() {
  renderer.render(scene, camera);
  const w = cvs.width, h = cvs.height;
  const out = document.createElement('canvas');
  out.width = w; out.height = h;
  const g = out.getContext('2d');
  const cs = getComputedStyle(viewport);
  const grd = g.createLinearGradient(0, 0, 0, h);
  if (S.style === 'blueprint') { grd.addColorStop(0, '#18385a'); grd.addColorStop(1, '#0b1a2b'); }
  else {
    grd.addColorStop(0, cs.getPropertyValue('--sky-top').trim() || '#86a9c4');
    grd.addColorStop(0.58, cs.getPropertyValue('--sky-bot').trim() || '#efe5d3');
    grd.addColorStop(1, '#8a7862');
  }
  g.fillStyle = grd;
  g.fillRect(0, 0, w, h);
  g.drawImage(cvs, 0, 0);
  const a = document.createElement('a');
  a.download = `${fileBase()}.png`;
  a.href = out.toDataURL('image/png');
  a.click();
}

// Download 3D: the current building, or the whole compound in site view.
const EX = { format: 'glb' };
function setFormat(f) {
  EX.format = f;
  setSeg($('#fmtSeg'), f);
  $('#fmtNote').textContent = FORMATS[f].note;
  $('#downloadBtn').textContent = `Download .${FORMATS[f].ext}`;
}
bindSeg($('#fmtSeg'), setFormat);
// Export uses the current material preset, independent of the on-screen render style.
function exportMaterial(slot, name) {
  return new THREE.MeshStandardMaterial({
    name, color: new THREE.Color(S.colors[slot] || '#cccccc'),
    map: S.textures ? slotTexture(slot) : null,
    roughness: H.slotById[slot]?.glossy ? Math.max(0.2, S.rough - 0.35) : S.rough,
    metalness: S.metal[slot] || 0,
  });
}
$('#downloadBtn').addEventListener('click', async () => {
  const btn = $('#downloadBtn');
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Preparing…';
  try {
    const onlyVisible = $('#exVisible').checked, exploded = $('#exExploded').checked;
    const blds = inBuilding() ? [cur] : H.blds.filter((B) => !onlyVisible || B.group.visible);
    const comps = blds.flatMap((B) => B.comps);
    root.updateMatrixWorld(true);
    const size = await export3D(EX.format, comps, {
      onlyVisible, exploded,
      transform: (c) => (exploded ? c.group.matrixWorld : c.bld.group.matrixWorld).clone(),
      nameOf: (c) => (blds.length > 1 ? `${c.bld.name} · ${c.name}` : c.name),
      material: exportMaterial,
      slotName: (slot) => H.slotById[slot]?.label || slot,
      title: inBuilding() && !H.single ? `${H.meta.name} · ${cur.name}` : H.meta.name,
      filename: fileBase(),
    });
    $('#fmtNote').textContent = `Saved ${(size / 1048576).toFixed(1)} MB. ${FORMATS[EX.format].note}`;
  } catch (err) {
    console.error(err);
    $('#fmtNote').textContent = `Export failed: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});
$('#dlDock').addEventListener('click', () => {
  const d = $('#exportSec');
  d.open = true;
  document.body.classList.remove('show-left');
  document.body.classList.add('show-right');
  requestAnimationFrame(() => { const sc = d.closest('.scroll'); sc.scrollTop = sc.scrollHeight; });
});
setFormat('glb');

// Mobile panel toggles
$$('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
  const cls = b.dataset.toggle;
  const on = !document.body.classList.contains(cls);
  document.body.classList.remove('show-left', 'show-right');
  document.body.classList.toggle(cls, on);
}));
cvs.addEventListener('pointerdown', () => document.body.classList.remove('show-left', 'show-right'));

// ── Guided walk (site mode) ──────────────────────────────────────────
// A camera tour through the compound defined by `site.walk.stops`: each stop has a title,
// text, camera pos/target (or a named `view`), optional `via` waypoints, the buildings to
// highlight and whether to show the site-logic overlay.
const W = { on: false, i: 0, auto: false, arrive: 0, wait: 0, hi: new Set(), overlay: false };
const walkEl = $('#walk');

function startWalk() {
  if (!H?.site?.walk || inBuilding()) return;
  select(null);
  setExplode(0);
  W.on = true;
  document.body.classList.add('walking');
  walkEl.classList.remove('hidden');
  $('#walkDots').replaceChildren(...H.site.walk.stops.map((st, i) => {
    const b = document.createElement('button');
    b.title = st.title;
    b.addEventListener('click', () => goStop(i));
    return b;
  }));
  setWalkAuto(false);
  goStop(0);
}

function stopWalk({ fly = true } = {}) {
  W.on = false;
  W.hi.clear();
  W.overlay = false;
  document.body.classList.remove('walking');
  walkEl.classList.add('hidden');
  if (!H) return;
  updateModeUI();
  updateEmissive();
  if (fly) goView('iso', 1.8);
}

function goStop(i) {
  const stops = H.site.walk.stops;
  if (i < 0 || i >= stops.length) return;
  W.i = i;
  const st = stops[i];
  $('#walkIndex').textContent = `${i + 1} / ${stops.length}`;
  $('#walkTitle').textContent = st.title;
  $('#walkLocal').textContent = st.local || '';
  $('#walkText').textContent = st.text;
  $('#walkPrev').disabled = i === 0;
  $('#walkNext').textContent = i === stops.length - 1 ? 'Finish' : 'Next stop →';
  $$('#walkDots button').forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); });

  W.hi = new Set(st.buildings || []);
  W.overlay = !!st.overlay;
  updateModeUI();
  updateEmissive();

  const pose = st.view ? viewPose(st.view, 0) : { pos: new THREE.Vector3(...st.pos), target: new THREE.Vector3(...st.target) };
  const via = (st.via || []).map((v) => new THREE.Vector3(...v));
  const dist = [camera.position, ...via, pose.pos].reduce((sum, p, k, a) => sum + (k ? p.distanceTo(a[k - 1]) : 0), 0);
  const dur = Math.min(4.5, Math.max(1.4, dist / 6));
  flyTo(pose.pos, pose.target, dur, via);
  W.arrive = performance.now() + dur * 1000;
  W.wait = Math.min(15000, Math.max(6000, st.text.length * 50));
}

function walkNext() {
  if (W.i >= H.site.walk.stops.length - 1) stopWalk();
  else goStop(W.i + 1);
}

function setWalkAuto(on) {
  W.auto = on;
  const b = $('#walkPlay');
  b.textContent = on ? '❚❚' : '▶';
  b.title = on ? 'Pause (space)' : 'Auto-play (space)';
  b.classList.toggle('on', on);
  if (on && !tween) W.arrive = performance.now();
}

function tickWalk() {
  const now = performance.now();
  const p = W.auto ? Math.min(1, Math.max(0, (now - W.arrive) / W.wait)) : 0;
  $('#walkProgress').style.transform = `scaleX(${p})`;
  if (W.auto && !tween && p >= 1) {
    if (W.i >= H.site.walk.stops.length - 1) setWalkAuto(false);
    else goStop(W.i + 1);
  }
}

$('#walkBtn').addEventListener('click', startWalk);
$('#walkStartCtl').addEventListener('click', startWalk);
$('#walkClose').addEventListener('click', () => stopWalk());
$('#walkPrev').addEventListener('click', () => goStop(W.i - 1));
$('#walkNext').addEventListener('click', walkNext);
$('#walkPlay').addEventListener('click', () => setWalkAuto(!W.auto));

// Keyboard
addEventListener('keydown', (e) => {
  if (!active || !H) return;
  if (e.target.closest?.('input, select, textarea, [role=dialog]') || e.metaKey || e.ctrlKey || about.open) return;
  if (document.body.classList.contains('switcher-open')) return;
  if (!bldMenu.classList.contains('hidden')) { if (e.key === 'Escape') openBldMenu(false); return; }
  const k = e.key.toLowerCase();
  if (W.on) {
    if (k === 'escape') stopWalk();
    else if (k === 'arrowright' || k === 'enter') walkNext();
    else if (k === 'arrowleft') goStop(W.i - 1);
    else if (k === ' ') { e.preventDefault(); setWalkAuto(!W.auto); }
    return;
  }
  if (k === 'w' && !inBuilding() && H.site.walk) { startWalk(); return; }
  const sel = inBuilding() ? S.selected : S.selBld;
  const views = { 1: 'iso', 2: 'front', 3: 'side', 4: 'top', 5: 'inside' };
  if (views[k]) goView(views[k]);
  else if (k === 'e') { setExplode(S.explodeTarget > 0.5 ? 0 : 1); goView('iso', 1.2); }
  else if (k === 's') setSectionOn(!S.section.on);
  else if (k === 'x') setStyle(STYLES[(STYLES.indexOf(S.style) + 1) % STYLES.length]);
  else if (k === 'l') { S.labels = !S.labels; $('#labels').checked = S.labels; updateVisibility(); }
  else if (k === 'r') goView('iso');
  else if (k === 'f' && sel) inBuilding() ? focusOn(sel) : focusBuilding(sel);
  else if (k === 'enter' && sel && !inBuilding()) enterBuilding(sel);
  else if (k === 'h' && sel) { toggleHidden(sel); select(null); }
  else if (k === 'escape') sel ? select(null) : inBuilding() && backToSite();
  else if (k === 'arrowright') step(1);
  else if (k === 'arrowleft') step(-1);
  else if (k === '?') about.showModal();
});

// Resize
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  labelRenderer.setSize(innerWidth, innerHeight);
});

// ── Loop (runs only while the viewer is open) ────────────────────────
const clock = new THREE.Clock();
let running = false;
function startLoop() {
  if (running) return;
  running = true;
  clock.getDelta();
  requestAnimationFrame(frame);
}
function frame() {
  if (!active) { running = false; return; }
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  if (S.explode !== S.explodeTarget) {
    S.explode += (S.explodeTarget - S.explode) * Math.min(1, dt * 3.2);
    if (Math.abs(S.explode - S.explodeTarget) < 1e-3) S.explode = S.explodeTarget;
    applyExplode();
  }
  if (tween) {
    const k = Math.min(1, (performance.now() - tween.start) / tween.dur);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    if (tween.curve) camera.position.copy(tween.curve.getPoint(e));
    else camera.position.lerpVectors(tween.p0, tween.p1, e);
    controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (k >= 1) tween = null;
  }
  controls.update();
  if (camera.position.y < 0.3) camera.position.y = 0.3;
  if (W.on) tickWalk();

  if (pointer.dirty && !pointer.buttons) { pointer.dirty = false; setHover(pick(pointer.x, pointer.y)); }
  if (H) {
    const k = 0.22 + 0.16 * (0.5 + 0.5 * Math.sin(t * 3.4));
    const mats = inBuilding() ? (S.selected ? cur.compById[S.selected].mats : null) : S.selBld ? H.bldById[S.selBld].comps.flatMap((c) => c.mats) : null;
    if (mats) for (const m of mats) m.emissiveIntensity = k;
  }
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

setSectionOn(false);
