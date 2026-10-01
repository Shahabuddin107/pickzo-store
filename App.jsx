import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Star, Plus, Minus, Trash2, X, 
  CheckCircle, MapPin, CreditCard, ShieldCheck, QrCode, 
  ShoppingBag, Sparkles, Loader2, ArrowRight
} from 'lucide-react';
import { productsData as localProducts, categories as baseCategories } from './products';

export default function App() {
  const [products, setProducts] = useState(localProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Cart Data synced with LocalStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("pickzo_cart");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(null); // 'address', 'payment', 'success'
  const [paymentMode, setPaymentMode] = useState("upi");
  const [lastOrder, setLastOrder] = useState(null);

  // Delivery Address State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "Delhi",
    pincode: ""
  });

  // LocalStorage Sync
  useEffect(() => {
    localStorage.setItem("pickzo_cart", JSON.stringify(cart));
  }, [cart]);

  // LIVE GLOBAL SEARCH: Duniya ke kisi bhi product ko search karne par live API fetch karega
  useEffect(() => {
    if (!searchQuery.trim()) {
      setProducts(localProducts);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        
        const apiResults = (data.products || []).map((item) => ({
          id: item.id + 50000,
          name: item.title,
          brand: item.brand || "Global Pickzo",
          category: item.category,
          price: Math.round(item.price * 83), // USD to INR
          originalPrice: Math.round(item.price * 83 * 1.3),
          rating: item.rating,
          image: item.thumbnail
        }));

        // Filter local matches
        const localMatches = localProducts.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Combine both
        setProducts([...localMatches, ...apiResults]);
      } catch (err) {
        console.error("Live Search Failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Category Filtering
  const filteredProducts = products.filter(item => {
    if (selectedCategory === "All") return true;
    return item.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  // Cart Functions
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

  // Final Order Confirmation
  const confirmOrder = () => {
    const orderData = {
      orderId: "PKZ-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      totalAmount: totalCartPrice,
      address: { ...address },
      paymentMethod: paymentMode.toUpperCase(),
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const existingOrders = JSON.parse(localStorage.getItem("pickzo_orders") || "[]");
    localStorage.setItem("pickzo_orders", JSON.stringify([orderData, ...existingOrders]));

    setLastOrder(orderData);
    setCart([]);
    setCheckoutStep('success');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900 font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <Sparkles size={14} className="text-yellow-400" />
        <span>Free Priority Express Delivery across India | 100% Genuine Branded Warranty</span>
      </div>

      {/* Main Navbar with Custom Logo */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* PICKZO LOGO */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-black via-gray-800 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <ShoppingBag size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-gray-950 block leading-none">Pickzo<span className="text-indigo-600">.</span></span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mt-0.5">Global Store</span>
          </div>
        </div>

        {/* Global Live Search Bar */}
        <div className="flex-1 max-w-xl mx-4 md:mx-8 relative">
          <input
            type="text"
            placeholder="Search ANY product in the world (e.g. iPhone, Rolex, Perfume, Shoes)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100/90 border border-gray-200 rounded-full py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition"
          />
          <Search size={18} className="absolute left-4 top-3 text-gray-400" />
          {isSearching && (
            <Loader2 size={18} className="absolute right-4 top-3 text-indigo-600 animate-spin" />
          )}
        </div>

        {/* Cart Trigger */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-gray-950 hover:bg-indigo-600 text-white p-2.5 rounded-full shadow-md transition duration-200"
        >
          <ShoppingCart size={20} />
          {totalItemsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {totalItemsCount}
            </span>
          )}
        </button>
      </nav>

      {/* Category Pills */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-5 pb-2">
        <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-2">
          {baseCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setSearchQuery(""); }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-gray-950 text-white shadow-sm"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-200 p-8 mt-4">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-800">No matching products found</h3>
            <p className="text-xs text-gray-500 mt-1">Try searching for keywords like "phone", "shirt", "shoes", or "watch".</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition flex flex-col group"
              >
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gray-50 p-2">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {product.brand}
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-semibold mb-1">
                      <Star size={13} fill="currentColor" />
                      <span>{product.rating}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2">
                      {product.name}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm sm:text-base font-black text-gray-950">
                        ₹{product.price.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[11px] text-gray-400 line-through">
                        ₹{product.originalPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-gray-950 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-xl flex items-center space-x-1 transition active:scale-95 text-xs font-bold shadow-sm"
                    >
                      <Plus size={14} />
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
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl p-5 relative">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <h3 className="text-lg font-bold">Shopping Bag ({totalItemsCount})</h3>
              <button onClick={() => setIsCartOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-28">
                  <ShoppingBag size={48} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Your shopping bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 border-b border-gray-100 pb-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border bg-gray-50" />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-gray-900 truncate">{item.name}</h5>
                      <span className="text-[10px] text-indigo-600 font-semibold">{item.brand}</span>
                      <p className="text-xs font-bold mt-0.5">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 bg-gray-100 rounded-lg p-1">
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
                <div className="flex justify-between text-sm font-bold mb-3">
                  <span>Grand Total:</span>
                  <span className="text-lg font-black text-gray-950">₹{totalCartPrice.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setCheckoutStep('address'); }}
                  className="w-full bg-gray-950 hover:bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Checkout Now</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Address Modal */}
      {checkoutStep === 'address' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setCheckoutStep(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="text-indigo-600" size={22} />
              <h3 className="text-lg font-bold">Delivery Address</h3>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setCheckoutStep('payment'); }} className="space-y-3">
              <input required type="text" placeholder="Full Name" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <input required type="tel" placeholder="Mobile Number (10 Digits)" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <input required type="text" placeholder="House / Flat / Street / Landmark" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              <div className="grid grid-cols-2 gap-2">
                <input required type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
                <input required type="text" placeholder="PIN Code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full border rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-black" />
              </div>
              <button type="submit" className="w-full bg-gray-950 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl mt-3 text-xs shadow-md transition">
                Proceed to Payment (₹{totalCartPrice.toLocaleString("en-IN")})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Step 2: Payment Gateway with Live QR Code */}
      {checkoutStep === 'payment' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button onClick={() => setCheckoutStep(null)} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg">
              <X size={20} />
            </button>
            <div className="flex items-center space-x-2 mb-2">
              <ShieldCheck className="text-emerald-600" size={24} />
              <h3 className="text-lg font-bold">Pickzo Secure Gateway</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">Total Amount: <strong className="text-gray-950 font-bold text-sm">₹{totalCartPrice.toLocaleString("en-IN")}</strong></p>

            <div className="space-y-2 mb-4">
              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${paymentMode === 'upi' ? 'border-indigo-600 bg-indigo-50/40' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <input type="radio" checked={paymentMode === 'upi'} onChange={() => setPaymentMode('upi')} />
                  <div>
                    <span className="text-xs font-bold block">UPI / QR Code (GPay, PhonePe, Paytm)</span>
                    <span className="text-[10px] text-gray-500">Scan QR Code directly with any app</span>
                  </div>
                </div>
                <QrCode size={18} className="text-indigo-600" />
              </label>

              {paymentMode === 'upi' && (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-4 text-center my-2">
                  <p className="text-[11px] font-bold text-gray-700 mb-2">Scan & Pay ₹{totalCartPrice.toLocaleString("en-IN")}</p>
                  <div className="inline-block p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=pickzostore@upi%26pn=PickzoStore%26am=${totalCartPrice}%26cu=INR`}
                      alt="UPI QR Code"
                      className="w-36 h-36 mx-auto"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">UPI ID: pickzostore@upi</p>
                </div>
              )}

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${paymentMode === 'card' ? 'border-indigo-600 bg-indigo-50/40' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <input type="radio" checked={paymentMode === 'card'} onChange={() => setPaymentMode('card')} />
                  <span className="text-xs font-bold">Credit / Debit Card (Visa, Master, RuPay)</span>
                </div>
                <CreditCard size={18} className="text-gray-400" />
              </label>

              <label className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${paymentMode === 'cod' ? 'border-indigo-600 bg-indigo-50/40' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-2.5">
                  <input type="radio" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
                  <span className="text-xs font-bold">Cash on Delivery (Pay at Doorstep)</span>
                </div>
              </label>
            </div>

            <button onClick={confirmOrder} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs shadow-lg transition active:scale-98">
              Verify & Complete Order
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Order Receipt */}
      {checkoutStep === 'success' && lastOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl text-center relative">
            <CheckCircle size={55} className="text-emerald-500 mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-black">Order Successfully Confirmed!</h3>
            <p className="text-xs text-gray-500 mb-4">Receipt Reference: <span className="font-mono font-bold text-gray-950">{lastOrder.orderId}</span></p>

            <div className="bg-gray-50 p-4 rounded-xl text-left text-xs space-y-1.5 border border-gray-100 mb-4">
              <div><strong>Recipient:</strong> {lastOrder.address.fullName} ({lastOrder.address.phone})</div>
              <div><strong>Address:</strong> {lastOrder.address.street}, {lastOrder.address.city} - {lastOrder.address.pincode}</div>
              <div><strong>Payment Method:</strong> {lastOrder.paymentMethod}</div>
              <div><strong>Total Paid:</strong> ₹{lastOrder.totalAmount.toLocaleString("en-IN")}</div>
            </div>

            <button onClick={() => setCheckoutStep(null)} className="w-full bg-gray-950 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl text-xs shadow transition">
              Back to Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
