/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// ✅ Import all pages
import RoleSelection from "./Pages/RoleSelection";
import LoginRegister from "./Pages/LoginRegister";
import HomePage from "./Pages/Homepage";
import Admin from "./Pages/Admin";
import AdminAuth from "./Pages/AdminAuth";
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

  // 🧹 Reset user data when visiting root (role selection)
  useEffect(() => {
    if (location.pathname === "/") {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userRole");
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* 1️⃣ Entry — Role Selection */}
      <Route path="/" element={<RoleSelection />} />

      {/* 2️⃣ Login/Register — Only after selecting a role */}
      <Route
        path="/login"
        element={userRole ? <LoginRegister /> : <Navigate to="/" replace />}
      />

      {/* 3️⃣ Home — For logged-in users only */}
      <Route
        path="/home/*"
        element={isLoggedIn ? <HomePage /> : <Navigate to="/login" replace />}
      />

      {/* 4️⃣ Cart — Only for logged-in users */}
      <Route
        path="/cart"
        element={isLoggedIn ? <CartPage /> : <Navigate to="/login" replace />}
      />

      {/* 5️⃣ Payment — Only for logged-in users */}
      <Route
        path="/payment"
        element={isLoggedIn ? <PaymentPage /> : <Navigate to="/login" replace />}
      />

      {/* 6️⃣ Sell — Only for logged-in users */}
      <Route
        path="/sell"
        element={isLoggedIn ? <SellPage /> : <Navigate to="/login" replace />}
      />

      {/* 7️⃣ Admin Auth — Admin login page */}
      <Route path="/admin-auth" element={<AdminAuth />} />

      {/* 8️⃣ Admin Dashboard — Only accessible by logged-in admin */}
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

      {/* 9️⃣ Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
