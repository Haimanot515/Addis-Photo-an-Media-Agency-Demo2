import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
// --- PURE REACT ICONS ---
import { 
  PiCameraDuotone, 
  PiCircleNotchBold, 
  PiShieldCheckDuotone, 
  PiShieldWarningDuotone, 
  PiArrowRightBold,
  PiApertureDuotone 
} from "react-icons/pi";

const VerifyEmail = ({ onVerify }) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Security handshake failed. Token missing.");
        return;
      }
      try {
        // withCredentials ensures the auth_token cookie is handled
        const res = await api.post("/auth/verify-user", { token }, { withCredentials: true });
        
        if (res.data.authenticated) {
          // Store UI metadata 
          localStorage.setItem("user_id", res.data.user_id); 
          localStorage.setItem("isAuthenticated", "true");

          if (onVerify) onVerify();
          
          setStatus("success");

          // ✅ REDIRECT TO /home (Your Protected Route path)
          setTimeout(() => navigate("/home"), 3000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setErrorMessage(err.response?.data?.error || "Signature expired or network failure.");
      }
    };
    verify();
  }, [token, navigate, onVerify]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#020617", 
      fontFamily: "'Inter', sans-serif",
      padding: "20px"
    }}>
      <style>
        {`
          @keyframes spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          @keyframes spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
          @keyframes pulse-soft { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
          
          .spin-fast { animation: spin-cw 1.5s linear infinite; }
          .spin-medium { animation: spin-ccw 2.5s linear infinite; }
          .pulse { animation: pulse-soft 3s ease-in-out infinite; }
          
          .glass-card {
            background: rgba(30, 41, 59, 0.5);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(51, 65, 85, 1);
            border-radius: 32px;
            padding: 60px 40px;
            width: 100%;
            max-width: 450px;
            text-align: center;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          }

          .icon-layers {
            position: relative;
            width: 120px;
            height: 120px;
            margin: 0 auto 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .layer { position: absolute; display: flex; align-items: center; justify-content: center; }
        `}
      </style>

      <div className="glass-card">
        <div className="pulse" style={{ marginBottom: "50px" }}>
          <PiCameraDuotone size={40} color="#3b82f6" />
          <h2 style={{ color: "#f8fafc", fontSize: "12px", letterSpacing: "3px", marginTop: "15px", fontWeight: "700", textTransform: "uppercase" }}>
            Addis Photo & Media
          </h2>
        </div>

        {status === "loading" && (
          <div>
            <div className="icon-layers">
              <div className="layer spin-fast" style={{ color: "rgba(59, 130, 246, 0.2)" }}>
                <PiCircleNotchBold size={120} />
              </div>
              <div className="layer spin-medium" style={{ color: "rgba(59, 130, 246, 0.4)" }}>
                <PiCircleNotchBold size={85} />
              </div>
              <div className="layer" style={{ color: "#3b82f6" }}>
                <PiApertureDuotone size={45} className="spin-fast" />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Verifying Identity</h1>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "14px" }}>
              Connecting to Addis Media secure gateway...
            </p>
          </div>
        )}

        {status === "success" && (
          <div style={{ animation: "pulse-soft 2s ease-in-out" }}>
            <div className="icon-layers">
              <div className="layer" style={{ color: "#3b82f6" }}>
                <PiShieldCheckDuotone size={100} />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Access Verified</h1>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "14px" }}>
              Welcome back. Redirecting to your private dashboard.
            </p>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="icon-layers">
              <div className="layer" style={{ color: "#ef4444" }}>
                <PiShieldWarningDuotone size={100} />
              </div>
            </div>
            <h1 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "15px" }}>Verification Failed</h1>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", marginBottom: "40px", fontSize: "14px" }}>
              {errorMessage}
            </p>
            <button 
              onClick={() => navigate("/login")}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                padding: "16px 30px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.target.style.background = "#2563eb"}
              onMouseOut={(e) => e.target.style.background = "#3b82f6"}
            >
              Return to Login <PiArrowRightBold size={18} />
            </button>
          </div>
        )}

        <div style={{ marginTop: "60px", color: "rgba(148, 163, 184, 0.3)", fontSize: "10px", fontWeight: "700", letterSpacing: "1px" }}>
          SECURE TERMINAL // ADDIS ABABA 2026
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;