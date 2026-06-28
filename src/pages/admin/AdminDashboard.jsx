import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Image as ImageIcon,
  Upload,
  LogOut,
  Users,
  AlertTriangle,
} from "lucide-react";

const categories = ["مواد تموينية", "أدوات منزلية", "مستحضرات تجميل"];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: categories[0],
    available: true,
    imageUrl: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://supermarket-api-w79n.onrender.com/api/products",
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://supermarket-api-w79n.onrender.com/api/admin/users",
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: categories[0],
      available: true,
      imageUrl: "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      available: product.available,
      imageUrl: product.image || "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("category", formData.category);
    data.append("available", formData.available);
    data.append("imageUrl", formData.imageUrl);
    if (formData.imageFile) {
      data.append("image", formData.imageFile);
    }

    try {
      if (editingProduct) {
        await axios.put(
          `https://supermarket-api-w79n.onrender.com/api/admin/products/${editingProduct._id}`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        await axios.post(
          "https://supermarket-api-w79n.onrender.com/api/admin/products",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في حفظ المنتج");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://supermarket-api-w79n.onrender.com/api/admin/products/${id}`,
      );
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في حذف المنتج");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getImageUrl = (product) => {
    if (!product.image) return "";
    return product.image.startsWith("http")
      ? product.image
      : `https://supermarket-api-w79n.onrender.com${product.image}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar + Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">لوحة الإدارة</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">خروج</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "products"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                المنتجات
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {products.length}
                </span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "users"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                المستخدمين
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {users.length}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                إدارة المنتجات
              </h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                إضافة منتج
              </button>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">لا توجد منتجات</p>
                <button
                  onClick={openAddModal}
                  className="mt-4 text-primary-600 font-medium hover:underline"
                >
                  إضافة منتج جديد
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          المنتج
                        </th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          الفئة
                        </th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          السعر
                        </th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          الكمية
                        </th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          الحالة
                        </th>
                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                          الإجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {product.image ? (
                                  <img
                                    src={getImageUrl(product)}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  {product.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-primary-600">
                            {product.price.toFixed(2)} ج.م
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                product.available && product.quantity > 0
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.available && product.quantity > 0 ? (
                                <>
                                  <Check className="w-3 h-3" /> متوفر
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3" /> غير متوفر
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(product)}
                                className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <Trash2 className="w-4 h-4" />
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
        )}

        {activeTab === "users" && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">المستخدمين</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        الاسم
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        البريد الإلكتروني
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        نوع الحساب
                      </th>
                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-700">
                        تاريخ الإنشاء
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              user.isAdmin
                                ? "bg-gray-900 text-white"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {user.isAdmin ? "مدير" : "مستخدم"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct ? "تعديل منتج" : "إضافة منتج جديد"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                  placeholder="اسم المنتج"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                  placeholder="وصف المنتج"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الكمية
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, available: true })
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
                      formData.available
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    متوفر
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, available: false })
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-colors ${
                      !formData.available
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <X className="w-4 h-4" />
                    غير متوفر
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  صورة المنتج
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <Upload className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          imageFile: e.target.files[0],
                        })
                      }
                      className="w-full pr-10 py-3 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700 file:font-medium hover:file:bg-primary-100"
                    />
                  </div>
                  <div className="text-center text-sm text-gray-400">أو</div>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="رابط الصورة"
                  />
                </div>
                {formData.imageFile && (
                  <p className="mt-2 text-sm text-primary-600">
                    {formData.imageFile.name}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md disabled:opacity-50"
                >
                  {saving
                    ? "جاري الحفظ..."
                    : editingProduct
                      ? "حفظ التعديلات"
                      : "إضافة المنتج"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              تأكيد الحذف
            </h3>
            <p className="text-gray-500 mb-6">
              هل أنت متأكد من حذف المنتج "{deleteConfirm.name}"؟ لا يمكن التراجع
              عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
