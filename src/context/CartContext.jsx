import { useEffect, useState } from 'react'
import { CartContext } from '../hooks/useCart'
import { getProducts } from '../services/api'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart_v2')
    return saved ? JSON.parse(saved) : []
  })

  // El catálogo es la fuente de verdad del stock disponible de cada producto.
  const [catalog, setCatalog] = useState([])

  useEffect(() => {
    getProducts()
      .then(setCatalog)
      .catch((err) => console.error('No se pudo cargar el catálogo:', err.message))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart_v2', JSON.stringify(items))
  }, [items])

  function getStock(productId) {
    const product = catalog.find((p) => p.id === productId)
    return product ? product.stock : 0
  }

  // Unidades que todavía se pueden agregar de un producto al carrito.
  function getRemainingStock(productId) {
    const item = items.find((i) => i.id === productId)
    const remaining = getStock(productId) - (item ? item.quantity : 0)
    return Math.max(0, remaining)
  }

  function addToCart(product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      const stock = getStock(product.id)
      const added = existing ? existing.quantity + quantity : quantity
      // Nunca superamos el stock disponible del catálogo
      const finalQuantity = Math.min(added, stock)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: finalQuantity }
            : item
        )
      }
      if (finalQuantity < 1) return prev
      return [...prev, { ...product, quantity: finalQuantity }]
    })
  }

  function removeFromCart(productId) {
    setItems((prev) => prev.filter((item) => item.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    const stock = getStock(productId)
    if (quantity < 1 || quantity > stock) return
    setItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, getStock, getRemainingStock }}
    >
      {children}
    </CartContext.Provider>
  )
}