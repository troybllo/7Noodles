"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addItem, parseLines, removeItem, setQuantity, type CartLine } from "./cart";

/** Bumped if the stored shape ever changes, so an old cart is discarded rather than misread. */
const STORAGE_KEY = "seven-noodles:cart:v1";
const EMPTY: CartLine[] = [];

let lines: CartLine[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    lines = parseLines(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    lines = EMPTY;
  }
}

function commit(next: CartLine[]) {
  lines = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private windows and full storage still get a working cart for this visit.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);

  // Another tab changing the cart updates this one.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      lines = parseLines(JSON.parse(event.newValue ?? "[]"));
    } catch {
      lines = EMPTY;
    }
    listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

type CartContextValue = {
  lines: CartLine[];
  add: (slug: string, quantity?: number) => void;
  set: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  /** Whether the cart drawer is open. */
  open: boolean;
  setOpen: (open: boolean) => void;
  /** The last dish added, for the confirmation note. Cleared when read out. */
  lastAdded: { slug: string; at: number } | null;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * The cart, kept in this browser. The same lines are read by the nav badge,
 * the drawer, the order page and checkout.
 *
 * Stored in localStorage and shared across tabs. On the server, and before the
 * browser store has been read, the cart is empty, so nothing about it is
 * rendered into the static HTML.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const current = useSyncExternalStore(
    subscribe,
    () => {
      load();
      return lines;
    },
    () => EMPTY,
  );
  const [open, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null);

  const add = useCallback((slug: string, quantity = 1) => {
    commit(addItem(lines, slug, quantity));
    setLastAdded({ slug, at: Date.now() });
  }, []);
  const set = useCallback((slug: string, quantity: number) => {
    commit(setQuantity(lines, slug, quantity));
  }, []);
  const remove = useCallback((slug: string) => commit(removeItem(lines, slug)), []);
  const clear = useCallback(() => commit(EMPTY), []);

  const value = useMemo(
    () => ({ lines: current, add, set, remove, clear, open, setOpen, lastAdded }),
    [current, add, set, remove, clear, open, lastAdded],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
