// English / Bahasa Indonesia. The choice is saved per browser; the first visit follows the browser's
// language (Indonesian browsers get Indonesian, everyone else English).
//
// Interface text is written in place as a pair: t('Guided walk', 'Jelajah terpandu').
// House content uses { en, id } objects wherever a field is translated; tx() picks the language.
import { createContext, useContext, useEffect, useState } from 'react';
import { tx } from '@/lib/i18n.js';

export { tx };

export const LANGS = [
  { id: 'id', label: 'Bahasa Indonesia', short: 'ID' },
  { id: 'en', label: 'English', short: 'EN' },
];
const KEY = 'lang';

export function detectLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'id') return saved;
  } catch { /* storage unavailable */ }
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en'];
  return prefs.some((l) => /^(id|ms)\b/i.test(l)) ? 'id' : 'en';
}


const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(detectLang);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch { /* storage unavailable */ }
  };
  const value = { lang, setLang, t: (en, id) => (lang === 'id' ? id : en), tx: (v) => tx(v, lang) };
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
