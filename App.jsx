import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Star, Plus, Minus, Trash2, X, 
  CheckCircle, MapPin, CreditCard, ShieldCheck, PlusCircle, Package 
} from 'lucide-react';
import { productsData as localProducts, categories as initialCategories } from './products';

export default function App() {
  const [products, setProducts] = useState(localProducts);
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cart State (Persisted)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pickzo_cart");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // 'address', 'payment', 'success'
  const [activePaymentMethod, setActivePaymentMethod] = useState("upi");
  const [lastOrderDetails, setLastOrderDetails] = useState(null);

  // Admin Custom Product Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category: "Smartphones",
    price: "",
    originalPrice: "",
    image: ""
  });

  // Delivery Address
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Delhi",
    pincode: ""
  });

  // Global Products API Integration
  useEffect(() => {
    const fetchGlobalCatalog = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('https://dummyjson.com/products?limit=100');
        const data = await res.json();
        
        const formattedApiProducts = data.products.map((item) => ({
          id: item.id + 2000,
          name: item.title,
          brand: item.brand || "Global Brand",
          category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
          price: Math.round(item.price * 83), // USD to INR conversion
          originalPrice: Math.round(item.price * 83 * 1.35),
          rating: item.rating,
          image: item.thumbnail
        }));

        // Merge with existing items
        setProducts([...localProducts, ...formattedApiProducts]);

        // Merge all categories
        const dynamicCats = Array.from(new Set(formattedApiProducts.map(p => p.category)));
        setCategories(["All", ...new Set([...initialCategories.filter(c => c !== "All"), ...dynamicCats])]);
      } catch (err) {
        console.error("API Fetch Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalCatalog();
  }, []);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem("pickzo_cart", JSON.stringify(cart));
  }, [cart]);

  // Filter Logic
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Cart Actions
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.qty + delta;
            return nextQty > 0 ? { ...item, qty: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Manual Add Product Handler
  const handleAddProduct = (e) => {
    e.preventDefault();
    const productToAdd = {
      id: Date.now(),
      name: newProduct.name,
      brand: newProduct.brand || "Brand",
      category: newProduct.category,
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price) * 1.2,
      rating: 5.0,
      image: newProduct.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"
    };

    setProducts([productToAdd, ...products]);
    setIsAdminOpen(false);
    setNewProduct({ name: "", brand: "", category: "Smartphones", price: "", originalPrice: "", image: "" });
  };

  // Order Placement
  const processFinalOrder = () => {
    const orderRecord = {
      orderId: "PKZ-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      totalAmount: totalCartPrice,
      shippingAddress: { ...address },
      paymentMethod: activePaymentMethod.toUpperCase(),
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const existingOrders = JSON.parse(localStorage.getItem("pickzo_orders") || "[]");
    localStorage.setItem("pickzo_orders", JSON.stringify([orderRecord, ...existingOrders]));

    setLastOrderDetails(orderRecord);
    setCart([]);
    setCheckoutStep('success');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        ⚡ 100% Original Global Brands | Express Worldwide & India Shipping Active!
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-3xl font-black tracking-tight text-gray-950">Pickzo.</span>

        <div className="hidden md:flex items-center w-1/3 relative">
          <input
            type="text"
            placeholder="Search across millions of global products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search size={18} className="absolute left-4 text-gray-400" />
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="hidden sm:flex items-center space-x-1 border border-black px-3.5 py-2 rounded-full text-xs font-bold hover:bg-black hover:text-white transition"
          >
            <PlusCircle size={15} />
            <span>Add Item</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-black text-white p-2.5 rounded-full shadow-md hover:bg-gray-800 transition"
          >
            <ShoppingCart size={20} />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Categories Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-24">
        {isLoading ? (
          <div className="text-center py-20">
            <Package size={40} className="mx-auto text-gray-400 animate-spin mb-3" />
            <p className="font-bold text-gray-600">Loading Global Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold mb-1">
                      <Star size={13} fill="currentColor" />
                      <span>{product.rating}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-black text-gray-950">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-xs text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-xl flex items-center space-x-1 transition active:scale-95 text-xs font-bold"
                    >
                      <Plus size={15} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold">Shopping Bag ({totalItemsCount})</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={22} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-28">
                  <ShoppingCart size={44} className="mx-auto mb-2 text-gray-300" />
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border" />
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                      <span className="text-[11px] text-blue-600 font-semibold">{item.brand}</span>
                      <p className="text-xs font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={12} /></button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-base font-bold mb-4">
                  <span>Grand Total:</span>
                  <span className="text-xl">₹{totalCartPrice.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutStep('address');
                  }}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Address Modal */}
      {checkoutStep === 'address' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setCheckoutStep(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="text-blue-600" size={22} />
              <h3 className="text-lg font-bold">Delivery Address</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }} className="space-y-3">
              <input required type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <input required type="tel" placeholder="Mobile Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <input required type="text" placeholder="Flat, Street, Area" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
                <input required type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              </div>
              <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-xl mt-3 text-xs">
                Proceed to Payment (₹{totalCartPrice.toLocaleString("en-IN")})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {checkoutStep === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setCheckoutStep(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <div className="flex items-center space-x-2 mb-3">
              <ShieldCheck className="text-emerald-600" size={24} />
              <h3 className="text-lg font-bold">Secure Payment</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Amount to Pay: <strong>₹{totalCartPrice.toLocaleString("en-IN")}</strong></p>

            <div className="space-y-2 mb-5">
              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${activePaymentMethod === 'upi' ? 'border-black bg-gray-50' : ''}`}>
                <div className="flex items-center space-x-2">
                  <input type="radio" checked={activePaymentMethod === 'upi'} onChange={() => setActivePaymentMethod('upi')} />
                  <span className="text-xs font-bold">UPI (PhonePe, GPay, Paytm)</span>
                </div>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">Instant</span>
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${activePaymentMethod === 'card' ? 'border-black bg-gray-50' : ''}`}>
                <div className="flex items-center space-x-2">
                  <input type="radio" checked={activePaymentMethod === 'card'} onChange={() => setActivePaymentMethod('card')} />
                  <span className="text-xs font-bold">Cards (Credit / Debit)</span>
                </div>
                <CreditCard size={16} />
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${activePaymentMethod === 'cod' ? 'border-black bg-gray-50' : ''}`}>
                <div className="flex items-center space-x-2">
                  <input type="radio" checked={activePaymentMethod === 'cod'} onChange={() => setActivePaymentMethod('cod')} />
                  <span className="text-xs font-bold">Cash on Delivery (COD)</span>
                </div>
              </label>
            </div>

            <button onClick={processFinalOrder} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md">
              Pay & Confirm Order
            </button>
          </div>
        </div>
      )}

      {/* Order Success Receipt */}
      {checkoutStep === 'success' && lastOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl text-center relative">
            <CheckCircle size={55} className="text-emerald-500 mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-black">Order Confirmed!</h3>
            <p className="text-xs text-gray-500 mb-4">Order ID: <span className="font-mono font-bold text-black">{lastOrderDetails.orderId}</span></p>

            <div className="bg-gray-50 p-3 rounded-xl text-left text-xs space-y-1.5 border border-gray-100 mb-4">
              <div><strong>Name:</strong> {lastOrderDetails.shippingAddress.fullName} ({lastOrderDetails.shippingAddress.phone})</div>
              <div><strong>Deliver To:</strong> {lastOrderDetails.shippingAddress.street}, {lastOrderDetails.shippingAddress.city} - {lastOrderDetails.shippingAddress.pincode}</div>
              <div><strong>Payment Mode:</strong> {lastOrderDetails.paymentMethod}</div>
              <div><strong>Amount Paid:</strong> ₹{lastOrderDetails.totalAmount.toLocaleString("en-IN")}</div>
            </div>

            <button onClick={() => setCheckoutStep(null)} className="w-full bg-black text-white font-bold py-2.5 rounded-xl text-xs">
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* Admin Add Product Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <h3 className="text-base font-bold mb-3">Add Custom Item to Store</h3>

            <form onSubmit={handleAddProduct} className="space-y-2.5 text-xs">
              <input required type="text" placeholder="Product Title" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full border p-2 rounded-lg outline-none" />
              <input required type="text" placeholder="Brand Name" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} className="w-full border p-2 rounded-lg outline-none" />
              <input required type="number" placeholder="Price (₹)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border p-2 rounded-lg outline-none" />
              <input type="text" placeholder="Image URL (Unsplash/Direct link)" value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} className="w-full border p-2 rounded-lg outline-none" />
              
              <button type="submit" className="w-full bg-black text-white font-bold py-2.5 rounded-lg mt-2">
                Publish Product Now
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
