import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, 
  Trash2, 
  UploadCloud, 
  RefreshCw, 
  X, 
  Loader2, 
  Image as ImageIcon 
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

    // Auto-clear status alerts
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
        const formData = new FormData();
        if (file) formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/services', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY PUSH: Service Node active.' });
                setTitle(""); setDescription(""); setFile(null); setPreview(null);
                fetchServices();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'PUSH Rejected by Authority.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("CRITICAL: Confirm REGISTRY DROP? This service node will be purged.")) return;
        try {
            const res = await axios.delete(`/api/admin/services/${id}`, { withCredentials: true });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'REGISTRY DROP: Node Purged.' });
                fetchServices();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'DROP Command Failed.' });
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Layers size={28} /> Services Authority
                </h1>
                <button 
                    onClick={fetchServices} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}
                >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: ACTIVE SERVICES REGISTRY */}
                <section className="contact-details" style={{ flex: '1 1 450px', maxHeight: '850px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#fff' }}>Active Offerings</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Operational service nodes currently live in the system ({services.length}).
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {services.length === 0 && !fetching && (
                            <div style={{ color: '#666', textAlign: 'center', padding: '40px', border: '1px dashed #444', borderRadius: '12px' }}>
                                No active service nodes found.
                            </div>
                        )}
                        
                        {services.map((s) => (
                            <div key={s.id} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden'
                            }}>
                                <div style={{ height: '120px', background: '#1a1a1a', position: 'relative' }}>
                                    {s.image_url ? (
                                        <img src={s.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} alt={s.title} />
                                    ) : (
                                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ImageIcon size={32} color="#333" />
                                        </div>
                                    )}
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '4px 8px', borderRadius: '4px' }}>
                                        <span style={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}>ID: {s.id}</span>
                                    </div>
                                </div>
                                <div style={{ padding: '15px' }}>
                                    <h4 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.title}</h4>
                                    <p style={{ color: '#aaa', fontSize: '0.8rem', lineHeight: '1.4', marginBottom: '15px' }}>
                                        {s.description}
                                    </p>
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => handleDrop(s.id)}
                                            style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 'bold' }}
                                        >
                                            <Trash2 size={14} /> DROP NODE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT COLUMN: SERVICE PUSH FORM */}
                <section className="contact-form-section" style={{ flex: '1 1 550px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>Initialize Node</h2>

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
                            <label>Service Title *</label>
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Precision Agronomy" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Service Description *</label>
                            <textarea 
                                rows="5" 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detail the scope of this service node..." 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Visual Asset (Optional)</label>
                            {!preview ? (
                                <div style={{ 
                                    border: '2px dashed #ccc', borderRadius: '8px', padding: '40px 20px', 
                                    textAlign: 'center', position: 'relative', backgroundColor: '#fafafa'
                                }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={28} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Click to upload service image</p>
                                    <input type="file" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    <button 
                                        type="button" onClick={() => {setFile(null); setPreview(null);}} 
                                        style={{ position: 'absolute', top: '10px', right: '10px', background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" className="btn-submit" disabled={loading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "EXECUTE SERVICE PUSH"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminServices;