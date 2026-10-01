// React access to the 3D engine and its state snapshots.
import { createContext, useContext, useSyncExternalStore } from 'react';

export const EngineContext = createContext(null);
const noop = () => () => {};
const none = () => null;

export function useEngineSnapshot(engine) {
  return useSyncExternalStore(engine ? engine.subscribe : noop, engine ? engine.getSnapshot : none);
}

// { engine, s } where s is the latest snapshot.
export const useEngine = () => useContext(EngineContext);
