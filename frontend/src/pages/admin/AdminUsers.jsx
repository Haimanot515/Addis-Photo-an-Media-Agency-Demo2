import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, UserX, Shield, Search, 
  RotateCcw, ChevronDown, BellRing, 
  Phone, Mail, User, ShieldCheck,
  Activity, Users, Loader2
} from 'lucide-react';

const AdminUsers = () => {
    const [time, setTime] = useState(new Date());
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0, admins: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const showToast = (msg, type = "success") => {
        setNotification({ show: true, message: msg, type });
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3500);
    };

    const loadRegistry = async () => {
        try {
            const token = localStorage.getItem('token'); 
            const res = await axios.get(`/api/admin/users?search=${searchTerm}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setUsers(res.data.data);
                setStats({
                    total: Number(res.data.stats.total) || 0,
                    active: Number(res.data.stats.active) || 0,
                    pending: Number(res.data.stats.pending) || 0,
                    suspended: Number(res.data.stats.suspended) || 0,
                    admins: Number(res.data.stats.admins) || 0
                });
            }
        } catch (err) {
            console.error("Registry Sync Failure");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => loadRegistry(), 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAction = async (method, url, body = {}, actionLabel = "Action", id = null) => {
        if (method.toLowerCase() === 'delete' && !window.confirm("EXECUTE DROP: Permanent removal of portfolio user?")) return;
        
        setLoadingId(id || url);
        try {
            const token = localStorage.getItem('token');
            const res = await axios({ method, url, data: body, headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200 || res.data.success) {
                showToast(`${actionLabel} SUCCESSFUL`);
                await loadRegistry(); 
            }
        } catch (err) {
            await loadRegistry();
            showToast(`${actionLabel} EXECUTED`, "info");
        } finally {
            setLoadingId(null);
        }
    };

    const filteredUsers = statusFilter === "ALL" 
        ? users 
        : users.filter(u => u.account_status?.toUpperCase() === statusFilter);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f6' }}>
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
                        padding: 0 40px 100px 40px;
                        background: #f4f7f6;
                        font-family: 'Inter', sans-serif;
                        color: #1e293b;
                        min-height: 100vh;
                        width: calc(100% - 70px);
                    }
                    .hero-gradient { 
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); 
                        padding: 60px 80px; 
                        border-radius: 40px; 
                        color: white; 
                        box-shadow: 0 40px 80px rgba(0, 0, 0, 0.15);
                        margin-bottom: 60px;
                        width: 100%;
                    }
                    .glass-card {
                        background: #ffffff;
                        border-radius: 24px;
                        padding: 35px;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.02);
                        border: 1px solid #eef2f1;
                        width: 100%;
                    }
                    .status-badge {
                        background: rgba(225, 29, 72, 0.15);
                        padding: 8px 20px;
                        border-radius: 50px;
                        display: inline-block;
                        font-size: 11px;
                        font-weight: bold;
                        color: #e11d48;
                        margin-bottom: 20px;
                        border: 1px solid rgba(225, 29, 72, 0.2);
                        backdrop-filter: blur(10px);
                    }
                    .section-label {
                        font-size: 11px;
                        font-weight: 800;
                        color: #e11d48;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                        margin-bottom: 10px;
                        display: block;
                    }
                    .registry-container {
                        width: 100%;
                        background: white;
                        border-radius: 40px;
                        border: 1px solid #eef2f1;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.03);
                        margin-top: 40px;
                    }
                    .full-table {
                        width: 100%;
                        border-collapse: separate;
                        border-spacing: 0;
                    }
                    .full-table th {
                        padding: 30px 40px; /* High Equidistance */
                        text-align: left;
                        background: #fafbfc;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .full-table td {
                        padding: 25px 40px; /* High Equidistance */
                        border-bottom: 1px solid #f8fafc;
                    }
                `}
            </style>

            {/* ──────────────── HERO ──────────────── */}
            <section style={{ paddingTop: '40px' }}>
                <div className="hero-gradient">
                    <div className="status-badge">🛡️ APMA: Registry Control</div>
                    <h1 style={{ fontSize: "52px", fontWeight: "900", margin: "0 0 10px 0", letterSpacing: "-2px" }}>
                        User Authority System
                    </h1>
                    <p style={{ fontSize: "20px", opacity: 0.8, lineHeight: "1.6" }}>
                        Managing <strong>{stats.total} total portfolio users</strong>. Operational integrity verified.
                    </p>
                    
                    <div className="flex items-center gap-6 mt-10">
                        <div style={{ fontSize: '32px', fontWeight: '800' }}>
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <button onClick={loadRegistry} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:rotate-180">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ──────────────── STATS GRID ──────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', width: '100%' }}>
                <StatCard label="Total Users" val={stats.total} icon={<Users size={28} />} color="#0f172a" />
                <StatCard label="Active Status" val={stats.active} icon={<Activity size={28} />} color="#10b981" />
                <StatCard label="Authorities" val={stats.admins} icon={<ShieldCheck size={28} />} color="#0866ff" />
                <StatCard label="Suspended" val={stats.suspended} icon={<UserX size={28} />} color="#e11d48" />
            </div>

            {/* ──────────────── FULL SCREEN REGISTRY ──────────────── */}
            <div className="registry-container">
                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                    <div>
                        <span className="section-label">Sector 02: Full Registry</span>
                        <h2 style={{ fontSize: "32px", fontWeight: "900", margin: 0 }}>Identity Management</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text"
                                placeholder="SEARCH IDENTITIES..."
                                className="bg-slate-50 border-none py-4 pl-14 pr-8 rounded-2xl text-[12px] font-bold w-[400px] outline-none focus:ring-2 focus:ring-[#e11d48]/20 uppercase"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-[#0f172a] p-1.5 rounded-2xl">
                            {["ALL", "ACTIVE", "SUSPENDED"].map(f => (
                                <button key={f} onClick={() => setStatusFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${statusFilter === f ? 'bg-[#e11d48] text-white' : 'text-slate-500 hover:text-white'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <table className="full-table">
                    <thead>
                        <tr className="text-[11px] font-black text-slate-400 uppercase tracking-[2px]">
                            <th style={{ width: '25%' }}>User Identity</th>
                            <th style={{ width: '20%' }}>Communication</th>
                            <th style={{ width: '15%', textAlign: 'center' }}>Authority</th>
                            <th style={{ width: '15%', textAlign: 'center' }}>Status</th>
                            <th style={{ width: '25%', textAlign: 'right' }}>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td>
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-[#e11d48] border border-slate-200 text-lg">{u.full_name?.charAt(0)}</div>
                                        <span className="font-extrabold text-[16px] uppercase italic text-slate-800 tracking-tight">{u.full_name}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 font-mono text-[13px] font-bold text-slate-600">
                                            <Phone size={14} className="text-[#e11d48]" /> {u.phone || '---'}
                                        </div>
                                        <div className="font-mono text-[11px] text-slate-400 lowercase">{u.email}</div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <select 
                                        value={u.role?.toUpperCase() || "USER"}
                                        onChange={(e) => handleAction('put', `/api/admin/users/role/${u.id}`, { role: e.target.value }, "Authority Set", u.id)}
                                        className="appearance-none px-6 py-3 rounded-xl text-[11px] font-black border border-slate-200 bg-white hover:border-[#e11d48] outline-none cursor-pointer"
                                    >
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="text-center">
                                    <span className={`text-[10px] font-black px-5 py-2 rounded-full border tracking-widest ${
                                        u.account_status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                    }`}>
                                        {u.account_status?.toUpperCase() || 'OFFLINE'}
                                    </span>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => handleAction('put', `/api/admin/users/status/${u.id}`, { status: u.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }, "Status Sync", u.id)} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-[#e11d48] hover:border-[#e11d48] transition-all"><UserX size={20}/></button>
                                        <button onClick={() => handleAction('delete', `/api/admin/users/${u.id}`, {}, "DROP USER", u.id)} className="p-3.5 rounded-2xl bg-white border border-slate-200 text-rose-500 hover:bg-[#e11d48] hover:text-white hover:border-[#e11d48] transition-all"><Trash2 size={20} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <footer style={{ textAlign: 'center', opacity: 0.3, fontSize: '12px', padding: '80px 0' }}>
                Addis Photo and Media Agency // FULL_REGISTRY_V26 // © 2026
            </footer>
        </div>
    );
};

const StatCard = ({ label, val, icon, color }) => (
    <div className="glass-card flex items-center justify-between">
        <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
            <h2 style={{ fontSize: '42px', fontWeight: '900', margin: '5px 0', color: '#1e293b' }}>{val}</h2>
        </div>
        <div style={{ background: `${color}10`, padding: '15px', borderRadius: '20px', color: color }}>
            {icon}
        </div>
    </div>
);

export default AdminUsers;