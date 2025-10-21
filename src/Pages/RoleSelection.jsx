/* eslint-disable no-unused-vars */
import React from "react";
import "./css/RoleSelection.css";
import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    localStorage.setItem("userRole", role);
    localStorage.removeItem("isLoggedIn");

    if (role === "admin") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="role-container">
      <div className="role-card">
        <h1>⚡ Welcome!</h1>
        <p>Please select your role to continue</p>
        <div className="button-group">
          <button className="seller-btn" onClick={() => handleRoleSelect("seller")}>
            I'm a Seller
          </button>
          <button className="buyer-btn" onClick={() => handleRoleSelect("buyer")}>
            I'm a Buyer
          </button>
        </div>
      </div>

      {/* 👑 Admin Access Button */}
      <button className="admin-btn" onClick={() => handleRoleSelect("admin")}>
        Admin 
      </button>
    </div>
  );
}
