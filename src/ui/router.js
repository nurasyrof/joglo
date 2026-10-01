// Hash routing: #/<house> opens a house, #/<house>/<building> one building of a compound.
import { useEffect, useState } from 'react';

const parse = () => {
  const [house = '', building = null] = location.hash.replace(/^#\/?/, '').split('/');
  return { house, building };
};

export function useHashRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => setRoute(parse());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);
  return route;
}

export const navigate = (hash) => { if (location.hash !== hash) location.hash = hash; };
export const replaceRoute = (hash) => history.replaceState(null, '', hash);
