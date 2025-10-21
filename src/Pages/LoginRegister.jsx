import React, { useState } from "react";
import axios from "axios";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // 🔹 Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
        role: localStorage.getItem("userRole"),
      });

      if (res.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/home";
      }
    } catch (error) {
      alert("Invalid credentials or server error");
      console.error(error);
    }
  };

  // 🔹 Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/register", {
        username,
        password,
        fullName,
        role: localStorage.getItem("userRole"),
      });
      if (res.status === 200) {
        alert("Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (error) {
      alert("User already exists or server error");
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">⚡ Marketpal</h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Welcome Back! Let’s start Shopping!!!"
            : "Create your account to get started"}
        </p>

        <form
          className="auth-form"
          onSubmit={isLogin ? handleLogin : handleRegister}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              className="auth-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isLogin && (
            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" /> Remember Me
              </label>
              <a
                href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Faccounts.google.com%2F&dsh=S-148717191%3A1760785507314926&followup=https%3A%2F%2Faccounts.google.com%2F&ifkv=AfYwgwW3XBW_5hLsu22MTzkk8si01rAHp3h7LVtvfuiM0izQaVOat6WviHAW2gxDbtWLPbkC_LKIow&passive=1209600&flowName=GlifWebSignIn&flowEntry=ServiceLogin"
                className="forgot-link"
                target="_blank"
                rel="noreferrer"
              >
                Forgot Password?
              </a>
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        <div className="auth-toggle">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="toggle-link">
                Register Now
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="toggle-link">
                Login
              </button>
            </>
          )}
        </div>
      </div>

      <style>{`
        /* === Global Styles === */
        .auth-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at center, #1a1a1a 0%, #0d0d0d 100%);
          font-family: 'Poppins', sans-serif;
          color: #fff;
          animation: fadeIn 1.2s ease;
        }

        /* === Card === */
        .auth-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 221, 87, 0.3);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 30px rgba(255, 221, 87, 0.1);
          animation: floatUp 1.3s ease forwards;
        }

        .auth-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #ffdd57;
          margin-bottom: 0.5rem;
          letter-spacing: 1px;
        }

        .auth-subtitle {
          text-align: center;
          color: #dcdcdc;
          margin-bottom: 1.8rem;
          font-size: 0.95rem;
        }

        /* === Form === */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-input {
          padding: 0.8rem 1rem;
          border-radius: 10px;
          border: 1px solid rgba(255, 221, 87, 0.3);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: 0.3s ease;
        }

        .auth-input::placeholder {
          color: #aaa;
        }

        .auth-input:focus {
          border-color: #ffdd57;
          box-shadow: 0 0 10px rgba(255, 221, 87, 0.4);
        }

        /* === Options (Remember + Forgot) === */
        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #ccc;
        }

        .remember-me input {
          margin-right: 0.3rem;
          accent-color: #ffdd57;
        }

        .forgot-link {
          color: #ffdd57;
          text-decoration: none;
          font-weight: 500;
          transition: 0.3s;
        }

        .forgot-link:hover {
          text-shadow: 0 0 8px #ffdd57;
        }

        /* === Buttons === */
        .auth-button {
          background: linear-gradient(135deg, #ffdd57, #ffcc00);
          color: #0d0d0d;
          border: none;
          padding: 0.9rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s ease;
          box-shadow: 0 0 15px rgba(255, 221, 87, 0.3);
        }

        .auth-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px rgba(255, 221, 87, 0.6);
        }

        /* === Toggle === */
        .auth-toggle {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.9rem;
          color: #dcdcdc;
        }

        .toggle-link {
          background: none;
          border: none;
          color: #ffdd57;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .toggle-link:hover {
          text-shadow: 0 0 10px #ffdd57;
        }

        /* === Animations === */
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes floatUp {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
