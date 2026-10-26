import { createContext, useContext } from 'react'

// La "pizarra compartida" donde vive el carrito de compras.
export const CartContext = createContext(null)

// Hook de acceso rápido: cualquier componente lee el carrito con useCart().
export function useCart() {
  return useContext(CartContext)
}
