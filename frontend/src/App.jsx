import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Layouts
import ProtectedLayout from "./layout/ProtectedLayout";
import AdminLayout from "./layout/AdminLayout"; 

// Pages
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";
import VerifyEmail from "./pages/VerifyEmail";
import UserProfile from "./pages/UserProfile"; // ✅ Added User Profile Import

// Admin & Legal Pages
import AdminHome from "./pages/AdminHome"; 
import AdminFeatures from "./pages/admin/AdminFeatures"; 
import AdminTeam from "./pages/admin/AdminTeam"; 
import AdminPortfolio from "./pages/admin/AdminPortfolio"; 
import AdminHero from "./pages/admin/AdminHero"; 
import AdminServices from "./pages/admin/AdminServices"; 
import AdminBlog from "./pages/admin/AdminBlog"; 
import AdminUsers from "./pages/admin/AdminUsers"; 
import AdminProfile from "./pages/admin/AdminProfile"; 

// ✅ ADMIN CONTACT IMPORT
import AdminContact from "./pages/admin/AdminContact";

// ✅ ADMIN LEGAL AUTHORITY IMPORTS
import AdminPrivacyPolicy from "./pages/admin/AdminPrivacyPolicy";
import AdminTermsOfServices from "./pages/admin/AdminTermsOfServices";
import AdminCookiesPolicy from "./pages/admin/AdminCookiesPolicy";

// Public Legal Pages
import PrivacyPolicy from "./legal/PrivacyPolicy";
import TermsOfService from "./legal/TermsOfService";
import CookiePolicy from "./legal/CookiePolicy";

import "./style.css";

const MainLayout = () => (
  <div className="agency-shell">
    <main className="main-viewport">
      <Outlet />
    </main>
  </div>
);

const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#020617" }}>
    <div className="media-loader"></div>
  </div>
);

function App() {
  const [role, setRole] = useState(() => {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("role");
    if (isAuth && storedRole) {
      try {
        const parsed = JSON.parse(storedRole);
        return typeof parsed === "object" ? parsed.role : parsed;
      } catch {
        return storedRole;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Spinner />;

  return (
    <Router>
      <Routes>
        {/* 🔓 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setRole} />} />
          <Route path="/verify-email" element={<VerifyEmail onVerify={setRole} />} />
        </Route>

        {/* 🔐 PROTECTED USER ROUTES */}
        <Route element={<ProtectedLayout role={role} setRole={setRole} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<UserProfile />} /> {/* ✅ User Profile Route Mounted */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Route>

        {/* 👑 ADMIN ROUTES */}
        <Route element={<AdminLayout role={role} />}>
          <Route path="/admin/dashboard" element={<AdminHome />} />
          
          {/* ✅ Admin Authority Registries */}
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="/admin/portfolio" element={<AdminPortfolio />} />
          <Route path="/admin/hero" element={<AdminHero />} />
          <Route path="/admin/services" element={<AdminServices />} /> 
          <Route path="/admin/blog" element={<AdminBlog />} />
          <Route path="/admin/users" element={<AdminUsers />} /> 
          <Route path="/admin/profile" element={<AdminProfile />} /> 
          
          {/* ✅ Updated Admin Message Route */}
          <Route path="/admin/messages" element={<AdminContact />} /> 
          
          {/* ✅ Legal Authority Routes Integrated */}
          <Route path="/admin/edit-privacy" element={<AdminPrivacyPolicy />} />
          <Route path="/admin/edit-terms" element={<AdminTermsOfServices />} />
          <Route path="/admin/edit-cookies" element={<AdminCookiesPolicy />} />
        </Route>

        {/* ❌ CATCH-ALL */}
        <Route path="*" element={<Navigate to={role ? "/home" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;