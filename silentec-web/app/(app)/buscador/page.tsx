'use client';

import { useState } from 'react';
import { api, Product, formatARS } from '@/lib/api';
import { useCart } from '@/lib/cart';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, Spinner } from '@/components/ui';

export default function BuscadorPage() {
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const r = await api.products.list({ q: query.trim() });
      setResults(r.items);
    } catch {} finally { setLoading(false); }
  }

  async function handleAdd(p: Product) {
    setAddingId(p.id);
    try { await addItem(p.id, 1); } catch {} finally { setAddingId(null); }
  }

  return (
    <>
      <Topbar breadcrumb="Buscador OE" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.5px', color: '#1834FF', fontWeight: 700, marginBottom: 6 }}>BUSCADOR AVANZADO</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: '0 0 6px' }}>Buscar repuesto</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Encontrá el repuesto exacto por código OE, ST o descripción.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* By code */}
          <Panel>
            <PanelHead title="Por código OE / ST" />
            <PanelBody>
              <form onSubmit={handleSearch}>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Código OE o ST</div>
                  <input
                    value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Ej. BK3C-5493-AA o ST: 007-003-024"
                    style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, outline: 'none', background: 'var(--surface2)' }}
                  />
                </div>
                <Btn type="submit" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                  <SearchIcon /> Buscar
                </Btn>
              </form>
            </PanelBody>
          </Panel>

          {/* By vehicle */}
          <Panel>
            <PanelHead title="Por vehículo" />
            <PanelBody>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {['Marca', 'Modelo', 'Año', 'Tipo de pieza'].map(label => (
                  <div key={label}>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>{label}</div>
                    <select style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-strong)', borderRadius: 7, fontSize: 13, outline: 'none', background: '#fff' }}>
                      <option>Seleccioná…</option>
                    </select>
                  </div>
                ))}
              </div>
              <Btn style={{ width: '100%', justifyContent: 'center', padding: 12 }} onClick={() => {}}>
                <SearchIcon /> Buscar piezas compatibles
              </Btn>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                Próximamente disponible
              </div>
            </PanelBody>
          </Panel>
        </div>

        {/* Results */}
        {loading && <Spinner />}
        {!loading && searched && (
          <Panel>
            <PanelHead title={`Resultados · ${results.length} coincidencia${results.length !== 1 ? 's' : ''} para "${query}"`}>
              {results.length > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 6, background: 'rgba(30,143,82,0.1)', color: '#1E8F52', fontSize: 10, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase' }}>
                  <span style={{ width: 5, height: 5, borderRadius: 3, background: 'currentColor', display: 'inline-block' }}/> Match encontrado
                </span>
              )}
            </PanelHead>
            <PanelBody noPad>
              {results.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>Sin resultados</div>
                  <div style={{ fontSize: 13 }}>Probá con otro código o descripción.</div>
                </div>
              ) : (
                <table>
                  <thead><tr>
                    <th>Código ST</th>
                    <th>Código OE</th>
                    <th>Descripción</th>
                    <th>Marca</th>
                    <th>Vehículo</th>
                    <th style={{ textAlign: 'center' }}>Stock</th>
                    <th style={{ textAlign: 'right' }}>Precio</th>
                    <th></th>
                  </tr></thead>
                  <tbody>
                    {results.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700 }}>{p.codigo_st}</td>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--text-muted)' }}>{p.codigo_oe || '—'}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.descripcion}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: '"JetBrains Mono", monospace' }}>{p.tipo}</div>
                        </td>
                        <td style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }}>{p.marca}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{[p.modelo, p.anio].filter(Boolean).join(' · ') || '—'}</td>
                        <td style={{ textAlign: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, fontWeight: 700, color: p.stock === 0 ? '#C62828' : p.stock < 10 ? '#B07A10' : '#1E8F52' }}>
                          {p.stock}
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 800, fontSize: 14 }}>{formatARS(p.precio)}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            disabled={p.stock === 0 || addingId === p.id}
                            onClick={() => handleAdd(p)}
                            style={{ padding: '7px 12px', borderRadius: 7, background: p.stock === 0 ? 'var(--surface3)' : '#1834FF', color: p.stock === 0 ? 'var(--text-dim)' : '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: p.stock === 0 ? 'not-allowed' : 'pointer' }}
                          >
                            {addingId === p.id ? '…' : p.stock === 0 ? 'Sin stock' : '+ Agregar'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </PanelBody>
          </Panel>
        )}

        {!searched && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🔎</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Ingresá un código para buscar</div>
          </div>
        )}
      </div>
    </>
  );
}

function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>; }
