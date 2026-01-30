import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Trash2, Image as ImageIcon, Loader2, RefreshCw, X } from 'lucide-react';

const AdminFeatures = () => {
    const [features, setFeatures] = useState([]);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [altText, setAltText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fetchFeatures = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/admin/features');
            if (res.data?.success) {
                setFeatures(res.data.data || []);
            }
        } catch (err) {
            console.error("Registry Fetch Error:", err);
            setFeatures([]);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchFeatures();
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
        if (!file || !altText) {
            setStatus({ type: 'error', msg: "Image and Description required." });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', altText);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/features', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY PUSH: Node committed.' });
                setAltText("");
                setFile(null);
                setPreview(null);
                e.target.reset();
                fetchFeatures();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'PUSH Failure: Authority rejected.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("EXECUTE DROP: Purge this asset from the registry?")) return;
        
        try {
            const res = await axios.delete(`/api/admin/features/${id}`, { withCredentials: true });
            if (res.data.success) {
                fetchFeatures();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'DROP Failure: Asset not purged.' });
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1>Featured Works</h1>
                <button 
                    onClick={fetchFeatures} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}
                >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: LIVE REGISTRY (Styled like contact-details) */}
                <section className="contact-details" style={{ flex: '1 1 400px' }}>
                    <h2 style={{ color: '#fff' }}>Live Registry</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        Active asset nodes ({features.length}).
                    </p>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '15px', 
                        marginTop: '2rem' 
                    }}>
                        {features.map((item) => (
                            <div key={item.id} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden'
                            }}>
                                <div style={{ height: '100px', background: '#222' }}>
                                    <img src={item.src} alt={item.alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#fff', fontSize: '0.7rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                                        {item.alt}
                                    </span>
                                    <button onClick={() => handleDrop(item.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT COLUMN: PUSH FORM (Styled like contact-form-section) */}
                <section className="contact-form-section" style={{ flex: '1 1 450px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>Push New Asset</h2>

                        {status.msg && (
                            <div style={{ 
                                color: status.type === 'success' ? 'green' : 'red', 
                                padding: '10px', 
                                backgroundColor: status.type === 'success' ? '#f0fff4' : '#fff5f5',
                                borderRadius: '4px',
                                marginBottom: '1rem',
                                fontSize: '0.85rem'
                            }}>
                                {status.msg}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Asset Description (Alt Text) *</label>
                            <input 
                                type="text" 
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Describe the work..." 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Image Asset *</label>
                            {!preview ? (
                                <div style={{ 
                                    border: '2px dashed #ccc', 
                                    borderRadius: '8px', 
                                    padding: '40px', 
                                    textAlign: 'center', 
                                    position: 'relative',
                                    backgroundColor: '#fafafa'
                                }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={32} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Click to select file</p>
                                    <input 
                                        type="file" 
                                        onChange={handleFileChange} 
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} 
                                    />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #eee' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    <button 
                                        type="button"
                                        onClick={() => {setFile(null); setPreview(null);}} 
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
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
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "PUSH TO REGISTRY"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminFeatures;