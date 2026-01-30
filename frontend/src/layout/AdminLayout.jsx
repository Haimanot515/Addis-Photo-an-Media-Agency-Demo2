import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

const AdminLayout = ({ role }) => {
  const storedRole = localStorage.getItem("role");
  const activeRole = role || (storedRole ? JSON.parse(storedRole) : null);

  const isAdmin = Array.isArray(activeRole)
    ? activeRole.some(r => r.toLowerCase() === "admin")
    : activeRole?.toLowerCase() === "admin";

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="admin-layout-wrapper" style={styles.wrapper}>
      {/* 1. Navbar stays constant */}
      <AdminNavbar />

      <main className="admin-main-viewport" style={styles.main}>
        <div className="admin-container" style={styles.container}>
          {/* ✅ ONLY use Outlet here. 
             The Router will decide to show AdminHome or other pages.
          */}
          <Outlet /> 
        </div>
      </main>

      <Footer />
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f4f7f6", // Matches your AdminHome background
  },
  main: {
    flex: 1,
    // Removed extra padding here to let AdminHome handle its own elite spacing
  },
  container: {
    maxWidth: "1400px", // Slightly wider for elite dashboard feel
    margin: "0 auto",
    width: "100%",
  }
};

export default AdminLayout;