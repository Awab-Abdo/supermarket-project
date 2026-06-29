import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck, LogOut, Package, Users, Plus, ShoppingBag,
  TrendingUp, PackageX, ArrowLeft, Edit
} from 'lucide-react'
import { api } from '../../utils/api'

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    unavailableProducts: 0,
    totalUsers: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const productsResult = await api.get('/admin/products')
    const usersResult = await api.get('/admin/users')

    if (productsResult.success) {
      const products = productsResult.data
      setRecentProducts(products.slice(0, 6))
      setStats({
        totalProducts: products.length,
        availableProducts: products.filter(p => p.available).length,
        unavailableProducts: products.filter(p => !p.available).length,
        totalUsers: usersResult.success ? usersResult.count : 0
      })
    }
    setLoading(false)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
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
              className="py-4 px-2 border-b-2 border-gray-800 text-gray-800 font-medium"
            >
              الرئيسية
            </Link>
            <Link
              to="/admin/products"
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalProducts}</h3>
                <p className="text-gray-500">إجمالي المنتجات</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.availableProducts}</h3>
                <p className="text-gray-500">منتجات متوفرة</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <PackageX className="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.unavailableProducts}</h3>
                <p className="text-gray-500">منتجات غير متوفرة</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                <p className="text-gray-500">عدد المستخدمين</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">أحدث المنتجات</h2>
              <Link
                to="/admin/products"
                className="text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                <span>عرض الكل</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-800 font-semibold mb-2">لا توجد منتجات</h3>
                <p className="text-gray-500 mb-4">ابدأ بإضافة منتجات جديدة</p>
                <Link
                  to="/admin/products/add"
                  className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>إضافة منتج</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProducts.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="aspect-video bg-gray-100 relative">
                      {product.image ? (
                        <img
                          src={product.image.startsWith('/') ? `https://supermarket-api-w79n.onrender.com${product.image}` : product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-gray-300" />
                        </div>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold">غير متوفر</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">{product.price} ر.س</span>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8">
              <Link
                to="/admin/products/add"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>إضافة منتج جديد</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
