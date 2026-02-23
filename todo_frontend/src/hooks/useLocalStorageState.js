import { useEffect, useState } from "react";

// PUBLIC_INTERFACE
export function useLocalStorageState(key, initialValue) {
  /** useState that persists to localStorage under `key`. */
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return initialValue;
      return JSON.parse(raw);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Ignore quota / privacy mode errors; app should still work in-memory.
    }
  }, [key, state]);

  return [state, setState];
}
