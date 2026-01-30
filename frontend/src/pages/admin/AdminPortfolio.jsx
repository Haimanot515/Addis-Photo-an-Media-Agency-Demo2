import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Trash2, Image as ImageIcon, RefreshCw, X, Loader2 } from 'lucide-react';

const AdminPortfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Form State
    const [alt, setAlt] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fetchPortfolio = async () => {
        setFetching(true);
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

    const onFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handlePush = async (e) => {
        e.preventDefault();
        if (!file || !alt) {
            setStatus({ type: 'error', msg: "Authority requires an Image and Alt Text." });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', alt);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/portfolio', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                setStatus({ type: 'success', msg: "REGISTRY PUSH: Node committed." });
                setAlt("");
                setFile(null);
                setPreview(null);
                fetchPortfolio();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "Authority rejected the PUSH request." });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("WARNING: Execute DROP? Node will be permanently purged.")) return;

        try {
            const res = await axios.delete(`/api/admin/portfolio/${id}`, { withCredentials: true });
            if (res.data.success) {
                fetchPortfolio();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "DROP Failure: Authority rejected request." });
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ImageIcon size={28} /> Portfolio Registry
                </h1>
                <button 
                    onClick={fetchPortfolio} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}
                >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: PORTFOLIO GRID (Registry) */}
                <section className="contact-details" style={{ flex: '1 1 500px', maxHeight: '800px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#fff' }}>Active Nodes</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        Displaying {portfolio.length} assets currently in the registry.
                    </p>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '15px', 
                        marginTop: '2rem' 
                    }}>
                        {portfolio.map((item) => (
                            <div key={item.id} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                <div style={{ height: '120px', background: '#222' }}>
                                    <img src={item.src} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <p style={{ 
                                        color: '#fff', 
                                        fontSize: '0.75rem', 
                                        margin: '0 0 8px 0',
                                        height: '2.4em',
                                        overflow: 'hidden',
                                        textTransform: 'uppercase',
                                        fontWeight: '600'
                                    }}>
                                        {item.alt}
                                    </p>
                                    <button 
                                        onClick={() => handleDrop(item.id)} 
                                        style={{ 
                                            width: '100%',
                                            background: 'rgba(225, 29, 72, 0.1)', 
                                            border: '1px solid #e11d48', 
                                            color: '#e11d48', 
                                            fontSize: '0.7rem',
                                            padding: '4px',
                                            cursor: 'pointer',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        DROP
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT COLUMN: PUSH FORM */}
                <section className="contact-form-section" style={{ flex: '1 1 450px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>Execute PUSH</h2>

                        {status.msg && (
                            <div style={{ 
                                color: status.type === 'success' ? '#166534' : '#991b1b', 
                                padding: '12px', 
                                backgroundColor: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.85rem',
                                border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`
                            }}>
                                {status.msg}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Project Description *</label>
                            <input 
                                type="text" 
                                value={alt}
                                onChange={(e) => setAlt(e.target.value)}
                                placeholder="Enter asset metadata..." 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Asset Image *</label>
                            {!preview ? (
                                <div style={{ 
                                    border: '2px dashed #ccc', 
                                    borderRadius: '8px', 
                                    padding: '50px 20px', 
                                    textAlign: 'center', 
                                    position: 'relative',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={32} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Click to select project file</p>
                                    <input 
                                        type="file" 
                                        onChange={onFileChange} 
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                                    />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '220px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    <button 
                                        type="button"
                                        onClick={() => {setFile(null); setPreview(null);}} 
                                        style={{ 
                                            position: 'absolute', top: '10px', right: '10px', 
                                            background: '#000', color: '#fff', border: 'none', 
                                            borderRadius: '50%', padding: '5px', cursor: 'pointer' 
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-submit" 
                            disabled={loading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '1rem' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "COMMIT TO REGISTRY"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminPortfolio;