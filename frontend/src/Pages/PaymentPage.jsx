import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./css/paymentpage.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const total = location.state?.total || 0;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // ✅ Load Razorpay SDK dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!window.Razorpay) {
      alert("⚠️ Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    try {
      // Step 1: Create order from backend
      const orderResponse = await fetch("http://localhost:8080/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }), // amount in paise
      });

      const orderData = await orderResponse.json();

      if (!orderData.id) {
        alert("⚠️ Could not create Razorpay order. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_RVdaZ7GpzFReUR", 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Marketpal",
        description: "Order Payment",
        image: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Razorpay_logo.svg",
        order_id: orderData.id,
        handler: function (response) {
          alert("✅ Payment Successful! ID: " + response.razorpay_payment_id);
          localStorage.setItem("orderStatus", "paid");
          navigate("/home/cart");
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.contact,
        },
        notes: {
          address: "Marketpal Pvt. Ltd.",
        },
        theme: {
          color: "#ffdd57",
        },
      };

      // Step 3: Open Razorpay secure checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        alert("❌ Payment Failed: " + response.error.description);
      });
    } catch (error) {
      console.error("Payment error:", error);
      alert("❌ Something went wrong. Please try again later.");
    }
  };

  return (
    <main className="payment-page">
      <h2 className="payment-title">💳 Secure Payment</h2>

      <form className="payment-form" onSubmit={handlePayment}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter your phone"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount to Pay</label>
          <input type="text" value={`₹ ${total}`} disabled />
        </div>

        <button type="submit" className="pay-btn">
          Pay Securely 💰
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/cart")}
        >
          Cancel
        </button>
      </form>
    </main>
  );
}
