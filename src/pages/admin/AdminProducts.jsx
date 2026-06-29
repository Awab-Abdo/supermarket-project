import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck, LogOut, Package, Plus, Edit, Trash2,
  Search, Filter, X
} from 'lucide-react'
import { api } from '../../utils/api'

const CATEGORIES = ['جميع الفئات', 'مواد تموينية', 'أدوات منزلية', 'مستحضرات تجميل']

function AdminProducts({ user, onLogout }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('جميع الفئات')
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const result = await api.get('/admin/products')
    if (result.success) {
      setProducts(result.data)
      setFilteredProducts(result.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    let filtered = products

    if (selectedCategory !== 'جميع الفئات') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('هل تريد حذف هذا المنتج؟')) return

    setDeleting(id)
    const result = await api.delete(`/admin/products/${id}`)
    if (result.success) {
      setProducts(products.filter(p => p._id !== id))
    }
    setDeleting(null)
  }

  const toggleAvailability = async (product) => {
    const result = await api.put(`/admin/products/${product._id}`, {
      ...product,
      available: !product.available
    })
    if (result.success) {
      setProducts(products.map(p => p._id === product._id ? result.data : p))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-gray-800" />
              </div>
              <div>
                <h1 className="font-bold text-white">لوحة التحكم</h1>
                <p className="text-xs text-gray-300">سوبرماركت سيد أحمد</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <Link
              to="/admin/dashboard"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              to="/admin/products"
              className="py-4 px-2 border-b-2 border-gray-800 text-gray-800 font-medium"
            >
              المنتجات
            </Link>
            <Link
              to="/admin/products/add"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
            >
              إضافة منتج
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">جميع المنتجات ({products.length})</h2>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>إضافة منتج</span>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج..."
              className="w-full pr-10 pl-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-800 font-semibold mb-2">لا توجد منتجات</h3>
            <p className="text-gray-500">ابدأ بإضافة منتجات جديدة</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">المنتج</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">الفئة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">السعر</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">الكمية</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">الحالة</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-800">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            {product.image ? (
                              <img
                                src={product.image.startsWith('/') ? `https://supermarket-api-w79n.onrender.com${product.image}` : product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{product.category}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{product.price} ر.س</td>
                      <td className="px-4 py-3 text-gray-600">{product.quantity}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAvailability(product)}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {product.available ? 'متوفر' : 'غير متوفر'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product._id)}
                            disabled={deleting === product._id}
                            className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                          >
                            {deleting === product._id ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminProducts
