import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Trash2, Image as ImageIcon, RefreshCw, Plus } from 'lucide-react';

const AdminPortfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Form State for PUSH
    const [alt, setAlt] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // 1. READ: Fetch the Portfolio Registry
    const fetchPortfolio = async () => {
        try {
            const res = await axios.get('/api/admin/portfolio');
            if (res.data.success) {
                setPortfolio(res.data.data);
            }
        } catch (err) {
            console.error("Registry Fetch Error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    // Handle Image Selection & Preview
    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // 2. PUSH: Commit a New Node to the Registry
    const handlePush = async (e) => {
        e.preventDefault();
        if (!file || !alt) return alert("Authority requires an Image and Alt Text.");

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', alt);

        setLoading(true);
        try {
            const res = await axios.post('/api/admin/portfolio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                alert("REGISTRY PUSH: Node committed.");
                setAlt("");
                setFile(null);
                setPreview(null);
                fetchPortfolio(); // Refresh list
            }
        } catch (err) {
            console.error("PUSH ERROR:", err.response?.data);
            alert("Authority rejected the PUSH request.");
        } finally {
            setLoading(false);
        }
    };

    // 3. DROP: Purge a Node from the Registry
    const handleDrop = async (id) => {
        if (!window.confirm("Confirm REGISTRY DROP? Node will be permanently deleted.")) return;

        try {
            const res = await axios.delete(`/api/admin/portfolio/${id}`);
            if (res.data.success) {
                alert("REGISTRY DROP: Node purged.");
                fetchPortfolio();
            }
        } catch (err) {
            console.error("DROP ERROR:", err);
            alert("Authority rejected the DROP request.");
        }
    };

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <ImageIcon className="text-rose-600" size={32} />
                            PORTFOLIO AUTHORITY
                        </h1>
                        <p className="text-slate-500 font-medium mt-1">Independent Registry for Project Assets</p>
                    </div>
                    {fetching && <RefreshCw className="animate-spin text-rose-500" />}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: PUSH FORM */}
                    <div className="lg:col-span-4">
                        <form onSubmit={handlePush} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm sticky top-24">
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Plus size={16} /> Execute PUSH
                            </h2>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Alt Text</label>
                                    <input 
                                        type="text" 
                                        placeholder="Project description..." 
                                        value={alt} 
                                        onChange={(e) => setAlt(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none"
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Upload Asset</label>
                                    <div className="relative group cursor-pointer">
                                        <input 
                                            type="file" 
                                            onChange={onFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            required 
                                        />
                                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center group-hover:border-rose-400 transition-colors">
                                            {preview ? (
                                                <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                            ) : (
                                                <>
                                                    <UploadCloud className="text-slate-300 mb-2" size={30} />
                                                    <span className="text-xs font-semibold text-slate-400">Select Image</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-slate-200 disabled:bg-slate-300"
                                >
                                    {loading ? "SYNCING..." : "COMMIT PUSH"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* RIGHT: REGISTRY VIEW */}
                    <div className="lg:col-span-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {portfolio.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                                    <div className="relative overflow-hidden aspect-video">
                                        <img src={item.src} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 right-3">
                                            <button 
                                                onClick={() => handleDrop(item.id)}
                                                className="bg-white/90 backdrop-blur p-2 rounded-full text-rose-600 hover:bg-rose-600 hover:text-white transition-colors shadow-sm"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4 bg-white">
                                        <p className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{item.alt}</p>
                                        <p className="text-[10px] text-slate-400 font-mono mt-1">NODE_ID: {item.id}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPortfolio;