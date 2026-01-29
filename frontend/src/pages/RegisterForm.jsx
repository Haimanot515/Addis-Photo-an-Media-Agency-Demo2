import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ReCAPTCHA from "react-google-recaptcha";
import { MdOutlinePersonOutline, MdPhoneIphone, MdOutlineMail, MdSecurity, MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { FiLoader, FiUserCheck } from "react-icons/fi";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  
  // ✅ Reset to empty string - user must now provide a valid token or logic
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
    
    // Logic check for verification method
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
        captchaToken, // Will be empty unless captcha is re-enabled/filled
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
      <div className="level-up-card" style={cardStyle}>
        {!isRegistered ? (
          <>
            <div className="card-header" style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#fff' }}>Join the Agency</h2>
              <p style={{ color: '#94a3b8' }}>Create your media creator account</p>
            </div>
            
            {error && <div style={errorStyle}><MdErrorOutline /> {error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group" style={{ marginBottom: '15px' }}>
                <label style={labelStyle}><MdOutlinePersonOutline /> Full Name</label>
                <input 
                  style={inputStyle} 
                  name="full_name" 
                  value={formData.full_name} 
                  onChange={handleChange} 
                  placeholder="Enter your full name" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' }}>
                <div className="input-group">
                  <label style={labelStyle}><MdPhoneIphone /> Phone</label>
                  <input 
                    style={inputStyle} 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder="09..." 
                    required 
                  />
                </div>
                <div className="input-group">
                  <label style={labelStyle}><MdOutlineMail /> Email</label>
                  <input 
                    style={inputStyle} 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="Email address" 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Verify via:</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                  {['EMAIL', 'SMS'].map(m => (
                    <button key={m} type="button" 
                      onClick={() => setFormData(p => ({...p, preferred_method: m}))}
                      style={formData.preferred_method === m ? activeToggle : inactiveToggle}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group" style={{ marginBottom: '15px' }}>
                <label style={labelStyle}><MdSecurity /> Password</label>
                <input 
                  style={inputStyle} 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Create password" 
                  required 
                />
                <input 
                  style={{...inputStyle, marginTop: '10px'}} 
                  type="password" 
                  name="confirmPassword" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  placeholder="Confirm password" 
                  required 
                />
              </div>

              <div style={{ marginBottom: '20px', color: '#94a3b8', fontSize: '13px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} style={{ marginTop: '3px' }} />
                  <span>I agree to the Terms, Privacy Policy and Agency Rules.</span>
                </label>
              </div>

              <button type="submit" disabled={loading} style={{...btnStyle, opacity: (loading) ? 0.6 : 1}}>
                {loading ? <FiLoader className="spinner" /> : <><FiUserCheck /> Register Now</>}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <MdCheckCircle style={{ fontSize: '70px', color: '#22c55e' }} />
            <h2 style={{ color: '#fff', marginTop: '20px' }}>Success!</h2>
            <p style={{ color: '#94a3b8', lineHeight: '1.5' }}>
              We sent a verification {formData.preferred_method === 'EMAIL' ? 'link' : 'code'} to your {formData.preferred_method.toLowerCase()}. 
              Please check your inbox or messages.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Styles (Unchanged) ---
const containerStyle = { background: '#020617', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' };
const cardStyle = { background: '#0f172a', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '450px', border: '1px solid #1e293b' };
const inputStyle = { width: '100%', background: '#1e293b', border: '1px solid #334155', padding: '12px', borderRadius: '8px', color: '#fff', outline: 'none', fontSize: '15px', boxSizing: 'border-box' };
const labelStyle = { color: '#cbd5e1', display: 'block', marginBottom: '5px', fontSize: '14px' };
const btnStyle = { width: '100%', background: '#3b82f6', color: '#fff', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '16px', transition: '0.3s' };
const activeToggle = { flex: 1, padding: '10px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const inactiveToggle = { flex: 1, padding: '10px', background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', cursor: 'pointer' };
const errorStyle = { background: 'rgba(239,68,68,0.1)', color: '#f87171', padding: '12px', borderRadius: '8px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' };

export default RegisterForm;