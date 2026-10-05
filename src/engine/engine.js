// Headless 3D engine. It owns the Three.js scene, camera, picking and animation, keeps the
// view state and exposes actions; the React UI subscribes to snapshots of that state.
//
// A house is a site with one or more buildings; each building has parts. Two modes:
//   site      the whole compound: pick buildings, lift roofs, site-logic overlay, guided walk
//   building  one building's anatomy: pick parts, explode, part cards (other buildings ghosted)
// Houses without a `site` definition are a single building and always open in building mode.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { texture, createMaterialFactory } from './materials.js';
import { export3D } from './exporter.js';

const CLAY_DEFAULT = '#e8e3da';
// Parts that rise with "lift roofs" in site view: flagged `lift`, or in the 'roof' category.
const lifts = (c) => c.lift ?? c.cat === 'roof';
const VIEW_DIRS = { iso: [21, 9, 24], front: [0, 2.2, 33], side: [37, 2.2, 0.01], top: [0, 42, 1.2] };
export const STYLES = ['realistic', 'clay', 'xray', 'blueprint'];

export function createEngine(container, { onNavigate = () => {} } = {}) {
  // ── State ──────────────────────────────────────────────────────────
  // View settings persist across houses and modes; H holds the loaded house.
  const S = {
    mode: 'site', view: 'iso', theme: 'light',
    explode: 1, explodeTarget: 1,
    style: 'realistic', roofOpacity: 1,
    section: { on: false, axis: 'x', pos: 0, flip: false, plane: true, min: -10, max: 10 },
    preset: null, colors: {}, rough: 0.7, metal: {}, texOverride: {}, textures: true,
    time: 9.5, shadows: true, labels: false, siteLogic: false, autoRotate: false,
    selected: null, hovered: null, focusMode: 'ghost', hidden: new Set(),     // building mode (parts)
    selBld: null, hovBld: null, hiddenBld: new Set(),                        // site mode (buildings)
    loading: false, loadingText: '',
  };
  let H = null;      // the loaded house
  let cur = null;    // the building open in building mode
  let alive = true;
  let loadToken = 0;
  const inBuilding = () => S.mode === 'building';

  // ── Subscriptions ──────────────────────────────────────────────────
  const listeners = new Set(), hoverListeners = new Set(), progressListeners = new Set();
  let snap = null;
  const emit = () => { snap = null; for (const l of listeners) l(); };
  const getSnapshot = () => (snap ||= buildSnapshot());

  // ── Renderer, scene, camera ────────────────────────────────────────
  const size = () => [Math.max(1, container.clientWidth), Math.max(1, container.clientHeight)];
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(...size());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;
  renderer.domElement.className = 'block outline-none';
  container.appendChild(renderer.domElement);
  const anisotropy = renderer.capabilities.getMaxAnisotropy();

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(...size());
  labelRenderer.domElement.className = 'absolute inset-0 pointer-events-none';
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.4;

  const camera = new THREE.PerspectiveCamera(38, size()[0] / size()[1], 0.1, 600);
  camera.position.set(44, 30, 50);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 9, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 2;
  controls.maxDistance = 180;
  controls.maxPolarAngle = Math.PI * 0.92;
  controls.autoRotateSpeed = 0.7;

  // ── Lights, ground ─────────────────────────────────────────────────
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
  // The ground is transparent (its edge fades out), so it joins the depth-sorted transparent pass.
  // Draw it first: otherwise it can paint over faded roofs whose centres are farther away.
  ground.renderOrder = -1;
  scene.add(ground);

  const grid = new THREE.GridHelper(1, 1, 0x4f86b8, 0x24476b);
  grid.material.transparent = true;
  grid.material.opacity = 0.5;
  grid.visible = false;
  grid.renderOrder = -1;
  scene.add(grid);

  // ── Section plane + cap uniforms ───────────────────────────────────
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

  // ── Building the house ─────────────────────────────────────────────
  function tag(text, color, cls, onClick) {
    const el = document.createElement('button');
    el.className = `scene-tag ${cls}`;
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
      }
      c.label = tag(d.name, catById[d.cat].color, '', () => select(d.id, { focus: true }));
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
      B.label = tag(entry.name, zone?.color || '#c08040', 'bld-tag', () => select(B.id, { focus: true }));
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
      const col = z.color || H.zoneById[z.zone]?.color || '#ffffff';
      // A zone spans the overlay's full width unless it sets its own x0 / x1.
      const x0 = z.x0 ?? ov.x0, x1 = z.x1 ?? ov.x1;
      const w = x1 - x0, d = z.z1 - z.z0;
      const geo = new THREE.PlaneGeometry(w - 0.4, d - 0.4).rotateX(-Math.PI / 2);
      const plane = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3, depthWrite: false }));
      plane.position.set((x0 + x1) / 2, 0.08, (z.z0 + z.z1) / 2);
      plane.renderOrder = 2;
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 }));
      edge.position.copy(plane.position);
      g.add(plane, edge);
      const l = tag(z.text, col, 'zone-tag', () => {});
      l.position.set(x0 + 1.2, 0.4, z.z1 - 1.2);
      g.add(l);
      g.userData.labels.push(l);
    }
    if (ov.axis) {
      const [a, b] = [ov.axis.from, ov.axis.to].map(([x, z]) => new THREE.Vector3(x, 0.12, z));
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), new THREE.LineDashedMaterial({ color: 0xfff4dc, dashSize: 0.9, gapSize: 0.5 }));
      line.computeLineDistances();
      g.add(line);
      const l = tag(ov.axis.text, '#e9d9b8', 'zone-tag', () => {});
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
        H.s1.union(lifts(c) ? bb.translate(new THREE.Vector3(0, B.liftH, 0)) : bb);
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
    const sz = H.s0.getSize(new THREE.Vector3()), c = H.s0.getCenter(new THREE.Vector3());
    const ext = Math.max(sz.x, sz.z) / 2 + 3;
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
  async function openHouse(meta, def, bldId = null) {
    if (H && H.meta.id === meta.id) { showBuilding(bldId); return; }
    const token = ++loadToken;
    S.loading = true;
    S.loadingText = def.loading || 'Building…';
    emit();
    await new Promise((r) => setTimeout(r, 40));   // let the loading screen paint before the synchronous build
    if (token !== loadToken || !alive) return;

    if (W.on) stopWalk({ fly: false });
    unloadHouse();
    S.hiddenBld.clear();
    buildHouse(meta, def);
    fitEnvironment();
    applyPreset(Object.keys(def.presets)[0]);
    const target = H.single ? H.blds[0] : H.bldById[bldId] || null;
    setMode(target ? 'building' : 'site', target, { intro: true });
    S.loading = false;
    emit();
  }

  // ── Modes ──────────────────────────────────────────────────────────
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
    S.explode = intro ? 1 : 0;
    S.explodeTarget = S.explode;
    applyExplode();
    setSectionAxis(S.section.axis);
    updateOverlay();
    applyMaterials();
    if (intro) {
      const far = viewPose('iso', 1);
      camera.position.copy(far.target).addScaledVector(far.pos.clone().sub(far.target), 1.3);
      controls.target.copy(far.target);
      tween = null;
      const token = loadToken;
      setTimeout(() => { if (token !== loadToken) return; S.explodeTarget = 0; goView('iso', 2.6, 0); emit(); }, 450);
    } else goView('iso', 1.2);
    emit();
  }

  const enterBuilding = (id) => onNavigate(`#/${H.meta.id}/${id}`);
  const backToSite = () => { if (H && !H.single) onNavigate(`#/${H.meta.id}`); };

  function updateOverlay() {
    if (!H?.overlay) return;
    H.overlay.visible = !inBuilding() && (S.siteLogic || W.overlay);
    for (const l of H.overlay.userData.labels) l.visible = H.overlay.visible;
  }

  // ── Materials / display state ──────────────────────────────────────
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
      if (!inBuilding() && lifts(c)) op = Math.min(op, 1 - 0.8 * S.explode);
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
    updateEdges();
    updateVisibility();
    updateEmissive();
  }

  // Edge outlines are only needed for X-ray / Blueprint and for highlighting a selection, and
  // computing them is a large share of a house's build time, so each part gets them on first use.
  function ensureEdges(c) {
    if (c.edges.length) return;
    for (const m of c.meshes) {
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 28), c.edgeMat);
      edges.raycast = () => {};
      c.group.add(edges);
      c.edges.push(edges);
    }
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
      if (show) ensureEdges(c);
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
        B.label.visible = S.labels && !inBuilding() && !hideB && !W.on;
        B.label.element.classList.toggle('on', S.selBld === B.id);
      }
      for (const c of B.comps) {
        const mine = inBuilding() && B === cur;
        c.group.visible = !(mine && (S.hidden.has(c.id) || (isolating && S.selected !== c.id)));
        c.label.visible = S.labels && mine && c.group.visible && !hideB;
        c.label.element.classList.toggle('on', mine && S.selected === c.id);
      }
    }
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

  // ── Explode (building) / lift roofs (site) ─────────────────────────
  function applyExplode() {
    if (!H) return;
    for (const B of H.blds) for (const c of B.comps) {
      if (inBuilding() && B === cur) c.group.position.set(...c.explode).multiplyScalar(S.explode);
      else if (!inBuilding() && lifts(c)) c.group.position.set(0, B.liftH * S.explode, 0);
      else c.group.position.set(0, 0, 0);
    }
    if (!inBuilding()) applyMaterials();
    if (S.section.on) updateSection();
  }

  // ── Bounds used by camera and section ──────────────────────────────
  function activeBounds(ex) {
    const [a, b] = inBuilding() ? [cur.b0, cur.b1] : [H.s0, H.s1];
    return new THREE.Box3(a.min.clone().lerp(b.min, ex), a.max.clone().lerp(b.max, ex));
  }

  // ── Section ────────────────────────────────────────────────────────
  function sectionRange(axis) {
    const b0 = activeBounds(0), b1 = activeBounds(1);
    if (axis === 'y') {
      const sy = inBuilding() ? cur.def.sectionY : H.site.sectionY;
      return [0.2, +b1.max.y.toFixed(1), sy ?? b0.max.y / 3];
    }
    const lo = +(b0.min[axis] - 0.3).toFixed(1), hi = +(b0.max[axis] + 0.3).toFixed(1);
    return [lo, hi, +((b0.min[axis] + b0.max[axis]) / 2).toFixed(1)];
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
    const b = activeBounds(S.explode), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
    if (s.axis === 'x') { secHelper.rotation.y = Math.PI / 2; secHelper.scale.set(sz.z + 2, sz.y + 2, 1); secHelper.position.set(s.pos, c.y, c.z); }
    if (s.axis === 'z') { secHelper.scale.set(sz.x + 2, sz.y + 2, 1); secHelper.position.set(c.x, c.y, s.pos); }
    if (s.axis === 'y') { secHelper.rotation.x = -Math.PI / 2; secHelper.scale.set(sz.x + 2, sz.z + 2, 1); secHelper.position.set(c.x, s.pos, c.z); }
  }
  function setSectionAxis(axis) {
    S.section.axis = axis;
    if (!H) return;
    const [min, max, pos] = sectionRange(axis);
    Object.assign(S.section, { min, max, pos });
    updateSection();
  }

  // ── Lighting, time of day and theme ────────────────────────────────
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
    // The sky follows the time of day; the dark theme deepens it towards dusk.
    let top = mix('#394064', '#9cb9cd', Math.pow(el, 0.7)), bot = mix('#f1a46d', '#f1e9dc', k), gnd = '#a4937a';
    if (S.theme === 'dark') { top = mix(top, '#12151d', 0.74); bot = mix(bot, '#2b241d', 0.74); gnd = '#1f1a15'; }
    container.style.setProperty('--sky-top', top);
    container.style.setProperty('--sky-bot', bot);
    container.style.setProperty('--sky-ground', gnd);
    ground.material.color.set(S.theme === 'dark' ? '#3d3329' : '#8d7c63');
  }

  // ── Camera ─────────────────────────────────────────────────────────
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
  function viewPose(name, ex = S.explodeTarget) {
    const b = activeBounds(ex), sz = b.getSize(new THREE.Vector3()), c = b.getCenter(new THREE.Vector3());
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
    const radius = name === 'top' ? Math.hypot(sz.x, sz.z) / 2 : sz.length() / 2;
    const dist = (radius / Math.sin(fitFov() / 2)) * (name === 'top' ? 0.95 : 0.82);
    const T = name === 'top' ? new THREE.Vector3(c.x, 0, c.z) : new THREE.Vector3(c.x, b.min.y + sz.y * 0.4, c.z);
    return { pos: T.clone().addScaledVector(new THREE.Vector3(...VIEW_DIRS[name]).normalize(), dist), target: T };
  }
  function goView(name, dur = 1, ex) {
    if (!H) return;
    const v = viewPose(name, ex);
    flyTo(v.pos, v.target, dur);
    S.view = name;
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
  const focusBuilding = (id) => frameBox(H.bldById[id].b0.clone(), null);
  function fitAll() {
    root.updateMatrixWorld(true);
    const meshes = inBuilding() ? cur.comps.filter((c) => c.group.visible).flatMap((c) => c.meshes) : H.blds.filter((B) => B.group.visible).flatMap((B) => B.meshes);
    frameBox(boundsOf(meshes), null, false);
  }
  function dolly(f) {
    const off = camera.position.clone().sub(controls.target).multiplyScalar(f);
    flyTo(controls.target.clone().add(off), controls.target.clone(), 0.35);
  }

  // ── Picking ────────────────────────────────────────────────────────
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

  const pointer = { x: 0, y: 0, buttons: 0, inside: false, dirty: false };
  let downAt = null;
  const cvs = renderer.domElement;
  const notifyHover = (h) => { for (const l of hoverListeners) l(h); };
  cvs.addEventListener('pointerdown', (e) => { downAt = [e.clientX, e.clientY]; pointer.buttons = e.buttons; notifyHover(null); });
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
    if (id && pointer.inside && !W.on) {
      const item = inBuilding() ? cur.compById[id] : H.bldById[id];
      const r = container.getBoundingClientRect();
      notifyHover({ x: pointer.x - r.left, y: pointer.y - r.top, name: item.name, en: item.en });
    } else notifyHover(null);
  }

  // ── Selection ──────────────────────────────────────────────────────
  function select(id, { focus = false } = {}) {
    if (!H) return;
    id = id || null;
    if (inBuilding()) S.selected = id; else S.selBld = id;
    applyMaterials();
    if (id && focus) inBuilding() ? focusOn(id) : focusBuilding(id);
    emit();
  }
  const listItems = () => (inBuilding() ? cur.comps : H.blds);
  function step(d) {
    const list = listItems();
    const i = list.findIndex((c) => c.id === (inBuilding() ? S.selected : S.selBld));
    select(list[(i + d + list.length) % list.length].id, { focus: true });
  }
  function toggleHidden(id) {
    const set = inBuilding() ? S.hidden : S.hiddenBld;
    set.has(id) ? set.delete(id) : set.add(id);
    updateVisibility();
    emit();
  }

  // ── Materials ──────────────────────────────────────────────────────
  function applyPreset(k) {
    const p = H.def.presets[k];
    S.preset = k;
    S.colors = { ...p.colors };
    S.rough = p.rough;
    S.metal = { ...(p.metal || {}) };
    S.texOverride = { ...(p.tex || {}) };
    applyMaterials();
  }

  // ── Guided walk (site mode) ────────────────────────────────────────
  // A camera tour defined by `site.walk.stops`: each stop has title/local/text, a camera
  // pos/target (or a named `view`), optional `via` waypoints, buildings to highlight and
  // whether to show the site-logic overlay.
  const W = { on: false, i: 0, auto: false, arrive: 0, wait: 0, hi: new Set(), overlay: false };
  const stops = () => H?.site?.walk?.stops || [];

  function startWalk() {
    if (!H?.site?.walk || inBuilding()) return;
    S.selBld = null;
    S.explodeTarget = 0;
    W.on = true;
    W.auto = false;
    goStop(0);
  }
  function stopWalk({ fly = true } = {}) {
    if (!W.on) return;
    W.on = false;
    W.auto = false;
    W.hi.clear();
    W.overlay = false;
    if (!H) return;
    updateOverlay();
    applyMaterials();
    if (fly) goView('iso', 1.8);
    emit();
  }
  function goStop(i) {
    const list = stops();
    if (!W.on || i < 0 || i >= list.length) return;
    W.i = i;
    const st = list[i];
    W.hi = new Set(st.buildings || []);
    W.overlay = !!st.overlay;
    updateOverlay();
    applyMaterials();
    const pose = st.view ? viewPose(st.view, 0) : { pos: new THREE.Vector3(...st.pos), target: new THREE.Vector3(...st.target) };
    const via = (st.via || []).map((v) => new THREE.Vector3(...v));
    const dist = [camera.position, ...via, pose.pos].reduce((sum, p, k, a) => sum + (k ? p.distanceTo(a[k - 1]) : 0), 0);
    const dur = Math.min(4.5, Math.max(1.4, dist / 6));
    flyTo(pose.pos, pose.target, dur, via);
    W.arrive = performance.now() + dur * 1000;
    W.wait = Math.min(15000, Math.max(6000, st.text.length * 50));
    emit();
  }
  function walkNext() { if (W.i >= stops().length - 1) stopWalk(); else goStop(W.i + 1); }
  function setWalkAuto(on) {
    W.auto = on;
    if (on && !tween) W.arrive = performance.now();
    emit();
  }
  function tickWalk() {
    const now = performance.now();
    const p = W.auto ? Math.min(1, Math.max(0, (now - W.arrive) / W.wait)) : 0;
    for (const l of progressListeners) l(p);
    if (W.auto && !tween && p >= 1) {
      if (W.i >= stops().length - 1) setWalkAuto(false);
      else goStop(W.i + 1);
    }
  }

  // ── Export & screenshot ────────────────────────────────────────────
  const fileBase = () => (inBuilding() && !H.single ? `${H.meta.id}-${cur.id}` : H.meta.id);
  function exportMaterial(slot, name) {
    return new THREE.MeshStandardMaterial({
      name, color: new THREE.Color(S.colors[slot] || '#cccccc'),
      map: S.textures ? slotTexture(slot) : null,
      roughness: H.slotById[slot]?.glossy ? Math.max(0.2, S.rough - 0.35) : S.rough,
      metalness: S.metal[slot] || 0,
    });
  }
  async function exportModel({ format, onlyVisible = true, exploded = false }) {
    const blds = inBuilding() ? [cur] : H.blds.filter((B) => !onlyVisible || B.group.visible);
    root.updateMatrixWorld(true);
    return export3D(format, blds.flatMap((B) => B.comps), {
      onlyVisible, exploded,
      transform: (c) => (exploded ? c.group.matrixWorld : c.bld.group.matrixWorld).clone(),
      nameOf: (c) => (blds.length > 1 ? `${c.bld.name} · ${c.name}` : c.name),
      material: exportMaterial,
      slotName: (slot) => H.slotById[slot]?.label || slot,
      title: inBuilding() && !H.single ? `${H.meta.name} · ${cur.name}` : H.meta.name,
      filename: fileBase(),
    });
  }
  function screenshot() {
    renderer.render(scene, camera);
    const w = cvs.width, h = cvs.height;
    const out = document.createElement('canvas');
    out.width = w; out.height = h;
    const g = out.getContext('2d');
    const grd = g.createLinearGradient(0, 0, 0, h);
    if (S.style === 'blueprint') { grd.addColorStop(0, '#18385a'); grd.addColorStop(1, '#0b1a2b'); }
    else {
      const v = (n, d) => container.style.getPropertyValue(n) || d;
      grd.addColorStop(0, v('--sky-top', '#9cb9cd'));
      grd.addColorStop(0.58, v('--sky-bot', '#f1e9dc'));
      grd.addColorStop(1, v('--sky-ground', '#a4937a'));
    }
    g.fillStyle = grd;
    g.fillRect(0, 0, w, h);
    g.drawImage(cvs, 0, 0);
    const a = document.createElement('a');
    a.download = `${fileBase()}.png`;
    a.href = out.toDataURL('image/png');
    a.click();
  }

  // ── Snapshot for the UI ────────────────────────────────────────────
  function buildSnapshot() {
    const base = {
      theme: S.theme, loading: S.loading, loadingText: S.loadingText,
      style: S.style, roofOpacity: S.roofOpacity, siteLogic: S.siteLogic, labels: S.labels, autoRotate: S.autoRotate,
      explode: S.explodeTarget, view: S.view, focusMode: S.focusMode, textures: S.textures,
      section: { ...S.section },
      lighting: { time: S.time, exposure: renderer.toneMappingExposure, shadows: S.shadows },
    };
    if (!H) return { ...base, house: null };
    const site = !inBuilding();
    const items = listItems();
    const groups = (site ? H.site.categories : cur.def.categories)
      .map((g) => ({
        id: g.id, label: g.label, local: g.local, color: g.color,
        items: items.filter((it) => (site ? it.zone : it.cat) === g.id).map((it) => ({ id: it.id, name: it.name, en: it.en, alias: it.alias })),
      }))
      .filter((g) => g.items.length);
    const selId = site ? S.selBld : S.selected;
    const item = selId ? (site ? H.bldById[selId] : cur.compById[selId]) : null;
    const cat = item ? (site ? H.zoneById[item.zone] : cur.catById[item.cat]) : null;
    const list = stops();
    return {
      ...base,
      house: {
        id: H.meta.id, name: H.meta.name, single: H.single, about: H.def.about,
        hasWalk: list.length > 0, hasOverlay: !!H.overlay,
      },
      mode: S.mode,
      building: inBuilding() && !H.single
        ? { id: cur.id, name: cur.name, en: cur.en, alias: cur.alias, desc: cur.desc, fn: cur.fn, meaning: cur.meaning }
        : null,
      buildings: H.single ? [] : H.blds.map((B) => ({ id: B.id, name: B.name, en: B.en, zone: B.zone })),
      zones: H.site.categories || [],
      groups, total: items.length,
      selected: selId,
      hidden: [...(site ? S.hiddenBld : S.hidden)],
      card: item && {
        id: item.id, kind: site ? 'building' : 'part',
        name: item.name, en: item.en, alias: item.alias, desc: item.desc, fn: item.fn, meaning: item.meaning, interp: !!item.interp, specs: item.specs,
        cat: cat ? { label: cat.label, local: cat.local, color: cat.color } : null,
        index: items.indexOf(item) + 1, total: items.length,
      },
      materials: {
        preset: S.preset, colors: { ...S.colors }, rough: S.rough,
        presets: Object.entries(H.def.presets).map(([id, p]) => ({ id, label: p.label })),
        slots: H.def.slots.filter((s) => s.ui !== false).map((s) => ({ id: s.id, label: s.label })),
      },
      walk: W.on
        ? { on: true, index: W.i, total: list.length, auto: W.auto, stop: { title: list[W.i].title, local: list[W.i].local, text: list[W.i].text }, titles: list.map((s) => s.title) }
        : { on: false },
    };
  }

  // ── Loop ───────────────────────────────────────────────────────────
  const clock = new THREE.Clock();
  function frame() {
    if (!alive) return;
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
  requestAnimationFrame(frame);

  const ro = new ResizeObserver(() => {
    const [w, h] = size();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    labelRenderer.setSize(w, h);
  });
  ro.observe(container);
  setTime(S.time);

  // ── Public API ─────────────────────────────────────────────────────
  const set = (fn) => (...args) => { fn(...args); emit(); };
  return {
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    getSnapshot,
    onHover: (fn) => { hoverListeners.add(fn); return () => hoverListeners.delete(fn); },
    onProgress: (fn) => { progressListeners.add(fn); return () => progressListeners.delete(fn); },

    openHouse,
    isLoaded: (id) => H?.meta.id === id,
    enterBuilding, backToSite,

    // Camera
    goView: set((v) => goView(v)),
    zoomIn: () => dolly(0.72),
    zoomOut: () => dolly(1.38),
    fit: () => H && fitAll(),
    setAutoRotate: set((v) => { S.autoRotate = v; controls.autoRotate = v; }),

    // Selection
    select: (id, opts) => select(id, opts),
    step,
    focusSelected: () => { if (!H) return; const id = inBuilding() ? S.selected : S.selBld; if (id) inBuilding() ? focusOn(id) : focusBuilding(id); },
    toggleHidden,
    showAll: set(() => { (inBuilding() ? S.hidden : S.hiddenBld).clear(); updateVisibility(); }),
    setFocusMode: set((m) => { S.focusMode = m; applyMaterials(); }),

    // Explode / lift roofs
    setExplode: set((v) => { S.explodeTarget = v; }),
    explodeAll: set((on) => { S.explodeTarget = on ? 1 : 0; goView('iso', 1.2); }),

    // Display
    setStyle: set((v) => { S.style = v; applyMaterials(); }),
    cycleStyle: set(() => { S.style = STYLES[(STYLES.indexOf(S.style) + 1) % STYLES.length]; applyMaterials(); }),
    setRoofOpacity: set((v) => { S.roofOpacity = v; applyMaterials(); }),
    setSiteLogic: set((v) => { S.siteLogic = v; updateOverlay(); }),
    setLabels: set((v) => { S.labels = v; updateVisibility(); }),

    // Section
    // Changing the axis resets the range and position, and switches the cut on.
    setSection: set(({ axis, ...rest }) => {
      if (axis && axis !== S.section.axis) { setSectionAxis(axis); S.section.on = true; }
      Object.assign(S.section, rest);
      updateSection();
    }),

    // Materials
    setPreset: set((k) => applyPreset(k)),
    setColor: set((slot, hex) => { S.colors[slot] = hex; S.preset = 'custom'; applyMaterials(); }),
    setRough: set((v) => { S.rough = v; applyMaterials(); }),
    setTextures: set((v) => { S.textures = v; applyMaterials(); }),

    // Lighting & theme
    setTime: set((v) => setTime(v)),
    setExposure: set((v) => { renderer.toneMappingExposure = v; }),
    setShadows: set((v) => { S.shadows = v; applyMaterials(); }),
    setTheme: set((t) => { S.theme = t; setTime(S.time); }),

    // Walk
    startWalk, stopWalk: () => stopWalk(),
    walkGo: (i) => goStop(i), walkNext, walkPrev: () => goStop(W.i - 1),
    setWalkAuto,

    // Files
    exportModel, screenshot,

    dispose() {
      alive = false;
      ro.disconnect();
      unloadHouse();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labelRenderer.domElement.remove();
    },
  };
}
