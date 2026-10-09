import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-4">Cargando productos...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  // Lista de categorías únicas, calculada a partir de los productos
  const categories = ['Todas', ...new Set(products.map((p) => p.category))]

  // Aplica el filtro de categoría y el texto de búsqueda
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'Todas' || product.category === selectedCategory
    const matchesSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-lg px-4 py-2 mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No se encontraron productos.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}