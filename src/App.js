/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import RoleSelection from "./Pages/RoleSelection";
import LoginRegister from "./Pages/LoginRegister";
import HomePage from "./Pages/Homepage";
import Admin from "./Pages/Admin";
import AdminAuth from "./Pages/AdminAuth"; // ✅ New admin login page
import SellPage from "./Pages/SellPage";
import CartPage from "./Pages/CartPage";
import PaymentPage from "./Pages/PaymentPage";

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");

  // 🧹 Clear session if user visits root (RoleSelection)
  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* 1️⃣ Entry Point — Role Selection */}
      <Route path="/" element={<RoleSelection />} />

      {/* 2️⃣ Login Page — Allowed only after selecting a role */}
      <Route
        path="/login"
        element={userRole ? <LoginRegister /> : <Navigate to="/" replace />}
      />

      {/* 3️⃣ Home (User Dashboard) — For logged-in users only */}
      <Route
        path="/home/*"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />

      {/* 4️⃣ Cart Page — Only for logged-in users */}
      <Route
        path="/cart"
        element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
      />

      {/* 5️⃣ Payment Page — Only for logged-in users */}
      <Route
        path="/payment"
        element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" replace />}
      />

      {/* 6️⃣ Sell Page — Only for logged-in users */}
      <Route
        path="/sell"
        element={isLoggedIn ? <SellPage /> : <Navigate to="/login" replace />}
      />

      {/* 7️⃣ Admin Auth — for admin login */}
      <Route path="/admin-auth" element={<AdminAuth />} />

      {/* 8️⃣ Admin Dashboard — Restricted to logged-in admins */}
      <Route
        path="/admin"
        element={
          isLoggedIn && userRole === "admin" ? (
            <Admin />
          ) : (
            <Navigate to="/admin-auth" replace />
          )
        }
      />

      {/* 9️⃣ Fallback for invalid routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
