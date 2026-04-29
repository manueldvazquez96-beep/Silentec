'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { api, formatARS, ProfileStats, Order } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, Pill, MonoLabel, Spinner } from '@/components/ui';

const MONTHS = ['MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC','ENE','FEB','MAR','ABR'];

export default function DashboardPage() {
  const { cliente } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.profile.stats(), api.orders.list({ page: 1 })])
      .then(([s, o]) => { setStats(s); setOrders(o.items.slice(0, 5)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const dayName = now.toLocaleDateString('es-AR', { weekday: 'long' }).toUpperCase();
  const dateStr = now.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }).toUpperCase();

  const chartData = [42, 58, 35, 71, 89, 63, 95, 48, 77, 82, 67, 100];
  const maxVal = Math.max(...chartData);

  return (
    <>
      <Topbar breadcrumb="Dashboard" />
      <div style={{ padding: '28px 32px 60px' }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, gap: 24 }}>
          <div>
            <MonoLabel>◆ {dayName} {dateStr}</MonoLabel>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 6px' }}>
              Buen día, {cliente?.razon_social?.split(' ').slice(0, 3).join(' ')}
            </h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Plazo activo: <strong style={{ color: 'var(--text)' }}>{cliente?.plazo_pago || '30 días'}</strong>
              {' · '}
              Descuento: <strong style={{ color: 'var(--text)' }}>{cliente?.descuento ?? 0}%</strong>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost">
              <DownloadIcon /> Lista de precios
            </Btn>
            <Btn onClick={() => router.push('/catalogo')}>
              <PlusIcon /> Crear pedido
            </Btn>
          </div>
        </div>

        {/* Stats */}
        {loading ? <Spinner /> : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
              <StatCard label="Comprado · 90 días" value={formatARS(stats?.total90 || 0)} trend="neutral" trendText="Últimos 90 días" />
              <StatCard label="Pedidos abiertos" value={String(stats?.pendientes || 0)} trend="neutral" trendText="En proceso" />
              <StatCard label="Pedidos · 90 días" value={String(stats?.pedidos90 || 0)} trend="up" trendText="Total período" />
              <StatCard label="Descuento mayorista" value={`${cliente?.descuento ?? 0}%`} trend="up" trendText={`Nivel: ${cliente?.nivel || 'BASE'}`} />
            </div>

            {/* Two-col grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Chart */}
                <Panel>
                  <PanelHead title="Compras por mes">
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.5px' }}>ÚLTIMOS 12 MESES · ARS</div>
                  </PanelHead>
                  <PanelBody>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, height: 160, alignItems: 'flex-end' }}>
                      {chartData.map((v, i) => (
                        <div key={i} title={`${MONTHS[i]}: ${v}%`} style={{
                          background: i === 11 ? '#1834FF' : 'var(--surface3)',
                          borderRadius: '4px 4px 0 0',
                          height: `${(v / maxVal) * 100}%`,
                        }} />
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, marginTop: 8, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.8px', color: 'var(--text-dim)', textAlign: 'center' }}>
                      {MONTHS.map(m => <span key={m}>{m}</span>)}
                    </div>
                  </PanelBody>
                </Panel>

                {/* Recent orders */}
                <Panel>
                  <PanelHead title="Pedidos recientes">
                    <span onClick={() => router.push('/historial')} style={{ fontSize: 12, color: '#1834FF', fontWeight: 700, cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Ver todos →
                    </span>
                  </PanelHead>
                  <PanelBody noPad>
                    {orders.length === 0 ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Sin pedidos aún</div>
                    ) : (
                      <table>
                        <thead><tr>
                          <th>N° Pedido</th>
                          <th>Fecha</th>
                          <th style={{ textAlign: 'center' }}>Ítems</th>
                          <th>Estado</th>
                          <th style={{ textAlign: 'right' }}>Total</th>
                        </tr></thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => router.push('/historial')}>
                              <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>{o.numero}</td>
                              <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(o.created_at).toLocaleDateString('es-AR')}</td>
                              <td style={{ textAlign: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>—</td>
                              <td><Pill estado={o.estado} /></td>
                              <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatARS(o.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </PanelBody>
                </Panel>
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Quick actions */}
                <Panel>
                  <PanelHead title="Accesos rápidos" />
                  <PanelBody>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                      {[
                        { icon: '🔍', title: 'Buscar por OE', sub: 'Código de fabricante', href: '/buscador' },
                        { icon: '📦', title: 'Catálogo', sub: 'Todos los productos', href: '/catalogo' },
                        { icon: '🤖', title: 'Asistente IA', sub: 'Compatibilidad', href: '/asistente' },
                        { icon: '📄', title: 'Mis pedidos', sub: 'Historial completo', href: '/historial' },
                      ].map(q => (
                        <div key={q.href} onClick={() => router.push(q.href)} style={{
                          background: 'var(--surface2)', border: '1px solid var(--border)',
                          borderRadius: 11, padding: 14, cursor: 'pointer', transition: 'all 0.15s',
                        }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1834FF'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}>
                          <div style={{ fontSize: 22, marginBottom: 8 }}>{q.icon}</div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>{q.title}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{q.sub}</div>
                        </div>
                      ))}
                    </div>
                  </PanelBody>
                </Panel>

                {/* Top products */}
                <Panel>
                  <PanelHead title="Más compradas">
                    <span style={{ fontSize: 12, color: '#1834FF', fontWeight: 700, cursor: 'pointer', fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Top 10 →
                    </span>
                  </PanelHead>
                  <PanelBody noPad>
                    {!stats?.topProductos?.length ? (
                      <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Sin datos aún</div>
                    ) : (
                      stats.topProductos.slice(0, 5).map((p, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                          <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--text-dim)', fontWeight: 700, width: 20 }}>{String(i + 1).padStart(2, '0')}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: '"JetBrains Mono", monospace' }}>{p.codigo_st}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.descripcion}</div>
                          </div>
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 700 }}>{p.unidades} u.</div>
                          </div>
                        </div>
                      ))
                    )}
                  </PanelBody>
                </Panel>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: 40, paddingTop: 22, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.4px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
          <span>SILENTEC · Diseñado para durar</span>
          <span>Respaldado por COARDEL · 55 años</span>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, trend, trendText }: { label: string; value: string; trend: 'up' | 'dn' | 'neutral'; trendText: string }) {
  const trendColor = trend === 'up' ? '#1E8F52' : trend === 'dn' ? '#C62828' : 'var(--text-muted)';
  const trendPrefix = trend === 'up' ? '↑ ' : trend === 'dn' ? '↓ ' : '';
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.4px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.7px', color: 'var(--text)', marginTop: 6, lineHeight: 1.05 }}>{value}</div>
      <div style={{ fontSize: 12, marginTop: 4, fontWeight: 600, color: trendColor }}>{trendPrefix}<span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>{trendText}</span></div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>; }
function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>; }
