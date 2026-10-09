# rumahadat.id

An interactive 3D directory of Indonesia's traditional houses (rumah adat), built with Three.js. Live at [rumahadat.id](https://rumahadat.id). Each house can be exploded, cut through, restyled and downloaded, and every part explains what it is and what it means.

Made by [nurasyrof](https://nurasyrof.com).

## Run locally

Built with Vite, React, Tailwind CSS and [shadcn/ui](https://ui.shadcn.com); the 3D engine is plain Three.js.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. `npm run build` writes the static site to `dist/`.

URLs are real paths: `/joglo` opens a house, `/joglo/dalem` one building of a compound, and Indonesian pages live under `/id` (`/id/joglo`). Old `#/…` links are converted on load. The home page (`/`) shows the default house; the directory landing page is built but switched off until there are 10–15 houses in 3D: set `SHOW_DIRECTORY` in `src/config.js` to launch it.

Footer links: **About** and **Contribute** open as dialogs (`/about`, `/contribute`); **Terms & privacy** is a page (`/terms`). Contribute form messages go to `CONTACT.endpoint` in `src/config.js` (any form service that accepts a JSON POST, such as Formspree), or to an email address via `mailto:` if only `CONTACT.email` is set.

**Deploying (Cloudflare):** build command `npm run build`, output directory `dist`.

## Structure

```
index.html              Vite entry
src/
  main.jsx · App.jsx    React entry, theme provider, routing
  config.js             site name, credit, directory flag, default house
  index.css             Tailwind + shadcn theme tokens (light default, dark)
  components/ui/        shadcn/ui components (generated, safe to edit)
  ui/                   app UI: header, panels, cards, walk, dock, directory
  engine/               headless 3D engine (Three.js), no UI code
    engine.js           scene, camera, picking, modes, walk; exposes actions + snapshots
    materials.js        procedural textures + material factory
    exporter.js         GLB / OBJ / STL / USDZ download
  houses/
    index.js            registry: every house, its metadata and silhouette
    joglo/              a compound: several buildings on one site
    joglo-pencu/        a Kudus house plot: the omah, pawon, pekiwan and sisir around a yard
    rumah-gadang/       a compound: house, four rangkiang, surau and yard
    uma-mbatangu/       a village: clan houses around a plaza of stone tombs
    pekarangan-bali/    a Balinese compound laid out by the Sanga Mandala
    tongkonan/          a Toraja row of houses facing their rice barns, and the rante
  lib/
    geometry.js · kit.js  procedural building blocks
    utils.js            shadcn `cn` helper
```

The engine never touches the page UI. React subscribes to its state with `useSyncExternalStore` and calls its actions (`select`, `setStyle`, `setSection`, `startWalk`…). Labels in the 3D scene are the only DOM the engine creates.

Light mode is the default; the theme menu offers light, dark and system, and the 3D sky follows it.

## Search engines and link previews

- **Per-page tags:** `src/seo.js` describes every page (title, description, canonical, English/Indonesian alternates, Open Graph and X cards, schema.org data). At build time `scripts/prerender-meta.js` writes one HTML file per page and language (`joglo.html`, `id/joglo.html`, `joglo/dalem.html`…) with those tags filled in, plus `sitemap.xml`; in the browser `src/ui/page-meta.js` keeps the head in step as you navigate. New houses and buildings are picked up automatically.
- **Static files** in `public/`: `icon.svg` (the source icon), `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `site.webmanifest`, `robots.txt`, and the share images in `og/`.
- **Regenerating images** (dev server only, never in the production build): open `http://localhost:5173/<house>?og=house` (and `/id/<house>?og=house`) in a 1200 × 630 window to render that house's share image into `public/og/`; `/?og=home` and `/id?og=home` render the home card; `/?icons=1` renders the PNG icons from `icon.svg` (then rebuild `favicon.ico` from them). Camera distance per house is set in `src/dev/og.js`.

## Languages

The site is in English and Bahasa Indonesia. The first visit follows the browser's language; the toolbar's **ID / EN** button switches it, and the choice is saved.

- **Interface text** is written in place as a pair: `t('Guided walk', 'Jelajah terpandu')` (from `useLang()` in `src/ui/lang.jsx`).
- **House content**: any text field can be a plain string (same in both languages, e.g. local names like `Pendapa`) or `{ en: '…', id: '…' }`. This applies to `en`, `desc`, `fn`, `meaning`, `specs` items, `about` paragraphs, walk stops, zone and category labels, slot and preset labels. The engine resolves it in the current language, so switching is instant.
- Spec badges use a decimal comma in Indonesian automatically (`16.6 m` → `16,6 m`).
- When you change a text, change both languages.

## Houses, sites and buildings

A house is either **a single building** or **a site** (a compound) with several buildings.

- **Single building**: `index.js` exports `build`, `parts`, `categories`, `slots`, `presets`, `about`, `views` and `sectionY`. It opens straight into building view. (No house uses this at the moment, but it is still supported.)
- **Site**: `index.js` exports `slots`, `presets`, `about` and a `site` with `buildings`, `categories` (zones), `views`, `sectionY` and an optional `overlay`. Each building entry has `id`, `name`, `zone`, `at: [x, z]`, `rot`, its card text (`desc`, `fn`, `meaning`, `specs`) and a `def` with `build`, `parts`, `categories`, `views` and `sectionY`. Example: `joglo`.

In a site, the viewer opens on the whole compound (`/joglo`). Click a building for its card, and **Enter** (or double-click) to open its anatomy (`/joglo/dalem`). Roofs lift and fade in site view, and the overlay draws the zones and axis. Parts in the `roof` category are the ones that lift.

A site can also have a **guided walk** (`site.walk.stops`). Each stop has a `title`, `local` subtitle and `text`, a camera `pos` and `target` in site coordinates (or a named `view` such as `'top'`), and optionally `via` waypoints to steer the camera through doorways, `buildings` to highlight (use only for views from outside) and `overlay: true` to show the site-logic overlay.

## Adding a house

1. **List it** in `src/houses/index.js` with its metadata and a 120 × 72 SVG silhouette. Leave `status: 'soon'` until the model is ready.
2. **Create `src/houses/<id>/`** as a single building or a site (see above). Every `build()` returns `{ parts, counts }`: use `partStore()` from `lib/geometry.js` and add geometry per part and material slot, e.g. `P('tiang').add('wood', …)`. Every part id needs an entry in the building's `parts` with `explode`, `anchor`, `desc`, `fn`, `meaning` and `specs` (specs can use `{count}` placeholders filled from `counts`).
3. **Switch it on** by setting `status: 'ready'` and `load: () => import('./<id>/index.js')` in the registry.

The camera views, section ranges and shadows are calculated from each model's size, so nothing in the viewer needs changing. Loading houses modelled in Blender (GLB with mesh names matching part ids) isn't supported yet; it would need a small loader that returns the same `{ parts }` shape as `build()`.

Check part names and descriptions against published sources before switching a house on. Each house has a review sheet in `docs/content-review/` recording what has been checked and against which source. A `meaning` that is our own reading rather than sourced gets `interp: true` on the part, and the info card labels it **Interpretation**.

## Licence

Two licences, see [LICENSE](LICENSE):

- **House models and content** (`src/houses/`, and every model exported from them): [CC BY-NC 4.0](src/houses/LICENSE). Free to share and adapt with credit, but not for commercial use without permission.
- **Everything else** (engine, UI, geometry helpers): MIT.
