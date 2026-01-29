import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, Plus, Trash2, UploadCloud, RefreshCw, 
  CheckCircle2, AlertCircle, Link2, X, Image as ImageIcon 
} from 'lucide-react';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    };

    const fetchPosts = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/admin/blog');
            if (res.data.success) setPosts(res.data.data);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Sync Failed.' });
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handlePush = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('excerpt', excerpt);
        formData.append('content', content);

        setLoading(true);
        setStatus({ type: '', msg: '' }); // Clear previous status

        try {
            const res = await axios.post('/api/admin/blog', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY UPDATED: Post is live.' });
                setTitle(""); setSlug(""); setExcerpt(""); setContent("");
                setFile(null); setPreview(null);
                fetchPosts();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'AUTHORITY REJECTED: Check fields.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("EXECUTE DROP?")) return;
        try {
            await axios.delete(`/api/admin/blog/${id}`);
            fetchPosts();
        } catch (err) {
            setStatus({ type: 'error', msg: 'DROP COMMAND FAILED' });
        }
    };

    return (
        <div className="p-6 bg-[#fcfcfd] min-h-screen font-sans text-slate-900">
            <header className="max-w-7xl mx-auto mb-8 flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-indigo-600 uppercase">System Active</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter flex items-center gap-3">
                        BLOG <span className="text-slate-400 font-light">AUTHORITY</span>
                    </h1>
                </div>
                <button onClick={fetchPosts} className="p-3 bg-white border border-slate-200 rounded-full hover:shadow-md transition-all">
                    <RefreshCw size={20} className={`${fetching ? 'animate-spin' : ''} text-slate-500`} />
                </button>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                    <form onSubmit={handlePush} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-tighter">
                                <Plus size={16} className="text-indigo-600" /> Initialize Node
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Headline</label>
                                    <input className="w-full bg-slate-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold text-sm" placeholder="Post title..." value={title} onChange={handleTitleChange} required />
                                </div>
                                <div className="col-span-2">
                                    <div className="flex items-center gap-2 bg-indigo-50/50 p-2 px-3 rounded-lg border border-indigo-100">
                                        <Link2 size={12} className="text-indigo-400" />
                                        <input className="bg-transparent border-none outline-none text-[11px] font-mono text-indigo-600 w-full" value={slug} readOnly />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Visual Asset</label>
                                {!preview ? (
                                    <div className="relative border-2 border-dashed border-slate-200 rounded-2xl h-24 flex flex-col items-center justify-center group hover:border-indigo-400 transition-colors cursor-pointer">
                                        <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <UploadCloud size={20} className="text-slate-300 group-hover:text-indigo-500 mb-1" />
                                        <span className="text-[9px] font-bold text-slate-400">UPLOAD IMAGE</span>
                                    </div>
                                ) : (
                                    <div className="relative h-24 rounded-2xl overflow-hidden group">
                                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button type="button" onClick={() => {setFile(null); setPreview(null);}} className="bg-white p-2 rounded-full text-rose-500 hover:scale-110 transition-transform"><X size={16}/></button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Excerpt & Content</label>
                                <textarea className="w-full bg-slate-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs h-16 mb-2" placeholder="Summary..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                                <textarea className="w-full bg-slate-50 border-none p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 text-xs h-32" placeholder="Body content..." value={content} onChange={(e) => setContent(e.target.value)} required />
                            </div>

                            <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-600 shadow-lg shadow-indigo-200 transition-all disabled:bg-slate-200">
                                {loading ? <RefreshCw className="animate-spin mx-auto" size={18} /> : "COMMIT TO REGISTRY"}
                            </button>

                            {/* ✅ ERROR/SUCCESS STATUS BELOW THE BUTTON */}
                            {status.msg && (
                                <div className={`flex items-center gap-2 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${
                                    status.type === 'success' 
                                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                                    : 'bg-rose-50 border-rose-100 text-rose-700'
                                }`}>
                                    {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                    <span className="text-[10px] font-black uppercase tracking-wider">{status.msg}</span>
                                    <button onClick={() => setStatus({type:'', msg:''})} className="ml-auto opacity-50 hover:opacity-100">
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-7 space-y-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Registry Nodes ({posts.length})</h2>
                    {posts.map(post => (
                        <div key={post.id} className="group bg-white border border-slate-200 p-3 rounded-2xl flex gap-4 items-center hover:border-indigo-200 transition-all">
                            <div className="h-16 w-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-50">
                                {post.image_url ? (
                                    <img src={post.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-sm text-slate-800 truncate">{post.title}</h3>
                                <p className="text-[10px] font-mono text-indigo-500 mt-0.5">/{post.slug}</p>
                            </div>
                            <button onClick={() => handleDrop(post.id)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AdminBlog;