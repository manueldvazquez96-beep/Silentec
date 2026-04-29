'use client';

import { useEffect, useState } from 'react';
import { api, ProfileStats, formatARS } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Spinner, MonoLabel } from '@/components/ui';

const MONTHS = ['MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC','ENE','FEB','MAR','ABR'];

export default function ReportesPage() {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.profile.stats().then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const chartData = [42, 58, 35, 71, 89, 63, 95, 48, 77, 82, 67, 100];
  const maxVal = Math.max(...chartData);

  return (
    <>
      <Topbar breadcrumb="Reportes" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <MonoLabel>REPORTES · ANÁLISIS DE COMPRAS</MonoLabel>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 6px' }}>Reportes</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Resumen de actividad y productos más comprados.</div>
        </div>

        {loading ? <Spinner /> : (
          <>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Comprado · 90 días', value: formatARS(stats?.total90 || 0) },
                { label: 'Pedidos · 90 días', value: String(stats?.pedidos90 || 0) },
                { label: 'Ticket promedio', value: stats?.pedidos90 ? formatARS((stats.total90 || 0) / stats.pedidos90) : '—' },
              ].map(s => (
                <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.4px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{s.label}</div>
                  <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.7px', color: 'var(--text)', marginTop: 6 }}>{s.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
              {/* Chart */}
              <Panel>
                <PanelHead title="Evolución de compras">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.5px' }}>ÚLTIMOS 12 MESES · ARS</div>
                </PanelHead>
                <PanelBody>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, height: 180, alignItems: 'flex-end' }}>
                    {chartData.map((v, i) => (
                      <div key={i} title={`${MONTHS[i]}: ${v}%`} style={{
                        background: i === 11 ? '#1834FF' : 'var(--surface3)',
                        borderRadius: '4px 4px 0 0',
                        height: `${(v / maxVal) * 100}%`,
                        cursor: 'pointer', transition: 'opacity 0.15s',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, marginTop: 8, fontFamily: '"JetBrains Mono", monospace', fontSize: 9, letterSpacing: '0.8px', color: 'var(--text-dim)', textAlign: 'center' }}>
                    {MONTHS.map(m => <span key={m}>{m}</span>)}
                  </div>
                </PanelBody>
              </Panel>

              {/* Top products */}
              <Panel>
                <PanelHead title="Top 10 productos" />
                <PanelBody noPad>
                  {!stats?.topProductos?.length ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Sin datos de compras aún.</div>
                  ) : stats.topProductos.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < stats.topProductos.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#1834FF', fontWeight: 800, width: 24 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{p.codigo_st}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.descripcion}</div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>{p.unidades} u.</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace' }}>{formatARS(p.monto)}</div>
                      </div>
                    </div>
                  ))}
                </PanelBody>
              </Panel>
            </div>
          </>
        )}
      </div>
    </>
  );
}
