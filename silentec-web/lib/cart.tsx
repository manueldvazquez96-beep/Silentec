'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { api, CartItem, CartResponse } from './api';
import { useAuth } from './auth';

interface CartState {
  items: CartItem[];
  subtotal: number;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (producto_id: number, cantidad: number) => Promise<void>;
  updateItem: (producto_id: number, cantidad: number) => Promise<void>;
  removeItem: (producto_id: number) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartState>({
  items: [], subtotal: 0, loading: false,
  refresh: async () => {}, addItem: async () => {},
  updateItem: async () => {}, removeItem: async () => {}, clear: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

  function apply(r: CartResponse) {
    setItems(r.items);
    setSubtotal(r.subtotal);
  }

  const refresh = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const r = await api.cart.get();
      apply(r);
    } catch {} finally { setLoading(false); }
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addItem(producto_id: number, cantidad: number) {
    const r = await api.cart.addItem(producto_id, cantidad);
    apply(r);
  }
  async function updateItem(producto_id: number, cantidad: number) {
    const r = await api.cart.updateItem(producto_id, cantidad);
    apply(r);
  }
  async function removeItem(producto_id: number) {
    const r = await api.cart.removeItem(producto_id);
    apply(r);
  }
  async function clear() {
    const r = await api.cart.clear();
    apply(r);
  }

  return (
    <CartContext.Provider value={{ items, subtotal, loading, refresh, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() { return useContext(CartContext); }
