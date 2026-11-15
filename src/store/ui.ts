"use client";

import { createStore, useStore } from "./create-store";
import type { Order } from "@/lib/types";

export interface Toast {
  id: number;
  message: string;
  tone?: "default" | "success" | "error";
}

interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewId: string | null;
  toasts: Toast[];
}

export const uiStore = createStore<UIState>({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickViewId: null,
  toasts: [],
});

const patch = (p: Partial<UIState>) => uiStore.set((s) => ({ ...s, ...p }));
let toastId = 0;

export const ui = {
  openCart: () => patch({ cartOpen: true, searchOpen: false, menuOpen: false, quickViewId: null }),
  closeCart: () => patch({ cartOpen: false }),
  openSearch: () => patch({ searchOpen: true, cartOpen: false, menuOpen: false }),
  closeSearch: () => patch({ searchOpen: false }),
  openMenu: () => patch({ menuOpen: true }),
  closeMenu: () => patch({ menuOpen: false }),
  quickView: (id: string | null) => patch({ quickViewId: id }),
  closeAll: () => patch({ cartOpen: false, searchOpen: false, menuOpen: false, quickViewId: null }),
  toast(message: string, tone: Toast["tone"] = "default") {
    const id = ++toastId;
    uiStore.set((s) => ({ ...s, toasts: [...s.toasts.slice(-2), { id, message, tone }] }));
    setTimeout(() => uiStore.set((s) => ({ ...s, toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
  },
};

export const useUI = () => useStore(uiStore);

/* -------- Demo session (NOT authentication) -------- */
// Persists only a boolean flag. No credentials, tokens or personal data.
export const sessionStore = createStore<{ signedIn: boolean }>(
  { signedIn: false },
  {
    key: "rk.demo-session.v1",
    validate: (raw) =>
      raw && typeof raw === "object" && typeof (raw as { signedIn?: unknown }).signedIn === "boolean"
        ? { signedIn: (raw as { signedIn: boolean }).signedIn }
        : null,
  },
);
export const useSession = () => useStore(sessionStore);

/* -------- Last demo order (memory only, never persisted) -------- */
export const lastOrderStore = createStore<Order | null>(null);
export const useLastOrder = () => useStore(lastOrderStore);
