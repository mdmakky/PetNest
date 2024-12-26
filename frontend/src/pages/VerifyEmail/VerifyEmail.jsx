import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress } from "@mui/material";
import './VerifyEmail.css';

const VerifyEmail = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please enter the verification code.");
      return;
    }

    const data = { token };

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/authentication/verifyEmail", {
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
        <h2>A verification code has been sent to your email</h2>
        <div className="forgotPass-input-group">
          <label htmlFor="token">Enter code</label>
          <input
            type="text"
            id="token"
            name="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
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

export default VerifyEmail;
