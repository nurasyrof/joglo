// English / Bahasa Indonesia. The URL decides the language: Indonesian pages live under /id.
// A visitor's first landing on an English URL is sent to /id when their saved choice or their
// browser says Indonesian (the inline script in index.html does this before the app starts).
//
// Interface text is written in place as a pair: t('Guided walk', 'Jelajah terpandu').
// House content uses { en, id } objects wherever a field is translated; tx() picks the language.
// href('/joglo') gives a link in the current language ('/joglo' or '/id/joglo').
import { createContext, useContext, useEffect } from 'react';
import { tx } from '@/lib/i18n.js';
import { navigate, neutralPath, pathFor, useRoute } from './router.js';

export { tx };

export const LANGS = [
  { id: 'id', label: 'Bahasa Indonesia', short: 'ID' },
  { id: 'en', label: 'English', short: 'EN' },
];
export const LANG_KEY = 'lang';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const { lang } = useRoute();
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => {
    try { localStorage.setItem(LANG_KEY, l); } catch { /* storage unavailable */ }
    navigate(pathFor(l, neutralPath(location.pathname)) + location.search, { replace: true });
  };
  const value = {
    lang, setLang,
    t: (en, id) => (lang === 'id' ? id : en),
    tx: (v) => tx(v, lang),
    href: (path) => pathFor(lang, path),
  };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
