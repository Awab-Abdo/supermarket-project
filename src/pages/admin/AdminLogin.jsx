import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Shield, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://supermarket-api-w79n.onrender.com/api/auth/login",
        { email, password },
      );
      if (!res.data.user.isAdmin) {
        setError("غير مصرح لك بالدخول للوحة الإدارة");
        setLoading(false);
        return;
      }
      login(res.data.token, res.data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>رجوع</span>
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة الإدارة</h1>
          <p className="text-gray-500 mt-1">تسجيل دخول المدير</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التسجيل..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
