// routes/chat.js — Asistente IA con historial por cliente

const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const SYSTEM_PROMPT = `Sos el asistente de ventas de COARDEL, una empresa argentina mayorista de autopartes de suspensión y dirección (marca SILENTEC).
Ayudás a los clientes (talleres y distribuidores) con consultas sobre productos, stock, precios, compatibilidades y pedidos.

Tipos de productos:
- Bujes de punta de eje (001)
- Cazoletas de amortiguador (002)
- Crapodinas (003)
- Topes de amortiguador (004)
- Soportes de motor (005)

Cuando el cliente pregunta por un producto, buscá en el catálogo provisto en el contexto.
Respondé siempre en español argentino, de forma concisa y profesional.
Si no tenés información de un producto específico, decilo claramente.
No inventes precios ni stock que no estén en el contexto.`;

function buildCatalogContext(db) {
  const productos = db.prepare(`
    SELECT p.codigo_st, p.codigo_oe, p.descripcion, p.modelo, p.anio,
           p.stock, p.precio, m.nombre AS marca, t.nombre AS tipo
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
    LEFT JOIN tipos t ON t.id = p.tipo_id
    WHERE p.activo = 1
    ORDER BY p.rotacion DESC
    LIMIT 50
  `).all();

  if (productos.length === 0) return '';

  const lines = productos.map(p =>
    `[${p.codigo_st}] ${p.descripcion} | Marca: ${p.marca} | Modelo: ${p.modelo}${p.anio ? ' ' + p.anio : ''} | Stock: ${p.stock} | Precio: $${p.precio} | Tipo: ${p.tipo}${p.codigo_oe ? ' | OE: ' + p.codigo_oe : ''}`
  );

  return `\n\nCATÁLOGO ACTUAL (${productos.length} productos):\n${lines.join('\n')}`;
}

// GET /api/chat  — historial del cliente
router.get('/', requireAuth, (req, res) => {
  const db  = req.app.locals.db;
  const cid = req.cliente.id;
  const { limit = 50 } = req.query;

  const mensajes = db.prepare(`
    SELECT id, role, content, created_at
    FROM chat_mensajes
    WHERE cliente_id = ?
    ORDER BY created_at ASC
    LIMIT ?
  `).all(cid, Number(limit));

  res.json(mensajes);
});

// POST /api/chat  — enviar mensaje y obtener respuesta del asistente
// Body: { message: string }
router.post('/', requireAuth, async (req, res) => {
  if (!anthropic) {
    return res.status(503).json({ error: 'El asistente IA no está configurado aún.' });
  }

  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
  }

  const db  = req.app.locals.db;
  const cid = req.cliente.id;

  // Guardar mensaje del usuario
  db.prepare(`
    INSERT INTO chat_mensajes (cliente_id, role, content) VALUES (?, 'user', ?)
  `).run(cid, message.trim());

  // Obtener historial reciente (últimos 20 mensajes para contexto)
  const historial = db.prepare(`
    SELECT role, content FROM chat_mensajes
    WHERE cliente_id = ?
    ORDER BY created_at DESC
    LIMIT 20
  `).all(cid).reverse();

  const messages = historial.slice(0, -1).map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }));
  messages.push({ role: 'user', content: message.trim() });

  const systemWithCatalog = SYSTEM_PROMPT + buildCatalogContext(db);

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 1024,
      system: systemWithCatalog,
      messages,
    });

    const assistantText = response.content[0].text;

    db.prepare(`
      INSERT INTO chat_mensajes (cliente_id, role, content) VALUES (?, 'assistant', ?)
    `).run(cid, assistantText);

    res.json({ response: assistantText });
  } catch (err) {
    console.error('Error llamando a Claude:', err.message);
    res.status(502).json({ error: 'Error al procesar la consulta con el asistente IA' });
  }
});

// DELETE /api/chat  — limpiar historial del cliente
router.delete('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  db.prepare(`DELETE FROM chat_mensajes WHERE cliente_id=?`).run(req.cliente.id);
  res.json({ message: 'Historial borrado' });
});

module.exports = router;
