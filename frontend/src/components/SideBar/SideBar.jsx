import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SideBar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        ☰
      </button>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/editProfile">Update Profile</Link>
          </li>
          <li>
            <Link to="/sell-product">Sell Product</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
