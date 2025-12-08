import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/sellpage.css";

axios.defaults.baseURL = "http://localhost:8080";

export default function SellPage() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    conditionType: "",
    imageUrl: ""
  });

  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // ✅ Fetch products from backend on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Backend unreachable:", err.message);
        setMessage("⚠️ Backend not reachable. Offline mode active.");
      }
    };
    fetchProducts();
  }, []);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Preview selected image
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("time", "72h");
    form.append("fileToUpload", file);

  const res = await fetch("https://litterbox.catbox.moe/resources/internals/api.php", {
    method: "POST",
    body: form,
  });

  const text = await res.text();
  if (!res.ok || !/^https?:\/\//i.test(text)) {
    throw new Error(text || "Upload failed");
  }

    const url = text.trim();
    setPreview(url);
    setProduct((prev) => ({ ...prev, imageUrl: url }));
  };

  // ✅ Sanitize payload before sending
  const submitPayload = (raw) => ({
    ...raw,
    price: parseFloat(raw.price) || 0,
    imageUrl: raw.imageUrl?.trim() || null,
  });

  // ✅ Add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.price || !product.category) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const payload = submitPayload(product);
      const res = await axios.post("/api/products", payload);
      setProducts((prev) => [...prev, res.data]);
      setMessage("✅ Product added successfully!");
      setProduct({
        title: "",
        description: "",
        price: "",
        category: "",
        conditionType: "",
        imageUrl: ""
      });
      setPreview("");
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage("⚠️ Could not connect to backend.");
    }
  };

  // ✅ Edit existing product
  const handleEdit = (p) => {
    setEditingProduct(p.id);
    setProduct({
      title: p.title || "",
      description: p.description || "",
      price: p.price ? String(p.price) : "",
      category: p.category || "",
      conditionType: p.conditionType || "",
      imageUrl: p.imageUrl || "",
    });
    setPreview(p.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Update existing product
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.price || !product.category) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const payload = submitPayload(product);
      const res = await axios.put(`/api/products/${editingProduct}`, payload);
      setProducts((prev) => prev.map((p) => (p.id === editingProduct ? res.data : p)));
      cancelEdit();
      setMessage("✅ Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      setMessage("⚠️ Failed to update product in backend.");
    }
  };

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setMessage("🗑️ Product deleted!");
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("⚠️ Delete failed.");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProduct({
      title: "",
      description: "",
      price: "",
      category: "",
      conditionType: "",
      imageUrl: ""
    });
    setPreview("");
  };

  return (
    <div className="sell-container">
      <header className="sell-header">
        <h1>⚡ Sell Your Product</h1>
        <button className="go-home-btn" onClick={() => navigate("/home")}>
          Go to Home
        </button>
      </header>

      <form className="sell-form" onSubmit={editingProduct ? handleUpdate : handleSubmit}>
        <h2>{editingProduct ? "✏️ Edit Product" : "List a New Product"}</h2>

        <div className="form-group">
          <input type="text" name="title" value={product.title} onChange={handleChange} placeholder="Product Title" required />
          <input type="text" name="description" value={product.description} onChange={handleChange} placeholder="Product Description" required />
          <input type="text" name="category" value={product.category} onChange={handleChange} placeholder="Category (e.g., Electronics)" required />
          <input type="number" name="price" value={product.price} onChange={handleChange} placeholder="Price (₹)" required />

          <select name="conditionType" value={product.conditionType} onChange={handleChange}>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used - Like New">Used - Like New</option>
            <option value="Used">Used</option>
          </select>

          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="button-row">
          <button type="submit" className="add-btn">
            {editingProduct ? "Save Changes" : "Add Product"}
          </button>
          {editingProduct && (
            <button type="button" className="cancel-btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>

        {message && <p className="status-msg">{message}</p>}
      </form>

      {products.length > 0 && (
        <section className="local-products">
          <h3>🛒Listed Products </h3>
          <div className="scrollable">
            {products.map((p) => (
              <div className="product-card" key={p.id}>
                <img src={p.imageUrl || "https://via.placeholder.com/150"} alt={p.title} />
                <h4>{p.title}</h4>
                <p>{p.description}</p>
                <div className="price">₹{p.price}</div>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
