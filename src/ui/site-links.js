// Footer links. About and Contribute open as dialogs over the 3D view; Terms & privacy is a page.
export const SITE_LINKS = [
  { id: 'about', short: 'About', title: 'About', kind: 'dialog' },
  { id: 'terms', short: 'Terms & privacy', title: 'Terms & privacy', kind: 'page' },
  { id: 'contribute', short: 'Contribute', title: 'Contribute', kind: 'dialog' },
];
export const linkById = (id) => SITE_LINKS.find((l) => l.id === id);
