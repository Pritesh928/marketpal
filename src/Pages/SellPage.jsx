import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/sellpage.css"; // <-- be sure this path is correct

axios.defaults.baseURL = "http://localhost:8080";

export default function SellPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: ""
  });
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Backend unreachable:", err.message);
        setMessage("Backend not reachable. Offline mode active.");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  // local preview for file input (does not upload the file)
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setProduct(prev => ({ ...prev, imageUrl: url })); // temp; ideally upload to cloud and store URL
  };

  const submitPayload = (raw) => ({
    ...raw,
    price: parseFloat(raw.price) || 0,
    imageUrl: raw.imageUrl && raw.imageUrl.trim() !== "" ? raw.imageUrl.trim() : null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.price || !product.category) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const payload = submitPayload(product);
      console.log("📤 Sending product data:", payload);
      const res = await axios.post("/api/products", payload);
      setProducts(prev => [...prev, res.data]);
      setMessage("✅ Product added successfully!");
      setProduct({ title: "", description: "", price: "", category: "", imageUrl: "" });
      setPreview("");
    } catch (err) {
      console.error("Error adding product:", err);
      setMessage("⚠️ Could not connect to backend.");
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p.id);
    setProduct({
      title: p.title || "",
      description: p.description || "",
      price: p.price != null ? String(p.price) : "",
      category: p.category || "",
      imageUrl: p.imageUrl || ""
    });
    setPreview(p.imageUrl || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!product.title || !product.description || !product.price || !product.category) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    }

    try {
      const payload = submitPayload(product);
      console.log("📤 Sending update data:", payload);
      const res = await axios.put(`/api/products/${editingProduct}`, payload);
      setProducts(prev => prev.map(p => p.id === editingProduct ? res.data : p));
      setEditingProduct(null);
      setProduct({ title: "", description: "", price: "", category: "", imageUrl: "" });
      setPreview("");
      setMessage("✅ Product updated successfully!");
    } catch (err) {
      console.error("Error updating product:", err);
      setMessage("⚠️ Failed to update product in backend.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
      setMessage("🗑️ Deleted!");
    } catch (err) {
      console.error(err);
      setMessage("⚠️ Delete failed.");
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setProduct({ title: "", description: "", price: "", category: "", imageUrl: "" });
    setPreview("");
  };

  return (
    <div className="sell-container">
      <header className="sell-header">
        <h1>⚡ Sell Your Product</h1>
        <button className="go-home-btn" onClick={() => navigate("/home")}>Go to Home</button>
      </header>

      <form className="sell-form" onSubmit={editingProduct ? handleUpdate : handleSubmit}>
        <h2>{editingProduct ? "✏️ Edit Product" : "List a New Product"}</h2>

        {/* Wrap all inputs inside .form-group to match your CSS */}
        <div className="form-group">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            placeholder="Product Title"
            required
          />

          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Product Description"
            required
          />

          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            placeholder="Category (e.g., Electronics)"
            required
          />

          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            required
          />

          <select name="conditionType" value={product.conditionType || ""} onChange={handleChange}>
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Used - Like New">Used - Like New</option>
            <option value="Used">Used</option>
          </select>

          {/* file input + preview */}
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <div className="image-preview"><img src={preview} alt="preview" /></div>}
        </div>

        <div className="button-row">
          <button type="submit" className="add-btn">{editingProduct ? "Save Changes" : "Add Product"}</button>
          {editingProduct && <button type="button" className="cancel-btn" onClick={cancelEdit}>Cancel</button>}
        </div>

        {message && <p className="status-msg">{message}</p>}
      </form>

      {products.length > 0 && (
        <section className="local-products">
          <h3>🛒 Products in Database</h3>
          <div className="scrollable">
            {products.map(p => (
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
