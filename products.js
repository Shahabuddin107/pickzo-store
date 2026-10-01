// src/data/products.js

export const categories = [
  "All",
  "Men's Wear",
  "Ladies Wear",
  "Kids Wear",
  "Shoes & Footwear",
  "Chappal & Slippers",
  "Eyewear (Chasma)",
  "Smartphones",
  "Laptops",
  "Mouse & Keyboard",
  "Cameras",
  "Audio & Buds",
  "Bottles & Flasks"
];

export const productsData = [
  // --- 1. MEN'S WEAR (Levi's, Tommy Hilfiger) ---
  {
    id: 101,
    name: "Levi's Men's Original Trucker Denim Jacket",
    brand: "Levi's",
    category: "Men's Wear",
    price: 4999,
    originalPrice: 7999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 102,
    name: "Tommy Hilfiger Men's Slim Fit Cotton Polo",
    brand: "Tommy Hilfiger",
    category: "Men's Wear",
    price: 2999,
    originalPrice: 4999,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=700&q=80"
  },

  // --- 2. LADIES WEAR (Zara, H&M) ---
  {
    id: 201,
    name: "Zara Women's Floral Print Midi Dress",
    brand: "Zara",
    category: "Ladies Wear",
    price: 3590,
    originalPrice: 5590,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 202,
    name: "H&M Women's Rib-Knit Cardigan Sweater",
    brand: "H&M",
    category: "Ladies Wear",
    price: 1999,
    originalPrice: 2999,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=700&q=80"
  },

  // --- 3. KIDS WEAR (GAP Kids, Nike Kids) ---
  {
    id: 301,
    name: "GAP Kids Arch Logo Pullover Hoodie",
    brand: "GAP",
    category: "Kids Wear",
    price: 1799,
    originalPrice: 2999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 302,
    name: "Nike Kids Sportswear Club Fleece Tracksuit",
    brand: "Nike",
    category: "Kids Wear",
    price: 2495,
    originalPrice: 3995,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=700&q=80"
  },

  // --- 4. SHOES & FOOTWEAR (Nike, Adidas) ---
  {
    id: 401,
    name: "Nike Air Max 270 React Running Shoes",
    brand: "Nike",
    category: "Shoes & Footwear",
    price: 10495,
    originalPrice: 14995,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 402,
    name: "Adidas Originals Stan Smith Sneakers",
    brand: "Adidas",
    category: "Shoes & Footwear",
    price: 6999,
    originalPrice: 8999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=700&q=80"
  },

  // --- 5. CHAPPAL & SLIPPERS (Puma, Crocs) ---
  {
    id: 501,
    name: "Puma Leadcat 2.0 Unisex Comfort Slides",
    brand: "Puma",
    category: "Chappal & Slippers",
    price: 1299,
    originalPrice: 2299,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 502,
    name: "Crocs Classic Unisex Clogs & Slippers",
    brand: "Crocs",
    category: "Chappal & Slippers",
    price: 2495,
    originalPrice: 3495,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=700&q=80"
  },

  // --- 6. EYEWEAR (Ray-Ban, Oakley) ---
  {
    id: 601,
    name: "Ray-Ban Aviator Classic Polarized Sunglasses",
    brand: "Ray-Ban",
    category: "Eyewear (Chasma)",
    price: 8590,
    originalPrice: 10590,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 602,
    name: "Oakley Holbrook Square Matte Black Sunglasses",
    brand: "Oakley",
    category: "Eyewear (Chasma)",
    price: 7490,
    originalPrice: 9490,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=700&q=80"
  },

  // --- 7. SMARTPHONES (Apple, Samsung) ---
  {
    id: 701,
    name: "Apple iPhone 15 Pro (256 GB) - Natural Titanium",
    brand: "Apple",
    category: "Smartphones",
    price: 127990,
    originalPrice: 134900,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 702,
    name: "Samsung Galaxy S24 Ultra 5G (512 GB)",
    brand: "Samsung",
    category: "Smartphones",
    price: 119999,
    originalPrice: 139999,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"
  },

  // --- 8. LAPTOPS (Apple MacBook, Dell) ---
  {
    id: 801,
    name: "Apple MacBook Pro 16-inch M3 Pro (18GB/512GB)",
    brand: "Apple",
    category: "Laptops",
    price: 199900,
    originalPrice: 219900,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 802,
    name: "Dell XPS 15 Intel Core i9 (32GB / 1TB SSD)",
    brand: "Dell",
    category: "Laptops",
    price: 164990,
    originalPrice: 189990,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=700&q=80"
  },

  // --- 9. MOUSE & KEYBOARD (Logitech, Razer) ---
  {
    id: 901,
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    brand: "Logitech",
    category: "Mouse & Keyboard",
    price: 8995,
    originalPrice: 10995,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 902,
    name: "Razer BlackWidow V4 Pro Mechanical Gaming Keyboard",
    brand: "Razer",
    category: "Mouse & Keyboard",
    price: 16999,
    originalPrice: 22999,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"
  },

  // --- 10. CAMERAS (Sony, Canon) ---
  {
    id: 1001,
    name: "Sony Alpha 7 IV Full-frame Mirrorless Camera",
    brand: "Sony",
    category: "Cameras",
    price: 214990,
    originalPrice: 242990,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 1002,
    name: "Canon EOS R6 Mark II Mirrorless Body Kit",
    brand: "Canon",
    category: "Cameras",
    price: 198990,
    originalPrice: 225995,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=700&q=80"
  },

  // --- 11. AUDIO & BUDS (Sony, Apple AirPods) ---
  {
    id: 1101,
    name: "Apple AirPods Pro (2nd Gen) with MagSafe Case",
    brand: "Apple",
    category: "Audio & Buds",
    price: 20990,
    originalPrice: 24900,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 1102,
    name: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    brand: "Sony",
    category: "Audio & Buds",
    price: 26990,
    originalPrice: 34990,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"
  },

  // --- 12. BOTTLES & FLASKS (Milton, Hydro Flask) ---
  {
    id: 1201,
    name: "Milton Thermosteel Flip Lid Vacuum Insulated Flask (1L)",
    brand: "Milton",
    category: "Bottles & Flasks",
    price: 999,
    originalPrice: 1290,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 1202,
    name: "Hydro Flask 32 oz Wide Mouth with Straw Lid",
    brand: "Hydro Flask",
    category: "Bottles & Flasks",
    price: 3499,
    originalPrice: 4499,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=700&q=80"
  }
];