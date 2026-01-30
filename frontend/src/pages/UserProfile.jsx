import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserCircle, FaDoorOpen, FaUserEdit } from "react-icons/fa";
import { MdOutlineClose, MdManageAccounts } from "react-icons/md";
import api from "../api/axios"; 

const ProfileSidebar = ({ isOpen = true, setRole }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(!isOpen);
  const sidebarRef = useRef(null);

  const [userData, setUserData] = useState({ name: "Loading...", photo: null, role: "" });

  const toggleSidebar = () => setCollapsed(prev => !prev);

  const profilePath = userData.role === "ADMIN" ? "/admin/profile" : "/profile";

  useEffect(() => {
    const fetchSidebarProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        if (res.data && res.data.success) {
          const d = res.data.profile;
          setUserData({
            name: d.full_name || "USER",
            photo: d.photo_url || null,
            role: d.role || "MEMBER"
          });
        }
      } catch (err) {
        setUserData({ name: "OFFLINE", photo: null, role: "GUEST" });
      }
    };
    fetchSidebarProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    if (setRole) setRole(null);
    navigate("/login", { replace: true });
  };

  const sidebarStyle = {
    width: collapsed ? "70px" : "300px",
    transition: "all 0.3s ease",
    background: "#ffffff",
    borderLeft: "1px solid #e2e8f0",
    position: "fixed",
    top: "80px",
    height: "calc(100vh - 80px)",
    right: 0,
    zIndex: 10000,
    boxShadow: collapsed ? "none" : "-10px 0 20px rgba(0,0,0,0.05)"
  };

  const profileHeader = {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #f1f5f9"
  };

  const avatarStyle = {
    width: collapsed ? "30px" : "50px",
    height: collapsed ? "30px" : "50px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #64748b"
  };

  const linkStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px 20px",
    textDecoration: "none",
    color: isActive ? "#4f46e5" : "#475569",
    fontWeight: "700",
    fontSize: "14px",
    background: isActive ? "#f5f3ff" : "transparent"
  });

  return (
    <aside ref={sidebarRef} style={sidebarStyle}>
      {/* HEADER */}
      <div style={profileHeader}>
        {userData.photo ? (
          <img src={userData.photo} alt="P" style={avatarStyle} />
        ) : (
          <FaUserCircle size={collapsed ? 25 : 40} color="#94a3b8" />
        )}
        {!collapsed && <span style={{ fontWeight: "800", fontSize: "14px" }}>{userData.name}</span>}
      </div>

      {/* TOGGLE BUTTON */}
      <div style={{ padding: "10px" }}>
        <button onClick={toggleSidebar} style={{ width: "100%", padding: "10px", background: "none", border: "1px solid #cbd5e1", borderRadius: "5px", cursor: "pointer" }}>
          {collapsed ? <MdManageAccounts /> : <MdOutlineClose />}
        </button>
      </div>

      <nav>
        {/* UPDATE PROFILE */}
        {!collapsed && (
          <NavLink to={profilePath} style={linkStyle}>
            <FaUserEdit size={18} /> <span>Update Profile</span>
          </NavLink>
        )}

        {/* LOGOUT */}
        <button 
          onClick={handleLogout}
          style={{ 
            width: "100%", padding: "15px 20px", border: "none", background: "none", 
            display: "flex", alignItems: "center", gap: "12px", cursor: "pointer",
            color: "#ef4444", fontWeight: "700", fontSize: "14px"
          }}
        >
          <FaDoorOpen size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;