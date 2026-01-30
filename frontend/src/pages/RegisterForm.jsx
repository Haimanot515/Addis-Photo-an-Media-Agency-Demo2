import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ReCAPTCHA from "react-google-recaptcha";
import { MdOutlinePersonOutline, MdPhoneIphone, MdOutlineMail, MdSecurity, MdCheckCircle, MdErrorOutline, MdCameraAlt } from "react-icons/md";
import { FiLoader, FiUserCheck } from "react-icons/fi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  
  const [captchaToken, setCaptchaToken] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    preferred_method: "EMAIL",
    consent: false, 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCaptchaChange = (token) => setCaptchaToken(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");
    if (!formData.consent) return setError("You must accept the terms.");
    
    if (formData.preferred_method === "EMAIL" && !formData.email) {
        return setError("Please provide an email for Email verification.");
    }

    setLoading(true);

    try {
      const payload = {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email ? formData.email.trim().toLowerCase() : null,
        password: formData.password,
        all_consents_accepted: formData.consent, 
        preferred_method: formData.preferred_method, 
        captchaToken,
      };

      await api.post("/auth/register", payload);

      setIsRegistered(true);
      setTimeout(() => navigate("/login"), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper" style={containerStyle}>
      
      {/* SOFTER, SUBTLE TEXT WALL */}
      <div className="bg-text-wall">
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className="scrolling-text">
            ADDIS PHOTO & MEDIA AGENCY • ADDIS PHOTO & MEDIA AGENCY • ADDIS PHOTO & MEDIA AGENCY • 
          </div>
        ))}
      </div>

      <div className="level-up-card" style={cardStyle}>
        {!isRegistered ? (
          <>
            <div className="card-header" style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '45px', color: '#065f46', marginBottom: '10px', opacity: 0.8 }}><MdCameraAlt /></div>
              <h2 style={{ color: '#064e3b', fontSize: '22px', fontWeight: '800', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Join the Agency</h2>
              <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '500', marginTop: '5px' }}>Addis Photo & Media House</p>
            </div>
            
            {error && <div style={errorStyle}><MdErrorOutline /> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={labelStyle}><MdOutlinePersonOutline /> Full Name</label>
                <input style={inputStyle} name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Full name" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label style={labelStyle}><MdPhoneIphone /> Phone</label>
                  <input style={inputStyle} name="phone" value={formData.phone} onChange={handleChange} placeholder="09..." required />
                </div>
                <div className="input-group" style={{ textAlign: 'left' }}>
                  <label style={labelStyle}><MdOutlineMail /> Email</label>
                  <input style={inputStyle} name="email" value={formData.email} onChange={handleChange} placeholder="Optional for SMS" />
                </div>
              </div>

              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={labelStyle}>Verify via:</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {['EMAIL', 'SMS'].map(m => (
                    <button key={m} type="button" 
                      onClick={() => setFormData(p => ({...p, preferred_method: m}))}
                      style={formData.preferred_method === m ? activeToggle : inactiveToggle}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group" style={{ textAlign: 'left', marginBottom: '15px' }}>
                <label style={labelStyle}><MdSecurity /> Security</label>
                <input style={inputStyle} type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input style={{...inputStyle, marginTop: '10px'}} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm" required />
              </div>

              <div style={{ marginBottom: '20px', color: '#4b5563', fontSize: '12px', textAlign: 'left', background: '#f9fafb', padding: '12px', borderRadius: '10px', border: '1px solid #f3f4f6' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} />
                  <span>I agree to the Terms & Privacy.</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', transform: 'scale(0.9)' }}>
                <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
              </div>

              <button type="submit" disabled={loading} style={{...btnStyle, opacity: (loading) ? 0.6 : 1}}>
                {loading ? <FiLoader className="spinner" /> : <><FiUserCheck /> Create Account</>}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <MdCheckCircle style={{ fontSize: '60px', color: '#059669' }} />
            <h2 style={{ color: '#064e3b', marginTop: '15px' }}>Success!</h2>
            <p style={{ color: '#6b7280' }}>Check your {formData.preferred_method.toLowerCase()} for verification.</p>
          </div>
        )}
        <div style={{ marginTop: '25px', fontSize: '14px', color: '#6b7280', textAlign: 'center' }}>
          Already a member? <Link to="/login" style={{ color: '#065f46', fontWeight: '700', textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>

      <style>{`
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .bg-text-wall {
          position: absolute;
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

// --- Softer Studio Theme ---
const containerStyle = { 
  background: 'linear-gradient(135deg, #1e293b 0%, #064e3b 100%)', // Muted Deep Slate to Forest
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
  boxShadow: '0 40px 80px -15px rgba(0, 0, 0, 0.4)', 
  position: 'relative',
  zIndex: 1,
  backdropFilter: 'blur(10px)'
};

const inputStyle = { width: '100%', background: '#fcfcfc', border: '1px solid #d1d5db', padding: '12px 14px', borderRadius: '10px', color: '#111827', outline: 'none', fontSize: '15px', boxSizing: 'border-box', transition: 'all 0.2s' };
const labelStyle = { color: '#374151', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '6px', fontSize: '12.5px', fontWeight: '700' };
const btnStyle = { width: '100%', background: '#064e3b', color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '15px', boxShadow: '0 10px 15px -3px rgba(6, 78, 59, 0.3)' };
const activeToggle = { flex: 1, padding: '10px', background: '#064e3b', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' };
const inactiveToggle = { flex: 1, padding: '10px', background: '#f3f4f6', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' };
const errorStyle = { background: '#fef2f2', color: '#991b1b', padding: '10px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #fee2e2', fontSize: '13px' };

export default RegisterForm;