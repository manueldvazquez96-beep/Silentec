'use client';

import { useEffect, useRef, useState } from 'react';
import { api, ChatMessage } from '@/lib/api';
import Topbar from '@/components/Topbar';
import { Btn, Spinner } from '@/components/ui';

export default function AsistentePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api.chat.history().then(setMessages).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    setError('');
    setSending(true);

    const userMsg: ChatMessage = { id: Date.now(), role: 'user', content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const { response } = await api.chat.send(text);
      const assistantMsg: ChatMessage = { id: Date.now() + 1, role: 'assistant', content: response, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err.message || 'Error al enviar el mensaje');
      setMessages(prev => prev.filter(m => m.id !== userMsg.id));
    } finally { setSending(false); }
  }

  async function handleClear() {
    if (!confirm('¿Borrar el historial del chat?')) return;
    await api.chat.clear();
    setMessages([]);
  }

  return (
    <>
      <Topbar breadcrumb="Asistente IA" />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: 0, padding: '28px 32px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 11, letterSpacing: '1.5px', color: '#1834FF', fontWeight: 700, marginBottom: 6 }}>ASISTENTE IA · POWERED BY CLAUDE</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.6px', margin: 0 }}>Asistente SILENTEC</h1>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Consultá compatibilidades, juegos de repuestos y más.</div>
          </div>
          {messages.length > 0 && (
            <Btn variant="ghost" onClick={handleClear} style={{ fontSize: 12 }}>Limpiar historial</Btn>
          )}
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px 14px 0 0', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 300 }}>
          {loading ? <Spinner /> : messages.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>🤖</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', textAlign: 'center' }}>¿En qué puedo ayudarte?</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 400 }}>Podés preguntarme sobre compatibilidades, qué repuesto usar para un vehículo específico, o características de los productos SILENTEC.</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {[
                  '¿Qué bujes tiene una Ford Ranger 2019?',
                  'Comparame cazoletas para Peugeot 208',
                  '¿Cuál es la diferencia entre ST-007 y ST-012?',
                ].map(s => (
                  <button key={s} onClick={() => setInput(s)} style={{ padding: '8px 14px', borderRadius: 20, border: '1px solid var(--border)', background: 'var(--surface2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--text)' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-start' }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1834FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                  )}
                  <div style={{
                    maxWidth: '72%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                    background: msg.role === 'user' ? '#1834FF' : 'var(--surface2)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text)',
                    fontSize: 14, lineHeight: 1.6,
                  }}>
                    {msg.content}
                    <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, fontFamily: '"JetBrains Mono", monospace' }}>
                      {new Date(msg.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1834FF', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🤖</div>
                  <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: 'var(--surface2)', display: 'flex', gap: 6, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-dim)', animation: `bounce 1.2s ${i * 0.2}s infinite`, display: 'inline-block' }} />)}
                    <style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0.8);opacity:0.5} 40%{transform:scale(1.2);opacity:1} }`}</style>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 14px 14px', padding: '12px 16px', marginBottom: 28 }}>
          {error && <div style={{ color: '#C62828', fontSize: 12, marginBottom: 8, padding: '6px 10px', background: 'rgba(198,40,40,0.06)', borderRadius: 6 }}>{error}</div>}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: 10 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Escribí tu consulta aquí…"
              disabled={sending}
              style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 14, outline: 'none', background: 'var(--surface2)' }}
            />
            <button type="submit" disabled={sending || !input.trim()}
              style={{ padding: '12px 20px', borderRadius: 10, background: '#1834FF', color: '#fff', border: 'none', fontWeight: 700, fontSize: 14, cursor: !input.trim() || sending ? 'not-allowed' : 'pointer', opacity: !input.trim() || sending ? 0.5 : 1 }}>
              Enviar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
