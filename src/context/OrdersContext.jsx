import { useEffect, useState } from 'react'
import { OrdersContext } from '../hooks/useOrders'
import { useAuth } from '../hooks/useAuth'
import { createOrder, getOrders } from '../services/api'

export function OrdersProvider({ children }) {
  const { user, token } = useAuth()
  const [orders, setOrders] = useState([])
  const [error, setError] = useState(null)

  // Cuando haya sesión activa, cargamos los pedidos DESDE EL BACKEND
  // (ya no del localStorage). El backend solo devuelve los del usuario.
  useEffect(() => {
    if (!user || !token) return

    let activo = true // evita actualizar si el componente ya se desmontó

    getOrders(token)
      .then((data) => {
        if (activo) setOrders(data)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })

    // Limpieza: si el usuario cambió (login/logout) o se desmontó,
    // descartamos la respuesta que llegue tarde
    return () => {
      activo = false
    }
  }, [user, token])

  // El estado "guarda" lo que el backend entregó; lo que se muestra
  // se calcula: sin usuario, no hay pedidos visibles (aunque queden
  // residuales en memoria hasta que la nueva carga los reemplace).
  const userOrders = user ? orders : []

  // Guarda el pedido en el backend y lo agrega también en memoria
  // para que la pantalla lo muestre sin necesidad de recargar.
  async function addOrder({ items, shipping }) {
    const order = await createOrder(token, { items, shipping })
    setOrders((prev) => [order, ...prev])
    return order
  }

  return (
    <OrdersContext.Provider value={{ userOrders, addOrder, error: user ? error : null }}>
      {children}
    </OrdersContext.Provider>
  )
}
