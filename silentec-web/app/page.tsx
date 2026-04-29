'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AuthProvider, useAuth } from '@/lib/auth';

function LoginPage() {
  const { login, token, isReady } = useAuth();
  const router = useRouter();
  const [cuit, setCuit] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isReady && token) router.replace('/dashboard');
  }, [isReady, token, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token: t, cliente } = await api.auth.login(cuit, password);
      login(t, cliente);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      background: `
        radial-gradient(ellipse 60% 50% at 80% 0%, rgba(24,52,255,0.12) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 0% 100%, rgba(24,52,255,0.06) 0%, transparent 60%),
        #F5F6F9
      `,
    }}>
      <div style={{
        position: 'relative', zIndex: 2, width: 460, padding: 44,
        background: '#fff', border: '1px solid var(--border)',
        borderRadius: 20, boxShadow: '0 30px 80px rgba(0,0,0,0.08)',
      }}>
        {/* Logo */}
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.8px', color: '#1834FF', marginBottom: 4 }}>
          SILENTEC
        </div>

        {/* Kicker */}
        <div style={{
          display: 'inline-block', marginTop: 16, padding: '5px 10px',
          border: '1px solid #1834FF', color: '#1834FF',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.5px',
          fontWeight: 700, textTransform: 'uppercase',
        }}>
          Portal Mayorista · B2B
        </div>

        <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.8px', margin: '18px 0 8px', lineHeight: 1.1 }}>
          Bienvenido de vuelta
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 26, lineHeight: 1.5 }}>
          Ingresá con las credenciales de tu cuenta SILENTEC.
        </p>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'rgba(198,40,40,0.08)', color: '#C62828', padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
              CUIT
            </label>
            <input
              type="text" value={cuit} onChange={e => setCuit(e.target.value)}
              placeholder="20-12345678-9" required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, fontWeight: 500, background: 'var(--surface2)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, fontWeight: 500, background: 'var(--surface2)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{ width: '100%', padding: 14, fontSize: 14, letterSpacing: '0.4px', textTransform: 'uppercase', background: '#1834FF', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>¿Primera vez? <a href="mailto:ventas@silentec.com.ar" style={{ color: '#1834FF', fontWeight: 600 }}>Solicitá acceso</a></span>
          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '1.3px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Soporte en tu camino · COARDEL
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
}
