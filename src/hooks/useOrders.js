import { createContext, useContext } from 'react'

// El "archivo de recibos" donde viven los pedidos de cada usuario.
export const OrdersContext = createContext(null)

// Hook de acceso rápido: cualquier componente lee los pedidos con useOrders().
export function useOrders() {
  return useContext(OrdersContext)
}
