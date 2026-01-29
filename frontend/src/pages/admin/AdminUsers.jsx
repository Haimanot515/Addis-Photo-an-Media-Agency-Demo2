import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, UserX, UserCheck, Shield, Search, 
  RotateCcw, ChevronDown, BellRing, Loader2, 
  Layers, Activity, Cpu, Phone, Mail, User
} from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0, admins: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
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
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => loadRegistry(), 400);
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleAction = async (method, url, body = {}, actionLabel = "Action", id = null) => {
        if (url.includes('delete') && !window.confirm("EXECUTE DROP: Permanent removal of node?")) return;
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

    return (
        <div className="bg-[#f4f7fe] min-h-screen font-sans text-[#1b1b2f] p-4 md:p-8">
            
            {/* NOTIFICATION TOAST */}
            {notification.show && (
                <div className="fixed top-10 right-10 z-[100] animate-in slide-in-from-top-5 duration-300">
                    <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-[#1b1b2f] text-white shadow-2xl border border-white/10 backdrop-blur-xl">
                        <div className="bg-[#0866ff] p-2 rounded-lg"><BellRing size={16} /></div>
                        <span className="text-[11px] font-black uppercase tracking-[2px]">{notification.message}</span>
                    </div>
                </div>
            )}

            <div className="max-w-[1800px] mx-auto space-y-6">
                
                {/* BRAND & STATS BAR (TOP) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-3 flex items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
                        <div className="bg-[#0866ff] p-3 rounded-2xl text-white shadow-lg shadow-blue-500/20"><Shield size={24} fill="currentColor" /></div>
                        <div>
                            <h1 className="text-lg font-black tracking-tight uppercase italic text-[#0866ff]">Amole Authority</h1>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Registry Control</p>
                        </div>
                    </div>

                    <div className="lg:col-span-6 flex items-center justify-around bg-white p-6 rounded-[2rem] border border-slate-200/60 shadow-sm">
                        <TopStat label="Total Nodes" val={stats.total} color="text-slate-900" />
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <TopStat label="Active" val={stats.active} color="text-emerald-500" />
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <TopStat label="Authorities" val={stats.admins} color="text-blue-600" />
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <TopStat label="Suspended" val={stats.suspended} color="text-rose-500" />
                    </div>

                    <div className="lg:col-span-3 flex justify-end">
                        <button onClick={loadRegistry} className="p-5 bg-white hover:bg-slate-50 rounded-[1.5rem] border border-slate-200 transition-all active:rotate-180 duration-500 shadow-sm">
                            <RotateCcw size={22} className="text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* SEARCH & FILTERS */}
                <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-200/60 shadow-sm">
                    <div className="relative flex-grow group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0866ff] transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="SEARCH ENTIRE REGISTRY BY NAME, EMAIL, PHONE..."
                            className="w-full bg-[#f8f9fc] border-none py-4 pl-16 pr-8 rounded-2xl text-[11px] font-bold focus:ring-2 focus:ring-[#0866ff]/20 outline-none uppercase tracking-widest transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-[#1b1b2f] p-1.5 rounded-2xl shadow-lg shrink-0">
                        {["ALL", "ACTIVE", "PENDING", "SUSPENDED"].map(f => (
                            <button key={f} onClick={() => setStatusFilter(f)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${statusFilter === f ? 'bg-[#0866ff] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* THE REGISTRY - STRICT SINGLE ROW */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[2px] border-b border-slate-100">
                                    <th className="px-8 py-7 text-left">Node Identity</th>
                                    <th className="px-8 py-7 text-left">Phone</th>
                                    <th className="px-8 py-7 text-left">Endpoint</th>
                                    <th className="px-8 py-7 text-center">Authority</th>
                                    <th className="px-8 py-7 text-center">Status</th>
                                    <th className="px-8 py-7 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(u => (
                                    <tr key={u.id} className={`group hover:bg-[#f4f7fe] transition-all ${loadingId === u.id ? 'opacity-40 pointer-events-none animate-pulse' : ''}`}>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-[#0866ff] text-[11px] border border-slate-200">{u.full_name?.charAt(0)}</div>
                                                <span className="font-bold text-[14px] uppercase italic tracking-tight text-slate-800">{u.full_name}</span>
                                            </div>
                                        </td>
                                        
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-mono text-[12px] font-bold text-slate-500">
                                                <Phone size={12} className="text-[#0866ff]" />
                                                {u.phone || '---'}
                                            </div>
                                        </td>
                                        
                                        <td className="px-8 py-5 whitespace-nowrap font-mono text-[11px] text-slate-500">{u.email}</td>
                                        
                                        <td className="px-8 py-5 text-center whitespace-nowrap">
                                            <div className="relative inline-block">
                                                <select 
                                                    value={u.role?.toUpperCase() || "USER"}
                                                    onChange={(e) => handleAction('put', `/api/admin/users/role/${u.id}`, { role: e.target.value }, "Authority Set", u.id)}
                                                    className={`appearance-none pl-5 pr-10 py-2 rounded-xl text-[10px] font-black border outline-none cursor-pointer transition-all ${
                                                        u.role?.toUpperCase() === 'ADMIN' ? 'bg-blue-50 border-blue-200 text-[#0866ff]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                                                    }`}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-30" size={12} />
                                            </div>
                                        </td>

                                        <td className="px-8 py-5 text-center whitespace-nowrap">
                                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border tracking-widest ${
                                                u.account_status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm' : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm'
                                            }`}>
                                                {u.account_status?.toUpperCase() || 'OFFLINE'}
                                            </span>
                                        </td>

                                        <td className="px-8 py-5 text-right whitespace-nowrap">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                                <button onClick={() => handleAction('put', `/api/admin/users/status/${u.id}`, { status: u.account_status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }, "Status Sync", u.id)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-[#0866ff] hover:text-[#0866ff] transition-all active:scale-90"><UserX size={16}/></button>
                                                <button onClick={() => handleAction('delete', `/api/admin/users/${u.id}`, {}, "DROP NODE", u.id)} className="p-2.5 rounded-xl bg-white border border-slate-200 text-rose-500 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all active:scale-90 shadow-sm"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopStat = ({ label, val, color }) => (
    <div className="flex flex-col items-center">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[2px] mb-1">{label}</span>
        <span className={`text-2xl font-black ${color} tracking-tighter`}>{val || 0}</span>
    </div>
);

export default AdminUsers;