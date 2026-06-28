import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
} from "lucide-react";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://supermarket-api-w79n.onrender.com/api/cart",
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      if (quantity <= 0) {
        await axios.delete(
          `https://supermarket-api-w79n.onrender.com/api/cart/${productId}`,
        );
      } else {
        await axios.put(
          `https://supermarket-api-w79n.onrender.com/api/cart/${productId}`,
          { quantity },
        );
      }
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في تحديث الكمية");
    } finally {
      setUpdating((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `https://supermarket-api-w79n.onrender.com/api/cart/${productId}`,
      );
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في حذف المنتج");
    }
  };

  const getTotal = () => {
    return (
      cart.items?.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0) || 0
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/home"
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
              <span className="font-medium">العودة للتسوق</span>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">سلة المشتريات</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {!cart.items || cart.items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              السلة فارغة
            </h2>
            <p className="text-gray-500 mb-6">
              ابدأ التسوق وإضافة المنتجات إلى سلة المشتريات
            </p>
            <Link
              to="/home"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">منتجاتك</h2>
                    <p className="text-sm text-gray-500">
                      {cart.items.length} منتج في السلة
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                        {item.product.image ? (
                          <img
                            src={
                              item.product.image.startsWith("http")
                                ? item.product.image
                                : `https://supermarket-api-w79n.onrender.com${item.product.image}`
                            }
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-primary-600 font-semibold mb-2">
                          {item.product.price.toFixed(2)} ج.م
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={updating[item.product._id]}
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-semibold text-sm">
                              {updating[item.product._id]
                                ? "..."
                                : item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product._id,
                                  item.quantity + 1,
                                )
                              }
                              disabled={
                                updating[item.product._id] ||
                                item.quantity >= item.product.quantity
                              }
                              className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-left">
                        <p className="font-bold text-gray-900">
                          {(item.product.price * item.quantity).toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">عدد المنتجات</span>
                <span className="font-semibold">
                  {cart.items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    الإجمالي
                  </span>
                  <span className="text-2xl font-bold text-primary-600">
                    {getTotal().toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
