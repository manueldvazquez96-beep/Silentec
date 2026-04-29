// SILENTEC — pantallas parte 1: Login, Home, Catálogo, Detalle
// Usa window.T (tema activo), window.SILENTEC_FONT, iconos e imports globales

const fmtARS = (n) => '$' + n.toLocaleString('es-AR');

// ─── Shared: badge, chip, tab bar ───────────────────────────
function STBadge({ tone = 'neutral', children }) {
  const T = window.T;
  const map = {
    neutral: { bg: T.chip, fg: T.textMuted, bd: T.border },
    ok:      { bg: 'rgba(63,181,112,0.14)', fg: T.success, bd: 'rgba(63,181,112,0.25)' },
    low:     { bg: 'rgba(232,179,65,0.14)', fg: T.warn,    bd: 'rgba(232,179,65,0.28)' },
    out:     { bg: 'rgba(229,72,77,0.14)',  fg: T.danger,  bd: 'rgba(229,72,77,0.28)' },
    accent:  { bg: T.accentSoft,            fg: T.accent,  bd: 'transparent' },
  };
  const s = map[tone];
  return <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
    fontSize: 11, fontWeight: 600, letterSpacing: 0.3,
    padding: '3px 8px', borderRadius: 5, textTransform: 'uppercase',
    fontFamily: window.SILENTEC_FONT_MONO,
  }}>{children}</span>;
}

function STTabBar({ active, onNav }) {
  const T = window.T;
  const items = [
    { id: 'home',    label: 'Inicio',    Icon: IconHome },
    { id: 'catalog', label: 'Catálogo',  Icon: IconBox },
    { id: 'chat',    label: 'Asistente', Icon: IconChat },
    { id: 'reports', label: 'Reportes',  Icon: IconChart },
    { id: 'cart',    label: 'Pedido',    Icon: IconCart },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 28, paddingTop: 8,
      background: T.dark
        ? 'linear-gradient(to top, ' + T.bg + ' 60%, rgba(0,0,0,0))'
        : 'linear-gradient(to top, ' + T.bg + ' 60%, rgba(255,255,255,0))',
      display: 'flex', justifyContent: 'space-around',
      borderTop: `1px solid ${T.border}`,
    }}>
      {items.map(it => {
        const on = active === it.id;
        return (
          <button key={it.id} onClick={() => onNav(it.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 3, padding: '4px 10px',
            color: on ? T.accent : T.textMuted,
          }}>
            <it.Icon size={22} sw={on ? 2 : 1.6}/>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Top bar (no-nav large title, stays crisp) ──────────────
function STTopBar({ title, subtitle, right, tight = false }) {
  const T = window.T;
  return (
    <div style={{
      padding: `${tight ? 54 : 62}px 20px 14px`,
      display: 'flex', alignItems: 'flex-end', gap: 12,
    }}>
      <div style={{ flex: 1 }}>
        {subtitle && <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 11, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase', marginBottom: 3,
        }}>{subtitle}</div>}
        <div style={{
          fontSize: tight ? 26 : 32, fontWeight: 800, letterSpacing: -0.8,
          color: T.text, lineHeight: 1.02,
          fontStretch: '90%',
        }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

// ─── Small components ───────────────────────────────────────
function STIconBtn({ children, onClick, size = 40 }) {
  const T = window.T;
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: 10,
      background: T.surface, border: `1px solid ${T.border}`,
      color: T.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', padding: 0,
    }}>{children}</button>
  );
}

// ═══════════════════════════════════════════════════════════
// 1. LOGIN
// ═══════════════════════════════════════════════════════════
function ScreenLogin({ onLogin }) {
  const T = window.T;
  return (
    <div style={{
      height: '100%', padding: '64px 26px 32px',
      display: 'flex', flexDirection: 'column', gap: 24,
      background: T.dark
        ? `radial-gradient(ellipse at top right, ${T.accentSoft} 0%, transparent 45%), ${T.bg}`
        : `radial-gradient(ellipse at top right, ${T.accentSoft} 0%, transparent 55%), ${T.bg}`,
    }}>
      {/* Logo block */}
      <div style={{ marginTop: 10 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '4px 10px', border: `1px solid ${T.accent}`,
          color: T.accent, fontFamily: window.SILENTEC_FONT_MONO,
          fontSize: 10, letterSpacing: 1.5, fontWeight: 700, marginBottom: 26,
        }}>
          <div style={{ width: 6, height: 6, background: T.accent }}/>
          PORTAL MAYORISTA
        </div>
        <div style={{ marginBottom: 16 }}>
          <window.SilentecLogo size={240}/>
        </div>
        <div style={{
          fontFamily: window.SILENTEC_FONT, fontSize: 15, letterSpacing: 0.2,
          color: T.text, fontWeight: 600, marginTop: 6,
        }}>Soporte en tu camino.</div>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 2,
          color: T.textMuted, marginTop: 4, textTransform: 'uppercase',
        }}>Diseñado para durar</div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase',
        }}>CUIT / USUARIO</div>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '14px 16px',
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 17, color: T.text,
          letterSpacing: 0.5,
        }}>30-71485293-4</div>

        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase', marginTop: 6,
        }}>CLAVE</div>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '14px 16px',
          fontSize: 17, color: T.text, letterSpacing: 4,
        }}>••••••••••</div>

        <button onClick={onLogin} style={{
          marginTop: 18, background: T.accent, color: '#fff',
          border: 'none', borderRadius: 12, padding: '17px 20px',
          fontSize: 16, fontWeight: 700, letterSpacing: 0.4,
          fontFamily: window.SILENTEC_FONT, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          textTransform: 'uppercase',
        }}>
          Ingresar al portal <IconChevR size={18} sw={2.2}/>
        </button>

        <div style={{
          textAlign: 'center', marginTop: 10,
          fontSize: 13, color: T.textMuted,
        }}>
          ¿Primera vez? <span style={{ color: T.accent, fontWeight: 600 }}>Solicitá acceso</span>
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{
        paddingTop: 16, borderTop: `1px solid ${T.border}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
        letterSpacing: 1.4, color: T.textDim, textTransform: 'uppercase',
      }}>
        <span>Respaldado por COARDEL</span>
        <span>55 años · AR</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 2. HOME / DASHBOARD
// ═══════════════════════════════════════════════════════════
function ScreenHome({ onNav }) {
  const T = window.T;
  const cliente = 'REPUESTOS DEL CENTRO';
  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 110 }}>
      {/* Greeting strip */}
      <div style={{
        padding: '54px 20px 20px',
        background: T.dark
          ? `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)`
          : `linear-gradient(180deg, ${T.surface} 0%, ${T.bg} 100%)`,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {/* Mini logo in header */}
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <window.SilentecLogo size={130}/>
          <div style={{
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 9, letterSpacing: 1.4,
            color: T.textDim, textTransform: 'uppercase',
          }}>B2B · MAYORISTA</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
              color: T.textDim, textTransform: 'uppercase', marginBottom: 4,
            }}>CUENTA MAYORISTA</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.text, letterSpacing: -0.4 }}>
              {cliente}
            </div>
            <div style={{ fontSize: 13, color: T.textMuted, marginTop: 2 }}>
              Córdoba Capital · Cta. #4821
            </div>
          </div>
          <div style={{
            width: 42, height: 42, borderRadius: 10, background: T.surface2,
            border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: T.text, position: 'relative',
          }}>
            <IconBell size={20}/>
            <div style={{
              position: 'absolute', top: 8, right: 8, width: 8, height: 8,
              borderRadius: 4, background: T.accent, border: `2px solid ${T.surface2}`,
            }}/>
          </div>
        </div>

        {/* Credit strip */}
        <div style={{
          marginTop: 18, background: T.dark ? 'rgba(242,103,34,0.08)' : T.accentSoft,
          border: `1px solid ${T.accentSoft}`, borderRadius: 12, padding: 14,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.2,
              color: T.textDim, textTransform: 'uppercase',
            }}>CUENTA CORRIENTE · DISPONIBLE</div>
            <div style={{
              fontSize: 24, fontWeight: 800, color: T.text, marginTop: 2,
              letterSpacing: -0.6, fontStretch: '90%',
            }}>$ 1.842.300</div>
          </div>
          <div style={{ width: 1, height: 34, background: T.border }}/>
          <div>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.2,
              color: T.textDim, textTransform: 'uppercase',
            }}>LÍMITE</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: T.textMuted, marginTop: 2 }}>
              $ 3.000.000
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: '18px 20px 8px' }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase', marginBottom: 10,
        }}>ACCESOS RÁPIDOS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { label: 'Buscar por vehículo', Icon: IconCar, to: 'catalog', accent: true },
            { label: 'Asistente técnico',   Icon: IconSpark, to: 'chat' },
            { label: 'Mis pedidos',         Icon: IconDoc, to: 'reports' },
            { label: 'Escanear OE',         Icon: IconScan, to: 'catalog' },
          ].map((a, i) => (
            <button key={i} onClick={() => onNav(a.to)} style={{
              background: a.accent ? T.accent : T.surface,
              color: a.accent ? '#fff' : T.text,
              border: `1px solid ${a.accent ? T.accent : T.border}`,
              borderRadius: 14, padding: '14px 14px 16px',
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: 22, cursor: 'pointer', textAlign: 'left',
              fontFamily: window.SILENTEC_FONT,
            }}>
              <a.Icon size={22} sw={1.8}/>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: -0.2 }}>
                {a.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: '16px 20px 6px' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, overflow: 'hidden',
        }}>
          <div style={{
            padding: '12px 16px', borderBottom: `1px solid ${T.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
              color: T.textDim, textTransform: 'uppercase',
            }}>ACTIVIDAD · ABRIL 2026</div>
            <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Ver detalle →</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {[
              { k: 'PEDIDOS', v: '8', d: '+2 vs mar' },
              { k: 'UNIDADES', v: '147', d: '+18%' },
              { k: 'FACTURADO', v: '$ 1.25M', d: '+9%' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 14, borderLeft: i ? `1px solid ${T.border}` : 'none',
              }}>
                <div style={{
                  fontFamily: window.SILENTEC_FONT_MONO, fontSize: 9, letterSpacing: 1.2,
                  color: T.textDim,
                }}>{s.k}</div>
                <div style={{
                  fontSize: 20, fontWeight: 800, color: T.text, marginTop: 4,
                  letterSpacing: -0.5, fontStretch: '90%',
                }}>{s.v}</div>
                <div style={{ fontSize: 11, color: T.success, marginTop: 2, fontWeight: 600 }}>
                  ↑ {s.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Destacados */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
            color: T.textDim, textTransform: 'uppercase',
          }}>ALTA ROTACIÓN · RECOMENDADOS</div>
          <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Ver todos</span>
        </div>
        {window.SILENTEC_PRODUCTOS.slice(0, 3).map((p, i) => (
          <div key={i} onClick={() => onNav('detail', p)} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            {/* product placeholder */}
            <div style={{
              width: 54, height: 54, borderRadius: 8,
              background: T.dark
                ? 'repeating-linear-gradient(45deg, #242629 0 6px, #1b1d20 6px 12px)'
                : 'repeating-linear-gradient(45deg, #e8eaee 0 6px, #dde0e5 6px 12px)',
              flexShrink: 0, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: T.textDim,
              }}><IconBox size={22} sw={1.3}/></div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
                color: T.accent, fontWeight: 600, letterSpacing: 0.5,
              }}>{p.st}</div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: T.text, marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.tipo}</div>
              <div style={{
                fontSize: 12, color: T.textMuted, marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.marca} {p.modelo}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>
                {fmtARS(p.precio)}
              </div>
              <div style={{ marginTop: 3 }}>
                <STBadge tone={p.stock === 0 ? 'out' : p.stock < 15 ? 'low' : 'ok'}>
                  {p.stock === 0 ? 'Sin stock' : `${p.stock} u.`}
                </STBadge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 3. CATÁLOGO (con buscador por vehículo)
// ═══════════════════════════════════════════════════════════
function ScreenCatalog({ onNav }) {
  const T = window.T;
  const [marca, setMarca] = React.useState('Ford');
  const [tipo, setTipo] = React.useState(null);
  const [query, setQuery] = React.useState('');

  const prods = window.SILENTEC_PRODUCTOS.filter(p =>
    (!marca || p.marca === marca) &&
    (!tipo  || p.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
    (!query || (p.modelo + p.tipo + p.oe + p.st).toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 110 }}>
      <STTopBar title="Catálogo" subtitle="LÍNEA SUSPENSIÓN & CHASIS"/>

      {/* Search bar */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '12px 14px',
        }}>
          <IconSearch size={18} color={T.textMuted}/>
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Código OE, ST o modelo..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: T.text, fontFamily: window.SILENTEC_FONT, fontSize: 15,
            }}
          />
          <div style={{
            width: 1, height: 18, background: T.border,
          }}/>
          <IconScan size={18} color={T.accent}/>
        </div>
      </div>

      {/* Vehicle selector card */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '14px 16px',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
          }}>
            <IconCar size={18} color={T.accent} sw={1.8}/>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
              color: T.textDim, textTransform: 'uppercase',
            }}>BUSCAR POR VEHÍCULO</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {window.SILENTEC_MARCAS.map(m => {
              const on = marca === m;
              return (
                <button key={m} onClick={() => setMarca(on ? null : m)} style={{
                  padding: '7px 13px', borderRadius: 8,
                  background: on ? T.text : T.chip,
                  color: on ? T.bg : T.text,
                  border: `1px solid ${on ? T.text : T.border}`,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  fontFamily: window.SILENTEC_FONT,
                }}>{m}</button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tipo pieza horizontal chips */}
      <div style={{
        padding: '0 20px 10px', display: 'flex', gap: 8, overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        <button onClick={() => setTipo(null)} style={{
          padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap',
          background: !tipo ? T.accent : T.surface,
          color: !tipo ? '#fff' : T.text,
          border: `1px solid ${!tipo ? T.accent : T.border}`,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: window.SILENTEC_FONT,
        }}>Todas</button>
        {window.SILENTEC_TIPOS.map(t => {
          const on = tipo === t.name;
          return (
            <button key={t.id} onClick={() => setTipo(on ? null : t.name)} style={{
              padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap',
              background: on ? T.accent : T.surface,
              color: on ? '#fff' : T.text,
              border: `1px solid ${on ? T.accent : T.border}`,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              fontFamily: window.SILENTEC_FONT,
            }}>{t.name}</button>
          );
        })}
      </div>

      {/* Results counter */}
      <div style={{
        padding: '6px 20px 10px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.3,
          color: T.textDim, textTransform: 'uppercase',
        }}>
          {prods.length} RESULTADOS{marca ? ` · ${marca.toUpperCase()}` : ''}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5, color: T.textMuted,
          fontSize: 12,
        }}>
          <IconSliders size={14}/> Ordenar
        </div>
      </div>

      {/* Product rows (denser list) */}
      <div style={{ padding: '0 20px' }}>
        {prods.map((p, i) => (
          <div key={i} onClick={() => onNav('detail', p)} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 6,
              background: T.dark
                ? 'repeating-linear-gradient(45deg, #242629 0 5px, #1b1d20 5px 10px)'
                : 'repeating-linear-gradient(45deg, #e8eaee 0 5px, #dde0e5 5px 10px)',
              flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.textDim,
            }}><IconBox size={20} sw={1.3}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <span style={{
                  fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
                  color: T.accent, fontWeight: 600,
                }}>{p.st}</span>
                {p.rot === 'alta' && <STBadge tone="accent">Alta rotación</STBadge>}
              </div>
              <div style={{
                fontSize: 14, fontWeight: 700, color: T.text,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.tipo}</div>
              <div style={{
                fontSize: 12, color: T.textMuted, marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{p.marca} · {p.modelo} · {p.anio}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>
                {fmtARS(p.precio)}
              </div>
              <div style={{ marginTop: 3 }}>
                <STBadge tone={p.stock === 0 ? 'out' : p.stock < 15 ? 'low' : 'ok'}>
                  {p.stock === 0 ? 'Sin stock' : `${p.stock} u.`}
                </STBadge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 4. DETALLE PRODUCTO
// ═══════════════════════════════════════════════════════════
function ScreenDetail({ product, onBack, onAddToCart }) {
  const T = window.T;
  const [qty, setQty] = React.useState(4);
  const p = product || window.SILENTEC_PRODUCTOS[0];

  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 140 }}>
      {/* Header bar */}
      <div style={{
        padding: '54px 20px 12px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <STIconBtn onClick={onBack}><IconChevL size={20}/></STIconBtn>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
          letterSpacing: 1.4, color: T.textDim,
        }}>FICHA TÉCNICA</div>
        <STIconBtn><IconBookmark size={18}/></STIconBtn>
      </div>

      {/* Hero */}
      <div style={{
        margin: '0 20px', borderRadius: 18, overflow: 'hidden',
        aspectRatio: '1.2/1', position: 'relative',
        background: T.dark
          ? `linear-gradient(135deg, ${T.surface} 0%, ${T.surface2} 100%)`
          : `linear-gradient(135deg, ${T.surface} 0%, ${T.surface3} 100%)`,
        border: `1px solid ${T.border}`,
      }}>
        <div style={{
          position: 'absolute', inset: 16,
          background: T.dark
            ? 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0 8px, transparent 8px 16px)'
            : 'repeating-linear-gradient(45deg, rgba(14,18,28,0.04) 0 8px, transparent 8px 16px)',
          borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.textDim,
        }}>
          <div style={{ textAlign: 'center' }}>
            <IconBox size={56} sw={1}/>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
              marginTop: 8, textTransform: 'uppercase',
            }}>IMAGEN DE PIEZA</div>
          </div>
        </div>
        <div style={{
          position: 'absolute', top: 14, left: 14,
          display: 'flex', gap: 6,
        }}>
          {p.rot === 'alta' && <STBadge tone="accent">Alta rotación</STBadge>}
        </div>
        <div style={{
          position: 'absolute', bottom: 14, right: 14,
          display: 'flex', gap: 4,
        }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: i === 0 ? 16 : 5, height: 5, borderRadius: 3,
              background: i === 0 ? T.accent : T.textDim,
            }}/>
          ))}
        </div>
      </div>

      {/* Meta */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 11,
          color: T.accent, fontWeight: 600, letterSpacing: 0.5,
        }}>{p.st}</div>
        <div style={{
          fontSize: 24, fontWeight: 800, color: T.text, marginTop: 4,
          letterSpacing: -0.5, lineHeight: 1.15, fontStretch: '90%',
        }}>{p.tipo}</div>
        <div style={{ fontSize: 15, color: T.textMuted, marginTop: 3 }}>
          {p.marca} {p.modelo} · {p.anio}
        </div>
      </div>

      {/* Price card */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.3,
              color: T.textDim, textTransform: 'uppercase',
            }}>PRECIO MAYORISTA · + IVA</div>
            <div style={{
              fontSize: 28, fontWeight: 800, color: T.text, marginTop: 2,
              letterSpacing: -0.7, fontStretch: '90%',
            }}>{fmtARS(p.precio)}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 2 }}>
              Lista <s>${(p.precio*1.22).toLocaleString('es-AR',{maximumFractionDigits:0})}</s> · Desc. 18%
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <STBadge tone={p.stock === 0 ? 'out' : p.stock < 15 ? 'low' : 'ok'}>
              {p.stock === 0 ? 'Sin stock' : `${p.stock} u. disp.`}
            </STBadge>
            <div style={{
              fontSize: 11, color: T.textMuted, marginTop: 6,
              display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end',
            }}>
              <IconTruck size={13}/> 24–48hs
            </div>
          </div>
        </div>
      </div>

      {/* Specs table */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase', marginBottom: 8,
        }}>ESPECIFICACIONES</div>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
          overflow: 'hidden',
        }}>
          {[
            ['Código SILENTEC', p.st.replace('ST: ', '')],
            ['OE / Ref. original', p.oe],
            ['Posición', 'Delantera · ambos lados'],
            ['Material', 'Caucho vulcanizado + inserto de acero'],
            ['Fabricación', 'COARDEL · Córdoba, AR'],
            ['Garantía', '12 meses / 30.000 km'],
          ].map(([k, v], i, arr) => (
            <div key={i} style={{
              display: 'flex', padding: '11px 14px',
              borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{ flex: 1, fontSize: 13, color: T.textMuted }}>{k}</div>
              <div style={{
                fontSize: 13, color: T.text, fontWeight: 600,
                fontFamily: k.includes('Código') || k.includes('OE') ? window.SILENTEC_FONT_MONO : window.SILENTEC_FONT,
              }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add to cart dock (fixed-ish) */}
      <div style={{
        position: 'absolute', bottom: 82, left: 0, right: 0,
        padding: '12px 20px 12px',
        background: T.dark
          ? `linear-gradient(to top, ${T.bg} 70%, rgba(0,0,0,0))`
          : `linear-gradient(to top, ${T.bg} 70%, rgba(255,255,255,0))`,
        borderTop: `1px solid ${T.border}`,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
          height: 52,
        }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
            width: 44, height: 52, background: 'none', border: 'none',
            color: T.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconMinus size={16}/></button>
          <div style={{
            minWidth: 28, textAlign: 'center',
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 16,
            fontWeight: 700, color: T.text,
          }}>{qty}</div>
          <button onClick={() => setQty(qty + 1)} style={{
            width: 44, height: 52, background: 'none', border: 'none',
            color: T.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconPlus size={16}/></button>
        </div>
        <button onClick={() => onAddToCart && onAddToCart(p, qty)} style={{
          flex: 1, height: 52, background: T.accent, color: '#fff',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          letterSpacing: 0.3, cursor: 'pointer', fontFamily: window.SILENTEC_FONT,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          textTransform: 'uppercase',
        }}>
          Agregar · {fmtARS(p.precio * qty)}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  STBadge, STTabBar, STTopBar, STIconBtn, fmtARS,
  ScreenLogin, ScreenHome, ScreenCatalog, ScreenDetail,
});
