// Footer links. About and Contribute open as dialogs over the 3D view; Terms & privacy is a page.
export const SITE_LINKS = [
  { id: 'about', short: { en: 'About', id: 'Tentang' }, kind: 'dialog' },
  { id: 'terms', short: { en: 'Terms & privacy', id: 'Ketentuan & privasi' }, kind: 'page' },
  { id: 'contribute', short: { en: 'Contribute', id: 'Kontribusi' }, kind: 'dialog' },
];
export const linkById = (id) => SITE_LINKS.find((l) => l.id === id);
