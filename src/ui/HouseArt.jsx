// A house silhouette from the registry (static SVG markup, 120 × 72).
export function HouseArt({ art, className }) {
  return <svg viewBox="0 0 120 72" fill="currentColor" aria-hidden="true" className={className} dangerouslySetInnerHTML={{ __html: art }} />;
}
