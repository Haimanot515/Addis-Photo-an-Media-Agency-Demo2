import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, 
  Plus, 
  Trash2, 
  UploadCloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  X
} from 'lucide-react';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        if (status.msg) {
            const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const fetchServices = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/admin/services');
            if (res.data.success) setServices(res.data.data);
        } catch (err) {
            console.error("Registry Fetch Failed:", err);
            setStatus({ type: 'error', msg: 'Failed to sync with Registry.' });
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected)); 
        }
    };

    const handlePush = async (e) => {
        e.preventDefault();
        // ✅ Image asset is no longer required for PUSH.

        const formData = new FormData();
        if (file) formData.append('image', file); 
        formData.append('title', title);
        formData.append('description', description);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/services', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY PUSH: Service Node active.' });
                setTitle(""); 
                setDescription(""); 
                setFile(null);
                setPreview(null);
                fetchServices();
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'PUSH Rejected by Authority.';
            setStatus({ type: 'error', msg: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("EXECUTE DROP: Are you sure you want to purge this service?")) return;
        
        try {
            const res = await axios.delete(`/api/admin/services/${id}`);
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY DROP: Node Purged.' });
                fetchServices();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'DROP Command Failed.' });
        }
    };

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <Layers className="text-rose-600" size={32} />
                        SERVICES AUTHORITY
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Registry Management for Agency Offerings</p>
                </div>
                {fetching && <RefreshCw className="animate-spin text-rose-500" />}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                    <form onSubmit={handlePush} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-8">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Initialize New Node</h2>
                        
                        <div className="space-y-5">
                            {status.msg && (
                                <div className={`p-4 rounded-xl flex items-start gap-3 text-sm font-bold border ${
                                    status.type === 'success' 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                    : 'bg-rose-50 border-rose-100 text-rose-700'
                                } animate-in fade-in slide-in-from-top-2 duration-300`}>
                                    {status.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
                                    <span className="flex-1">{status.msg}</span>
                                    <button type="button" onClick={() => setStatus({type:'', msg:''})}><X size={14} /></button>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700 uppercase">Service Title</label>
                                <input 
                                    className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all font-semibold" 
                                    placeholder="e.g. Digital Strategy" 
                                    value={title} 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700 uppercase">Description</label>
                                <textarea 
                                    className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all h-28" 
                                    placeholder="Brief overview of the service..." 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2 text-slate-700 uppercase">Visual Node (Optional)</label>
                                {!preview ? (
                                    <div className="relative group cursor-pointer border-2 border-dashed border-slate-200 p-8 rounded-xl hover:border-rose-400 transition-all text-center">
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <UploadCloud size={32} className="text-slate-300 mx-auto mb-2 group-hover:text-rose-500" />
                                        <span className="text-xs text-slate-500 font-bold">Select Service Image</span>
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden border border-slate-200 h-32">
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => {setFile(null); setPreview(null);}}
                                            className="absolute top-2 right-2 bg-rose-500 text-white p-1 rounded-full shadow-lg"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button 
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-rose-600 transition-all disabled:bg-slate-300"
                            >
                                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
                                {loading ? "COMMITTING PUSH..." : "EXECUTE SERVICE PUSH"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {services.length === 0 && !fetching && (
                            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-medium bg-white">
                                <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
                                No active services found in registry.
                            </div>
                        )}
                        
                        {services.map(s => (
                            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                <div className="h-44 overflow-hidden bg-slate-100 relative">
                                    {s.image_url ? (
                                        <img src={s.image_url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-50"><ImageIcon className="text-slate-300" /></div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-black text-slate-900 border border-slate-200 uppercase">Node #{s.id}</div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-slate-900">{s.title}</h3>
                                    <p className="text-slate-500 text-sm mt-2 line-clamp-3 leading-relaxed">{s.description}</p>
                                    
                                    <div className="mt-6 pt-5 border-t border-slate-50 flex justify-end">
                                        <button 
                                            onClick={() => handleDrop(s.id)} 
                                            className="text-rose-500 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 font-black text-xs uppercase tracking-tighter"
                                        >
                                            <Trash2 size={16} /> Purge Node
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminServices;