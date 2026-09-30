// App shell: hash routing between the house directory (#/) and a house viewer (#/<id>),
// plus the house switcher behind the title while a house is open.
import { HOUSES, ISLANDS, houseById } from './houses/index.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const SITE = 'Rumah Nusantara';

// The directory landing page (#/) stays hidden until there are enough houses in 3D (roughly 10–15).
// While it's off, the site opens straight into DEFAULT_HOUSE and the title switcher is the only way to browse.
const SHOW_DIRECTORY = false;
const DEFAULT_HOUSE = 'joglo';

const svgArt = (h, cls = '') => `<svg class="${cls}" viewBox="0 0 120 72" fill="currentColor" aria-hidden="true">${h.art}</svg>`;
const matches = (h, q) => !q || `${h.name} ${h.local} ${h.province} ${h.people} ${h.island}`.toLowerCase().includes(q);
const readyFirst = (a, b) => (a.status === 'ready' ? 0 : 1) - (b.status === 'ready' ? 0 : 1);

// ── Directory ────────────────────────────────────────────────────────
const dir = { island: 'all', q: '', only3d: false };

function renderDirectory() {
  const ready = HOUSES.filter((h) => h.status === 'ready').length;
  $('#dirStats').textContent = `${ready} in 3D · ${HOUSES.length} houses · ${ISLANDS.length} island groups`;

  const chips = $('#islandChips');
  if (!chips.childElementCount) {
    for (const id of ['all', ...ISLANDS]) {
      const b = document.createElement('button');
      b.className = 'fchip';
      b.dataset.island = id;
      b.textContent = id === 'all' ? 'All islands' : id;
      chips.append(b);
    }
  }
  $$('.fchip', chips).forEach((b) => b.classList.toggle('on', b.dataset.island === dir.island));

  const grid = $('#houseGrid');
  grid.replaceChildren();
  const q = dir.q.trim().toLowerCase();
  const list = HOUSES.filter((h) => (dir.island === 'all' || h.island === dir.island) && matches(h, q) && (!dir.only3d || h.status === 'ready'))
    .sort(readyFirst);
  for (const h of list) {
    const ready = h.status === 'ready';
    const card = document.createElement(ready ? 'a' : 'div');
    card.className = `card ${ready ? 'ready' : 'soon'}`;
    if (ready) card.href = `#/${h.id}`;
    card.style.setProperty('--tint', `var(--isl-${ISLANDS.indexOf(h.island)})`);
    card.innerHTML = `
      <div class="card-art">${svgArt(h)}<span class="badge"></span></div>
      <div class="card-body">
        <span class="card-island"></span>
        <h3></h3>
        <p class="card-meta"></p>
        <p class="card-blurb"></p>
      </div>`;
    $('.badge', card).textContent = ready ? 'Explore in 3D' : 'Coming soon';
    $('.card-island', card).textContent = h.island;
    $('h3', card).textContent = h.name;
    $('.card-meta', card).textContent = `${h.province} · ${h.people}`;
    $('.card-blurb', card).textContent = h.blurb;
    grid.append(card);
  }
  $('#dirEmpty').hidden = list.length > 0;
}

$('#islandChips').addEventListener('click', (e) => {
  const b = e.target.closest('.fchip');
  if (!b) return;
  dir.island = b.dataset.island;
  renderDirectory();
});
$('#dirSearch').addEventListener('input', (e) => { dir.q = e.target.value; renderDirectory(); });
$('#only3d').addEventListener('change', (e) => { dir.only3d = e.target.checked; renderDirectory(); });

// ── House switcher (title button inside the viewer) ─────────────────
const switcher = $('#switcher');
const switchBtn = $('#houseSwitch');
let current = null;

function renderSwitcher(filter = '') {
  const list = $('#hsList');
  list.replaceChildren();
  const q = filter.trim().toLowerCase();
  for (const island of ISLANDS) {
    const items = HOUSES.filter((h) => h.island === island && matches(h, q)).sort(readyFirst);
    if (!items.length) continue;
    const head = document.createElement('div');
    head.className = 'hs-island';
    head.textContent = island;
    list.append(head);
    for (const h of items) {
      const ready = h.status === 'ready';
      const row = document.createElement(ready ? 'a' : 'div');
      row.className = `hs-row ${ready ? 'ready' : 'soon'}${h.id === current ? ' current' : ''}`;
      if (ready) row.href = `#/${h.id}`;
      row.innerHTML = `${svgArt(h, 'hs-art')}<span class="hs-text"><b></b><small></small></span><span class="hs-tag"></span>`;
      $('b', row).textContent = h.name;
      $('small', row).textContent = `${h.province} · ${h.people}`;
      $('.hs-tag', row).textContent = h.id === current ? 'Viewing' : ready ? '3D' : 'Soon';
      list.append(row);
    }
  }
  if (!list.childElementCount) {
    const p = document.createElement('p');
    p.className = 'hs-empty';
    p.textContent = 'No houses match.';
    list.append(p);
  }
}

function openSwitcher(open = true) {
  switcher.classList.toggle('hidden', !open);
  switchBtn.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('switcher-open', open);
  if (open) {
    $('#hsSearch').value = '';
    renderSwitcher();
    setTimeout(() => $('#hsSearch').focus(), 30);
  }
}
switchBtn.addEventListener('click', (e) => { e.stopPropagation(); openSwitcher(switcher.classList.contains('hidden')); });
$('#hsSearch').addEventListener('input', (e) => renderSwitcher(e.target.value));
$('#hsSearch').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { const first = $('.hs-row.ready:not(.current)', switcher); if (first) location.hash = first.getAttribute('href'); }
});
switcher.addEventListener('click', (e) => { if (e.target.closest('a')) openSwitcher(false); });
document.addEventListener('pointerdown', (e) => {
  if (!switcher.classList.contains('hidden') && !switcher.contains(e.target) && !switchBtn.contains(e.target)) openSwitcher(false);
});
addEventListener('keydown', (e) => { if (e.key === 'Escape' && !switcher.classList.contains('hidden')) { e.stopPropagation(); openSwitcher(false); } }, true);

function setHeader(h) {
  $('#houseArt').innerHTML = h.art;
  $('#houseName').textContent = h.name;
  $('#houseSub').textContent = `${h.province} · ${h.people}`;
}

// ── Routing ──────────────────────────────────────────────────────────
let viewer = null;
async function route() {
  const id = location.hash.replace(/^#\/?/, '');
  const h = houseById(id);
  openSwitcher(false);
  if ((!h || h.status !== 'ready') && !SHOW_DIRECTORY) {
    history.replaceState(null, '', `#/${DEFAULT_HOUSE}`);
    return route();
  }
  if (!h || h.status !== 'ready') {
    if (id) history.replaceState(null, '', '#/');
    current = null;
    viewer?.closeViewer();
    document.body.classList.add('mode-dir');
    document.title = `${SITE} · Traditional houses of Indonesia`;
    renderDirectory();
    $('#loading').classList.add('done');
    return;
  }
  document.body.classList.remove('mode-dir');
  document.title = `${h.name} · ${SITE}`;
  setHeader(h);
  if (current === id) return;
  current = id;
  $('#loading').classList.remove('done');
  document.body.classList.add('mode-viewer');
  const [v, mod] = await Promise.all([viewer || import('./viewer/viewer.js'), h.load()]);
  viewer = v;
  if (current !== id) return;
  await viewer.openHouse(h, mod.default);
}
$('.hs-back').hidden = !SHOW_DIRECTORY;
addEventListener('hashchange', route);
route();
