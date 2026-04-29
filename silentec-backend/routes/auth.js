// routes/auth.js — Login y registro de nuevos clientes

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const router  = express.Router();

function makeToken(cliente) {
  return jwt.sign(
    { id: cliente.id, cuit: cliente.cuit, razon_social: cliente.razon_social },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/login
// Body: { cuit, password }
router.post('/login', (req, res) => {
  const { cuit, password } = req.body;
  if (!cuit || !password) {
    return res.status(400).json({ error: 'CUIT y contraseña requeridos' });
  }

  const db = req.app.locals.db;
  const cliente = db.prepare(`SELECT * FROM clientes WHERE cuit=? AND activo=1`).get(cuit);
  if (!cliente) {
    return res.status(401).json({ error: 'CUIT o contraseña incorrectos' });
  }

  const ok = bcrypt.compareSync(password, cliente.password_hash);
  if (!ok) {
    return res.status(401).json({ error: 'CUIT o contraseña incorrectos' });
  }

  const token = makeToken(cliente);
  const { password_hash, ...safe } = cliente;
  res.json({ token, cliente: safe });
});

// POST /api/auth/register  (útil para el primer acceso o desde un panel admin)
// Body: { cuit, razon_social, email, password }
router.post('/register', (req, res) => {
  const { cuit, razon_social, email, password } = req.body;
  if (!cuit || !razon_social || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const db   = req.app.locals.db;
  const hash = bcrypt.hashSync(password, 10);

  try {
    const result = db.prepare(`
      INSERT INTO clientes (cuit, razon_social, email, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(cuit, razon_social, email, hash);

    const cliente = db.prepare(`SELECT * FROM clientes WHERE id=?`).get(result.lastInsertRowid);
    const token   = makeToken(cliente);
    const { password_hash, ...safe } = cliente;
    res.status(201).json({ token, cliente: safe });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'El CUIT o email ya está registrado' });
    }
    throw err;
  }
});

module.exports = router;
