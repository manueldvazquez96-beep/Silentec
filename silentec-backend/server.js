// server.js — Punto de entrada principal

require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const { DatabaseSync } = require('node:sqlite');

const authRoutes     = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes     = require('./routes/cart');
const ordersRoutes   = require('./routes/orders');
const profileRoutes  = require('./routes/profile');
const chatRoutes     = require('./routes/chat');
const adminRoutes    = require('./routes/admin');

// ── Base de datos ──────────────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, 'db', 'silentec.db');
const db = new DatabaseSync(DB_PATH);

// Habilitar WAL y foreign keys
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA foreign_keys = ON");

// Crear tablas si no existen (ejecuta el schema)
const fs = require('fs');
const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
db.exec(schema);

// ── Express ────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inyectar DB en todas las rutas
app.locals.db = db;

// ── Rutas ──────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   ordersRoutes);
app.use('/api/profile',  profileRoutes);
app.use('/api/chat',     chatRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Manejo de errores ──────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

// ── Arranque ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅  SILENTEC API corriendo en http://localhost:${PORT}`);
  console.log(`   DB: ${DB_PATH}`);
});

module.exports = app;
