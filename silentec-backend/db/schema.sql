-- SILENTEC Database Schema

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ─── Clientes (usuarios mayoristas) ────────────────────────
CREATE TABLE IF NOT EXISTS clientes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cuit        TEXT    NOT NULL UNIQUE,       -- ej: 30-71485293-4
  razon_social TEXT   NOT NULL,
  email       TEXT    NOT NULL UNIQUE,
  password_hash TEXT  NOT NULL,
  nivel       TEXT    NOT NULL DEFAULT 'Bronce', -- Bronce / Plata / Oro / Platinum
  descuento   REAL    NOT NULL DEFAULT 0,     -- porcentaje, ej: 5
  plazo_pago  TEXT    NOT NULL DEFAULT '30 días',
  direccion   TEXT,
  ciudad      TEXT,
  cuenta_num  TEXT,
  activo      INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─── Marcas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marcas (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

-- ─── Tipos de pieza ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tipos (
  id     TEXT    PRIMARY KEY,   -- '001', '002', etc.
  nombre TEXT    NOT NULL,
  detalle TEXT
);

-- ─── Productos ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS productos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_st   TEXT    NOT NULL UNIQUE,   -- 'ST: 007-003-024'
  codigo_oe   TEXT    NOT NULL,          -- 'BK3C-5493-AA'
  tipo_id     TEXT    REFERENCES tipos(id),
  descripcion TEXT    NOT NULL,          -- 'Buje parrilla delantera'
  marca_id    INTEGER REFERENCES marcas(id),
  modelo      TEXT,
  anio        TEXT,
  stock       INTEGER NOT NULL DEFAULT 0,
  precio      REAL    NOT NULL,
  rotacion    TEXT    NOT NULL DEFAULT 'media', -- alta / media / baja
  activo      INTEGER NOT NULL DEFAULT 1
);

-- ─── Carritos (un borrador por cliente) ────────────────────
CREATE TABLE IF NOT EXISTS carritos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id  INTEGER NOT NULL REFERENCES clientes(id),
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS carrito_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  carrito_id  INTEGER NOT NULL REFERENCES carritos(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad    INTEGER NOT NULL DEFAULT 1,
  precio_unit REAL    NOT NULL,          -- precio al momento de agregar
  UNIQUE(carrito_id, producto_id)
);

-- ─── Pedidos ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pedidos (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  numero      TEXT    NOT NULL UNIQUE,   -- 'P-24018'
  cliente_id  INTEGER NOT NULL REFERENCES clientes(id),
  estado      TEXT    NOT NULL DEFAULT 'Pendiente',
                      -- Pendiente / En preparación / Despachado / Entregado / Cancelado
  subtotal    REAL    NOT NULL DEFAULT 0,
  descuento   REAL    NOT NULL DEFAULT 0,
  iva         REAL    NOT NULL DEFAULT 0,
  total       REAL    NOT NULL DEFAULT 0,
  notas       TEXT,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pedido_items (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id   INTEGER NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  producto_id INTEGER NOT NULL REFERENCES productos(id),
  cantidad    INTEGER NOT NULL,
  precio_unit REAL    NOT NULL,
  subtotal    REAL    NOT NULL
);

-- ─── Historial de chat por cliente ─────────────────────────
CREATE TABLE IF NOT EXISTS chat_mensajes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id  INTEGER NOT NULL REFERENCES clientes(id),
  role        TEXT    NOT NULL,  -- 'user' | 'assistant'
  content     TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);
