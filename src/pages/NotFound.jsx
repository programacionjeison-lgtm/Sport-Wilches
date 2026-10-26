import { Link } from 'react-router-dom'

// Esta página se muestra cuando el usuario entra a una URL que no existe.
// En App.jsx la ruta path="*" la captura: "cualquier cosa no listada".
export default function NotFound() {
  return (
    <div className="text-center py-16">
      <p className="text-6xl font-bold text-blue-600 mb-4">404</p>
      <h1 className="text-2xl font-bold mb-2">Página no encontrada</h1>
      <p className="text-gray-500 mb-6">
        La dirección que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
