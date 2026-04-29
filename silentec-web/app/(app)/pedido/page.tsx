'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { api, formatARS } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, Spinner, EmptyState } from '@/components/ui';

export default function PedidoPage() {
  const router = useRouter();
  const { items, subtotal, loading, updateItem, removeItem, clear } = useCart();
  const { cliente } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [orderNum, setOrderNum] = useState('');

  const descuento = cliente?.descuento ?? 0;
  const descuentoAmt = subtotal * (descuento / 100);
  const baseAfterDiscount = subtotal - descuentoAmt;
  const iva = baseAfterDiscount * 0.21;
  const total = baseAfterDiscount + iva;

  async function handleConfirm() {
    if (!confirm('¿Confirmás el pedido?')) return;
    setConfirming(true);
    try {
      const order = await api.orders.confirm();
      setOrderNum(order.numero);
      setConfirmed(true);
    } catch (err: any) {
      alert(err.message || 'Error al confirmar el pedido');
    } finally { setConfirming(false); }
  }

  if (confirmed) {
    return (
      <>
        <Topbar breadcrumb="Pedido actual" />
        <div style={{ padding: '28px 32px 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>¡Pedido confirmado!</h2>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 18, fontWeight: 700, color: '#1834FF', marginBottom: 16 }}>{orderNum}</div>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>Tu pedido fue recibido y está siendo procesado. Te avisamos por email cuando esté listo.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Btn variant="ghost" onClick={() => router.push('/historial')}>Ver historial</Btn>
              <Btn onClick={() => router.push('/catalogo')}>Hacer otro pedido</Btn>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar breadcrumb="Pedido actual" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.5px', color: '#1834FF', fontWeight: 700, marginBottom: 6 }}>
              PEDIDO ACTUAL · {items.length} {items.length === 1 ? 'ÍTEM' : 'ÍTEMS'}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: 0 }}>Pedido actual</h1>
          </div>
          {items.length > 0 && (
            <Btn variant="ghost" onClick={() => { if (confirm('¿Vaciás el pedido?')) clear(); }}>
              Vaciar pedido
            </Btn>
          )}
        </div>

        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState
            icon={<svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h2l2.4 12.4a2 2 0 002 1.6h9.6a2 2 0 002-1.6L23 6H6"/><circle cx="9" cy="21" r="1.5"/><circle cx="18" cy="21" r="1.5"/></svg>}
            title="Tu pedido está vacío"
            sub="Agregá productos desde el catálogo."
          >
            <div style={{ marginTop: 20 }}>
              <Btn onClick={() => router.push('/catalogo')}>Ir al catálogo</Btn>
            </div>
          </EmptyState>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            {/* Items table */}
            <Panel>
              <PanelHead title="Productos" />
              <PanelBody noPad>
                <table>
                  <thead><tr>
                    <th>Código ST</th>
                    <th>Descripción</th>
                    <th>Marca</th>
                    <th style={{ textAlign: 'right' }}>Precio unit.</th>
                    <th style={{ textAlign: 'center' }}>Cantidad</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                    <th></th>
                  </tr></thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>{item.codigo_st}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{item.descripcion}</div>
                          {item.modelo && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.modelo}</div>}
                        </td>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: 'var(--text-muted)' }}>{item.marca}</td>
                        <td style={{ textAlign: 'right', fontFamily: '"JetBrains Mono", monospace', fontSize: 12 }}>{formatARS(item.precio_unit)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={() => updateItem(item.producto_id, Math.max(1, item.cantidad - 1))}
                              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              −
                            </button>
                            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.cantidad}</span>
                            <button onClick={() => updateItem(item.producto_id, Math.min(item.stock, item.cantidad + 1))}
                              style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              +
                            </button>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700 }}>{formatARS(item.subtotal)}</td>
                        <td>
                          <button onClick={() => removeItem(item.producto_id)}
                            style={{ padding: '4px 8px', borderRadius: 6, border: 'none', background: 'rgba(198,40,40,0.08)', color: '#C62828', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PanelBody>
            </Panel>

            {/* Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Panel>
                <PanelHead title="Resumen del pedido" />
                <PanelBody>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <SummaryRow label="Subtotal" value={formatARS(subtotal)} />
                    {descuento > 0 && <SummaryRow label={`Descuento mayorista (${descuento}%)`} value={`- ${formatARS(descuentoAmt)}`} color="#1E8F52" />}
                    <SummaryRow label="Base" value={formatARS(baseAfterDiscount)} />
                    <SummaryRow label="IVA (21%)" value={formatARS(iva)} />
                    <div style={{ borderTop: '2px solid var(--border)', paddingTop: 12, marginTop: 4 }}>
                      <SummaryRow label="TOTAL" value={formatARS(total)} bold />
                    </div>
                  </div>

                  <Btn
                    onClick={handleConfirm}
                    disabled={confirming}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 20, padding: 14 }}
                  >
                    {confirming ? 'Confirmando…' : 'Confirmar pedido'}
                  </Btn>

                  <Btn variant="ghost" onClick={() => router.push('/catalogo')} style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: 12 }}>
                    + Agregar más productos
                  </Btn>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelBody>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: 8 }}>Condiciones</div>
                    <div>Plazo de pago: <strong style={{ color: 'var(--text)' }}>{cliente?.plazo_pago || '30 días'}</strong></div>
                    <div>Los precios son + IVA y sujetos a stock al momento de la entrega.</div>
                  </div>
                </PanelBody>
              </Panel>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SummaryRow({ label, value, color, bold }: { label: string; value: string; color?: string; bold?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: bold ? 16 : 13 }}>
      <span style={{ color: bold ? 'var(--text)' : 'var(--text-muted)', fontWeight: bold ? 800 : 500 }}>{label}</span>
      <span style={{ fontWeight: bold ? 800 : 600, color: color || (bold ? 'var(--text)' : 'var(--text)') }}>{value}</span>
    </div>
  );
}

