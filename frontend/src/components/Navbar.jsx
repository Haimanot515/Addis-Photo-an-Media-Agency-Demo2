import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ role, setRole }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    if (setRole) {
      setRole(null);
    }
    navigate("/", { replace: true });
  };

  const activeRole = role || JSON.parse(localStorage.getItem("role") || "null");
  const isAdmin = Array.isArray(activeRole) 
    ? activeRole.some(r => r.toLowerCase() === "admin") 
    : activeRole?.toLowerCase() === "admin";

  return (
    <nav className="navbar">
      {/* Size fix: In your HTML, 'Home' is a direct child of 'navbar'. 
          Ensure no extra divs are wrapping this link.
      */}
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>

      {/* Hamburger toggle for mobile */}
      <input type="checkbox" id="nav-toggle" className="nav-toggle" />
      <label htmlFor="nav-toggle" className="nav-toggle-label" aria-label="Toggle navigation menu">
        <svg className="hamburger-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" 
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <rect y="4" width="24" height="2" fill="white"/>
          <rect y="11" width="24" height="2" fill="white"/>
          <rect y="18" width="24" height="2" fill="white"/>
        </svg>

        <svg className="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" 
             xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <line x1="18" y1="6" x2="6" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </label>

      {/* IMPORTANT: The "container" class here is likely what controls 
          the width and padding that dictates the overall navbar height.
      */}
      <ul className="nav-list container">
        <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink></li>
        <li><NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>Services</NavLink></li>
        <li><NavLink to="/portfolio" className={({ isActive }) => (isActive ? "active" : "")}>Portfolio</NavLink></li>
        <li><NavLink to="/team" className={({ isActive }) => (isActive ? "active" : "")}>Team</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink></li>
        <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>Blog</NavLink></li>

        {/* Existing React Links */}
        {isAdmin && (
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              Admin Dashboard
            </NavLink>
          </li>
        )}

        <li>
          <button 
            onClick={handleLogout} 
            className="logout-btn" 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer', 
              font: 'inherit',
              padding: '0',
              marginLeft: '15px' // Matches link spacing
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}