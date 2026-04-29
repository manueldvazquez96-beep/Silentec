'use client';

import { useEffect, useState } from 'react';
import { api, Order, OrderDetail, formatARS } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, Pill, Spinner } from '@/components/ui';

export default function HistorialPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.orders.list({ page, estado: filter || undefined })
      .then(r => { setOrders(r.items); setTotal(r.total); setPages(Math.ceil(r.total / r.limit)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, filter]);

  async function openDetail(id: number) {
    setLoadingDetail(true);
    try { setDetail(await api.orders.get(id)); } catch {} finally { setLoadingDetail(false); }
  }

  const filterBtns = [
    { value: '', label: `Todos · ${total}` },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'preparacion', label: 'En preparación' },
    { value: 'transito', label: 'En tránsito' },
    { value: 'entregado', label: 'Entregados' },
  ];

  return (
    <>
      <Topbar breadcrumb="Historial" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.5px', color: '#1834FF', fontWeight: 700, marginBottom: 6 }}>
              HISTORIAL · {total} PEDIDOS
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: 0 }}>Historial de pedidos</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Todos tus pedidos a SILENTEC.</div>
          </div>
        </div>

        {detail ? (
          <div>
            <button onClick={() => setDetail(null)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1834FF', marginBottom: 20 }}>
              ← Volver al historial
            </button>
            <Panel>
              <PanelHead title={`Pedido ${detail.numero}`}>
                <Pill estado={detail.estado} />
              </PanelHead>
              <PanelBody noPad>
                <table>
                  <thead><tr>
                    <th>Código ST</th>
                    <th>Descripción</th>
                    <th>Marca</th>
                    <th style={{ textAlign: 'center' }}>Cantidad</th>
                    <th style={{ textAlign: 'right' }}>Precio unit.</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr></thead>
                  <tbody>
                    {detail.items.map((item, i) => (
                      <tr key={i}>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>{item.codigo_st}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.descripcion}</div>
                          {item.modelo && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.modelo}</div>}
                        </td>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>{item.marca}</td>
                        <td style={{ textAlign: 'center', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>{item.cantidad}</td>
                        <td style={{ textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{formatARS(item.precio_unit)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatARS(item.subtotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ padding: '16px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 24 }}>
                  <div style={{ textAlign: 'right', fontSize: 13 }}>
                    <div style={{ color: 'var(--text-muted)' }}>Subtotal: <strong>{formatARS(detail.subtotal)}</strong></div>
                    {detail.descuento > 0 && <div style={{ color: '#1E8F52' }}>Descuento: - {formatARS(detail.descuento)}</div>}
                    <div style={{ color: 'var(--text-muted)' }}>IVA: <strong>{formatARS(detail.iva)}</strong></div>
                    <div style={{ fontSize: 18, fontWeight: 800, marginTop: 6 }}>Total: {formatARS(detail.total)}</div>
                  </div>
                </div>
              </PanelBody>
            </Panel>
          </div>
        ) : (
          <Panel>
            <PanelHead>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {filterBtns.map(f => (
                  <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }}
                    style={{ padding: '7px 12px', fontSize: 12, fontWeight: 700, borderRadius: 8, border: '1px solid var(--border-strong)', cursor: 'pointer', background: filter === f.value ? 'var(--text)' : 'transparent', color: filter === f.value ? '#fff' : 'var(--text)', transition: 'all 0.15s' }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </PanelHead>
            <PanelBody noPad>
              {loading ? <Spinner /> : orders.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Sin pedidos en este estado.</div>
              ) : (
                <>
                  <table>
                    <thead><tr>
                      <th>Pedido</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>{o.numero}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(o.created_at).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                          <td><Pill estado={o.estado} /></td>
                          <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatARS(o.total)}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => openDetail(o.id)}
                              style={{ padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#1834FF' }}>
                              {loadingDetail ? '…' : 'Ver detalle'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pages > 1 && (
                    <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'center', gap: 8 }}>
                      <Btn variant="ghost" onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Anterior</Btn>
                      <span style={{ display: 'flex', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--text-muted)' }}>{page} / {pages}</span>
                      <Btn variant="ghost" onClick={() => setPage(p => p + 1)} disabled={page >= pages}>Siguiente →</Btn>
                    </div>
                  )}
                </>
              )}
            </PanelBody>
          </Panel>
        )}
      </div>
    </>
  );
}
