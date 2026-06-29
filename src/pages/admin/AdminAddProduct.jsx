import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck, LogOut, Package, Plus, X, Upload, Link as LinkIcon, AlertCircle
} from 'lucide-react'
import { api } from '../../utils/api'

const CATEGORIES = ['مواد تموينية', 'أدوات منزلية', 'مستحضرات تجميل']

function AdminAddProduct({ user, onLogout }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: CATEGORIES[0],
    imageType: 'url',
    imageUrl: '',
    available: true
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.description || !formData.price || !formData.quantity) {
      setError('جميع الحقول مطلوبة')
      return
    }

    setLoading(true)

    try {
      let result

      if (formData.imageType === 'file' && selectedFile) {
        const data = new FormData()
        data.append('name', formData.name)
        data.append('description', formData.description)
        data.append('price', formData.price)
        data.append('quantity', formData.quantity)
        data.append('category', formData.category)
        data.append('available', formData.available)
        data.append('image', selectedFile)

        result = await api.uploadFile('/admin/products', data)
      } else {
        result = await api.post('/admin/products', {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          category: formData.category,
          available: formData.available,
          imageUrl: formData.imageUrl
        })
      }

      if (result.success) {
        navigate('/admin/products')
      } else {
        setError(result.message || 'حدث خطأ')
      }
    } catch (err) {
      setError('حدث خطأ أثناء إضافة المنتج')
    }

    setLoading(false)
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
              className="py-4 px-2 border-b-2 border-transparent text-gray-500 hover:text-gray-800 transition-colors"
            >
              المنتجات
            </Link>
            <Link
              to="/admin/products/add"
              className="py-4 px-2 border-b-2 border-gray-800 text-gray-800 font-medium"
            >
              إضافة منتج
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">إضافة منتج جديد</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">اسم المنتج *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
                placeholder="اسم المنتج"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">الوصف *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none resize-none"
                placeholder="وصف المنتج..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">السعر (ر.س) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">الكمية *</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">الفئة *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">صورة المنتج</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageType: 'url' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.imageType === 'url'
                      ? 'border-gray-800 bg-gray-800 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>رابط صورة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, imageType: 'file' })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                    formData.imageType === 'file'
                      ? 'border-gray-800 bg-gray-800 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>رفع صورة</span>
                </button>
              </div>

              {formData.imageType === 'url' ? (
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gray-800 focus:outline-none"
                  placeholder="https://example.com/image.jpg"
                />
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <p className="text-sm text-gray-500 mt-2">انقر لاختيار صورة</p>
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="available" className="text-gray-700">المنتج متوفر</label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>إضافة المنتج</span>
                  </>
                )}
              </button>

              <Link
                to="/admin/products"
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminAddProduct
