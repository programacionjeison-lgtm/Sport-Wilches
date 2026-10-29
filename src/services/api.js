const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// Los productos vienen de MongoDB con "_id"; el resto de la app usa "id"
function normalizeProduct(product) {
  const { _id, ...rest } = product
  return { ...rest, id: _id }
}

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `Error del servidor (${response.status})`)
  }

  return response.json()
}

export async function getProducts() {
  const products = await request('/api/products')
  return products.map(normalizeProduct)
}

export async function getProduct(id) {
  const product = await request(`/api/products/${id}`)
  return normalizeProduct(product)
}

// ---- Pedidos ----

// El token JWT viaja en el encabezado "Authorization: Bearer <token>"
function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function requestApi(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || `Error del servidor (${response.status})`)
  }

  return data
}

// POST /api/orders → guardar el pedido del usuario con sesión activa
export function createOrder(token, { items, shipping }) {
  return requestApi('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    body: JSON.stringify({ items, shipping }),
  })
}

// GET /api/orders → pedidos del usuario autenticado
export function getOrders(token) {
  return requestApi('/api/orders', {
    headers: authHeaders(token),
  })
}

// ---- Usuarios ----

// POST /api/users/register → crear cuenta (devuelve token + usuario)
export function registerUser(userData) {
  return requestApi('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
}

// POST /api/users/login → iniciar sesión (devuelve token + usuario)
export function loginUser(credentials) {
  return requestApi('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })
}
