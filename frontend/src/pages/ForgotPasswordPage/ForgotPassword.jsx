import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email };
    setLoading(true); 

    try {
      const response = await fetch("http://localhost:3000/api/authentication/forgotPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 2000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="forgotPass-container">
      <form className="forgotPass-form" onSubmit={handleSubmit}>
        <h2>Enter email address</h2>
        <div className="forgotPass-input-group">
          <label htmlFor="email">Enter email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="forgotPassBtn" type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} color="white" /> : "Continue"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
