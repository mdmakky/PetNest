import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo-container">
            <img src="../images/logo.webp" alt="PetNest Logo" className="footer-logo" />
            <h2 className="footer-logo-text">PetNest</h2>
          </div>
          <p className="footer-about">
            Your trusted partner in pet care services. Providing quality adoption, 
            veterinary consultation, and pet care solutions since 2025.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/consultDoctor" className="footer-link">Consult Doctor</Link></li>
            <li><Link to="/adoption" className="footer-link">Adoption</Link></li>
            <li><Link to="/blog" className="footer-link">Blogs</Link></li>
            <li><Link to="/qa" className="footer-link">Q/A Forum</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Contact Info</h3>
          <ul className="footer-contact">
            <li><FaMapMarkerAlt className="footer-icon" />Palbari, Jashore, Bangladesh</li>
            <li><FaPhone className="footer-icon" />+8801859093806</li>
            <li><FaEnvelope className="footer-icon" />petnestweb@gmail.com</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="footer-social">
            <a href="https://facebook.com" className="social-icon"><FaFacebook /></a>
            <a href="https://instagram.com" className="social-icon"><FaInstagram /></a>
            <a href="https://twitter.com" className="social-icon"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;