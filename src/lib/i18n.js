// A content value in the given language: plain strings (and anything else) pass through,
// { en, id } objects resolve to that language, falling back to English.
export function tx(v, lang) {
  if (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v) return v[lang] ?? v.en;
  return v;
}
