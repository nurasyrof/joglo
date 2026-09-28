import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { buildJoglo } from './joglo.js';
import { COMPONENTS, CATEGORIES, ABOUT } from './components.js';
import { PRESETS, CLAY, SLOTS, createMaterialFactory } from './materials.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const catById = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// ── State ────────────────────────────────────────────────────────────
const S = {
  explode: 1, explodeTarget: 1,
  style: 'realistic', roofOpacity: 1,
  section: { on: false, axis: 'x', pos: 0, flip: false, plane: true },
  preset: 'natural', colors: { ...PRESETS.natural.colors }, rough: PRESETS.natural.rough, accentMetal: PRESETS.natural.accentMetal, textures: true,
  time: 9.5, shadows: true,
  labels: false,
  selected: null, hovered: null, focusMode: 'ghost', hidden: new Set(),
};

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

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(innerWidth, innerHeight);
labelRenderer.domElement.className = 'labels';
viewport.appendChild(labelRenderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.4;

const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 400);
camera.position.set(44, 30, 50);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 9, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 2;
controls.maxDistance = 90;
controls.maxPolarAngle = Math.PI * 0.92;
controls.autoRotateSpeed = 0.7;

// ── Lights, ground ───────────────────────────────────────────────────
const hemi = new THREE.HemisphereLight(0xf3ead8, 0x5a4a38, 0.6);
const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -17, right: 17, top: 17, bottom: -17, near: 1, far: 100 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.03;
sun.target.position.set(0, 3, 0);
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
  new THREE.CircleGeometry(60, 72).rotateX(-Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: '#8d7c63', roughness: 1, alphaMap: groundAlpha, transparent: true }));
ground.position.y = -0.002;
ground.receiveShadow = true;
scene.add(ground);

const grid = new THREE.GridHelper(60, 60, 0x4f86b8, 0x24476b);
grid.material.transparent = true;
grid.material.opacity = 0.5;
grid.visible = false;
scene.add(grid);

// ── Section plane + cap uniforms ─────────────────────────────────────
const sectionPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e5);
const capUniforms = { uCapOn: { value: 0 }, uCapColor: { value: new THREE.Vector3(0.84, 0.37, 0.26) } };
const MF = createMaterialFactory({ planes: [sectionPlane], capUniforms, anisotropy: renderer.capabilities.getMaxAnisotropy() });

const secHelper = new THREE.Group();
secHelper.add(
  new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xe8a74a, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false })),
  new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)), new THREE.LineBasicMaterial({ color: 0xf0b95a, transparent: true, opacity: 0.9 })));
secHelper.visible = false;
scene.add(secHelper);

// ── Build the joglo ──────────────────────────────────────────────────
const built = buildJoglo();
const root = new THREE.Group();
scene.add(root);
const comps = [];
const compById = {};
const pickables = [];

for (const def of COMPONENTS) {
  const part = built.parts[def.id];
  const group = new THREE.Group();
  group.name = def.id;
  root.add(group);
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, clippingPlanes: [sectionPlane] });
  const c = { ...def, group, meshes: [], edges: [], mats: [], edgeMat };
  c.specs = def.specs.map((s) => s.replace('{rafters}', built.counts.rafters).replace('{battens}', built.counts.battens));
  for (const [slot, list] of Object.entries(part.parts)) {
    const geom = mergeGeometries(list, false);
    const mat = MF.make(slot, def.id);
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    mesh.userData.comp = def.id;
    group.add(mesh);
    c.meshes.push(mesh);
    c.mats.push(mat);
    pickables.push(mesh);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geom, 28), edgeMat);
    edges.visible = false;
    edges.raycast = () => {};
    group.add(edges);
    c.edges.push(edges);
  }
  const el = document.createElement('button');
  el.className = 'tag';
  el.textContent = def.name;
  el.style.setProperty('--c', catById[def.cat].color);
  el.addEventListener('click', (e) => { e.stopPropagation(); select(def.id, { focus: true }); });
  const label = new CSS2DObject(el);
  label.position.set(...def.anchor);
  label.visible = false;
  group.add(label);
  c.label = label;
  comps.push(c);
  compById[def.id] = c;
}

// ── Materials / display state ────────────────────────────────────────
function applyMaterials() {
  const st = S.style;
  const plank = new THREE.Color(S.colors.wood).lerp(new THREE.Color('#e8d2b4'), 0.18).getHexString();
  for (const rec of MF.records) {
    const m = rec.mat, c = compById[rec.comp];
    const isSel = S.selected === rec.comp;
    const col = st === 'clay' ? CLAY[rec.slot] : st === 'blueprint' ? '#1c4068' : rec.slot === 'plank' ? '#' + plank : S.colors[rec.slot];
    m.color.set(col);
    const map = st === 'realistic' && S.textures ? MF.texFor(rec.slot) : null;
    if (m.map !== map) { m.map = map; m.needsUpdate = true; }
    m.roughness = st === 'clay' ? 0.92 : rec.slot === 'accent' ? Math.max(0.2, S.rough - 0.35) : S.rough;
    m.metalness = st === 'realistic' && rec.slot === 'accent' ? S.accentMetal : 0;

    let op = st === 'xray' ? 0.16 : st === 'blueprint' ? 0.06 : 1;
    if (c.roof && !isSel) op = Math.min(op, S.roofOpacity);
    if (S.selected && !isSel && S.focusMode === 'ghost') op = Math.min(op, st === 'realistic' || st === 'clay' ? 0.1 : 0.04);
    if (isSel && (st === 'xray' || st === 'blueprint')) op = 0.85;
    const tr = op < 0.999;
    if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
    m.opacity = op;
    m.depthWrite = !tr;
  }
  const solidStyle = st === 'realistic' || st === 'clay';
  sun.castShadow = S.shadows && solidStyle;
  for (const c of comps) for (const mesh of c.meshes) mesh.castShadow = mesh.material.opacity > 0.5;
  ground.visible = st !== 'blueprint';
  grid.visible = st === 'blueprint';
  document.body.classList.toggle('blueprint', st === 'blueprint');
  updateEdges();
  updateVisibility();
  updateEmissive();
}

function updateEdges() {
  const st = S.style;
  for (const c of comps) {
    const sel = S.selected === c.id, hov = S.hovered === c.id;
    const show = st === 'xray' || st === 'blueprint' || sel || (hov && st !== 'realistic' && st !== 'clay');
    c.edgeMat.color.set(sel ? '#ffcf6b' : hov ? '#ffe2a8' : st === 'blueprint' ? '#8ecbff' : '#f6e6c8');
    let op = sel ? 0.95 : hov ? 0.8 : st === 'blueprint' ? 0.55 : 0.3;
    if (S.selected && !sel && S.focusMode === 'ghost') op *= 0.3;
    c.edgeMat.opacity = op;
    for (const e of c.edges) e.visible = show;
  }
}

function updateVisibility() {
  for (const c of comps) {
    const iso = S.selected && S.focusMode === 'isolate' && S.selected !== c.id;
    c.group.visible = !S.hidden.has(c.id) && !iso;
    c.label.visible = S.labels && c.group.visible;
    c.label.element.classList.toggle('on', S.selected === c.id);
    const row = $(`.part[data-id="${c.id}"]`);
    if (row) row.classList.toggle('off', S.hidden.has(c.id));
  }
}

function updateEmissive() {
  for (const c of comps) {
    const sel = S.selected === c.id, hov = S.hovered === c.id;
    for (const m of c.mats) {
      m.emissive.set(sel ? '#ff9b2f' : hov ? '#ffc070' : '#000000');
      m.emissiveIntensity = sel ? 0.3 : hov ? 0.22 : 0;
    }
  }
}

// ── Explode ──────────────────────────────────────────────────────────
function applyExplode() {
  for (const c of comps) c.group.position.set(...c.explode).multiplyScalar(S.explode);
  if (S.section.on) updateSection();
}
function setExplode(v) {
  S.explodeTarget = v;
  setRange($('#explode'), Math.round(v * 100));
  $('#explodeOut').textContent = Math.round(v * 100) + '%';
}

// ── Section ──────────────────────────────────────────────────────────
const SEC_RANGE = { x: [-10, 10, 0], z: [-9, 9, 0], y: [0.2, 14, 3.2] };
function updateSection() {
  const s = S.section;
  capUniforms.uCapOn.value = s.on ? 1 : 0;
  if (!s.on) {
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
  const h = 15 + 16 * S.explode, cy = h / 2 - 1.5;
  if (s.axis === 'x') { secHelper.rotation.y = Math.PI / 2; secHelper.scale.set(19, h, 1); secHelper.position.set(s.pos, cy, 0); }
  if (s.axis === 'z') { secHelper.scale.set(21, h, 1); secHelper.position.set(0, cy, s.pos); }
  if (s.axis === 'y') { secHelper.rotation.x = -Math.PI / 2; secHelper.scale.set(21, 19, 1); secHelper.position.set(0, s.pos, 0); }
}
function setSectionAxis(axis) {
  S.section.axis = axis;
  const [min, max, def] = SEC_RANGE[axis];
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
  sun.position.copy(dir).multiplyScalar(45).add(sun.target.position);
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
controls.addEventListener('start', () => { tween = null; });
function flyTo(pos, target, dur = 1) {
  tween = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos.clone(), t1: target.clone(), start: performance.now(), dur: dur * 1000 };
}
function viewPose(name, ex = S.explodeTarget) {
  const lift = 8.5 * ex, grow = 1 + 0.5 * ex;
  const T = new THREE.Vector3(0, 4.6 + lift, 0);
  const off = {
    iso: [21, 9, 24], front: [0, 2.2, 33], side: [37, 2.2, 0.01], top: [0.01, 42, 0.02],
  }[name];
  if (name === 'inside') return { pos: new THREE.Vector3(0.8, 1.7, 4.4), target: new THREE.Vector3(0, 7.3 + lift, 0) };
  if (name === 'top') T.set(0, 0, 0);
  return { pos: T.clone().add(new THREE.Vector3(...off).multiplyScalar(grow)), target: T };
}
function goView(name, dur = 1) {
  const v = viewPose(name);
  flyTo(v.pos, v.target, dur);
  setSeg($('#viewSeg'), name);
}
function boundsOf(objs) {
  const b = new THREE.Box3();
  for (const o of objs) if (o.visible !== false) b.expandByObject(o);
  return b;
}
function frameBox(box, dirOverride) {
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  const vfov = THREE.MathUtils.degToRad(camera.fov);
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect);
  const fov = Math.min(vfov, hfov);
  const dist = Math.max(4, (sphere.radius / Math.sin(fov / 2)) * 1.25);
  const dir = dirOverride
    ? new THREE.Vector3(...dirOverride).normalize()
    : camera.position.clone().sub(controls.target).normalize();
  // Drop the view slightly so the part sits above the info card.
  const target = sphere.center.clone();
  if (S.selected) target.y -= dist * (camera.aspect < 0.8 ? 0.16 : 0.1);
  flyTo(target.clone().addScaledVector(dir, dist), target, 0.9);
}
function focusOn(id) {
  const c = compById[id];
  c.group.updateMatrixWorld(true);
  // Frame where the part will be once the explode animation settles.
  const box = boundsOf(c.meshes).translate(new THREE.Vector3(...c.explode).multiplyScalar(S.explodeTarget - S.explode));
  frameBox(box, c.focusDir);
}
function fitAll() {
  root.updateMatrixWorld(true);
  frameBox(boundsOf(comps.filter((c) => c.group.visible).flatMap((c) => c.meshes)));
}
function dolly(f) {
  const off = camera.position.clone().sub(controls.target).multiplyScalar(f);
  flyTo(controls.target.clone().add(off), controls.target.clone(), 0.35);
}

// ── Picking ──────────────────────────────────────────────────────────
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pick(x, y) {
  const rect = renderer.domElement.getBoundingClientRect();
  ndc.set(((x - rect.left) / rect.width) * 2 - 1, -((y - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  let fallback = null;
  for (const h of raycaster.intersectObjects(pickables, false)) {
    const c = compById[h.object.userData.comp];
    if (!c.group.visible) continue;
    if (S.section.on && sectionPlane.distanceToPoint(h.point) < 0) continue;
    fallback ||= c.id;
    if (h.object.material.opacity >= 0.35) return c.id;
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
  if (moved < 5) select(pick(e.clientX, e.clientY));
});
cvs.addEventListener('dblclick', (e) => { const id = pick(e.clientX, e.clientY); if (id) { select(id); focusOn(id); } });
cvs.addEventListener('pointermove', (e) => { Object.assign(pointer, { x: e.clientX, y: e.clientY, buttons: e.buttons, inside: true, dirty: true }); });
cvs.addEventListener('pointerleave', () => { pointer.inside = false; setHover(null); });

function setHover(id) {
  if (id !== S.hovered) {
    S.hovered = id;
    updateEmissive();
    updateEdges();
    cvs.style.cursor = id ? 'pointer' : '';
  }
  if (id && pointer.inside) {
    const c = compById[id];
    tooltip.innerHTML = '';
    tooltip.append(c.name);
    const sm = document.createElement('small');
    sm.textContent = c.en;
    tooltip.append(sm);
    tooltip.style.left = pointer.x + 14 + 'px';
    tooltip.style.top = pointer.y + 16 + 'px';
    tooltip.classList.add('on');
  } else tooltip.classList.remove('on');
}

// ── Selection & info card ────────────────────────────────────────────
function select(id, { focus = false } = {}) {
  S.selected = id || null;
  document.body.classList.toggle('has-selection', !!id);
  $$('.part').forEach((el) => el.classList.toggle('active', el.dataset.id === id));
  applyMaterials();
  renderInfo();
  if (id && focus) focusOn(id);
  if (id) $(`.part[data-id="${id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function step(d) {
  const i = COMPONENTS.findIndex((c) => c.id === S.selected);
  const next = COMPONENTS[(i + d + COMPONENTS.length) % COMPONENTS.length];
  select(next.id, { focus: true });
}
function renderInfo() {
  const info = $('#info');
  const c = compById[S.selected];
  if (!c) { info.classList.add('hidden'); return; }
  const cat = catById[c.cat];
  info.classList.remove('hidden');
  info.style.setProperty('--c', cat.color);
  $('#infoCat').textContent = `${cat.label} · ${cat.local}`;
  $('#infoIndex').textContent = `${COMPONENTS.findIndex((x) => x.id === c.id) + 1} / ${COMPONENTS.length}`;
  $('#infoName').textContent = c.name;
  $('#infoEn').textContent = c.en;
  $('#infoAlias').textContent = c.alias;
  $('#infoDesc').textContent = c.desc;
  $('#infoFn').textContent = c.fn;
  $('#infoMeaning').textContent = c.meaning;
  const specs = $('#infoSpecs');
  specs.replaceChildren(...c.specs.map((s) => { const el = document.createElement('span'); el.textContent = s; return el; }));
  info.scrollTop = 0;
}

// ── Anatomy list ─────────────────────────────────────────────────────
const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
function renderList(filter = '') {
  const list = $('#partList');
  list.replaceChildren();
  const q = filter.trim().toLowerCase();
  for (const cat of CATEGORIES) {
    const items = COMPONENTS.filter((c) => c.cat === cat.id &&
      (!q || `${c.name} ${c.alias} ${c.en}`.toLowerCase().includes(q)));
    if (!items.length) continue;
    const head = document.createElement('div');
    head.className = 'cat-head';
    head.textContent = cat.label + ' ';
    const i = document.createElement('i');
    i.textContent = cat.local;
    head.append(i);
    list.append(head);
    for (const c of items) {
      const row = document.createElement('div');
      row.className = 'part';
      row.dataset.id = c.id;
      row.style.setProperty('--c', cat.color);
      row.innerHTML = `<span class="dot"></span><span class="pname"><b></b><small></small></span><button class="eye" title="Show / hide">${EYE}</button>`;
      $('b', row).textContent = c.name;
      $('small', row).textContent = c.en;
      row.classList.toggle('active', S.selected === c.id);
      row.classList.toggle('off', S.hidden.has(c.id));
      row.addEventListener('click', () => { select(c.id, { focus: true }); document.body.classList.remove('show-left'); });
      $('.eye', row).addEventListener('click', (e) => { e.stopPropagation(); toggleHidden(c.id); });
      list.append(row);
    }
  }
}
function toggleHidden(id) {
  S.hidden.has(id) ? S.hidden.delete(id) : S.hidden.add(id);
  updateVisibility();
}

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

// Explode
bindRange('explode', (v) => { S.explodeTarget = v / 100; $('#explodeOut').textContent = v + '%'; });
$('#explodeBtn').addEventListener('click', () => { setExplode(1); goView('iso', 1.2); });
$('#assembleBtn').addEventListener('click', () => { setExplode(0); goView('iso', 1.2); });

// Display
const STYLES = ['realistic', 'clay', 'xray', 'blueprint'];
function setStyle(v) { S.style = v; setSeg($('#styleSeg'), v); applyMaterials(); }
bindSeg($('#styleSeg'), setStyle);
bindRange('roofOpacity', (v) => { S.roofOpacity = v / 100; $('#roofOut').textContent = v + '%'; applyMaterials(); });

// Section
function setSectionOn(v) {
  S.section.on = v;
  $('#secOn').checked = v;
  ['secPos'].forEach((id) => { $('#' + id).disabled = !v; });
  updateSection();
}
bindSwitch('secOn', setSectionOn);
bindSeg($('#axisSeg'), (v) => { setSectionAxis(v); if (!S.section.on) setSectionOn(true); });
bindRange('secPos', (v) => { S.section.pos = v; $('#secOut').textContent = v.toFixed(1) + ' m'; updateSection(); });
bindSwitch('secFlip', (v) => { S.section.flip = v; updateSection(); });
bindSwitch('secPlane', (v) => { S.section.plane = v; updateSection(); });

// Materials
const presetSel = $('#preset');
for (const [k, p] of Object.entries(PRESETS)) presetSel.append(new Option(p.label, k));
presetSel.append(new Option('Custom', 'custom'));
presetSel.options[presetSel.options.length - 1].hidden = true;
const swatches = $('#swatches');
for (const s of SLOTS) {
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
function syncMaterialUI() {
  $$('input[data-slot]').forEach((el) => { el.value = S.colors[el.dataset.slot]; });
  setRange($('#rough'), Math.round(S.rough * 100));
  $('#roughOut').textContent = S.rough.toFixed(2);
}
function setPreset(k) {
  const p = PRESETS[k];
  S.preset = k;
  S.colors = { ...p.colors };
  S.rough = p.rough;
  S.accentMetal = p.accentMetal;
  presetSel.value = k;
  syncMaterialUI();
  applyMaterials();
}
presetSel.addEventListener('change', () => { if (PRESETS[presetSel.value]) setPreset(presetSel.value); });
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
$('#focusBtn').addEventListener('click', () => S.selected && focusOn(S.selected));
bindSeg($('#focusSeg'), (v) => { S.focusMode = v; applyMaterials(); });

// Anatomy panel
$('#search').addEventListener('input', (e) => renderList(e.target.value));
$('#showAll').addEventListener('click', () => { S.hidden.clear(); updateVisibility(); });

// About
$('#aboutTitle').textContent = ABOUT.title;
$('#aboutBody').replaceChildren(...ABOUT.paras.map((t) => { const p = document.createElement('p'); p.textContent = t; return p; }));
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
  a.download = 'joglo.png';
  a.href = out.toDataURL('image/png');
  a.click();
}

// Mobile panel toggles
$$('[data-toggle]').forEach((b) => b.addEventListener('click', () => {
  const cls = b.dataset.toggle;
  const on = !document.body.classList.contains(cls);
  document.body.classList.remove('show-left', 'show-right');
  document.body.classList.toggle(cls, on);
}));
cvs.addEventListener('pointerdown', () => document.body.classList.remove('show-left', 'show-right'));

// Keyboard
addEventListener('keydown', (e) => {
  if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || about.open) return;
  const k = e.key.toLowerCase();
  const views = { 1: 'iso', 2: 'front', 3: 'side', 4: 'top', 5: 'inside' };
  if (views[k]) goView(views[k]);
  else if (k === 'e') { setExplode(S.explodeTarget > 0.5 ? 0 : 1); goView('iso', 1.2); }
  else if (k === 's') setSectionOn(!S.section.on);
  else if (k === 'x') setStyle(STYLES[(STYLES.indexOf(S.style) + 1) % STYLES.length]);
  else if (k === 'l') { S.labels = !S.labels; $('#labels').checked = S.labels; updateVisibility(); }
  else if (k === 'r') { goView('iso'); }
  else if (k === 'f' && S.selected) focusOn(S.selected);
  else if (k === 'h' && S.selected) { toggleHidden(S.selected); select(null); }
  else if (k === 'escape') select(null);
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

// ── Loop ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
function frame() {
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
    camera.position.lerpVectors(tween.p0, tween.p1, e);
    controls.target.lerpVectors(tween.t0, tween.t1, e);
    if (k >= 1) tween = null;
  }
  controls.update();
  if (camera.position.y < 0.3) camera.position.y = 0.3;

  if (pointer.dirty && !pointer.buttons) { pointer.dirty = false; setHover(pick(pointer.x, pointer.y)); }
  if (S.selected) {
    const k = 0.22 + 0.16 * (0.5 + 0.5 * Math.sin(t * 3.4));
    for (const m of compById[S.selected].mats) m.emissiveIntensity = k;
  }
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

// ── Init ─────────────────────────────────────────────────────────────
$('#partCount').textContent = `${COMPONENTS.length} parts`;
renderList();
setPreset('natural');
setTime(S.time);
setSectionAxis('x');
setSectionOn(false);
applyExplode();
setExplode(1);
frame();
setTimeout(() => {
  $('#loading').classList.add('done');
  setTimeout(() => { setExplode(0); flyTo(viewPose('iso', 0).pos, viewPose('iso', 0).target, 2.6); }, 500);
}, 60);
