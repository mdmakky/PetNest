import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "./AdminBar.css";
import "react-toastify/dist/ReactToastify.css";

const AdminBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLoginLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    } else {
      navigate("/login");
    }
  };


  const isLoggedIn = localStorage.getItem("token");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <img src="../images/logo.webp" alt="PetNest Logo" className="logo" />
          <h1 className="logo-text">PetNest</h1>
        </Link>

        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={`menu-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {/* <Link
            to="/adminHome"
            className={`menu-link ${
              location.pathname === "/adminHome" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link> */}

          <Link
            to="/handleBlog"
            className={`menu-link ${
              location.pathname === "/handleBlog" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Blog Requests
          </Link>

          <Link
            to="/handleDoctor"
            className={`menu-link ${
              location.pathname === "/handleDoctor" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Doctor Requests
          </Link>

          <Link
            to="/handleOrder"
            className={`menu-link ${
              location.pathname === "/handleOrder" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Order List
          </Link>


          <Link
            to="/adminPaymentDetails"
            className={`menu-link ${
              location.pathname === "/adminPaymentDetails" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Payment Details
          </Link>

          <Link
            to="/adminUser"
            className={`menu-link ${
              location.pathname === "/adminUser" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            User List
          </Link>
          
        </div>

        <div className="other-container">
          <div className="login-btn">
            <button className="cart-icon-button" onClick={handleLoginLogout}>
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <div className={`bar ${menuOpen ? "rotate-bar1" : ""}`}></div>
          <div className={`bar ${menuOpen ? "hide-bar" : ""}`}></div>
          <div className={`bar ${menuOpen ? "rotate-bar2" : ""}`}></div>
        </div>
      </div>
    </nav>
  );
};

export default AdminBar;
