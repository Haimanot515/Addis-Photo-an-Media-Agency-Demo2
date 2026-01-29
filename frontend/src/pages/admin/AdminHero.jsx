import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Save, UploadCloud, RefreshCw } from 'lucide-react';

const AdminHero = () => {
    const [formData, setFormData] = useState({
        hero_title: "",
        hero_subtitle: "",
        hero_marquee: "",
        hero_bg: ""
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(true);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await axios.get('/api/admin/hero');
                if (res.data.success) setFormData(res.data.data);
            } catch (err) { console.error(err); }
            finally { setSyncing(false); }
        };
        fetchHero();
    }, []);

    const handlePush = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        data.append('image', file);
        data.append('hero_title', formData.hero_title);
        data.append('hero_subtitle', formData.hero_subtitle);
        data.append('hero_marquee', formData.hero_marquee);
        data.append('hero_bg', formData.hero_bg);

        try {
            const res = await axios.post('/api/admin/hero', data);
            if (res.data.success) alert("HERO AUTHORITY: Registry PUSH successful.");
        } catch (err) { alert("PUSH Rejected."); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Layout className="text-rose-600" size={32} />
                        HERO AUTHORITY
                    </h1>
                    <p className="text-slate-500 font-medium">Global Landing Configuration</p>
                </div>
                {syncing && <RefreshCw className="animate-spin text-rose-500" />}
            </header>

            <form onSubmit={handlePush} className="max-w-3xl bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Main Title</label>
                        <input 
                            type="text" 
                            value={formData.hero_title}
                            onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                            className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Subtitle</label>
                        <textarea 
                            value={formData.hero_subtitle}
                            onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                            className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 h-32"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Background Image PUSH</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-slate-500" />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-rose-600 transition-all"
                >
                    <Save size={20} />
                    {loading ? "COMMITTING PUSH..." : "EXECUTE HERO UPDATE"}
                </button>
            </form>
        </div>
    );
};

export default AdminHero;