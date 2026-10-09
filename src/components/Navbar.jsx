import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <header className="bg-white shadow">
      <nav className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Sport wilches
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
        </div>
      </nav>
    </header>
  )
}