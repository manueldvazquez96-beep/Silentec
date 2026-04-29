const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://silentec-production.up.railway.app/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('st_token');
}

async function request<T>(method: string, path: string, body?: object, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data as T;
}

export const api = {
  auth: {
    login: (cuit: string, password: string) =>
      request<{ token: string; cliente: Cliente }>('POST', '/auth/login', { cuit, password }, false),
  },
  products: {
    list: (params?: { q?: string; marca?: string; tipo?: string; inStock?: boolean; page?: number }) => {
      const qs = new URLSearchParams();
      if (params?.q)       qs.set('q', params.q);
      if (params?.marca)   qs.set('marca', params.marca);
      if (params?.tipo)    qs.set('tipo', params.tipo);
      if (params?.inStock) qs.set('inStock', 'true');
      if (params?.page)    qs.set('page', String(params.page));
      const query = qs.toString() ? `?${qs}` : '';
      return request<ProductsResponse>('GET', `/products${query}`);
    },
    get: (id: number) => request<Product>('GET', `/products/${id}`),
    marcas: () => request<Marca[]>('GET', '/products/marcas'),
    tipos: () => request<Tipo[]>('GET', '/products/tipos'),
  },
  cart: {
    get: () => request<CartResponse>('GET', '/cart'),
    addItem: (producto_id: number, cantidad: number) =>
      request<CartResponse>('POST', '/cart/items', { producto_id, cantidad }),
    updateItem: (producto_id: number, cantidad: number) =>
      request<CartResponse>('PUT', `/cart/items/${producto_id}`, { cantidad }),
    removeItem: (producto_id: number) =>
      request<CartResponse>('DELETE', `/cart/items/${producto_id}`),
    clear: () => request<CartResponse>('DELETE', '/cart'),
  },
  orders: {
    list: (params?: { page?: number; estado?: string }) => {
      const qs = new URLSearchParams();
      if (params?.page)   qs.set('page', String(params.page));
      if (params?.estado) qs.set('estado', params.estado);
      const query = qs.toString() ? `?${qs}` : '';
      return request<OrdersResponse>('GET', `/orders${query}`);
    },
    get: (id: number) => request<OrderDetail>('GET', `/orders/${id}`),
    confirm: () => request<Order>('POST', '/orders'),
  },
  profile: {
    get: () => request<Cliente>('GET', '/profile'),
    stats: () => request<ProfileStats>('GET', '/profile/stats'),
  },
  chat: {
    history: () => request<ChatMessage[]>('GET', '/chat'),
    send: (message: string) => request<{ response: string }>('POST', '/chat', { message }),
    clear: () => request<{ message: string }>('DELETE', '/chat'),
  },
};

export interface Cliente {
  id: number; cuit: string; razon_social: string; email: string;
  nivel: string; descuento: number; plazo_pago: string;
  direccion?: string; ciudad?: string; cuenta_num?: string; created_at: string;
}
export interface Product {
  id: number; codigo_st: string; codigo_oe: string; descripcion: string;
  modelo?: string; anio?: string; stock: number; precio: number;
  rotacion: string; marca: string; marca_id: number; tipo: string; tipo_id: string; tipo_detalle?: string;
}
export interface Marca { id: number; nombre: string; }
export interface Tipo { id: string; nombre: string; detalle?: string; }
export interface ProductsResponse { total: number; page: number; limit: number; pages: number; items: Product[]; }
export interface CartItem {
  id: number; cantidad: number; precio_unit: number; subtotal: number;
  producto_id: number; codigo_st: string; descripcion: string; modelo?: string; marca: string; stock: number;
}
export interface CartResponse { cart_id: number; items: CartItem[]; subtotal: number; }
export interface Order {
  id: number; numero: string; estado: string; subtotal: number;
  descuento: number; iva: number; total: number; notas?: string; created_at: string;
}
export interface OrderItem {
  cantidad: number; precio_unit: number; subtotal: number;
  codigo_st: string; descripcion: string; modelo?: string; marca: string;
}
export interface OrderDetail extends Order { items: OrderItem[]; }
export interface OrdersResponse { total: number; page: number; limit: number; items: Order[]; }
export interface ProfileStats {
  total90: number; pedidos90: number; pendientes: number;
  topProductos: { codigo_st: string; descripcion: string; marca: string; unidades: number; monto: number }[];
}
export interface ChatMessage { id: number; role: 'user' | 'assistant'; content: string; created_at: string; }

export function formatARS(amount: number): string {
  return `$ ${Math.round(amount).toLocaleString('es-AR')}`;
}

export function estadoPill(estado: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    pendiente:    { label: 'Pendiente',    cls: 'pill warn' },
    preparacion:  { label: 'En preparación', cls: 'pill warn' },
    transito:     { label: 'En tránsito',  cls: 'pill neutral' },
    entregado:    { label: 'Entregado',    cls: 'pill ok' },
    cancelado:    { label: 'Cancelado',    cls: 'pill alert' },
  };
  return map[estado] || { label: estado, cls: 'pill neutral' };
}
