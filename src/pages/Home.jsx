import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingCart, LogOut, ShoppingBag, Package,
  Home as HomeIcon, Filter, X, Plus, Minus
} from 'lucide-react'
import { api } from '../utils/api'

const CATEGORIES = [
  { id: 'all', name: 'جميع المنتجات', icon: '🛒' },
  { id: 'مواد تموينية', name: 'مواد تموينية', icon: '🥫' },
  { id: 'أدوات منزلية', name: 'أدوات منزلية', icon: '🏠' },
  { id: 'مستحضرات تجميل', name: 'مستحضرات تجميل', icon: '💄' }
]

function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  const fetchProducts = async () => {
    const result = await api.get('/products')
    if (result.success) {
      setProducts(result.data)
      setFilteredProducts(result.data)
    }
    setLoading(false)
  }

  const fetchCart = async () => {
    const result = await api.get('/cart')
    if (result.success) {
      const count = result.data.items.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(count)
    }
  }

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const addToCart = async (productId) => {
    const result = await api.post('/cart/add', { productId, quantity: 1 })
    if (result.success) {
      fetchCart()
    }
  }

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find(c => c.id === category)
    return cat?.icon || '📦'
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-800">سوبرماركت سيد أحمد</h1>
                <p className="text-xs text-gray-500">مرحباً، {user?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-emerald-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full pr-10 pl-10 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-emerald-50 border border-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">جاري تحميل المنتجات...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 group"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image.startsWith('/') ? `https://supermarket-api-w79n.onrender.com${product.image}` : product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {!product.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">غير متوفر</span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className="text-2xl">{getCategoryIcon(product.category)}</span>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-emerald-600">{product.price} ر.س</span>
                    <span className="text-xs text-gray-500">الكمية: {product.quantity}</span>
                  </div>

                  <button
                    onClick={() => addToCart(product._id)}
                    disabled={!product.available || product.quantity === 0}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>إضافة للسلة</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
