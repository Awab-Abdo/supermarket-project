import { Link } from 'react-router-dom'
import { ShoppingCart, UserPlus, LogIn } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">سوبرماركت سيد أحمد</h1>
          <p className="text-gray-600">تسوق بذكاء، اختيار بسهولة</p>
        </div>

        <div className="space-y-4">
          <Link
            to="/login"
            className="flex items-center justify-center gap-3 w-full bg-primary-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors duration-200 shadow-md"
          >
            <LogIn className="w-5 h-5" />
            تسجيل الدخول
          </Link>
          <Link
            to="/register"
            className="flex items-center justify-center gap-3 w-full bg-white text-primary-700 border-2 border-primary-600 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors duration-200"
          >
            <UserPlus className="w-5 h-5" />
            إنشاء حساب جديد
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
