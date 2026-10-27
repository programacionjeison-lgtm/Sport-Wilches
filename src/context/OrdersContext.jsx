import { useEffect, useState } from 'react'
import { OrdersContext } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'

export function OrdersProvider({ children }) {
  const { user } = useAuth()
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  // Guarda un pedido asociado al usuario con sesión activa
  // y lo devuelve completo (con número y fecha ya asignados).
  function addOrder({ items, shipping }) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const order = {
      numero: Math.floor(100000 + Math.random() * 900000),
      userEmail: user?.email || null,
      items: items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),
      shipping,
      total,
      fecha: new Date().toISOString(),
      estado: 'En proceso',
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  // Los pedidos del usuario que tiene sesión iniciada.
  const userOrders = user
    ? orders.filter((order) => order.userEmail === user.email)
    : []

  return (
    <OrdersContext.Provider value={{ userOrders, addOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}
