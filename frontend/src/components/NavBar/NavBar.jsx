import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Link to="/" className="menu-link">
            PetNest
          </Link>
        </div>

        <div className={`menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" className="menu-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link
            to="/consult-doctor"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            Consult Doctor
          </Link>
          <Link
            to="/adoption"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            Adoption
          </Link>
          <Link
            to="/blog"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </Link>
          <Link
            to="/qa"
            className="menu-link"
            onClick={() => setMenuOpen(false)}
          >
            Q/A
          </Link>

          <Link
            to="/profile"
            className="menu-link"
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

export default Navbar;
