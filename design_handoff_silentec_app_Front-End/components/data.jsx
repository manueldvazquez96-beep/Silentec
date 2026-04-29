// SILENTEC mock data — catalogo realista de suspensión y chasis

const SILENTEC_MARCAS = ['Ford', 'VW', 'Chevrolet', 'Fiat', 'Peugeot', 'Renault', 'Toyota', 'Citroën'];

const SILENTEC_TIPOS = [
  { id: '001', name: 'Bujes', detail: 'Parrilla, barra estab., tensor' },
  { id: '002', name: 'Cazoletas', detail: 'Con y sin crapodina' },
  { id: '003', name: 'Crapodinas', detail: 'Susp. delantera' },
  { id: '004', name: 'Topes', detail: 'Amortiguador delantero' },
  { id: '005', name: 'Soportes motor', detail: 'Hidráulicos y convencionales' },
];

const SILENTEC_PRODUCTOS = [
  { st: 'ST: 007-003-024', oe: 'BK3C-5493-AA',  tipo: 'Buje parrilla delantera', marca: 'Ford',      modelo: 'Ranger 2.5 TDCi',     anio: '2012–2022', stock: 48, precio: 14800, rot: 'alta' },
  { st: 'ST: 007-001-011', oe: '1K0-407-183-E', tipo: 'Buje barra estabilizadora', marca: 'VW',        modelo: 'Amarok 2.0 TDI',      anio: '2010–2023', stock: 120, precio: 6450, rot: 'alta' },
  { st: 'ST: 003-002-008', oe: '52365-SCA',    tipo: 'Cazoleta con crapodina',   marca: 'Chevrolet', modelo: 'Cruze 1.4 LT',        anio: '2016–2023', stock: 22, precio: 27900, rot: 'media' },
  { st: 'ST: 014-005-002', oe: '51810-84M0',   tipo: 'Soporte motor hidráulico', marca: 'Fiat',      modelo: 'Cronos 1.3',          anio: '2018–2024', stock: 8,  precio: 38200, rot: 'media' },
  { st: 'ST: 009-004-019', oe: '5033.A4',      tipo: 'Tope de amortiguador',     marca: 'Peugeot',   modelo: '208 1.6',             anio: '2013–2023', stock: 64, precio: 4950, rot: 'alta' },
  { st: 'ST: 011-003-007', oe: '8200-908-035', tipo: 'Crapodina delantera',      marca: 'Renault',   modelo: 'Sandero 1.6',         anio: '2015–2024', stock: 0,  precio: 9800,  rot: 'alta' },
  { st: 'ST: 007-001-044', oe: 'AB39-3078-AA', tipo: 'Buje eje trasero',         marca: 'Ford',      modelo: 'EcoSport 1.5',        anio: '2013–2023', stock: 31, precio: 11200, rot: 'alta' },
  { st: 'ST: 002-002-015', oe: '04632A-0K030', tipo: 'Cazoleta sin crapodina',   marca: 'Toyota',    modelo: 'Hilux 2.8 SRX',       anio: '2016–2024', stock: 17, precio: 32500, rot: 'media' },
];

const SILENTEC_PEDIDOS = [
  { id: 'P-24018', fecha: '18 abr 2026', items: 14, total: 248600, estado: 'Entregado',   cliente: 'REPUESTOS DEL CENTRO' },
  { id: 'P-24011', fecha: '12 abr 2026', items: 6,  total: 94800,  estado: 'En preparación', cliente: 'REPUESTOS DEL CENTRO' },
  { id: 'P-24002', fecha: '03 abr 2026', items: 22, total: 412300, estado: 'Entregado',   cliente: 'REPUESTOS DEL CENTRO' },
  { id: 'P-23987', fecha: '27 mar 2026', items: 9,  total: 167450, estado: 'Entregado',   cliente: 'REPUESTOS DEL CENTRO' },
  { id: 'P-23970', fecha: '19 mar 2026', items: 18, total: 331200, estado: 'Entregado',   cliente: 'REPUESTOS DEL CENTRO' },
];

const SILENTEC_CHAT_EJEMPLO = [
  { role: 'assistant', text: 'Hola. Soy el asistente técnico de SILENTEC. Decime qué pieza estás buscando, o pasame el OE del fabricante y te digo qué tenemos.' },
  { role: 'user',      text: 'Necesito buje de parrilla para Ranger 2012' },
  { role: 'assistant', text: 'Tengo la referencia **ST: 007-003-024** — Buje parrilla delantera Ford Ranger 2.5 TDCi (2012–2022).\n\nStock disponible: **48 unidades**. Precio: **$14.800 + IVA**.\n\n¿Querés agregarlo al pedido o necesitás ver el juego completo con bujes de barra estabilizadora?' },
];

Object.assign(window, {
  SILENTEC_MARCAS, SILENTEC_TIPOS, SILENTEC_PRODUCTOS,
  SILENTEC_PEDIDOS, SILENTEC_CHAT_EJEMPLO,
});
