"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny external store with optional localStorage persistence.
 *
 * Only NON-SENSITIVE data is persisted (cart line ids/quantities, wishlist ids,
 * recently viewed ids, a demo sign-in flag). Never persist personal details,
 * addresses, tokens or payment data in browser storage.
 */
export interface Store<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (cb: () => void) => () => void;
  initial: T;
}

export function createStore<T>(
  initial: T,
  persist?: { key: string; validate: (raw: unknown) => T | null },
): Store<T> {
  let state = initial;
  let loaded = !persist;
  const listeners = new Set<() => void>();

  const load = () => {
    if (loaded || typeof window === "undefined" || !persist) return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(persist.key);
      if (raw) {
        const v = persist.validate(JSON.parse(raw));
        if (v !== null) state = v;
      }
    } catch {
      /* storage unavailable or corrupt: fall back to initial */
    }
    window.addEventListener("storage", (e) => {
      if (e.key !== persist.key) return;
      try {
        const v = e.newValue ? persist.validate(JSON.parse(e.newValue)) : initial;
        if (v !== null) {
          state = v;
          listeners.forEach((l) => l());
        }
      } catch {
        /* ignore */
      }
    });
  };

  return {
    initial,
    get: () => {
      load();
      return state;
    },
    set: (next) => {
      load();
      state = typeof next === "function" ? (next as (p: T) => T)(state) : next;
      if (persist && typeof window !== "undefined") {
        try {
          window.localStorage.setItem(persist.key, JSON.stringify(state));
        } catch {
          /* quota exceeded or private mode */
        }
      }
      listeners.forEach((l) => l());
    },
    subscribe: (cb) => {
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
  };
}

/** Subscribe to a store. The server render (and hydration) always uses `initial`. */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}

const noopSubscribe = () => () => {};
/** True once the component has hydrated on the client. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
