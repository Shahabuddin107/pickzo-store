import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Minus, Trash2, X, CheckCircle } from 'lucide-react';
import { productsData, categories } from './products';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Filter Logic
  const filteredProducts = productsData.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Functions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
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

  const handleCheckout = () => {
    setIsOrderPlaced(true);
    setCart([]);
    setTimeout(() => {
      setIsOrderPlaced(false);
      setIsCartOpen(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide">
        ⚡ 100% Original Brands Guaranteed | Free Express Shipping on All Orders!
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-3xl font-black tracking-tight text-gray-950">Pickzo.</span>

        {/* Search */}
        <div className="hidden md:flex items-center w-1/3 relative">
          <input
            type="text"
            placeholder="Search Apple, Nike, Sony, Dell, clothes, shoes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 border border-gray-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <Search size={18} className="absolute left-4 text-gray-400" />
        </div>

        {/* Cart Trigger */}
        <div className="flex items-center space-x-5">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer bg-black text-white p-2.5 rounded-full shadow-md hover:bg-gray-800 transition"
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

      {/* Hero Banner */}
      <div
        className="relative h-[400px] bg-cover bg-center flex flex-col justify-end p-8 md:p-14 text-white"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="max-w-2xl mb-4">
          <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold mb-3">
            ⭐ Verified Official Brand Partner
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight">
            Shop Smart. <br /> Buy with Confidence.
          </h1>
        </div>
      </div>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-black text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {product.brand}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold mb-1">
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-base leading-snug line-clamp-2">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-black text-gray-950">
                      ₹{product.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-black hover:bg-gray-800 text-white px-3.5 py-2 rounded-xl flex items-center space-x-1 transition active:scale-95 text-xs font-bold shadow-sm"
                  >
                    <Plus size={16} />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-xl font-bold">Your Bag ({totalItemsCount})</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={22} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <p className="text-center text-gray-500 mt-20">Your cart is empty.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border" />
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                      <span className="text-xs text-blue-600 font-semibold">{item.brand}</span>
                      <p className="text-sm font-bold mt-1">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus size={14} /></button>
                      <span className="text-xs font-bold px-1">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-base font-bold mb-4">
                  <span>Grand Total:</span>
                  <span className="text-xl">₹{totalCartPrice.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition active:scale-98"
                >
                  Confirm & Place Order
                </button>
              </div>
            )}

            {/* Order Success Popup */}
            {isOrderPlaced && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 text-center z-10">
                <CheckCircle size={60} className="text-green-500 mb-3 animate-bounce" />
                <h4 className="text-2xl font-black">Order Placed Successfully!</h4>
                <p className="text-sm text-gray-500 mt-2">Thank you for shopping with Pickzo. Your items are being packed.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
