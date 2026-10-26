import { createContext, useContext } from 'react'

// La "pizarra compartida" donde vive la sesión del usuario.
// Se crea aquí (fuera de los componentes) para que el AuthProvider
// y el hook useAuth puedan compartirla sin copiarse.
export const AuthContext = createContext(null)

// Hook de acceso rápido: cualquier componente lee la sesión con useAuth().
export function useAuth() {
  return useContext(AuthContext)
}
