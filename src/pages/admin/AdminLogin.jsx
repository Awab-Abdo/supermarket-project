import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { api } from '../../utils/api'

function AdminLogin({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await api.post('/admin/login', formData)

    if (result.success) {
      onLogin(result.data, result.data.token)
      navigate('/admin/dashboard')
    } else {
      setError(result.message || 'بيانات الدخول غير صحيحة')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">لوحة تحكم المدير</h1>
            <p className="text-gray-500 mt-2">سوبرماركت سيد أحمد</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:outline-none transition-colors"
                  placeholder="admin@supermarket.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pr-10 pl-10 py-3 border-2 border-gray-200 rounded-xl focus:border-gray-800 focus:outline-none transition-colors"
                  placeholder="********"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>دخول</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
