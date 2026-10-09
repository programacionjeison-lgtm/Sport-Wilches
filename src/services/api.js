import products from '../data/products'

export async function getProducts() {
  // Simulamos una pequeña espera, como si viniera de un servidor real
  await new Promise((resolve) => setTimeout(resolve, 300))
  return products
}

export async function getProduct(id) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const product = products.find((p) => p.id === Number(id))
  if (!product) throw new Error('Producto no encontrado')
  return product
}