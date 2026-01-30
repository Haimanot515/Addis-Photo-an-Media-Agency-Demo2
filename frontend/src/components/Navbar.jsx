import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Navbar({ role, setRole }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ full_name: "PROFILE", photo_url: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/user/profile");
        if (res.data.success && res.data.profile) {
          setUser({
            full_name: res.data.profile.full_name || "PROFILE",
            photo_url: res.data.profile.photo_url || ""
          });
        }
      } catch (err) {
        console.error("Profile sync error");
      }
    };
    fetchProfile();
  }, []);

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
      <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
        Home
      </NavLink>

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

      <ul className="nav-list container">
        <li><NavLink to="/about" className={({ isActive }) => (isActive ? "active" : "")}>About</NavLink></li>
        <li><NavLink to="/services" className={({ isActive }) => (isActive ? "active" : "")}>Services</NavLink></li>
        <li><NavLink to="/portfolio" className={({ isActive }) => (isActive ? "active" : "")}>Portfolio</NavLink></li>
        <li><NavLink to="/team" className={({ isActive }) => (isActive ? "active" : "")}>Team</NavLink></li>
        <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")}>Contact</NavLink></li>
        <li><NavLink to="/blog" className={({ isActive }) => (isActive ? "active" : "")}>Blog</NavLink></li>

        {isAdmin && (
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              Administration
            </NavLink>
          </li>
        )}

        <li>
          <button 
            onClick={() => navigate("/profile")} 
            className="logout-btn"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0' // Removed padding to prevent displacement
            }}
          >
            <div style={{
              width: '24px', // Small size to match text height
              height: '24px', 
              borderRadius: '50%', 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0 // Prevents the circle from squishing
            }}>
              {user.photo_url ? (
                <img src={user.photo_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span style={{ color: '#fff', fontWeight: '600' }}>
              {user.full_name.toUpperCase()}
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}