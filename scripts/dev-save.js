// Vite plugin (dev server only): lets the dev-only share-image and icon generator
// (src/dev/og.js) save files into public/og and public/. Not part of the production build.
import fs from 'node:fs';
import path from 'node:path';

const ALLOWED = /^(og\/[\w-]+\.(jpg|png)|(icon-\d+|apple-touch-icon|favicon-\d+)\.png)$/;

export function devSave() {
  return {
    name: 'dev-save',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save', (req, res) => {
        const rel = new URL(req.url, 'http://local').searchParams.get('path') || '';
        if (req.method !== 'POST' || !ALLOWED.test(rel)) { res.statusCode = 400; res.end('bad request'); return; }
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', () => {
          const file = path.join(server.config.root, 'public', rel);
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, Buffer.concat(chunks));
          res.end(`saved ${rel}`);
        });
      });
    },
  };
}
