import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Save, UploadCloud, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

const AdminHero = () => {
    const [formData, setFormData] = useState({
        hero_title: "",
        hero_subtitle: "",
        hero_marquee: "",
        hero_bg: ""
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await axios.get('/api/admin/hero');
                if (res.data.success) setFormData(res.data.data);
            } catch (err) { 
                console.error(err); 
            } finally { 
                setSyncing(false); 
            }
        };
        fetchHero();
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handlePush = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        const data = new FormData();
        if (file) data.append('image', file);
        data.append('hero_title', formData.hero_title);
        data.append('hero_subtitle', formData.hero_subtitle);
        data.append('hero_marquee', formData.hero_marquee);

        try {
            const res = await axios.post('/api/admin/hero', data);
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'HERO AUTHORITY: Registry PUSH successful.' });
                setFile(null);
                setPreview(null);
            }
        } catch (err) { 
            setStatus({ type: 'error', msg: 'PUSH Rejected by Authority.' });
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Layout size={28} /> Hero Management
                </h1>
                {syncing && <RefreshCw className="animate-spin" size={20} />}
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: LIVE STATE PREVIEW */}
                <section className="contact-details" style={{ flex: '1 1 400px' }}>
                    <h2 style={{ color: '#fff' }}>Current State</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        This is what is currently broadcast to the public interface.
                    </p>

                    <div style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ 
                            height: '180px', 
                            background: '#111', 
                            borderRadius: '8px', 
                            overflow: 'hidden',
                            marginBottom: '15px',
                            position: 'relative'
                        }}>
                            {formData.hero_bg ? (
                                <img 
                                    src={formData.hero_bg} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} 
                                    alt="Current BG"
                                />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ImageIcon size={40} color="#333" />
                                </div>
                            )}
                            <div style={{ position: 'absolute', inset: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                                <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{formData.hero_title || "No Title Set"}</h4>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <small style={{ color: '#f2ca18', textTransform: 'uppercase', letterSpacing: '1px' }}>Marquee Text</small>
                            <p style={{ color: '#fff', fontSize: '0.85rem', margin: 0 }}>{formData.hero_marquee || "None"}</p>
                        </div>
                    </div>
                </section>

                {/* RIGHT COLUMN: CONFIGURATION FORM */}
                <section className="contact-form-section" style={{ flex: '1 1 500px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>Global Configuration</h2>

                        {status.msg && (
                            <div style={{ 
                                color: status.type === 'success' ? '#166534' : '#991b1b', 
                                padding: '12px', 
                                backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem',
                                border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                            }}>
                                {status.msg}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Hero Title *</label>
                            <input 
                                type="text" 
                                value={formData.hero_title}
                                onChange={(e) => setFormData({...formData, hero_title: e.target.value})}
                                placeholder="The main headline" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Marquee / Tagline</label>
                            <input 
                                type="text" 
                                value={formData.hero_marquee}
                                onChange={(e) => setFormData({...formData, hero_marquee: e.target.value})}
                                placeholder="Scrolling or secondary text" 
                            />
                        </div>

                        <div className="form-group">
                            <label>Subtitle</label>
                            <textarea 
                                rows="3" 
                                value={formData.hero_subtitle}
                                onChange={(e) => setFormData({...formData, hero_subtitle: e.target.value})}
                                placeholder="Supporting narrative..." 
                            />
                        </div>

                        <div className="form-group">
                            <label>Update Background Asset</label>
                            {!preview ? (
                                <div style={{ 
                                    border: '2px dashed #ccc', 
                                    borderRadius: '8px', 
                                    padding: '30px', 
                                    textAlign: 'center', 
                                    position: 'relative',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={24} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Upload new image asset</p>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                                    />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="New Preview" />
                                    <button 
                                        type="button"
                                        onClick={() => {setFile(null); setPreview(null);}} 
                                        style={{ position: 'absolute', top: '5px', right: '5px', background: '#000', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer' }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-submit" 
                            disabled={loading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            <Save size={18} />
                            {loading ? "COMMITTING..." : "EXECUTE UPDATE"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminHero;