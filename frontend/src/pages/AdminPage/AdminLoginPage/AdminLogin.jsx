import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email, password };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/admin/adminAuthentication/adminLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json()
      console.log(result);
      
      
      if (response.status === 403) {
        toast.warning(result.message, {
          position: "top-right",
          autoClose: 5000,
          onClose: () => {
            window.location.href = result.redirectUrl;
          },
        });
      } else if (result.success) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        navigate("/handleOrder")

        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
         
        });
      } else {
        toast.error(result.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <p className="forgot-link">
          Forgot password? <a href="/forgotPassword">Click here!</a>
        </p>
        <button type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} color="white" /> : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
