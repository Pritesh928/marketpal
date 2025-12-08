/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/Admin.css";

axios.defaults.baseURL = "http://localhost:8080";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch products + stats
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [prodRes, statsRes] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/admin/stats"),
        ]);
        setProducts(prodRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setMessage("⚠️ Could not connect to backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("🗑️ Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("⚠️ Failed to delete product.");
    }
  };

  return (
    <div className="admin-container">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <h1>🛍️ Marketplace Admin</h1>
        <nav>
          <button
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={activeTab === "products" ? "active" : ""}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {activeTab === "dashboard" && (
          <section className="dashboard-section">
            <h2>Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>👤 Users</h3>
                <p>{stats.users}</p>
              </div>
              <div className="stat-card">
                <h3>🛒 Products</h3>
                <p>{stats.products}</p>
              </div>
              <div className="stat-card">
                <h3>📦 Orders</h3>
                <p>{stats.orders}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "products" && (
          <section className="products-section">
            <h2>Manage Products</h2>
            {loading ? (
              <p>Loading products...</p>
            ) : (
              <div className="product-grid">
                {products.length > 0 ? (
                  products.map((p) => (
                    <div className="product-card" key={p.id}>
                      <img
                        src={p.imageUrl || "https://via.placeholder.com/150"}
                        alt={p.title}
                      />
                      <h4>{p.title}</h4>
                      <p>{p.description}</p>
                      <p className="price">₹{p.price}</p>
                      <p className="category">Category: {p.category}</p>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "orders" && (
          <section className="orders-section">
            <h2>Order Management</h2>
            <p>Coming soon...</p>
          </section>
        )}

        {activeTab === "users" && (
          <section className="users-section">
            <h2>User Management</h2>
            <p>Coming soon...</p>
          </section>
        )}
      </main>

      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}
