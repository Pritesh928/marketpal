import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './Homepage';
import { fetchProductById } from './Homepage';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductById(id).then(res => setProduct(res));
  }, [id]);

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <main className="product-page">
      <div className="product-container">
        <div className="product-image-box">
          <img src={product.imageUrl} alt={product.title} />
        </div>
        <div className="product-details">
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <div className="price">₹ {product.price}</div>
          <div className="actions">
            <button
              className="buy-btn"
              onClick={() => {
                addToCart(product);
                navigate('/home/cart');
              }}
            >
              Buy Now
            </button>
            <button className="add-btn" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
