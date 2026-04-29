'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { api, Cliente, formatARS } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, MonoLabel } from '@/components/ui';

export default function CuentaPage() {
  const { cliente: authCliente } = useAuth();
  const [cliente, setCliente] = useState<Cliente | null>(authCliente);

  useEffect(() => {
    api.profile.get().then(setCliente).catch(() => {});
  }, []);

  const initials = cliente?.razon_social.split(' ').slice(0, 2).map(w => w[0]).join('') || '??';

  const nivelData = {
    BASE: { label: 'Minorista', color: 'var(--text-muted)', pct: 20 },
    BRONCE: { label: 'Bronce', color: '#B07A10', pct: 40 },
    PLATA: { label: 'Plata', color: '#5A6075', pct: 60 },
    ORO: { label: 'Oro', color: '#B07A10', pct: 80 },
    PLATINO: { label: 'Platino', color: '#1834FF', pct: 100 },
  } as Record<string, { label: string; color: string; pct: number }>;

  const nivel = nivelData[cliente?.nivel || 'BASE'] || nivelData['BASE'];

  return (
    <>
      <Topbar breadcrumb="Cta. corriente" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <MonoLabel>CTA. CORRIENTE</MonoLabel>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 6px' }}>Mi cuenta</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Información de tu cuenta y condiciones comerciales.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Profile */}
          <Panel>
            <PanelHead title="Datos del cliente" />
            <PanelBody>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: '#1834FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, flexShrink: 0 }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{cliente?.razon_social}</div>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>CUIT {cliente?.cuit}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Email', value: cliente?.email },
                  { label: 'Dirección', value: cliente?.direccion || '—' },
                  { label: 'Ciudad', value: cliente?.ciudad || '—' },
                  { label: 'Cuenta corriente', value: cliente?.cuenta_num || '—' },
                  { label: 'Cliente desde', value: cliente?.created_at ? new Date(cliente.created_at).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' }) : '—' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, paddingTop: 2 }}>{r.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          {/* Commercial conditions */}
          <Panel>
            <PanelHead title="Condiciones comerciales" />
            <PanelBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <ConditionRow label="Descuento mayorista" value={`${cliente?.descuento ?? 0}%`} valueColor="#1834FF" />
                <ConditionRow label="Plazo de pago" value={cliente?.plazo_pago || '—'} />
                <ConditionRow label="Nivel" value={nivel.label} valueColor={nivel.color} />

                {/* Level progress */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Progreso de nivel</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: nivel.color }}>{nivel.pct}%</div>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface3)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: nivel.color, borderRadius: 4, width: `${nivel.pct}%`, transition: 'width 1s ease' }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                    {nivel.pct < 100 ? 'Comprá más para subir de nivel y mejorar tu descuento.' : 'Nivel máximo alcanzado. ¡Gracias por tu fidelidad!'}
                  </div>
                </div>
              </div>
            </PanelBody>
          </Panel>
        </div>

        {/* Levels table */}
        <Panel>
          <PanelHead title="Tabla de niveles" />
          <PanelBody noPad>
            <table>
              <thead><tr>
                <th>Nivel</th>
                <th>Compra mínima anual</th>
                <th style={{ textAlign: 'center' }}>Descuento</th>
                <th>Plazo de pago</th>
                <th style={{ textAlign: 'center' }}>Estado</th>
              </tr></thead>
              <tbody>
                {[
                  { nivel: 'Minorista', minimo: '$ 0', descuento: '0%', plazo: '14 días' },
                  { nivel: 'Bronce', minimo: '$ 500.000', descuento: '3%', plazo: '21 días' },
                  { nivel: 'Plata', minimo: '$ 1.000.000', descuento: '5%', plazo: '30 días' },
                  { nivel: 'Oro', minimo: '$ 2.500.000', descuento: '8%', plazo: '45 días' },
                  { nivel: 'Platino', minimo: '$ 5.000.000', descuento: '12%', plazo: '60 días' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{row.nivel}</td>
                    <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{row.minimo}</td>
                    <td style={{ textAlign: 'center', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, color: '#1834FF' }}>{row.descuento}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.plazo}</td>
                    <td style={{ textAlign: 'center' }}>
                      {row.nivel.toLowerCase() === (nivel.label.toLowerCase()) && (
                        <span style={{ background: 'rgba(30,143,82,0.1)', color: '#1E8F52', padding: '2px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>ACTUAL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </PanelBody>
        </Panel>
      </div>
    </>
  );
}

function ConditionRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 800, color: valueColor || 'var(--text)' }}>{value}</span>
    </div>
  );
}
