import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight, ShoppingCart, Package, Minus, Plus,
  LogOut, ShoppingBag, AlertCircle, Check
} from 'lucide-react'
import { api } from '../utils/api'

function ProductDetail({ user, onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const result = await api.get(`/products/${id}`)
    if (result.success) {
      setProduct(result.data)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const addToCart = async () => {
    setAddingToCart(true)
    const result = await api.post('/cart/add', { productId: id, quantity })
    if (result.success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    }
    setAddingToCart(false)
  }

  const getCategoryName = (category) => {
    const names = {
      'مواد تموينية': '🥫 مواد تموينية',
      'أدوات منزلية': '🏠 أدوات منزلية',
      'مستحضرات تجميل': '💄 مستحضرات تجميل'
    }
    return names[category] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">المنتج غير موجود</p>
          <Link to="/home" className="text-emerald-600 hover:underline mt-2 inline-block">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/home" className="text-gray-600 hover:text-emerald-600">
                <ArrowRight className="w-6 h-6" />
              </Link>
              <div className="bg-emerald-600 p-2 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-bold text-gray-800">تفاصيل المنتج</h1>
            </div>

            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              <div className="aspect-square md:aspect-auto md:h-full bg-gray-100 relative">
                {product.image ? (
                  <img
                    src={product.image.startsWith('/') ? `https://supermarket-api-w79n.onrender.com${product.image}` : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-gray-300" />
                  </div>
                )}
                {!product.available && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">غير متوفر</span>
                  </div>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-6">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm mb-3">
                {getCategoryName(product.category)}
              </span>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">{product.name}</h2>

              <p className="text-gray-600 mb-6">{product.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-emerald-600">{product.price} ر.س</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-gray-600">الكمية المتوفرة:</span>
                <span className={`font-semibold ${product.quantity > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {product.quantity > 0 ? `${product.quantity} قطعة` : 'غير متوفر'}
                </span>
              </div>

              {product.available && product.quantity > 0 && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-gray-600">الكمية:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                        className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {quantity === product.quantity && (
                      <span className="text-xs text-orange-500">أقصى كمية متوفرة</span>
                    )}
                  </div>

                  <div className="mb-4">
                    <span className="text-gray-600">الإجمالي:</span>
                    <span className="text-xl font-bold text-emerald-600 mr-2">
                      {(product.price * quantity).toFixed(2)} ر.س
                    </span>
                  </div>
                </>
              )}

              <button
                onClick={addToCart}
                disabled={!product.available || product.quantity === 0 || addingToCart}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  added
                    ? 'bg-green-500 text-white'
                    : product.available && product.quantity > 0
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تمت الإضافة!</span>
                  </>
                ) : addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة إلى السلة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Link
          to="/home"
          className="mt-6 block text-center text-emerald-600 hover:text-emerald-700 font-semibold"
        >
          ← العودة للتسوق
        </Link>
      </div>
    </div>
  )
}

export default ProductDetail
