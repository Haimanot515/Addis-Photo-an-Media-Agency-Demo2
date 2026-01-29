import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // 1. Import your Footer

const ProtectedLayout = ({ role, setRole }) => {
  const [ready, setReady] = useState(false);
  const location = useLocation();

  const storedRoleRaw = localStorage.getItem("role");
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  
  let storedRole = null;
  try {
    storedRole = storedRoleRaw ? JSON.parse(storedRoleRaw) : null;
  } catch {
    storedRole = storedRoleRaw ? [storedRoleRaw] : null; 
  }

  const activeRole = role || storedRole;

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!ready) return null; 

  const hasAccess = isAuthenticated && activeRole && (Array.isArray(activeRole) ? activeRole.length > 0 : !!activeRole);

  if (!hasAccess) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <Navbar role={activeRole} setRole={setRole} />
      
      <div className="protected-content" style={{ minHeight: '80vh' }}>
        <Outlet context={{ role: activeRole }} />
      </div>

      {/* 2. Add the Footer here */}
      {/* It is now protected because this whole component only renders if hasAccess is true */}
      <Footer />
    </>
  );
};

export default ProtectedLayout;