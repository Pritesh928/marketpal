import React, { useEffect, useState } from "react";
import { useCart } from "./Homepage";
import { useNavigate } from "react-router-dom";
import "./css/cartpage.css";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState(null);

  // 🟡 Check if order was paid successfully
  useEffect(() => {
    const status = localStorage.getItem("orderStatus");
    setOrderStatus(status);
  }, []);

  // 🟢 Redirect to payment page with total amount
  const handleCheckout = () => {
    navigate("/payment", { state: { total } });
  };

  // ✅ If order is completed, show confirmation message
  if (orderStatus === "paid") {
    return (
      <div className="cart-empty">
        <h2>✅ Payment Successful</h2>
        <p>Your order is ready to ship 🚚</p>
        <button
          className="buy-btn"
          onClick={() => {
            localStorage.removeItem("orderStatus");
            clearCart();
            navigate("/home");
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // 🛒 Empty cart case
  if (cart.length === 0)
    return (
      <div className="cart-empty">
        <h2>Your cart is empty 🛒</h2>
        <p>Looks like you haven’t added anything yet!</p>
      </div>
    );

  // 🛍️ Normal cart display
  return (
    <main className="cart-page">
      <h2 className="cart-title">🛍️ Your Cart</h2>

      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img
              src={item.imageUrl || "https://via.placeholder.com/150"}
              alt={item.title}
            />
            <div className="cart-details">
              <h4>{item.title}</h4>
              <p>Qty: {item.qty}</p>
              <p>₹ {item.price * item.qty}</p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <h3>Total: ₹ {total}</h3>
        <div className="cart-actions">
          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
          <button className="buy-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}
