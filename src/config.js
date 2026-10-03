// Site-wide settings.
export const SITE = 'rumahadat.id';
export const CREDIT = { name: 'Asyrof', handle: 'nurasyrof', url: 'https://nurasyrof.com' };
export const DONATE_URL = 'https://buymeacoffee.com/nurasyrof';
export const REPO_URL = 'https://github.com/nurasyrof/joglo';

// Where Contribute form messages go. `endpoint` takes a JSON POST (e.g. a Formspree form URL);
// without one, the form falls back to opening the visitor's email app addressed to `email`.
export const CONTACT = { endpoint: 'https://formspree.io/f/mvkgeabw', email: '' };

// The directory landing page (#/) stays hidden until there are enough houses in 3D (roughly 10–15).
// While it's off, the site opens straight into DEFAULT_HOUSE and the title switcher is the way to browse.
export const SHOW_DIRECTORY = false;
export const DEFAULT_HOUSE = 'joglo';
