import { create } from 'zustand';
import { CartItem } from '../services/api';

interface CartState {
  items: CartItem[];
  subtotal: number;
  setCart: (items: CartItem[], subtotal: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotal: 0,
  setCart: (items, subtotal) => set({ items, subtotal }),
  clearCart: () => set({ items: [], subtotal: 0 }),
}));
