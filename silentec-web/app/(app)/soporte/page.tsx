'use client';

import { useState } from 'react';
import Topbar from '@/components/Topbar';
import { Panel, PanelHead, PanelBody, Btn, MonoLabel } from '@/components/ui';

export default function SoportePage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ asunto: '', mensaje: '', tipo: 'consulta' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const faqs = [
    { q: '¿Cómo hago un pedido?', a: 'Navegá al Catálogo, agregá los productos que necesitás y hacé clic en "Confirmar pedido" desde la página "Pedido actual".' },
    { q: '¿Cómo consulto el estado de mi pedido?', a: 'Desde "Historial de pedidos" podés ver el estado de todos tus pedidos. También te notificamos por email ante cada cambio.' },
    { q: '¿Puedo buscar repuestos por código OE?', a: 'Sí, desde el "Buscador OE" podés buscar por el código del fabricante o número SILENTEC (ST).' },
    { q: '¿Qué significa cada nivel de descuento?', a: 'Los niveles (Minorista, Bronce, Plata, Oro, Platino) están basados en el volumen de compra anual. Revisá la tabla en "Mi cuenta".' },
    { q: '¿Cómo contacto a mi ejecutivo de ventas?', a: 'Podés escribirnos por este formulario o llamar al número que figura en tu cuenta. También podés usar el Asistente IA para consultas técnicas.' },
  ];

  return (
    <>
      <Topbar breadcrumb="Soporte" />
      <div style={{ padding: '28px 32px 60px' }}>
        <div style={{ marginBottom: 24 }}>
          <MonoLabel>SOPORTE TÉCNICO</MonoLabel>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: '8px 0 6px' }}>Soporte técnico</h1>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>¿Tenés alguna duda? Estamos para ayudarte.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
          {/* FAQ */}
          <div>
            <Panel>
              <PanelHead title="Preguntas frecuentes" />
              <PanelBody noPad>
                {faqs.map((faq, i) => (
                  <FAQItem key={i} q={faq.q} a={faq.a} last={i === faqs.length - 1} />
                ))}
              </PanelBody>
            </Panel>
          </div>

          {/* Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Panel>
              <PanelHead title="Contacto directo" />
              <PanelBody>
                {[
                  { icon: '📧', label: 'Email', value: 'ventas@silentec.com.ar' },
                  { icon: '📞', label: 'Teléfono', value: '+54 11 4000-0000' },
                  { icon: '⏰', label: 'Horario', value: 'Lun–Vie 8:00–17:00' },
                ].map(c => (
                  <div key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <span style={{ fontSize: 20 }}>{c.icon}</span>
                    <div>
                      <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>{c.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{c.value}</div>
                    </div>
                  </div>
                ))}
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHead title="Enviar consulta" />
              <PanelBody>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>¡Mensaje enviado!</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Te respondemos en las próximas 24hs hábiles.</div>
                    <Btn variant="ghost" onClick={() => { setSent(false); setForm({ asunto: '', mensaje: '', tipo: 'consulta' }); }}>
                      Enviar otro mensaje
                    </Btn>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Tipo</label>
                      <select value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value }))}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface2)' }}>
                        <option value="consulta">Consulta comercial</option>
                        <option value="tecnico">Consulta técnica</option>
                        <option value="pedido">Problema con pedido</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Asunto</label>
                      <input value={form.asunto} onChange={e => setForm(f => ({ ...f, asunto: e.target.value }))} required
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface2)' }}
                        placeholder="Ej. Consulta sobre compatibilidad Ford Ranger" />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontFamily: '"JetBrains Mono", monospace', fontSize: 10, letterSpacing: '1.3px', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Mensaje</label>
                      <textarea value={form.mensaje} onChange={e => setForm(f => ({ ...f, mensaje: e.target.value }))} required rows={4}
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid var(--border-strong)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--surface2)', resize: 'vertical' }}
                        placeholder="Describí tu consulta en detalle…" />
                    </div>
                    <Btn type="submit" style={{ width: '100%', justifyContent: 'center' }}>
                      Enviar consulta
                    </Btn>
                  </form>
                )}
              </PanelBody>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}

function FAQItem({ q, a, last }: { q: string; a: string; last: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: last ? 'none' : '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setOpen(o => !o)}>
      <div style={{ padding: '16px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{q}</span>
        <span style={{ flexShrink: 0, fontSize: 18, color: 'var(--text-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>↓</span>
      </div>
      {open && <div style={{ padding: '0 22px 16px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{a}</div>}
    </div>
  );
}
