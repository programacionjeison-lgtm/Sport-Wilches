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
