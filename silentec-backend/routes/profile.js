// routes/profile.js — Perfil y datos del cliente autenticado

const express = require('express');
const bcrypt  = require('bcryptjs');
const { requireAuth } = require('../middleware/auth');
const router  = express.Router();

// GET /api/profile
router.get('/', requireAuth, (req, res) => {
  const db      = req.app.locals.db;
  const cliente = db.prepare(
    `SELECT id, cuit, razon_social, email, nivel, descuento, plazo_pago, direccion, ciudad, cuenta_num, created_at
     FROM clientes WHERE id=? AND activo=1`
  ).get(req.cliente.id);

  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

// GET /api/profile/stats  — métricas para el Home/Dashboard
router.get('/stats', requireAuth, (req, res) => {
  const db  = req.app.locals.db;
  const cid = req.cliente.id;

  const since90 = new Date();
  since90.setDate(since90.getDate() - 90);
  const since90Str = since90.toISOString().split('T')[0];

  const { total90, pedidos90 } = db.prepare(`
    SELECT
      COALESCE(SUM(total), 0) AS total90,
      COUNT(*) AS pedidos90
    FROM pedidos
    WHERE cliente_id=? AND estado != 'Cancelado' AND created_at >= ?
  `).get(cid, since90Str);

  const { pendientes } = db.prepare(`
    SELECT COUNT(*) AS pendientes FROM pedidos
    WHERE cliente_id=? AND estado IN ('Pendiente','En preparación')
  `).get(cid);

  const topProductos = db.prepare(`
    SELECT
      p.codigo_st, p.descripcion,
      m.nombre AS marca,
      SUM(pi.cantidad) AS unidades,
      SUM(pi.subtotal) AS monto
    FROM pedido_items pi
    JOIN pedidos ped  ON ped.id = pi.pedido_id
    JOIN productos p  ON p.id  = pi.producto_id
    LEFT JOIN marcas m ON m.id = p.marca_id
    WHERE ped.cliente_id=? AND ped.created_at >= ?
    GROUP BY pi.producto_id
    ORDER BY unidades DESC
    LIMIT 3
  `).all(cid, since90Str);

  res.json({ total90, pedidos90, pendientes, topProductos });
});

// PATCH /api/profile  — actualizar datos del perfil
// Body: { email, direccion, ciudad }  (sólo campos opcionales)
router.patch('/', requireAuth, (req, res) => {
  const { email, direccion, ciudad } = req.body;
  const db = req.app.locals.db;

  const fields = [];
  const params = [];

  if (email)     { fields.push('email=?');     params.push(email); }
  if (direccion) { fields.push('direccion=?'); params.push(direccion); }
  if (ciudad)    { fields.push('ciudad=?');    params.push(ciudad); }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
  }

  params.push(req.cliente.id);
  try {
    db.prepare(`UPDATE clientes SET ${fields.join(', ')} WHERE id=?`).run(...params);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'El email ya está en uso' });
    }
    throw err;
  }

  const updated = db.prepare(
    `SELECT id, cuit, razon_social, email, nivel, descuento, plazo_pago, direccion, ciudad, cuenta_num
     FROM clientes WHERE id=?`
  ).get(req.cliente.id);
  res.json(updated);
});

// POST /api/profile/change-password
// Body: { current_password, new_password }
router.post('/change-password', requireAuth, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Ambas contraseñas son requeridas' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' });
  }

  const db      = req.app.locals.db;
  const cliente = db.prepare(`SELECT password_hash FROM clientes WHERE id=?`).get(req.cliente.id);

  if (!bcrypt.compareSync(current_password, cliente.password_hash)) {
    return res.status(401).json({ error: 'Contraseña actual incorrecta' });
  }

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare(`UPDATE clientes SET password_hash=? WHERE id=?`).run(hash, req.cliente.id);
  res.json({ message: 'Contraseña actualizada correctamente' });
});

module.exports = router;
