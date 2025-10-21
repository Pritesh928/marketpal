/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/Admin.css";

axios.defaults.baseURL = "http://localhost:8080";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setMessage("⚠️ Could not connect to backend.");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Add new product
  const handleAddProduct = async () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      alert("Please fill out required fields");
      return;
    }

    try {
      const payload = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        ownerUsername: "admin", // optional: or from localStorage if you have admin auth
      };

      const res = await axios.post("/api/products", payload);
      setProducts((prev) => [...prev, res.data]);
      setNewProduct({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "",
      });
      setMessage("✅ Product added successfully!");
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage("⚠️ Failed to add product.");
    }
  };

  // ✅ Delete a product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("🗑️ Product deleted!");
    } catch (err) {
      console.error("Error deleting:", err);
      setMessage("⚠️ Failed to delete product.");
    }
  };

  return (
    <div className="admin-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <div className="logo-box">⚡</div>
            <span className="logo-text">Marketpal Admin</span>
          </div>
          <div className="navbar-actions">
            <button
              className="sell-btn"
              onClick={() => (window.location.href = "/home")}
            >
              Go to Home
            </button>
          </div>
        </div>
      </nav>

      {/* 🧠 Admin Control Panel */}
      <div className="admin-panel">
        <h2>Add Product</h2>
        <div className="admin-form">
          <input
            type="text"
            placeholder="Product Title"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          />
          <button onClick={handleAddProduct}>Add Product</button>
        </div>

        {message && <p className="status-msg">{message}</p>}
      </div>

      {/* 🛍️ Product Grid */}
      <div className="products">
        <h2>All Products</h2>
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  src={product.imageUrl || "https://via.placeholder.com/150"}
                  alt={product.title}
                />
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p className="price">₹{product.price}</p>
                <p className="category">Category: {product.category}</p>
                <p className="owner">
                  Owner: {product.ownerUsername || "Unknown"}
                </p>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No Products .</p>
          )}
        </div>
      </div>
    </div>
  );
}
