import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { ShoppingCart, Plus, Minus, Check, X } from "lucide-react";

const categories = ["الكل", "مواد تموينية", "أدوات منزلية", "مستحضرات تجميل"];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCart();
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

  const fetchCart = async () => {
    try {
      const res = await axios.get(
        "https://supermarket-api-w79n.onrender.com/api/cart",
      );
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (productId) => {
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await axios.post("https://supermarket-api-w79n.onrender.com/api/cart", {
        productId,
        quantity: 1,
      });
      await fetchCart();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في إضافة المنتج");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const getCartQuantity = (productId) => {
    const item = cart.items?.find((item) => item.product?._id === productId);
    return item?.quantity || 0;
  };

  const getCartCount = () => {
    return cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "الكل" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={getCartCount()}
      />

      {/* Categories */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا توجد منتجات</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartQty = getCartQuantity(product._id);
              const available = product.available && product.quantity > 0;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={
                          product.image.startsWith("http")
                            ? product.image
                            : `https://supermarket-api-w79n.onrender.com${product.image}`
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingCart className="w-12 h-12" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {available ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" /> متوفر
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <X className="w-3 h-3" /> غير متوفر
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-primary-600">
                        {product.price.toFixed(2)} ج.م
                      </span>
                      <span className="text-xs text-gray-400">
                        متوفر: {product.quantity}
                      </span>
                    </div>

                    {/* Add to Cart */}
                    {available ? (
                      <button
                        onClick={() => addToCart(product._id)}
                        disabled={
                          addingToCart[product._id] ||
                          cartQty >= product.quantity
                        }
                        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
                          cartQty > 0
                            ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                            : "bg-primary-600 text-white hover:bg-primary-700 shadow-md"
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {addingToCart[product._id] ? (
                          "جاري الإضافة..."
                        ) : cartQty > 0 ? (
                          <>
                            <Plus className="w-4 h-4" />
                            في السلة ({cartQty})
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4" />
                            إضافة إلى السلة
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl font-medium text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                      >
                        غير متوفر
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
