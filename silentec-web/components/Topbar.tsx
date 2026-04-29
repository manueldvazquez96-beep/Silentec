'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TopbarProps {
  breadcrumb: string;
  activePage?: string;
}

export default function Topbar({ breadcrumb, activePage }: TopbarProps) {
  const router = useRouter();
  const [q, setQ] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/catalogo?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div style={{
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 24,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.4px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>
        SILENTEC › <strong style={{ color: 'var(--text)' }}>{breadcrumb}</strong>
      </div>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 540, marginLeft: 24, position: 'relative' }}>
        <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por código ST, OE o vehículo…"
          style={{
            width: '100%', padding: '11px 14px 11px 42px',
            background: 'var(--surface3)', border: '1px solid transparent',
            borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none',
          }}
        />
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
        <button
          style={{ width: 38, height: 38, borderRadius: 9, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', position: 'relative' }}
          title="Notificaciones"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M14 21a2 2 0 01-4 0"/>
          </svg>
        </button>
        <button
          onClick={() => router.push('/pedido')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: '#1834FF', color: '#fff' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          Nuevo pedido
        </button>
      </div>
    </div>
  );
}
