// routes/cart.js — Carrito / borrador de pedido

const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// Obtiene o crea el carrito activo del cliente
function getOrCreateCart(db, clienteId) {
  let cart = db.prepare(`SELECT * FROM carritos WHERE cliente_id=?`).get(clienteId);
  if (!cart) {
    const r = db.prepare(`INSERT INTO carritos (cliente_id) VALUES (?)`).run(clienteId);
    cart = db.prepare(`SELECT * FROM carritos WHERE id=?`).get(r.lastInsertRowid);
  }
  return cart;
}

function buildCartResponse(db, cartId) {
  const items = db.prepare(`
    SELECT
      ci.id, ci.cantidad, ci.precio_unit,
      ci.cantidad * ci.precio_unit AS subtotal,
      p.id AS producto_id, p.codigo_st, p.codigo_oe,
      p.descripcion, p.modelo, p.marca_id, p.stock,
      m.nombre AS marca
    FROM carrito_items ci
    JOIN productos p ON p.id = ci.producto_id
    LEFT JOIN marcas m ON m.id = p.marca_id
    WHERE ci.carrito_id = ?
  `).all(cartId);

  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  return { cart_id: cartId, items, subtotal };
}

// GET /api/cart
router.get('/', requireAuth, (req, res) => {
  const db   = req.app.locals.db;
  const cart = getOrCreateCart(db, req.cliente.id);
  res.json(buildCartResponse(db, cart.id));
});

// POST /api/cart/items
// Body: { producto_id, cantidad }
router.post('/items', requireAuth, (req, res) => {
  const { producto_id, cantidad = 1 } = req.body;
  if (!producto_id || cantidad < 1) {
    return res.status(400).json({ error: 'producto_id y cantidad requeridos' });
  }

  const db      = req.app.locals.db;
  const product = db.prepare(`SELECT * FROM productos WHERE id=? AND activo=1`).get(producto_id);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

  const cart = getOrCreateCart(db, req.cliente.id);

  // Upsert
  db.prepare(`
    INSERT INTO carrito_items (carrito_id, producto_id, cantidad, precio_unit)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(carrito_id, producto_id)
    DO UPDATE SET cantidad=excluded.cantidad, precio_unit=excluded.precio_unit
  `).run(cart.id, producto_id, cantidad, product.precio);

  db.prepare(`UPDATE carritos SET updated_at=datetime('now') WHERE id=?`).run(cart.id);

  res.status(201).json(buildCartResponse(db, cart.id));
});

// PUT /api/cart/items/:producto_id
// Body: { cantidad }
router.put('/items/:producto_id', requireAuth, (req, res) => {
  const { cantidad } = req.body;
  if (!cantidad || cantidad < 1) {
    return res.status(400).json({ error: 'cantidad debe ser mayor a 0. Para eliminar usá DELETE.' });
  }

  const db   = req.app.locals.db;
  const cart = getOrCreateCart(db, req.cliente.id);

  const r = db.prepare(`
    UPDATE carrito_items SET cantidad=?
    WHERE carrito_id=? AND producto_id=?
  `).run(cantidad, cart.id, req.params.producto_id);

  if (r.changes === 0) return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
  res.json(buildCartResponse(db, cart.id));
});

// DELETE /api/cart/items/:producto_id
router.delete('/items/:producto_id', requireAuth, (req, res) => {
  const db   = req.app.locals.db;
  const cart = getOrCreateCart(db, req.cliente.id);

  const r = db.prepare(`
    DELETE FROM carrito_items WHERE carrito_id=? AND producto_id=?
  `).run(cart.id, req.params.producto_id);

  if (r.changes === 0) return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
  res.json(buildCartResponse(db, cart.id));
});

// DELETE /api/cart  — vaciar el carrito
router.delete('/', requireAuth, (req, res) => {
  const db   = req.app.locals.db;
  const cart = getOrCreateCart(db, req.cliente.id);
  db.prepare(`DELETE FROM carrito_items WHERE carrito_id=?`).run(cart.id);
  res.json({ message: 'Carrito vaciado', cart_id: cart.id, items: [], subtotal: 0 });
});

module.exports = router;
