import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import "./NavBar.css";
import "react-toastify/dist/ReactToastify.css";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first.");
    } else {
      navigate("/profile");
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch("http://localhost:3000/api/cart/getCart", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await response.json();

          if (data.success) {
            setCartItems(data.cart.items);
          } else {
            console.error(data.message || "Failed to fetch cart");
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
    };

    fetchCart();
  }, []);

  const isLoggedIn = localStorage.getItem("token");

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

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

          <Link
            to="/consultDoctor"
            className={`menu-link ${
              location.pathname === "/consultDoctor" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Consult Doctor
          </Link>

          <Link
            to="/adoption"
            className={`menu-link ${
              location.pathname === "/adoption" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Adoption
          </Link>

          <Link
            to="/blog"
            className={`menu-link ${
              location.pathname === "/blog" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Blogs
          </Link>

          <Link
            to="/qa"
            className={`menu-link ${
              location.pathname === "/qa" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Q/A
          </Link>
          
          <div
            className={`menu-link ${location.pathname === "/profile" ? "active" : ""}`}
            onClick={handleProfileClick}
          >
            Profile
          </div>
        </div>

        <div className="other-container">
          <div className="cart-icon" onClick={handleCartClick}>
            <FaShoppingCart className="cart-icon-img" />
            <span className="cart-count">{cartItemCount}</span>
          </div>

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

export default NavBar;
