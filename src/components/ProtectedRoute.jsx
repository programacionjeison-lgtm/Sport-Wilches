import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    // Guarda a dónde quería ir el usuario, para regresarlo ahí después de iniciar sesión
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}