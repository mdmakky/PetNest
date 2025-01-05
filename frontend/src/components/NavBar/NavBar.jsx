import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
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
            Home
          </Link>
          <Link
            to="/consult-doctor"
            className={`menu-link ${
              location.pathname === "/consult-doctor" ? "active" : ""
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
            Blog
          </Link>
          <Link
            to="/qa"
            className={`menu-link ${location.pathname === "/qa" ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            Q/A
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
