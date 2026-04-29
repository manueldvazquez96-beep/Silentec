// db/seed.js — pobla la base con datos de ejemplo de SILENTEC
// Ejecutar con: node db/seed.js

const { DatabaseSync } = require('node:sqlite');
const bcrypt   = require('bcryptjs');
const path     = require('path');
const fs       = require('fs');

const DB_PATH  = path.join(__dirname, 'silentec.db');
const SQL_PATH = path.join(__dirname, 'schema.sql');

const db = new DatabaseSync(DB_PATH);

// Ejecutar schema
const schema = fs.readFileSync(SQL_PATH, 'utf8');
db.exec(schema);

// ─── Marcas ─────────────────────────────────────────────────
const marcas = ['Ford', 'VW', 'Chevrolet', 'Fiat', 'Peugeot', 'Renault', 'Toyota', 'Citroën'];
const insertMarca = db.prepare(`INSERT OR IGNORE INTO marcas (nombre) VALUES (?)`);
for (const m of marcas) insertMarca.run(m);

// ─── Tipos ──────────────────────────────────────────────────
const tipos = [
  { id: '001', nombre: 'Bujes',          detalle: 'Parrilla, barra estab., tensor' },
  { id: '002', nombre: 'Cazoletas',      detalle: 'Con y sin crapodina' },
  { id: '003', nombre: 'Crapodinas',     detalle: 'Susp. delantera' },
  { id: '004', nombre: 'Topes',          detalle: 'Amortiguador delantero' },
  { id: '005', nombre: 'Soportes motor', detalle: 'Hidráulicos y convencionales' },
];
const insertTipo = db.prepare(`INSERT OR IGNORE INTO tipos (id, nombre, detalle) VALUES (?, ?, ?)`);
for (const t of tipos) insertTipo.run(t.id, t.nombre, t.detalle);

// ─── Productos ──────────────────────────────────────────────
const marcaId = (nombre) => db.prepare(`SELECT id FROM marcas WHERE nombre=?`).get(nombre)?.id;

const productos = [
  { st: 'ST: 007-003-024', oe: 'BK3C-5493-AA',  tipo: '001', desc: 'Buje parrilla delantera',    marca: 'Ford',      modelo: 'Ranger 2.5 TDCi',  anio: '2012–2022', stock: 48,  precio: 14800, rot: 'alta' },
  { st: 'ST: 007-001-011', oe: '1K0-407-183-E', tipo: '001', desc: 'Buje barra estabilizadora', marca: 'VW',        modelo: 'Amarok 2.0 TDI',   anio: '2010–2023', stock: 120, precio: 6450,  rot: 'alta' },
  { st: 'ST: 003-002-008', oe: '52365-SCA',     tipo: '002', desc: 'Cazoleta con crapodina',    marca: 'Chevrolet', modelo: 'Cruze 1.4 LT',     anio: '2016–2023', stock: 22,  precio: 27900, rot: 'media' },
  { st: 'ST: 014-005-002', oe: '51810-84M0',    tipo: '005', desc: 'Soporte motor hidráulico',  marca: 'Fiat',      modelo: 'Cronos 1.3',       anio: '2018–2024', stock: 8,   precio: 38200, rot: 'media' },
  { st: 'ST: 009-004-019', oe: '5033.A4',       tipo: '004', desc: 'Tope de amortiguador',      marca: 'Peugeot',   modelo: '208 1.6',          anio: '2013–2023', stock: 64,  precio: 4950,  rot: 'alta' },
  { st: 'ST: 011-003-007', oe: '8200-908-035',  tipo: '003', desc: 'Crapodina delantera',       marca: 'Renault',   modelo: 'Sandero 1.6',      anio: '2015–2024', stock: 0,   precio: 9800,  rot: 'alta' },
  { st: 'ST: 007-001-044', oe: 'AB39-3078-AA',  tipo: '001', desc: 'Buje eje trasero',          marca: 'Ford',      modelo: 'EcoSport 1.5',     anio: '2013–2023', stock: 31,  precio: 11200, rot: 'alta' },
  { st: 'ST: 002-002-015', oe: '04632A-0K030',  tipo: '002', desc: 'Cazoleta sin crapodina',    marca: 'Toyota',    modelo: 'Hilux 2.8 SRX',    anio: '2016–2024', stock: 17,  precio: 32500, rot: 'media' },
  { st: 'ST: 012-001-033', oe: '93185468',       tipo: '001', desc: 'Buje barra tensora',        marca: 'Chevrolet', modelo: 'S10 2.8 TDI',      anio: '2012–2023', stock: 55,  precio: 8750,  rot: 'alta' },
  { st: 'ST: 006-003-009', oe: '48654-06060',    tipo: '003', desc: 'Crapodina delantera',       marca: 'Toyota',    modelo: 'Corolla 1.8',      anio: '2014–2023', stock: 40,  precio: 12300, rot: 'media' },
  { st: 'ST: 008-004-021', oe: '546620001R',     tipo: '004', desc: 'Tope amortiguador trasero', marca: 'Renault',   modelo: 'Duster 1.6',       anio: '2011–2024', stock: 90,  precio: 3800,  rot: 'alta' },
  { st: 'ST: 015-005-006', oe: '1610988480',     tipo: '005', desc: 'Soporte motor izquierdo',   marca: 'Peugeot',   modelo: '308 1.6 THP',      anio: '2014–2022', stock: 12,  precio: 45600, rot: 'baja' },
  { st: 'ST: 007-002-018', oe: '9687833380',     tipo: '001', desc: 'Buje parrilla trasera',     marca: 'Citroën',   modelo: 'Berlingo 1.6',     anio: '2015–2023', stock: 28,  precio: 7200,  rot: 'alta' },
  { st: 'ST: 013-002-004', oe: '51837793',       tipo: '002', desc: 'Cazoleta delantera',        marca: 'Fiat',      modelo: 'Toro 2.0 TDI',     anio: '2016–2024', stock: 33,  precio: 19500, rot: 'media' },
  { st: 'ST: 010-001-027', oe: '1K0-411-314-R', tipo: '001', desc: 'Buje estabilizadora front',  marca: 'VW',        modelo: 'Vento 2.5',        anio: '2010–2018', stock: 0,   precio: 5100,  rot: 'media' },
];

const insertProducto = db.prepare(`
  INSERT OR IGNORE INTO productos
    (codigo_st, codigo_oe, tipo_id, descripcion, marca_id, modelo, anio, stock, precio, rotacion)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const p of productos) {
  insertProducto.run(p.st, p.oe, p.tipo, p.desc, marcaId(p.marca), p.modelo, p.anio, p.stock, p.precio, p.rot);
}

// ─── Cliente de ejemplo ─────────────────────────────────────
const hash = bcrypt.hashSync('silentec123', 10);
const insertCliente = db.prepare(`
  INSERT OR IGNORE INTO clientes
    (cuit, razon_social, email, password_hash, nivel, descuento, plazo_pago, direccion, ciudad, cuenta_num)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertCliente.run(
  '30-71485293-4',
  'REPUESTOS DEL CENTRO',
  'pedidos@repuestosdelcentro.com.ar',
  hash,
  'Oro', 5, '30 días',
  'Av. Colón 2340',
  'Córdoba',
  '4821'
);

// ─── Pedidos históricos ─────────────────────────────────────
const clienteId = db.prepare(`SELECT id FROM clientes WHERE cuit=?`).get('30-71485293-4').id;

const pedidosHistoricos = [
  { numero: 'P-24018', estado: 'Entregado',       total: 248600, fecha: '2026-04-18' },
  { numero: 'P-24011', estado: 'En preparación',  total: 94800,  fecha: '2026-04-12' },
  { numero: 'P-24002', estado: 'Entregado',        total: 412300, fecha: '2026-04-03' },
  { numero: 'P-23987', estado: 'Entregado',        total: 167450, fecha: '2026-03-27' },
  { numero: 'P-23970', estado: 'Entregado',        total: 331200, fecha: '2026-03-19' },
];

const insertPedido = db.prepare(`
  INSERT OR IGNORE INTO pedidos
    (numero, cliente_id, estado, subtotal, descuento, iva, total, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
for (const p of pedidosHistoricos) {
  const sub  = Math.round(p.total / 1.21 / 0.95);
  const desc = Math.round(sub * 0.05);
  const iva  = Math.round((sub - desc) * 0.21);
  insertPedido.run(p.numero, clienteId, p.estado, sub, desc, iva, p.total, p.fecha, p.fecha);
}

console.log('✅ Base de datos SILENTEC inicializada con éxito.');
db.close();
