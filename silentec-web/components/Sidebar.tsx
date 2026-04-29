'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/lib/cart';

const navItems = [
  { section: 'Operación', items: [
    { href: '/dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { href: '/catalogo', label: 'Catálogo', icon: <GridIcon />, badge: true },
    { href: '/buscador', label: 'Buscador OE', icon: <SearchIcon /> },
    { href: '/pedido', label: 'Pedido actual', icon: <CartIcon />, cart: true },
  ]},
  { section: 'Cuenta', items: [
    { href: '/historial', label: 'Historial pedidos', icon: <DocIcon /> },
    { href: '/cuenta', label: 'Cta. corriente', icon: <CreditIcon /> },
    { href: '/reportes', label: 'Reportes', icon: <ChartIcon /> },
  ]},
  { section: 'Ayuda', items: [
    { href: '/asistente', label: 'Asistente IA', icon: <ChatIcon /> },
    { href: '/soporte', label: 'Soporte técnico', icon: <HelpIcon /> },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();
  const { cliente, logout } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((s, i) => s + i.cantidad, 0);
  const initials = cliente?.razon_social.split(' ').slice(0,2).map(w => w[0]).join('') || '??';

  return (
    <aside style={{
      background: '#0E121C', color: '#fff', padding: '24px 0',
      display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
      width: 240, flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 22px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.5px', color: '#fff' }}>SILENTEC</div>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '1.6px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginTop: 10, fontWeight: 600 }}>
          Soporte en tu camino
        </div>
      </div>

      {/* Nav */}
      {navItems.map(section => (
        <div key={section.section}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '1.6px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', padding: '14px 22px 6px', fontWeight: 700 }}>
            {section.section}
          </div>
          {section.items.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            const badge = item.cart ? cartCount : undefined;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 22px', cursor: 'pointer',
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                fontSize: 14, fontWeight: active ? 700 : 500,
                background: active ? 'rgba(24,52,255,0.18)' : 'transparent',
                borderLeft: `3px solid ${active ? '#1834FF' : 'transparent'}`,
                textDecoration: 'none', transition: 'all 0.15s',
              }}>
                <span style={{ width: 18, height: 18, flexShrink: 0 }}>{item.icon}</span>
                {item.label}
                {badge != null && badge > 0 && (
                  <span style={{ marginLeft: 'auto', background: '#1834FF', color: '#fff', padding: '2px 7px', borderRadius: 10, fontSize: 10, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}

      {/* Account */}
      <div style={{ marginTop: 'auto', padding: '16px 22px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#1834FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {cliente?.razon_social || 'CLIENTE'}
          </div>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
            CUIT {cliente?.cuit}
          </div>
        </div>
        <button onClick={logout} title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4 }}>
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
}

function HomeIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 12l9-9 9 9M5 10v10h14V10"/></svg>; }
function GridIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function SearchIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>; }
function CartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h9.6a2 2 0 002-1.6L23 6H6"/><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/></svg>; }
function DocIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>; }
function CreditIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></svg>; }
function ChartIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 3v18h18M7 14l4-4 4 4 5-7"/></svg>; }
function ChatIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>; }
function HelpIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01"/></svg>; }
function LogoutIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>; }
