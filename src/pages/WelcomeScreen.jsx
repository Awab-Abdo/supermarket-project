import { Link } from 'react-router-dom'
import { ShoppingBag, LogIn, UserPlus } from 'lucide-react'

function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        <div className="bg-emerald-600 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <ShoppingBag className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          سوبرماركت سيد أحمد
        </h1>

        <p className="text-gray-600 mb-12 text-lg">
          تسوق بسهولة وراحة من منزلك
        </p>

        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <LogIn className="w-5 h-5" />
            <span>تسجيل الدخول</span>
          </Link>

          <Link
            to="/register"
            className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 border-2 border-emerald-600 shadow-md hover:shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            <span>إنشاء حساب جديد</span>
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          جميع الحقوق محفوظة © 2024
        </p>
      </div>
    </div>
  )
}

export default WelcomeScreen
