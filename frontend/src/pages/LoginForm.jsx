import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; 
import ReCAPTCHA from "react-google-recaptcha";
import { PiCameraDuotone, PiShieldCheckDuotone, PiUserCircleDuotone } from "react-icons/pi";
import { FiLoader } from "react-icons/fi";

const LoginForm = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [captchaToken, setCaptchaToken] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCaptchaChange = (token) => setCaptchaToken(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post(
        "/auth/login-user",
        { ...formData, captchaToken },
        { withCredentials: true }
      );

      if (res.data && res.data.authenticated) {
        try {
          const userRole = Array.isArray(res.data.role)
            ? res.data.role
            : [res.data.role || "USER"];

          localStorage.setItem("user_id", res.data.user_id);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("role", JSON.stringify(userRole));

          if (setIsAuthenticated) {
            setIsAuthenticated(userRole); 
          }

          setSuccess("Access Granted! Opening Media Terminal...");

          setTimeout(() => {
            navigate("/home");
          }, 1500);

        } catch (storageErr) {
          setError("Terminal Cache Error. Please try again.");
        }
      } else {
        setError("Identity verification failed.");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid Credentials";
      setError(msg);
      localStorage.removeItem("role"); 
      localStorage.removeItem("isAuthenticated");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper" style={containerStyle}>
      
      <div className="bg-text-wall">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="scrolling-text">
            ADDIS PHOTO & MEDIA AGENCY • ADDIS PHOTO & MEDIA AGENCY • ADDIS PHOTO & MEDIA AGENCY • 
          </div>
        ))}
      </div>

      <div className="login-card" style={cardStyle}>
        <div className="card-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '45px', color: '#065f46', marginBottom: '10px', opacity: 0.8 }}>
            <PiCameraDuotone />
          </div>
          <h2 style={{ color: '#064e3b', fontSize: '22px', fontWeight: '800', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agency Terminal</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>Addis Photo & Media House</p>
        </div>

        {success && <div style={successBoxStyle}><PiShieldCheckDuotone size={18}/> {success}</div>}
        {error && <div style={errorStyle}><PiShieldCheckDuotone size={18}/> {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={labelStyle}><PiUserCircleDuotone size={18}/> Identity</label>
            <input 
              style={inputStyle} 
              name="identifier" 
              placeholder="Email or Phone" 
              value={formData.identifier} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={labelStyle}><PiShieldCheckDuotone size={18}/> Access Key</label>
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

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px', transform: 'scale(0.8)', transformOrigin: 'center center' }}>
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
            />
          </div>

          <button type="submit" disabled={loading} style={{...btnStyle, opacity: loading ? 0.7 : 1}}>
            {loading ? <FiLoader className="spinner" /> : "ENTER TERMINAL"}
          </button>
        </form>

        <div style={footerStyle}>
          <Link to="/forgot-password" style={linkStyle}>Forgot Key?</Link>
          <span style={{color: '#6b7280'}}>New Agent? <Link to="/register" style={linkStyle}>Register</Link></span>
        </div>
      </div>

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        /* Hides scrollbar for Chrome, Safari and Opera */
        .login-card::-webkit-scrollbar {
          display: none;
        }

        .bg-text-wall {
          position: fixed;
          top: -10%; left: -10%;
          width: 120%; height: 120%;
          display: flex; flex-direction: column;
          gap: 25px;
          transform: rotate(-8deg);
          z-index: 0;
          pointer-events: none;
          opacity: 0.08;
        }

        .scrolling-text {
          font-size: 3.8rem;
          font-weight: 800;
          color: #064e3b;
          white-space: nowrap;
          letter-spacing: 2px;
          animation: slide 120s linear infinite;
        }

        .scrolling-text:nth-child(even) { animation-direction: reverse; opacity: 0.4; }

        @keyframes slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

const containerStyle = { 
  background: 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)',
  minHeight: '100vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  padding: '20px', 
  fontFamily: "'Inter', sans-serif",
  position: 'relative',
  overflow: 'hidden'
};

const cardStyle = { 
  background: 'rgba(255, 255, 255, 0.98)', 
  padding: '40px', 
  borderRadius: '24px', 
  width: '100%', 
  maxWidth: '440px', 
  maxHeight: '90vh', 
  overflowY: 'scroll', // Keep scrolling active
  msOverflowStyle: 'none', // IE and Edge
  scrollbarWidth: 'none', // Firefox
  boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.4)', 
  position: 'relative',
  zIndex: 1,
  backdropFilter: 'blur(10px)',
  textAlign: 'center'
};

const inputStyle = { width: '100%', background: '#fcfcfc', border: '1px solid #d1d5db', padding: '14px', borderRadius: '10px', color: '#111827', outline: 'none', fontSize: '15px', boxSizing: 'border-box' };
const labelStyle = { color: '#374151', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px', fontSize: '12.5px', fontWeight: '700', textTransform: 'uppercase' };
const btnStyle = { width: '100%', background: '#064e3b', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '15px', textTransform: 'uppercase' };
const successBoxStyle = { background: '#ecfdf5', color: '#065f46', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #a7f3d0', fontSize: '13px' };
const errorStyle = { background: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #fee2e2', fontSize: '13px' };
const footerStyle = { marginTop: '25px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' };
const linkStyle = { color: '#065f46', textDecoration: 'none', fontWeight: '700' };

export default LoginForm;