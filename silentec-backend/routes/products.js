// routes/products.js — Catálogo de productos con filtros

const express = require('express');
const { requireAuth } = require('../middleware/auth');
const router = express.Router();

// GET /api/products
// Query params: marca, tipo, q (búsqueda), inStock (true/false), page, limit
router.get('/', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const { marca, tipo, q, inStock, page = 1, limit = 20 } = req.query;

  let sql = `
    SELECT
      p.id, p.codigo_st, p.codigo_oe, p.descripcion,
      p.modelo, p.anio, p.stock, p.precio, p.rotacion,
      m.nombre AS marca, m.id AS marca_id,
      t.id AS tipo_id, t.nombre AS tipo, t.detalle AS tipo_detalle
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
    LEFT JOIN tipos  t ON t.id = p.tipo_id
    WHERE p.activo = 1
  `;
  const params = [];

  if (marca) {
    sql += ` AND m.nombre = ?`;
    params.push(marca);
  }
  if (tipo) {
    sql += ` AND t.id = ?`;
    params.push(tipo);
  }
  if (q) {
    sql += ` AND (
      p.codigo_st LIKE ? OR p.codigo_oe LIKE ?
      OR p.descripcion LIKE ? OR p.modelo LIKE ?
      OR m.nombre LIKE ?
    )`;
    const like = `%${q}%`;
    params.push(like, like, like, like, like);
  }
  if (inStock === 'true') {
    sql += ` AND p.stock > 0`;
  }

  // Total para paginación
  const countSql = `SELECT COUNT(*) as total FROM (${sql}) sub`;
  const { total } = db.prepare(countSql).get(...params);

  // Paginado
  const offset = (Number(page) - 1) * Number(limit);
  sql += ` ORDER BY p.rotacion DESC, p.descripcion ASC LIMIT ? OFFSET ?`;
  params.push(Number(limit), offset);

  const items = db.prepare(sql).all(...params);

  res.json({
    total,
    page: Number(page),
    limit: Number(limit),
    pages: Math.ceil(total / Number(limit)),
    items,
  });
});

// GET /api/products/marcas  — lista de marcas disponibles
router.get('/marcas', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const marcas = db.prepare(`SELECT id, nombre FROM marcas ORDER BY nombre`).all();
  res.json(marcas);
});

// GET /api/products/tipos  — lista de tipos de pieza
router.get('/tipos', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const tipos = db.prepare(`SELECT * FROM tipos ORDER BY nombre`).all();
  res.json(tipos);
});

// GET /api/products/:id
router.get('/:id', requireAuth, (req, res) => {
  const db = req.app.locals.db;
  const product = db.prepare(`
    SELECT
      p.id, p.codigo_st, p.codigo_oe, p.descripcion,
      p.modelo, p.anio, p.stock, p.precio, p.rotacion,
      m.nombre AS marca, t.nombre AS tipo, t.detalle AS tipo_detalle
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
    LEFT JOIN tipos  t ON t.id = p.tipo_id
    WHERE p.id = ? AND p.activo = 1
  `).get(req.params.id);

  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

module.exports = router;
