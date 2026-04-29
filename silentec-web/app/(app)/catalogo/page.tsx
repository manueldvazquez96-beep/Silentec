'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api, Product, Marca, Tipo, ProductsResponse, formatARS } from '@/lib/api';
import { useCart } from '@/lib/cart';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, Spinner, EmptyState } from '@/components/ui';

function rotBadge(r: string) {
  if (r === 'alta') return { label: 'A', bg: 'rgba(30,143,82,0.12)', color: '#1E8F52' };
  if (r === 'media') return { label: 'M', bg: 'rgba(176,122,16,0.12)', color: '#B07A10' };
  return { label: 'B', bg: 'rgba(198,40,40,0.08)', color: '#C62828' };
}

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [data, setData] = useState<ProductsResponse | null>(null);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  const [q, setQ] = useState(searchParams.get('q') || '');
  const [marca, setMarca] = useState('');
  const [tipo, setTipo] = useState('');
  const [inStock, setInStock] = useState(false);
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.products.list({ q: q || undefined, marca: marca || undefined, tipo: tipo || undefined, inStock: inStock || undefined, page });
      setData(res);
    } catch {} finally { setLoading(false); }
  }, [q, marca, tipo, inStock, page]);

  useEffect(() => { fetch(); }, [fetch]);
  useEffect(() => {
    Promise.all([api.products.marcas(), api.products.tipos()])
      .then(([m, t]) => { setMarcas(m); setTipos(t); })
      .catch(() => {});
  }, []);

  async function handleAdd(p: Product) {
    setAddingId(p.id);
    try { await addItem(p.id, 1); } catch {} finally { setAddingId(null); }
  }

  function clearFilter(key: string) {
    if (key === 'q') setQ('');
    if (key === 'marca') setMarca('');
    if (key === 'tipo') setTipo('');
    if (key === 'inStock') setInStock(false);
    setPage(1);
  }

  const activeFilters = [
    ...(q ? [{ key: 'q', label: q }] : []),
    ...(marca ? [{ key: 'marca', label: marcas.find(m => String(m.id) === marca)?.nombre || marca }] : []),
    ...(tipo ? [{ key: 'tipo', label: tipos.find(t => t.id === tipo)?.nombre || tipo }] : []),
    ...(inStock ? [{ key: 'inStock', label: 'En stock' }] : []),
  ];

  return (
    <>
      <Topbar breadcrumb="Catálogo" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.5px', color: '#1834FF', fontWeight: 700, marginBottom: 6 }}>
              CATÁLOGO · {data?.total ?? '…'} PRODUCTOS
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: 0 }}>Catálogo de repuestos</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Suspensión y chasis. Precios mayoristas con descuento aplicado.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
          {/* Filters sidebar */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, alignSelf: 'flex-start', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: 88 }}>
            <FilterSection label="Marca fabricante">
              <select value={marca} onChange={e => { setMarca(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, outline: 'none', background: 'var(--surface2)' }}>
                <option value="">Todas las marcas</option>
                {marcas.map(m => <option key={m.id} value={String(m.id)}>{m.nombre}</option>)}
              </select>
            </FilterSection>

            <FilterSection label="Tipo de pieza">
              <select value={tipo} onChange={e => { setTipo(e.target.value); setPage(1); }}
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, outline: 'none', background: 'var(--surface2)' }}>
                <option value="">Todos los tipos</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
            </FilterSection>

            <FilterSection label="Disponibilidad">
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer' }}>
                <input type="checkbox" checked={inStock} onChange={e => { setInStock(e.target.checked); setPage(1); }} style={{ accentColor: '#1834FF' }} />
                Solo en stock
              </label>
            </FilterSection>

            <FilterSection label="Búsqueda">
              <input
                value={q} onChange={e => { setQ(e.target.value); setPage(1); }}
                placeholder="Código ST, OE, descripción…"
                style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 7, fontSize: 13, outline: 'none', background: 'var(--surface2)' }}
              />
            </FilterSection>

            {activeFilters.length > 0 && (
              <button onClick={() => { setQ(''); setMarca(''); setTipo(''); setInStock(false); setPage(1); }}
                style={{ width: '100%', padding: '8px', background: 'none', border: '1px solid var(--border)', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)', marginTop: 8 }}>
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Products */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              {activeFilters.map(f => (
                <span key={f.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', background: 'var(--surface3)', borderRadius: 7, fontSize: 12, fontWeight: 600 }}>
                  {f.label}
                  <span onClick={() => clearFilter(f.key)} style={{ cursor: 'pointer', opacity: 0.5, fontWeight: 700 }}>×</span>
                </span>
              ))}
              {data && (
                <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '0.8px', color: 'var(--text-muted)' }}>
                  {data.total} RESULTADOS
                </span>
              )}
            </div>

            {loading ? <Spinner /> : !data?.items.length ? (
              <EmptyState title="Sin resultados" sub="Probá con otros filtros o términos de búsqueda." />
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {data.items.map(p => <ProductCard key={p.id} product={p} onAdd={handleAdd} adding={addingId === p.id} />)}
                </div>
                {data.pages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                    <Btn variant="ghost" onClick={() => setPage(page - 1)} disabled={page === 1}>← Anterior</Btn>
                    <span style={{ display: 'flex', alignItems: 'center', fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                      {page} / {data.pages}
                    </span>
                    <Btn variant="ghost" onClick={() => setPage(page + 1)} disabled={page >= data.pages}>Siguiente →</Btn>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function ProductCard({ product: p, onAdd, adding }: { product: Product; onAdd: (p: Product) => void; adding: boolean }) {
  const rot = rotBadge(p.rotacion);
  const stockText = p.stock === 0 ? 'Sin stock' : p.stock < 10 ? `Stock: ${p.stock}` : `Stock: ${p.stock}`;
  const stockColor = p.stock === 0 ? '#C62828' : p.stock < 10 ? '#B07A10' : '#1E8F52';

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.15s' }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#1834FF'; el.style.boxShadow = 'var(--shadow-md)'; el.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.boxShadow = 'none'; el.style.transform = 'none'; }}>
      {/* Image placeholder */}
      <div style={{ height: 140, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.5px', position: 'relative', borderBottom: '1px solid var(--border)' }}>
        <span style={{ position: 'absolute', inset: 14, border: '1px dashed rgba(0,0,0,0.1)', borderRadius: 8 }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.04)', padding: '3px 7px', borderRadius: 5, fontFamily: '"JetBrains Mono", monospace', fontSize: 10, fontWeight: 700, letterSpacing: '0.4px' }}>{p.codigo_st}</span>
        <span style={{ position: 'absolute', top: 10, right: 10, background: rot.bg, color: rot.color, padding: '3px 7px', borderRadius: 5, fontSize: 10, fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>{rot.label}</span>
        IMAGEN
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 9, color: '#1834FF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{p.tipo}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3, marginBottom: 4 }}>{p.descripcion}</div>
        {(p.modelo || p.anio) && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, fontFamily: '"JetBrains Mono", monospace', letterSpacing: '0.2px' }}>
            {[p.marca, p.modelo, p.anio].filter(Boolean).join(' · ')}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.4px' }}>{formatARS(p.precio)}</div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, color: stockColor, fontWeight: 700, marginTop: 2 }}>{stockText}</div>
          </div>
        </div>
        <button
          disabled={p.stock === 0 || adding}
          onClick={e => { e.stopPropagation(); onAdd(p); }}
          style={{ width: '100%', marginTop: 10, padding: 9, borderRadius: 8, background: p.stock === 0 ? 'var(--surface3)' : 'var(--text)', color: p.stock === 0 ? 'var(--text-dim)' : '#fff', border: 'none', fontWeight: 700, fontSize: 12, cursor: p.stock === 0 ? 'not-allowed' : 'pointer', letterSpacing: '0.3px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          {adding ? '…' : p.stock === 0 ? 'Sin stock' : '+ Agregar al pedido'}
        </button>
      </div>
    </div>
  );
}
