import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cliente } from '../services/api';

interface AuthState {
  token: string | null;
  cliente: Cliente | null;
  isLoading: boolean;
  setAuth: (token: string, cliente: Cliente) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  cliente: null,
  isLoading: true,

  setAuth: async (token, cliente) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('cliente', JSON.stringify(cliente));
    set({ token, cliente });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['token', 'cliente']);
    set({ token: null, cliente: null });
  },

  loadFromStorage: async () => {
    try {
      const token   = await AsyncStorage.getItem('token');
      const raw     = await AsyncStorage.getItem('cliente');
      const cliente = raw ? JSON.parse(raw) as Cliente : null;
      set({ token, cliente, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
