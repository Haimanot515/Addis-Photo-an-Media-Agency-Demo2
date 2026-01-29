import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 
import { PiCameraDuotone, PiShieldCheckDuotone, PiUserCircleDuotone } from "react-icons/pi";

const LoginForm = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [captchaToken] = useState("bypass-token"); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Backend Request
      const res = await api.post(
        "/auth/login-user",
        { ...formData, captchaToken },
        { withCredentials: true }
      );

      // 2. Logic after successful API response
      if (res.data && res.data.authenticated) {
        try {
          // Prepare the role as an array (Required by your ProtectedLayout)
          const userRole = Array.isArray(res.data.role)
            ? res.data.role
            : [res.data.role || "USER"];

          // Store for persistence (for page refreshes)
          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("role", JSON.stringify(userRole));

          // ✅ THE KEY FIX: Pass the actual role array to the parent state
          // This allows ProtectedLayout to recognize the user immediately
          if (setIsAuthenticated) {
            setIsAuthenticated(userRole); 
          }

          setSuccess("Access Granted! Opening Media Terminal...");

          // Delay redirect so user can see the success message
          setTimeout(() => {
            navigate("/home");
          }, 1500);

        } catch (storageErr) {
          console.error("Client Error:", storageErr);
          setError("Terminal Cache Error. Please try again.");
        }
      } else {
        setError("Identity verification failed. Please try again.");
      }

    } catch (err) {
      setSuccess(""); 
      // If backend is down or credentials wrong, show specific error
      const msg = err.response?.data?.error || "Invalid Credentials";
      setError(msg);
      
      // Cleanup on failure
      localStorage.removeItem("role"); 
      localStorage.removeItem("isAuthenticated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <form onSubmit={handleSubmit} style={glassCardStyle}>
          <div style={iconWrapperStyle}>
            <PiCameraDuotone size={42} color="#3b82f6" />
          </div>
          
          <h2 style={titleStyle}>Agency Terminal</h2>
          <p style={subtitleStyle}>Addis Photo & Media Agency • v2.0</p>

          {success && <div style={successBoxStyle}><PiShieldCheckDuotone size={18}/> {success}</div>}
          {error && <div style={errorBoxStyle}>{error}</div>}

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Identity</label>
            <div style={inputWrapperStyle}>
              <PiUserCircleDuotone style={inputIconStyle} size={20} />
              <input 
                style={inputStyle} 
                name="identifier" 
                placeholder="Email or Phone" 
                value={formData.identifier} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>Access Key</label>
            <div style={inputWrapperStyle}>
              <PiShieldCheckDuotone style={inputIconStyle} size={20} />
              <input 
                style={inputStyle} 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={loading ? disabledBtnStyle : activeBtnStyle}
          >
            {loading ? "VERIFYING..." : "ENTER TERMINAL"}
          </button>

          <div style={footerStyle}>
            <Link to="/forgot-password" style={linkStyle}>Forgot Key?</Link>
            <span style={{color: '#64748b'}}>New Agent? <Link to="/register" style={linkStyle}>Register</Link></span>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- STYLES (MATCHING YOUR TERMINAL UI) ---
const wrapperStyle = { backgroundColor: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: "'Inter', sans-serif", background: 'radial-gradient(circle at top right, #1e293b, #020617)' };
const containerStyle = { width: '100%', maxWidth: '440px', padding: '20px' };
const glassCardStyle = { background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)', padding: '48px 40px', borderRadius: '32px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', textAlign: 'center' };
const iconWrapperStyle = { background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.05))', width: '84px', height: '84px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(59, 130, 246, 0.2)' };
const titleStyle = { color: '#f8fafc', fontSize: '28px', fontWeight: '800', margin: '0 0 6px' };
const subtitleStyle = { color: '#94a3b8', fontSize: '14px', marginBottom: '32px', textTransform: 'uppercase' };
const inputContainerStyle = { textAlign: 'left', marginBottom: '22px' };
const labelStyle = { color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'block' };
const inputWrapperStyle = { position: 'relative', display: 'flex', alignItems: 'center' };
const inputIconStyle = { position: 'absolute', left: '16px', color: '#475569' };
const inputStyle = { width: '100%', padding: '16px 16px 16px 48px', background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', color: '#fff', outline: 'none', boxSizing: 'border-box' };
const activeBtnStyle = { width: '100%', padding: '18px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '700' };
const disabledBtnStyle = { ...activeBtnStyle, background: '#1e293b', color: '#475569', cursor: 'not-allowed' };
const successBoxStyle = { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '14px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const errorBoxStyle = { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '14px', borderRadius: '12px', fontSize: '14px', marginBottom: '24px' };
const footerStyle = { marginTop: '30px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' };
const linkStyle = { color: '#3b82f6', textDecoration: 'none', fontWeight: '600' };

export default LoginForm;