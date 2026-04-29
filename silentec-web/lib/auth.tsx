'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Cliente } from './api';

interface AuthState {
  token: string | null;
  cliente: Cliente | null;
  login: (token: string, cliente: Cliente) => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthState>({
  token: null, cliente: null, isReady: false,
  login: () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('st_token');
    const c = localStorage.getItem('st_cliente');
    if (t && c) {
      try {
        setToken(t);
        setCliente(JSON.parse(c));
      } catch {}
    }
    setIsReady(true);
  }, []);

  function login(t: string, c: Cliente) {
    localStorage.setItem('st_token', t);
    localStorage.setItem('st_cliente', JSON.stringify(c));
    setToken(t);
    setCliente(c);
  }

  function logout() {
    localStorage.removeItem('st_token');
    localStorage.removeItem('st_cliente');
    setToken(null);
    setCliente(null);
  }

  return (
    <AuthContext.Provider value={{ token, cliente, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
