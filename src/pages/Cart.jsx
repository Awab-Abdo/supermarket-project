import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ShoppingCart, LogOut, ShoppingBag, Trash2, Minus, Plus,
  Package, ArrowRight, ShoppingBag as ContinueIcon
} from 'lucide-react'
import { api } from '../utils/api'

function Cart({ user, onLogout }) {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    const result = await api.get('/cart')
    if (result.success) {
      setCart(result.data)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return

    setUpdating(true)
    const result = await api.put('/cart/update', { productId, quantity: newQuantity })
    if (result.success) {
      setCart(result.data)
    }
    setUpdating(false)
  }

  const removeItem = async (productId) => {
    const result = await api.delete(`/cart/remove/${productId}`)
    if (result.success) {
      setCart(result.data)
    }
  }

  const clearCart = async () => {
    if (window.confirm('هل تريد تفريغ السلة؟')) {
      const result = await api.delete('/cart/clear')
      if (result.success) {
        setCart({ ...cart, items: [], total: 0 })
      }
    }
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
              <h1 className="font-bold text-gray-800">سلة التسوق</h1>
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
        {!cart || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">السلة فارغة</h2>
            <p className="text-gray-500 mb-6">ابدأ التسوق الآن!</p>
            <Link
              to="/home"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">{cart.items.length} منتج في السلة</span>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                تفريغ السلة
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div
                  key={item.product?._id || item.product}
                  className="bg-white rounded-xl shadow-sm p-4"
                >
                  <div className="flex gap-4">
                    <Link to={`/product/${item.product?._id || item.product}`} className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.product?.image ? (
                        <img
                          src={item.product.image.startsWith('/') ? `https://supermarket-api-w79n.onrender.com${item.product.image}` : item.product.image}
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1">
                      <Link to={`/product/${item.product?._id || item.product}`}>
                        <h3 className="font-semibold text-gray-800 mb-1">{item.product?.name || 'منتج'}</h3>
                      </Link>
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{item.product?.description}</p>
                      <p className="text-emerald-600 font-bold">{item.price} ر.س</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product?._id || item.product)}
                      className="text-red-500 hover:text-red-600 self-start"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product?._id || item.product, item.quantity - 1)}
                        disabled={updating || item.quantity <= 1}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product?._id || item.product, item.quantity + 1)}
                        disabled={updating || !item.product || item.quantity >= item.product.quantity}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-lg font-bold text-gray-800">
                      {(item.price * item.quantity).toFixed(2)} ر.س
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-600">الإجمالي النهائي:</span>
                <span className="font-bold text-2xl text-emerald-600">{cart.total?.toFixed(2)} ر.س</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/home"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <ContinueIcon className="w-5 h-5" />
                <span>متابعة التسوق</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Cart
