import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Sport-Wilches
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600">Inicio</Link>
          <Link to="/carrito" className="hover:text-blue-600 relative">
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/pedidos" className="hover:text-blue-600">
                Mis pedidos
              </Link>
              <span className="text-sm text-gray-600">Hola, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-600 hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-blue-600">
              Iniciar sesión
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}