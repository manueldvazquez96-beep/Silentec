// SILENTEC — pantallas parte 2: Chat IA, Reportes, Pedido, Perfil

// ═══════════════════════════════════════════════════════════
// 5. CHAT IA
// ═══════════════════════════════════════════════════════════
function ScreenChat() {
  const T = window.T;
  const [messages, setMessages] = React.useState(window.SILENTEC_CHAT_EJEMPLO);
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef(null);

  const send = () => {
    if (!input.trim()) return;
    const q = input;
    setMessages([...messages, { role: 'user', text: q }]);
    setInput('');
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'assistant',
        text: 'Dejame chequear en el sistema. Un segundo...',
        thinking: true,
      }]);
    }, 300);
  };

  const suggestions = [
    'Ver juego completo Ranger',
    'Alternativa económica',
    'Compatibilidad con 2014',
  ];

  return (
    <div style={{ height: '100%', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        padding: '54px 20px 14px', borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 42, height: 42, borderRadius: 11,
          background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', position: 'relative',
        }}>
          <IconSpark size={20}/>
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 12, height: 12, borderRadius: 6, background: T.success,
            border: `2px solid ${T.bg}`,
          }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: -0.3,
          }}>Asistente SILENTEC</div>
          <div style={{
            fontSize: 12, color: T.textMuted,
            fontFamily: window.SILENTEC_FONT_MONO, letterSpacing: 0.3,
          }}>
            <span style={{ color: T.success }}>●</span> En línea · Catálogo 2026
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '14px 16px 8px' }}>
        {/* Intro strip */}
        <div style={{
          padding: 14, borderRadius: 12, background: T.surface,
          border: `1px dashed ${T.border}`, marginBottom: 18,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
            letterSpacing: 1.4, color: T.textDim, textTransform: 'uppercase',
          }}>
            <IconWrench size={12}/> ASISTENTE TÉCNICO · BETA
          </div>
          <div style={{ fontSize: 13, color: T.textMuted, marginTop: 8, lineHeight: 1.5 }}>
            Consultá por código OE, modelo o tipo de pieza. Te ayudo a encontrar el repuesto
            correcto y confirmo stock al instante.
          </div>
        </div>

        {messages.map((m, i) => (
          <ChatMessage key={i} msg={m} T={T}/>
        ))}
      </div>

      {/* Suggestions */}
      <div style={{
        padding: '6px 16px 8px', display: 'flex', gap: 6,
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {suggestions.map((s, i) => (
          <button key={i} onClick={() => setInput(s)} style={{
            padding: '8px 12px', borderRadius: 10, whiteSpace: 'nowrap',
            background: T.surface, color: T.text,
            border: `1px solid ${T.border}`,
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            fontFamily: window.SILENTEC_FONT,
          }}>↳ {s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        padding: '8px 16px 100px',
        background: T.bg,
        borderTop: `1px solid ${T.border}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: '6px 6px 6px 14px', marginTop: 8,
        }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Consultá por modelo u OE..."
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              color: T.text, fontFamily: window.SILENTEC_FONT, fontSize: 15,
              padding: '10px 0',
            }}
          />
          <button onClick={send} style={{
            width: 40, height: 40, borderRadius: 10,
            background: input.trim() ? T.accent : T.surface3,
            border: 'none', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><IconSend size={16}/></button>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg, T }) {
  const isUser = msg.role === 'user';

  // render simple markdown bold **x**
  const parts = msg.text.split(/(\*\*[^*]+\*\*)/g).map((s, i) =>
    s.startsWith('**')
      ? <span key={i} style={{
          fontWeight: 800,
          color: isUser ? '#fff' : T.accent,
          fontFamily: s.includes('ST:') ? window.SILENTEC_FONT_MONO : window.SILENTEC_FONT,
        }}>{s.slice(2, -2)}</span>
      : <span key={i}>{s}</span>
  );

  return (
    <div style={{
      display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: T.accentSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: T.accent, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
        }}><IconSpark size={14}/></div>
      )}
      <div style={{
        maxWidth: '78%',
        background: isUser ? T.accent : T.surface,
        color: isUser ? '#fff' : T.text,
        border: isUser ? 'none' : `1px solid ${T.border}`,
        padding: '10px 14px',
        borderRadius: 16,
        borderBottomRightRadius: isUser ? 4 : 16,
        borderBottomLeftRadius: !isUser ? 4 : 16,
        fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap',
      }}>{parts}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 6. REPORTES (últimas compras)
// ═══════════════════════════════════════════════════════════
function ScreenReports() {
  const T = window.T;
  const [range, setRange] = React.useState('90d');

  // tiny bar chart data
  const bars = [42, 61, 38, 72, 55, 48, 84, 67, 52, 90, 78, 64];
  const max = Math.max(...bars);

  const estadoTone = (e) => e === 'Entregado' ? 'ok' : e === 'En preparación' ? 'low' : 'neutral';

  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 110 }}>
      <STTopBar title="Reportes" subtitle="MIS COMPRAS Y PEDIDOS"
        right={
          <STIconBtn><IconFilter size={18}/></STIconBtn>
        }
      />

      {/* Range chips */}
      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 6 }}>
        {[['30d','30 días'], ['90d','90 días'], ['ytd','Año'], ['all','Todo']].map(([k, l]) => {
          const on = range === k;
          return (
            <button key={k} onClick={() => setRange(k)} style={{
              padding: '7px 12px', borderRadius: 8, border: `1px solid ${on ? T.text : T.border}`,
              background: on ? T.text : T.surface, color: on ? T.bg : T.text,
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: window.SILENTEC_FONT,
            }}>{l}</button>
          );
        })}
      </div>

      {/* Hero stats */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 16, padding: 18, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
            color: T.textDim, textTransform: 'uppercase',
          }}>COMPRADO · ÚLTIMOS 90 DÍAS</div>
          <div style={{
            fontSize: 36, fontWeight: 800, color: T.text, marginTop: 4,
            letterSpacing: -1.2, lineHeight: 1.05, fontStretch: '88%',
          }}>$ 1.254.350</div>
          <div style={{ display: 'flex', gap: 20, marginTop: 8, alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: T.success, fontWeight: 600 }}>
              ↑ 12% vs. trimestre anterior
            </div>
            <div style={{ fontSize: 12, color: T.textMuted }}>
              69 unidades · 23 pedidos
            </div>
          </div>

          {/* bar chart */}
          <div style={{
            marginTop: 18, display: 'flex', alignItems: 'flex-end', gap: 4,
            height: 70,
          }}>
            {bars.map((v, i) => (
              <div key={i} style={{
                flex: 1, height: `${(v/max)*100}%`,
                background: i === bars.length - 1 ? T.accent
                  : i === bars.length - 2 ? T.accent
                  : T.surface3,
                borderRadius: '3px 3px 0 0',
                opacity: i === bars.length - 1 ? 1 : i === bars.length - 2 ? 0.7 : 1,
              }}/>
            ))}
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: 6,
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 9,
            color: T.textDim, letterSpacing: 1,
          }}>
            <span style={{ textAlign: 'center' }}>ENE</span>
            <span style={{ textAlign: 'center' }}>FEB</span>
            <span style={{ textAlign: 'center' }}>MAR</span>
            <span style={{ textAlign: 'center' }}>ABR</span>
          </div>
        </div>
      </div>

      {/* Top pieces */}
      <div style={{ padding: '6px 20px 14px' }}>
        <div style={{
          fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
          color: T.textDim, textTransform: 'uppercase', marginBottom: 10,
        }}>MÁS COMPRADAS</div>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, overflow: 'hidden',
        }}>
          {[
            { st: 'ST: 007-001-011', name: 'Buje barra estab. VW Amarok', u: 28, p: 180600 },
            { st: 'ST: 009-004-019', name: 'Tope amort. Peugeot 208',     u: 22, p: 108900 },
            { st: 'ST: 007-003-024', name: 'Buje parrilla Ford Ranger',   u: 18, p: 266400 },
          ].map((r, i, a) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px',
              borderBottom: i < a.length - 1 ? `1px solid ${T.border}` : 'none',
            }}>
              <div style={{
                width: 24, textAlign: 'center',
                fontFamily: window.SILENTEC_FONT_MONO, fontSize: 13,
                fontWeight: 700, color: T.accent,
              }}>{String(i+1).padStart(2, '0')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 700, color: T.text,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{r.name}</div>
                <div style={{
                  fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
                  color: T.textDim, marginTop: 1,
                }}>{r.st}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{r.u} u.</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{window.fmtARS(r.p)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order history */}
      <div style={{ padding: '6px 20px 0' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          marginBottom: 10,
        }}>
          <div style={{
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
            color: T.textDim, textTransform: 'uppercase',
          }}>HISTORIAL DE PEDIDOS</div>
          <span style={{ fontSize: 11, color: T.accent, fontWeight: 600 }}>Exportar</span>
        </div>
        {window.SILENTEC_PEDIDOS.map((p, i) => (
          <div key={i} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: '12px 14px', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: T.chip,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.textMuted,
            }}><IconDoc size={18}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: window.SILENTEC_FONT_MONO, fontSize: 12,
                  fontWeight: 700, color: T.text,
                }}>{p.id}</span>
                <STBadge tone={estadoTone(p.estado)}>{p.estado}</STBadge>
              </div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                {p.fecha} · {p.items} ítems
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>
                {window.fmtARS(p.total)}
              </div>
              <div style={{
                fontSize: 11, color: T.accent, fontWeight: 600, marginTop: 2,
              }}>Ver detalle →</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 7. PEDIDO / CARRITO
// ═══════════════════════════════════════════════════════════
function ScreenCart() {
  const T = window.T;
  const items = [
    { ...window.SILENTEC_PRODUCTOS[0], q: 4 },
    { ...window.SILENTEC_PRODUCTOS[1], q: 12 },
    { ...window.SILENTEC_PRODUCTOS[6], q: 2 },
  ];
  const subtotal = items.reduce((s, i) => s + i.precio * i.q, 0);
  const desc = Math.round(subtotal * 0.05);
  const iva = Math.round((subtotal - desc) * 0.21);
  const total = subtotal - desc + iva;

  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 220 }}>
      <STTopBar title="Pedido" subtitle="BORRADOR · NO ENVIADO"
        right={
          <div style={{
            padding: '6px 10px', background: T.accentSoft,
            color: T.accent, borderRadius: 8,
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 11,
            fontWeight: 700, letterSpacing: 0.5,
          }}>{items.length} ÍTEMS</div>
        }
      />

      {/* Delivery card */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, background: T.chip,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: T.accent,
          }}><IconTruck size={20}/></div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.3,
              color: T.textDim, textTransform: 'uppercase',
            }}>ENTREGA EN</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginTop: 1 }}>
              REPUESTOS DEL CENTRO
            </div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 1 }}>
              Av. Colón 2340 · Córdoba · 24-48hs
            </div>
          </div>
          <IconChevR size={18} color={T.textMuted}/>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '0 20px' }}>
        {items.map((it, i) => (
          <div key={i} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: 12, marginBottom: 8,
            display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 8, flexShrink: 0,
              background: T.dark
                ? 'repeating-linear-gradient(45deg, #242629 0 5px, #1b1d20 5px 10px)'
                : 'repeating-linear-gradient(45deg, #e8eaee 0 5px, #dde0e5 5px 10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: T.textDim,
            }}><IconBox size={20} sw={1.3}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10,
                color: T.accent, fontWeight: 600,
              }}>{it.st}</div>
              <div style={{
                fontSize: 13, fontWeight: 700, color: T.text, marginTop: 2,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.tipo}</div>
              <div style={{
                fontSize: 11, color: T.textMuted, marginTop: 1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{it.marca} {it.modelo}</div>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: 10,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center',
                  background: T.chip, borderRadius: 8, height: 28,
                }}>
                  <div style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: T.text, cursor: 'pointer',
                  }}><IconMinus size={12}/></div>
                  <div style={{
                    minWidth: 24, textAlign: 'center',
                    fontFamily: window.SILENTEC_FONT_MONO, fontSize: 13,
                    fontWeight: 700, color: T.text,
                  }}>{it.q}</div>
                  <div style={{
                    width: 28, height: 28, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: T.text, cursor: 'pointer',
                  }}><IconPlus size={12}/></div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 800, color: T.text,
                  letterSpacing: -0.3,
                }}>{window.fmtARS(it.precio * it.q)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div style={{ padding: '8px 20px 0' }}>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '14px 16px',
        }}>
          {[
            ['Subtotal', window.fmtARS(subtotal)],
            ['Descuento mayorista · 5%', '-' + window.fmtARS(desc), T.success],
            ['IVA 21%', window.fmtARS(iva)],
          ].map(([k, v, c], i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '4px 0', fontSize: 13,
            }}>
              <span style={{ color: T.textMuted }}>{k}</span>
              <span style={{ color: c || T.text, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{
            height: 1, background: T.border, margin: '10px 0 6px',
          }}/>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <span style={{
              fontFamily: window.SILENTEC_FONT_MONO, fontSize: 11, letterSpacing: 1.3,
              color: T.textDim, textTransform: 'uppercase',
            }}>TOTAL</span>
            <span style={{
              fontSize: 26, fontWeight: 800, color: T.text, letterSpacing: -0.7,
              fontStretch: '88%',
            }}>{window.fmtARS(total)}</span>
          </div>
        </div>
      </div>

      {/* Confirm dock */}
      <div style={{
        position: 'absolute', bottom: 82, left: 0, right: 0,
        padding: '12px 20px',
        background: T.dark
          ? `linear-gradient(to top, ${T.bg} 70%, rgba(0,0,0,0))`
          : `linear-gradient(to top, ${T.bg} 70%, rgba(255,255,255,0))`,
        borderTop: `1px solid ${T.border}`,
      }}>
        <button style={{
          width: '100%', height: 54, background: T.accent, color: '#fff',
          border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700,
          letterSpacing: 0.4, cursor: 'pointer', fontFamily: window.SILENTEC_FONT,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          textTransform: 'uppercase',
        }}>
          <IconCheck size={18} sw={2.4}/>
          Confirmar pedido · {window.fmtARS(total)}
        </button>
        <div style={{
          textAlign: 'center', fontSize: 11, color: T.textDim, marginTop: 8,
          fontFamily: window.SILENTEC_FONT_MONO, letterSpacing: 0.5,
        }}>Se descontará de cuenta corriente</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 8. PERFIL
// ═══════════════════════════════════════════════════════════
function ScreenProfile({ onLogout }) {
  const T = window.T;
  return (
    <div style={{ height: '100%', background: T.bg, overflow: 'auto', paddingBottom: 110 }}>
      <STTopBar title="Cuenta" subtitle="MI CUENTA MAYORISTA"/>

      {/* Identity card */}
      <div style={{ padding: '0 20px 14px' }}>
        <div style={{
          background: T.dark
            ? `linear-gradient(135deg, ${T.surface} 0%, ${T.surface2} 100%)`
            : `linear-gradient(135deg, ${T.surface} 0%, ${T.surface3} 100%)`,
          border: `1px solid ${T.border}`, borderRadius: 16, padding: 18,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 140, height: 140,
            borderRadius: '50%', background: T.accentSoft, filter: 'blur(30px)',
          }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: T.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, letterSpacing: -1,
              }}>RC</div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: T.text, letterSpacing: -0.3 }}>
                  REPUESTOS DEL CENTRO
                </div>
                <div style={{
                  fontFamily: window.SILENTEC_FONT_MONO, fontSize: 11,
                  color: T.textMuted, marginTop: 2, letterSpacing: 0.3,
                }}>CUIT 30-71485293-4 · Cta. #4821</div>
              </div>
            </div>
            <div style={{
              marginTop: 16, paddingTop: 14, borderTop: `1px solid ${T.border}`,
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
            }}>
              {[
                ['NIVEL', 'Oro'],
                ['DESC.', '5%'],
                ['PLAZO', '30 días'],
              ].map(([k, v], i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: window.SILENTEC_FONT_MONO, fontSize: 9,
                    color: T.textDim, letterSpacing: 1.3,
                  }}>{k}</div>
                  <div style={{
                    fontSize: 15, fontWeight: 800, color: T.text, marginTop: 2,
                    letterSpacing: -0.3,
                  }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings groups */}
      {[
        { title: 'GESTIÓN',     items: [
          ['Datos de la cuenta', IconUser],
          ['Direcciones de entrega', IconTruck],
          ['Usuarios autorizados', IconUser],
        ]},
        { title: 'PEDIDOS Y PAGOS', items: [
          ['Estado de cuenta corriente', IconChart],
          ['Medios de pago', IconTag],
          ['Listas guardadas', IconBookmark],
        ]},
        { title: 'SOPORTE', items: [
          ['Contactar ejecutivo de cuenta', IconChat],
          ['Centro de ayuda', IconDoc],
          ['Términos y condiciones', IconDoc],
        ]},
      ].map((group, gi) => (
        <div key={gi} style={{ padding: '0 20px 14px' }}>
          <div style={{
            fontFamily: window.SILENTEC_FONT_MONO, fontSize: 10, letterSpacing: 1.4,
            color: T.textDim, textTransform: 'uppercase', marginBottom: 8,
          }}>{group.title}</div>
          <div style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, overflow: 'hidden',
          }}>
            {group.items.map(([label, IC], i, a) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '13px 14px',
                borderBottom: i < a.length - 1 ? `1px solid ${T.border}` : 'none',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, background: T.chip,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: T.textMuted,
                }}><IC size={16}/></div>
                <div style={{ flex: 1, fontSize: 14, color: T.text, fontWeight: 500 }}>
                  {label}
                </div>
                <IconChevR size={16} color={T.textDim}/>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ padding: '0 20px 20px' }}>
        <button onClick={onLogout} style={{
          width: '100%', padding: 14,
          background: 'transparent', color: T.danger,
          border: `1px solid ${T.border}`,
          borderRadius: 12, fontSize: 14, fontWeight: 600,
          fontFamily: window.SILENTEC_FONT, cursor: 'pointer',
        }}>Cerrar sesión</button>
        <div style={{
          textAlign: 'center', fontSize: 10, color: T.textDim, marginTop: 14,
          fontFamily: window.SILENTEC_FONT_MONO, letterSpacing: 1.3,
        }}>SILENTEC v1.0.0 · RESPALDADO POR COARDEL</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ScreenChat, ScreenReports, ScreenCart, ScreenProfile,
});
