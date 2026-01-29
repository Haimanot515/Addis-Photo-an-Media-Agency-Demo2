import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";
import AdminHome from "../pages/AdminHome"; // ✅ Your single file

const AdminLayout = ({ role }) => {
  const location = useLocation();

  // 🛡️ SECURITY CHECK FIX
  // We check the 'role' prop OR the 'role' array stored in localStorage by your LoginForm
  const storedRole = localStorage.getItem("role");
  const activeRole = role || (storedRole ? JSON.parse(storedRole) : null);

  // Check if "admin" exists inside the array (e.g., ["admin"])
  const isAdmin = Array.isArray(activeRole)
    ? activeRole.some(r => r.toLowerCase() === "admin")
    : activeRole?.toLowerCase() === "admin";

  if (!isAdmin) {
    console.warn("Unauthorized access attempt. Redirecting to home.");
    return <Navigate to="/home" replace />;
  }

  // Check if the current URL is exactly the dashboard
  const isDashboardHome = location.pathname === "/admin/dashboard";

  return (
    <div className="admin-layout-wrapper" style={styles.wrapper}>
      {/* 1. Horizontal Admin Navbar */}
      <AdminNavbar />

      <main className="admin-main-viewport" style={styles.main}>
        <div className="admin-container" style={styles.container}>
          
          {/* ✅ Renders AdminHome.jsx when at /admin/dashboard */}
          {isDashboardHome && <AdminHome />}

          {/* 🔄 Renders other admin sub-pages (Messages, Legal, etc.) */}
          <Outlet /> 
        </div>
      </main>

      {/* 3. Admin Footer */}
      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f4f4f9", 
  },
  main: {
    flex: 1,
    padding: "40px 20px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  }
};

export default AdminLayout;