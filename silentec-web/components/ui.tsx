'use client';

import { CSSProperties } from 'react';

export function Panel({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, boxShadow: 'var(--shadow-sm)', ...style }}>
      {children}
    </div>
  );
}

export function PanelHead({ title, action, children }: { title?: string; action?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
      {title && <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.2px' }}>{title}</div>}
      {children}
      {action}
    </div>
  );
}

export function PanelBody({ children, noPad }: { children: React.ReactNode; noPad?: boolean }) {
  return <div style={{ padding: noPad ? 0 : '18px 22px' }}>{children}</div>;
}

export function Btn({ children, variant = 'primary', onClick, disabled, style, type = 'button' }: {
  children: React.ReactNode; variant?: 'primary' | 'ghost'; onClick?: () => void;
  disabled?: boolean; style?: CSSProperties; type?: 'button' | 'submit';
}) {
  const base: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer', border: 'none', letterSpacing: '0.2px', opacity: disabled ? 0.5 : 1, transition: 'all 0.15s', ...style };
  const variants = {
    primary: { background: '#1834FF', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-strong)' },
  };
  return <button type={type} style={{ ...base, ...variants[variant] }} onClick={onClick} disabled={disabled}>{children}</button>;
}

export function Pill({ estado }: { estado: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    pendiente:   { label: 'Pendiente',      bg: 'rgba(176,122,16,0.1)', color: '#B07A10' },
    preparacion: { label: 'En preparación', bg: 'rgba(176,122,16,0.1)', color: '#B07A10' },
    transito:    { label: 'En tránsito',    bg: 'var(--surface3)',       color: 'var(--text-muted)' },
    entregado:   { label: 'Entregado',      bg: 'rgba(30,143,82,0.1)',  color: '#1E8F52' },
    cancelado:   { label: 'Cancelado',      bg: 'rgba(198,40,40,0.1)',  color: '#C62828' },
  };
  const p = map[estado] || { label: estado, bg: 'var(--surface3)', color: 'var(--text-muted)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 6, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', background: p.bg, color: p.color }}>
      <span style={{ width: 5, height: 5, borderRadius: 3, background: 'currentColor', display: 'inline-block' }}/>
      {p.label}
    </span>
  );
}

export function MonoLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.4px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: 32, height: 32, border: '3px solid var(--surface3)', borderTopColor: '#1834FF', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function EmptyState({ icon, title, sub, children }: { icon?: React.ReactNode; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
      {icon && <div style={{ marginBottom: 12, opacity: 0.3 }}>{icon}</div>}
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
      {sub && <div style={{ fontSize: 13 }}>{sub}</div>}
      {children}
    </div>
  );
}
