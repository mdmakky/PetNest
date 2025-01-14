import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SideBar.css";

const SideBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
            Dashboard
          </Link>

          <Link
            to="/profile"
            className={`menu-link ${
              location.pathname === "/profile" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Profile
          </Link>

          <Link
            to="/editProfile"
            className={`menu-link ${
              location.pathname === "/editProfile" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Update Profile
          </Link>

          <Link
            to="/sellProduct"
            className={`menu-link ${
              location.pathname === "/sellProduct" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Sell Product
          </Link>

          <Link
            to="/updateProduct"
            className={`menu-link ${
              location.pathname === "/updateProduct" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Update Product
          </Link>


          <Link
            to="/writeBlog"
            className={`menu-link ${
              location.pathname === "/writeBlog" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
            Write Blog
          </Link>

          <Link
            to="/showOrder"
            className={`menu-link ${
              location.pathname === "/showOrder" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
          Your Orders
          </Link>

          <Link
            to="/giveAdopt"
            className={`menu-link ${
              location.pathname === "/giveAdopt" ? "active" : ""
            }`}
            onClick={() => setMenuOpen(false)}
          >
          Give Adopt
          </Link>


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

export default SideBar;
