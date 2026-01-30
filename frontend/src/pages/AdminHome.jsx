import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, ShieldCheck, Briefcase, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';

const AdminHome = () => {
  const [time, setTime] = useState(new Date());
  // 📊 BACKEND STATES
  const [stats, setStats] = useState({ admins: 0, totalNodes: 0 });
  const [loading, setLoading] = useState(true);

  // 🛡️ SYNC WITH REGISTRY BACKEND
  const fetchRegistryStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // Filter to only count nodes with ADMIN authority
        const adminNodes = res.data.data.filter(u => u.role?.toUpperCase() === 'ADMIN');
        
        setStats({
          admins: adminNodes.length,
          totalNodes: res.data.data.length
        });
      }
    } catch (err) {
      console.error("Registry Sync Failure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryStats();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '70px', background: '#f4f7f6' }}>
        <Loader2 className="animate-spin text-[#e11d48]" size={40} />
      </div>
    );
  }

  return (
    <div className="admin-page-root">
      <style>
        {`
          .admin-page-root {
            margin-top: 78px;
            margin-left: 70px;
            padding: 0 50px 100px 50px;
            background: #f4f7f6;
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            overflow-x: hidden;
          }
          .hero-gradient { 
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
            padding: 80px; 
            border-radius: 40px; 
            color: white; 
            position: relative; 
            box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
            margin-bottom: 60px;
          }
          .glass-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 35px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.02);
            border: 1px solid #eef2f1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: transform 0.3s ease;
          }
          .glass-card:hover {
            transform: translateY(-5px);
          }
          .status-badge {
            background: rgba(225, 29, 72, 0.15);
            padding: 10px 25px;
            border-radius: 50px;
            display: inline-block;
            font-size: 12px;
            font-weight: bold;
            color: #e11d48;
            margin-bottom: 25px;
            border: 1px solid rgba(225, 29, 72, 0.2);
            backdrop-filter: blur(10px);
          }
          .section-label {
            font-size: 12px;
            font-weight: 800;
            color: #e11d48;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 15px;
            display: block;
          }
          .card-link {
            margin-top: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: #e11d48;
            text-decoration: none;
            font-weight: 700;
          }
          @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
          .animate-reveal { animation: slideUp 0.8s ease-out forwards; }
        `}
      </style>

      {/* ──────────────── SECTION 1: THE SALUTATION ──────────────── */}
      <section className="animate-reveal" style={{ paddingTop: '40px' }}>
        <div className="hero-gradient">
          <div className="status-badge">🛡️ APMA: Admin</div>
          <h1 style={{ fontSize: "56px", fontWeight: "900", margin: "0 0 15px 0", letterSpacing: "-2px" }}>
            Welcome back,<br/>Commander Haimanot
          </h1>
          <p style={{ fontSize: "20px", opacity: 0.8, maxWidth: "600px", lineHeight: "1.6" }}>
            Registry oversight initialized. There are <strong>{stats.admins} Active Authorities</strong> managing {stats.totalNodes} network nodes.
          </p>
          
          <div style={{ marginTop: '40px', fontSize: '32px', fontWeight: '800' }}>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            <span style={{ fontSize: '14px', marginLeft: '15px', opacity: 0.5, fontWeight: '400', letterSpacing: '1px' }}>SYSTEM CHRONO</span>
          </div>
        </div>
      </section>

      {/* ──────────────── SECTION 2: COMMAND GRID ──────────────── */}
      <section style={{ paddingBottom: '100px' }}>
        <span className="section-label">Sector 01: Core Operations</span>
        <h2 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "40px" }}>Dashboard Overview</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
          
          {/* ADMIN AUTHORITY CARD */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Active Authorities</p>
                <h2 style={{ fontSize: '42px', fontWeight: '900', margin: '10px 0', color: '#1e293b' }}>{stats.admins}</h2>
              </div>
              <div style={{ background: '#fff1f2', padding: '15px', borderRadius: '18px' }}>
                <ShieldAlert color="#e11d48" size={28} />
              </div>
            </div>
            <Link to="/admin/users" className="card-link">
              MANAGE ADMINS <ArrowRight size={16} />
            </Link>
          </div>

          {/* MESSAGES CARD */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Transmissions</p>
                <h2 style={{ fontSize: '42px', fontWeight: '900', margin: '10px 0', color: '#1e293b' }}>---</h2>
              </div>
              <div style={{ background: '#fff1f2', padding: '15px', borderRadius: '18px' }}>
                <MessageSquare color="#e11d48" size={28} />
              </div>
            </div>
            <Link to="/admin/messages" className="card-link">
              ACCESS INBOX <ArrowRight size={16} />
            </Link>
          </div>

          {/* PORTFOLIO CARD */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Portfolio Assets</p>
                <h2 style={{ fontSize: '42px', fontWeight: '900', margin: '10px 0', color: '#1e293b' }}>---</h2>
              </div>
              <div style={{ background: '#fff1f2', padding: '15px', borderRadius: '18px' }}>
                <Briefcase color="#e11d48" size={28} />
              </div>
            </div>
            <Link to="/admin/portfolio" className="card-link">
              MANAGE PORTFOLIO <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ──────────────── FOOTER ──────────────── */}
      <footer style={{ textAlign: 'center', opacity: 0.4, fontSize: '12px', padding: '40px 0', borderTop: '1px solid #eef2f1' }}>
        Addis Photo and Media Agency // SESSION_VERIFIED_H_26 // © 2026
      </footer>
    </div>
  );
};

export default AdminHome;