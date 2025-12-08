import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/homepage.css';
import barca from "../assets/barca.jpeg";
import iphone from "../assets/iphone.png";
import card from "../assets/charizard.webp";
import ProductPage from './ProductPage';
import CartPage from './CartPage';

// ---------- Axios Config ----------
axios.defaults.baseURL = 'http://localhost:8080';

// ---------- Fallback Dummy Data ----------
const localProducts = [
  {
    id: 1,
    title: "FC Barcelona x Travis Scott Limited Edition Kit",
    description: "Pre-owned Nike jersey",
    price: 1899,
    imageUrl: barca,
    category: "Fashion",
  },
  {
    id: 2,
    title: "iPhone 14 Pro Max",
    description: "Brand new smartphone, 256GB",
    price: 99999,
    imageUrl: iphone,
    category: "Electronics",
  },
  {
    id: 3,
    title: "Rare Collectible Card",
    description: "Mint condition trading card",
    price: 1200,
    imageUrl: card,
    category: "Collectibles",
  },
];

// ---------- API Helpers ----------
export async function fetchProducts() {
  try {
    const res = await axios.get('/api/products');
    return res.data;
  } catch (e) {
    console.error("Error fetching products:", e.message);
    return localProducts;
  }
}

export async function fetchProductById(id) {
  try {
    const res = await axios.get(`/api/products/${id}`);
    return res.data;
  } catch (e) {
    console.error("Error fetching product:", e.message);
    return localProducts.find(p => p.id === Number(id)) || null;
  }
}

export async function searchProducts(q) {
  try {
    const res = await axios.get('/api/products/search', { params: { q } });
    return res.data;
  } catch (e) {
    console.error("Error searching products:", e.message);
    const term = q.toLowerCase();
    return localProducts.filter(
      p =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }
}

export async function fetchByCategory(category) {
  try {
    const res = await axios.get(`/api/products/category/${category}`);
    return res.data;
  } catch (e) {
    console.error("Error fetching category:", e.message);
    return localProducts.filter(p => p.category === category);
  }
}

// ---------- Cart Context ----------
const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

// ---------- Navbar ----------
function Navbar() {
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/home" className="navbar-logo">
          <div className="logo-box">M</div>
          <h1 className="logo-text">Marketpal</h1>
        </Link>

        <div className="navbar-actions">
          <button className="sell-btn" onClick={() => navigate("/sell")}>
            Sell on Marketpal
          </button>

          {/* ✅ FIXED: use absolute path for CartPage */}
          <Link to="/home/cart" className="cart-btn">
            🛒 <span className="cart-count">{cart.length}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

// ---------- Search Bar ----------
function SearchBar({ q, setQ, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search products..."
      />
      <button onClick={onSearch}>Search</button>
    </div>
  );
}

// ---------- Product Card ----------
function ProductCard({ product }) {
  return (
    <Link to={`product/${product.id}`} className="product-card">
      <img src={product.imageUrl} alt={product.title} />
      <h4>{product.title}</h4>
      <p>{product.description}</p>
      <div className="price">₹ {product.price}</div>
    </Link>
  );
}

// ---------- Home ----------
function Home() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts().then(data => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const doSearch = async () => {
    setLoading(true);
    const res = q ? await searchProducts(q) : await fetchProducts();
    setProducts(res);
    setLoading(false);
  };

  const filterByCategory = async (cat) => {
    setLoading(true);
    const res = await fetchByCategory(cat);
    setProducts(res);
    setLoading(false);
  };

  return (
    <main className="homepage">
      <section className="hero">
        <h2>Marketpal</h2>
        <div className="search-container">
          <SearchBar q={q} setQ={setQ} onSearch={doSearch} />
        </div>
      </section>

      <section className="categories">
        <h3>Browse by categories</h3>
        <div className="category-list">
          {['Electronics', 'Collectibles', 'Fashion', 'Health & beauty'].map(cat => (
            <button key={cat} onClick={() => filterByCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="products">
        <h3>Products</h3>
        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(p => <ProductCard key={p.id} product={p} />)
            ) : (
              <p>No products found.</p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

// ---------- Main Export ----------
export default function Homepage() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
      </Routes>
    </CartProvider>
  );
}
