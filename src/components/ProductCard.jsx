import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/producto/${product.id}`}
      className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-40 object-contain mb-3"
      />
      <h2 className="font-semibold text-sm line-clamp-2">{product.title}</h2>
     <p className="text-blue-600 font-bold mt-auto pt-2">
  {new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(product.price)}
</p>
    </Link>
  )
}