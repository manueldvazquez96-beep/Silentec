// routes/orders.js — Pedidos (confirmar carrito y consultar historial)

const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

function nextOrderNumber(db) {
  const last = db.prepare(`SELECT numero FROM pedidos ORDER BY id DESC LIMIT 1`).get();
  if (!last) return 'P-10001';
  const n = parseInt(last.numero.replace('P-', ''), 10);
  return `P-${String(n + 1).padStart(5, '0')}`;
}

// GET /api/orders  — historial del cliente
// Query: page, limit, estado
router.get('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const { page = 1, limit = 20, estado } = req.query;

  let sql    = `SELECT * FROM pedidos WHERE cliente_id=?`;
  const params = [req.cliente.id];

  if (estado) { sql += ` AND estado=?`; params.push(estado); }
  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), (Number(page) - 1) * Number(limit));

  const items = db.prepare(sql).all(...params);
  const { total } = db.prepare(
    `SELECT COUNT(*) as total FROM pedidos WHERE cliente_id=?${estado ? ' AND estado=?' : ''}`
  ).get(...(estado ? [req.cliente.id, estado] : [req.cliente.id]));

  res.json({ total, page: Number(page), limit: Number(limit), items });
});

// GET /api/orders/:id  — detalle de un pedido con sus ítems
router.get('/:id', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const pedido = db.prepare(
    `SELECT * FROM pedidos WHERE id=? AND cliente_id=?`
  ).get(req.params.id, req.cliente.id);

  if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });

  const items = db.prepare(`
    SELECT
      pi.cantidad, pi.precio_unit, pi.subtotal,
      p.codigo_st, p.codigo_oe, p.descripcion, p.modelo,
      m.nombre AS marca
    FROM pedido_items pi
    JOIN productos p ON p.id = pi.producto_id
    LEFT JOIN marcas m ON m.id = p.marca_id
    WHERE pi.pedido_id = ?
  `).all(pedido.id);

  res.json({ ...pedido, items });
});

// POST /api/orders  — confirmar el carrito actual como nuevo pedido
router.post('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;

  const cart = db.prepare(`SELECT * FROM carritos WHERE cliente_id=?`).get(req.cliente.id);
  if (!cart) return res.status(400).json({ error: 'No tenés un carrito activo' });

  const cartItems = db.prepare(`
    SELECT ci.*, p.precio AS precio_actual, p.stock
    FROM carrito_items ci
    JOIN productos p ON p.id = ci.producto_id
    WHERE ci.carrito_id = ?
  `).all(cart.id);

  if (cartItems.length === 0) return res.status(400).json({ error: 'El carrito está vacío' });

  // Verificar stock
  for (const item of cartItems) {
    if (item.stock < item.cantidad) {
      return res.status(409).json({
        error: `Stock insuficiente para producto ${item.producto_id}. Disponible: ${item.stock}`,
      });
    }
  }

  // Obtener descuento del cliente
  const cliente    = db.prepare(`SELECT descuento FROM clientes WHERE id=?`).get(req.cliente.id);
  const subtotal   = cartItems.reduce((s, i) => s + i.precio_unit * i.cantidad, 0);
  const descuento  = Math.round(subtotal * (cliente.descuento / 100));
  const iva        = Math.round((subtotal - descuento) * 0.21);
  const total      = subtotal - descuento + iva;
  const numero     = nextOrderNumber(db);

  // Transacción: crear pedido, copiar ítems, descontar stock, vaciar carrito
  let pedidoId;
  db.exec('BEGIN');
  try {
    pedidoId = db.prepare(`
      INSERT INTO pedidos (numero, cliente_id, estado, subtotal, descuento, iva, total)
      VALUES (?, ?, 'Pendiente', ?, ?, ?, ?)
    `).run(numero, req.cliente.id, subtotal, descuento, iva, total).lastInsertRowid;

    for (const item of cartItems) {
      db.prepare(`
        INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unit, subtotal)
        VALUES (?, ?, ?, ?, ?)
      `).run(pedidoId, item.producto_id, item.cantidad, item.precio_unit, item.precio_unit * item.cantidad);

      db.prepare(`UPDATE productos SET stock=stock-? WHERE id=?`).run(item.cantidad, item.producto_id);
    }

    db.prepare(`DELETE FROM carrito_items WHERE carrito_id=?`).run(cart.id);
    db.exec('COMMIT');
  } catch (txErr) {
    db.exec('ROLLBACK');
    throw txErr;
  }
  const pedido   = db.prepare(`SELECT * FROM pedidos WHERE id=?`).get(pedidoId);
  res.status(201).json(pedido);
});

module.exports = router;
