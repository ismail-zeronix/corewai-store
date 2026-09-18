"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/lib/placeholder-data";
import { CartToast, type CartNotification } from "@/components/cart/CartToast";

export interface CartItem {
  id: string;
  variantId?: string;
  slug: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "corewai-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<CartNotification | null>(null);
  const notificationId = useRef(0);
  const dismissNotification = useCallback(() => setNotification(null), []);
  // Exposed to consumers as `isHydrated` so pages can hold off on rendering
  // an "empty cart" state until localStorage has actually been read — otherwise
  // returning visitors briefly see their real cart flash to empty on first paint.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount to avoid an SSR/client markup mismatch.
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) {
        const valid = parsed.filter((item): item is CartItem => item !== null && typeof item === "object" &&
          ["id", "slug", "name", "image", "brand"].every((key) => typeof item[key] === "string") &&
          Number.isFinite(item.price) && item.price >= 0 && Number.isSafeInteger(item.quantity) && item.quantity > 0);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(valid);
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Keep the cart usable in this tab when browser storage is unavailable.
    }
  }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        );
      }
      return [
        ...current,
        {
          id: product.id,
          variantId: product.variantId,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          image: product.image,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          quantity,
        },
      ];
    });
    setNotification({ id: ++notificationId.current, name: product.name, quantity });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) return current.filter((item) => item.id !== id);
      return current.map((item) => (item.id === id ? { ...item, quantity } : item));
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, itemCount, subtotal, isHydrated: hydrated, addItem, removeItem, updateQuantity, clear }),
    [items, itemCount, subtotal, hydrated, addItem, removeItem, updateQuantity, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div role="status" aria-live="polite" aria-atomic="true"
        className="pointer-events-none fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-[80] mx-auto max-w-sm sm:left-auto sm:right-6 sm:mx-0 sm:w-96">
        {notification && <CartToast key={notification.id} notification={notification} onDismiss={dismissNotification} />}
      </div>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
