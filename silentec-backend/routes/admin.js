// routes/admin.js — Panel de administración (clientes y productos)

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

// ── Middleware admin ────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' });
  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    if (payload.role !== 'admin') return res.status(403).json({ error: 'No autorizado' });
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// ── POST /api/admin/auth ────────────────────────────────────────
router.post('/auth', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// ══════════════════════════════════════════════════════════════
// CLIENTES
// ══════════════════════════════════════════════════════════════

// GET /api/admin/clients
router.get('/clients', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const clients = db.prepare(`
    SELECT id, cuit, razon_social, email, nivel, descuento, plazo_pago,
           direccion, ciudad, cuenta_num, activo, created_at
    FROM clientes ORDER BY razon_social ASC
  `).all();
  res.json(clients);
});

// POST /api/admin/clients
router.post('/clients', requireAdmin, (req, res) => {
  const { cuit, razon_social, email, password, nivel = 'Bronce',
          descuento = 0, plazo_pago = '30 días', direccion, ciudad, cuenta_num } = req.body;

  if (!cuit || !razon_social || !email || !password) {
    return res.status(400).json({ error: 'cuit, razon_social, email y password son requeridos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const db   = req.app.locals.db;
  const hash = bcrypt.hashSync(password, 10);

  try {
    const result = db.prepare(`
      INSERT INTO clientes (cuit, razon_social, email, password_hash, nivel, descuento, plazo_pago, direccion, ciudad, cuenta_num)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(cuit, razon_social, email, hash, nivel, descuento, plazo_pago,
           direccion || null, ciudad || null, cuenta_num || null);

    const cliente = db.prepare(`SELECT * FROM clientes WHERE id=?`).get(result.lastInsertRowid);
    const { password_hash, ...safe } = cliente;
    res.status(201).json(safe);
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'El CUIT o email ya existe' });
    throw err;
  }
});

// PATCH /api/admin/clients/:id
router.patch('/clients/:id', requireAdmin, (req, res) => {
  const { razon_social, email, nivel, descuento, plazo_pago,
          direccion, ciudad, cuenta_num, password, activo } = req.body;
  const db = req.app.locals.db;

  const fields = [];
  const params = [];

  if (razon_social !== undefined) { fields.push('razon_social=?');  params.push(razon_social); }
  if (email       !== undefined)  { fields.push('email=?');          params.push(email); }
  if (nivel       !== undefined)  { fields.push('nivel=?');          params.push(nivel); }
  if (descuento   !== undefined)  { fields.push('descuento=?');      params.push(descuento); }
  if (plazo_pago  !== undefined)  { fields.push('plazo_pago=?');     params.push(plazo_pago); }
  if (direccion   !== undefined)  { fields.push('direccion=?');      params.push(direccion); }
  if (ciudad      !== undefined)  { fields.push('ciudad=?');         params.push(ciudad); }
  if (cuenta_num  !== undefined)  { fields.push('cuenta_num=?');     params.push(cuenta_num); }
  if (activo      !== undefined)  { fields.push('activo=?');         params.push(activo ? 1 : 0); }
  if (password) {
    if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    fields.push('password_hash=?');
    params.push(bcrypt.hashSync(password, 10));
  }

  if (fields.length === 0) return res.status(400).json({ error: 'Sin campos para actualizar' });

  params.push(req.params.id);
  try {
    const r = db.prepare(`UPDATE clientes SET ${fields.join(', ')} WHERE id=?`).run(...params);
    if (r.changes === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'El email ya existe' });
    throw err;
  }

  const updated = db.prepare(
    `SELECT id, cuit, razon_social, email, nivel, descuento, plazo_pago,
            direccion, ciudad, cuenta_num, activo FROM clientes WHERE id=?`
  ).get(req.params.id);
  res.json(updated);
});

// ══════════════════════════════════════════════════════════════
// PRODUCTOS
// ══════════════════════════════════════════════════════════════

// GET /api/admin/products
router.get('/products', requireAdmin, (req, res) => {
  const db = req.app.locals.db;
  const items = db.prepare(`
    SELECT p.id, p.codigo_st, p.codigo_oe, p.descripcion, p.modelo, p.anio,
           p.stock, p.precio, p.rotacion, p.activo,
           m.id AS marca_id, m.nombre AS marca,
           t.id AS tipo_id, t.nombre AS tipo
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
    LEFT JOIN tipos  t ON t.id = p.tipo_id
    ORDER BY p.descripcion ASC
  `).all();
  res.json(items);
});

// POST /api/admin/products
router.post('/products', requireAdmin, (req, res) => {
  const { codigo_st, codigo_oe, tipo_id, descripcion, marca_id,
          modelo, anio, stock = 0, precio, rotacion = 'media' } = req.body;

  if (!codigo_st || !codigo_oe || !descripcion || !precio) {
    return res.status(400).json({ error: 'codigo_st, codigo_oe, descripcion y precio son requeridos' });
  }

  const db = req.app.locals.db;
  try {
    const result = db.prepare(`
      INSERT INTO productos (codigo_st, codigo_oe, tipo_id, descripcion, marca_id, modelo, anio, stock, precio, rotacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(codigo_st, codigo_oe, tipo_id || null, descripcion,
           marca_id || null, modelo || null, anio || null, stock, precio, rotacion);

    const product = db.prepare(`
      SELECT p.*, m.nombre AS marca, t.nombre AS tipo
      FROM productos p
      LEFT JOIN marcas m ON m.id = p.marca_id
      LEFT JOIN tipos  t ON t.id = p.tipo_id
      WHERE p.id=?
    `).get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'El código ST ya existe' });
    throw err;
  }
});

// PATCH /api/admin/products/:id
router.patch('/products/:id', requireAdmin, (req, res) => {
  const { codigo_st, codigo_oe, tipo_id, descripcion, marca_id,
          modelo, anio, stock, precio, rotacion, activo } = req.body;
  const db = req.app.locals.db;

  const fields = [];
  const params = [];

  if (codigo_st   !== undefined) { fields.push('codigo_st=?');   params.push(codigo_st); }
  if (codigo_oe   !== undefined) { fields.push('codigo_oe=?');   params.push(codigo_oe); }
  if (tipo_id     !== undefined) { fields.push('tipo_id=?');     params.push(tipo_id); }
  if (descripcion !== undefined) { fields.push('descripcion=?'); params.push(descripcion); }
  if (marca_id    !== undefined) { fields.push('marca_id=?');    params.push(marca_id); }
  if (modelo      !== undefined) { fields.push('modelo=?');      params.push(modelo); }
  if (anio        !== undefined) { fields.push('anio=?');        params.push(anio); }
  if (stock       !== undefined) { fields.push('stock=?');       params.push(stock); }
  if (precio      !== undefined) { fields.push('precio=?');      params.push(precio); }
  if (rotacion    !== undefined) { fields.push('rotacion=?');    params.push(rotacion); }
  if (activo      !== undefined) { fields.push('activo=?');      params.push(activo ? 1 : 0); }

  if (fields.length === 0) return res.status(400).json({ error: 'Sin campos para actualizar' });

  params.push(req.params.id);
  try {
    const r = db.prepare(`UPDATE productos SET ${fields.join(', ')} WHERE id=?`).run(...params);
    if (r.changes === 0) return res.status(404).json({ error: 'Producto no encontrado' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'El código ST ya existe' });
    throw err;
  }

  const updated = db.prepare(`
    SELECT p.*, m.nombre AS marca, t.nombre AS tipo
    FROM productos p
    LEFT JOIN marcas m ON m.id = p.marca_id
    LEFT JOIN tipos  t ON t.id = p.tipo_id
    WHERE p.id=?
  `).get(req.params.id);
  res.json(updated);
});

// ══════════════════════════════════════════════════════════════
// BULK IMPORT
// ══════════════════════════════════════════════════════════════

// POST /api/admin/clients/bulk
router.post('/clients/bulk', requireAdmin, (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows es requerido y debe ser un array' });
  }

  const db = req.app.locals.db;
  const stmt = db.prepare(`
    INSERT INTO clientes (cuit, razon_social, email, password_hash, nivel, descuento, plazo_pago, direccion, ciudad, cuenta_num)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const results = { ok: 0, errors: [] };

  for (const [i, row] of rows.entries()) {
    const lineNum = i + 2;
    if (!row.cuit || !row.razon_social || !row.email || !row.password) {
      results.errors.push(`Fila ${lineNum}: cuit, razon_social, email y password son requeridos`);
      continue;
    }
    if (row.password.length < 6) {
      results.errors.push(`Fila ${lineNum}: contraseña demasiado corta`);
      continue;
    }
    try {
      const hash = bcrypt.hashSync(row.password, 10);
      stmt.run(
        row.cuit.trim(),
        row.razon_social.trim(),
        row.email.trim(),
        hash,
        row.nivel        || 'Bronce',
        parseFloat(row.descuento)  || 0,
        row.plazo_pago   || '30 días',
        row.direccion    || null,
        row.ciudad       || null,
        row.cuenta_num   || null,
      );
      results.ok++;
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        results.errors.push(`Fila ${lineNum} (${row.cuit}): CUIT o email ya existe`);
      } else {
        results.errors.push(`Fila ${lineNum}: ${err.message}`);
      }
    }
  }

  res.json(results);
});

// POST /api/admin/products/bulk
router.post('/products/bulk', requireAdmin, (req, res) => {
  const { rows } = req.body;
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'rows es requerido y debe ser un array' });
  }

  const db = req.app.locals.db;

  // Pre-cargar marcas y tipos para resolver por nombre
  const marcasMap = {};
  db.prepare(`SELECT id, nombre FROM marcas`).all()
    .forEach(m => { marcasMap[m.nombre.toLowerCase()] = m.id; });

  const tiposMap = {};
  db.prepare(`SELECT id, nombre FROM tipos`).all()
    .forEach(t => {
      tiposMap[t.id.toLowerCase()]     = t.id;
      tiposMap[t.nombre.toLowerCase()] = t.id;
    });

  const stmt = db.prepare(`
    INSERT INTO productos (codigo_st, codigo_oe, tipo_id, descripcion, marca_id, modelo, anio, stock, precio, rotacion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const results = { ok: 0, errors: [] };

  for (const [i, row] of rows.entries()) {
    const lineNum = i + 2;
    if (!row.codigo_st || !row.codigo_oe || !row.descripcion || !row.precio) {
      results.errors.push(`Fila ${lineNum}: codigo_st, codigo_oe, descripcion y precio son requeridos`);
      continue;
    }
    const precio = parseFloat(row.precio);
    if (isNaN(precio) || precio <= 0) {
      results.errors.push(`Fila ${lineNum}: precio inválido`);
      continue;
    }

    const marcaId = row.marca ? (marcasMap[row.marca.toLowerCase()] ?? null) : null;
    const tipoId  = row.tipo  ? (tiposMap[row.tipo.toLowerCase()]   ?? null) : null;

    try {
      stmt.run(
        row.codigo_st.trim(),
        row.codigo_oe.trim(),
        tipoId,
        row.descripcion.trim(),
        marcaId,
        row.modelo    || null,
        row.anio      || null,
        parseInt(row.stock) || 0,
        precio,
        ['alta','media','baja'].includes(row.rotacion?.toLowerCase())
          ? row.rotacion.toLowerCase() : 'media',
      );
      results.ok++;
    } catch (err) {
      if (err.message.includes('UNIQUE')) {
        results.errors.push(`Fila ${lineNum} (${row.codigo_st}): código ST ya existe`);
      } else {
        results.errors.push(`Fila ${lineNum}: ${err.message}`);
      }
    }
  }

  res.json(results);
});

// ══════════════════════════════════════════════════════════════
// MARCAS Y TIPOS (para los selects del formulario)
// ══════════════════════════════════════════════════════════════

router.get('/marcas', requireAdmin, (req, res) => {
  res.json(req.app.locals.db.prepare(`SELECT * FROM marcas ORDER BY nombre`).all());
});

router.post('/marcas', requireAdmin, (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre requerido' });
  try {
    const r = req.app.locals.db.prepare(`INSERT INTO marcas (nombre) VALUES (?)`).run(nombre);
    res.status(201).json({ id: r.lastInsertRowid, nombre });
  } catch {
    res.status(409).json({ error: 'La marca ya existe' });
  }
});

router.get('/tipos', requireAdmin, (req, res) => {
  res.json(req.app.locals.db.prepare(`SELECT * FROM tipos ORDER BY nombre`).all());
});

router.post('/tipos', requireAdmin, (req, res) => {
  const { id, nombre, detalle } = req.body;
  if (!id || !nombre) return res.status(400).json({ error: 'id y nombre requeridos' });
  try {
    req.app.locals.db.prepare(`INSERT INTO tipos (id, nombre, detalle) VALUES (?, ?, ?)`).run(id, nombre, detalle || null);
    res.status(201).json({ id, nombre, detalle });
  } catch {
    res.status(409).json({ error: 'El tipo ya existe' });
  }
});

module.exports = router;
