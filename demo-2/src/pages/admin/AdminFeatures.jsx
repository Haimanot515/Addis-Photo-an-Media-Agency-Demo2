import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Trash2, ShieldAlert, Image as ImageIcon, Loader2 } from 'lucide-react';

const AdminFeatures = () => {
    const [features, setFeatures] = useState([]);
    const [file, setFile] = useState(null);
    const [altText, setAltText] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // ───── REGISTRY READ: Fetch nodes from Authority ─────
    const fetchFeatures = async () => {
        try {
            // Adjust this URL if your public route is different
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

    // ───── AUTHORITY PUSH: Add new node ─────
    const handlePush = async (e) => {
        e.preventDefault();
        if (!file || !altText) return alert("Validation Failed: Image and Alt Text required.");

        const formData = new FormData();
        formData.append('image', file);
        formData.append('alt', altText);

        setLoading(true);
        try {
            const res = await axios.post('/api/admin/features', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                setAltText("");
                setFile(null);
                // Reset file input manually
                e.target.reset();
                fetchFeatures();
                alert("REGISTRY PUSH: Node successfully committed.");
            }
        } catch (err) {
            console.error("Push Error:", err.response?.data || err.message);
            alert("PUSH Failure: Authority rejected the request.");
        } finally {
            setLoading(false);
        }
    };

    // ───── AUTHORITY DROP: Purge node ─────
    const handleDrop = async (id) => {
        if (!window.confirm("WARNING: Are you sure you want to DROP this asset from the registry?")) return;
        
        try {
            const res = await axios.delete(`/api/admin/features/${id}`, { withCredentials: true });
            if (res.data.success) {
                fetchFeatures();
            }
        } catch (err) {
            console.error("Drop Error:", err);
            alert("DROP Failure: Asset could not be purged.");
        }
    };

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                <ShieldAlert size={32} color="#e11d48" />
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#09090b', margin: 0 }}>
                    FEATURED WORKS AUTHORITY
                </h2>
            </div>

            {/* PUSH INTERFACE */}
            <div style={{ backgroundColor: '#fff', border: '1px solid #e4e4e7', borderRadius: '12px', padding: '24px', marginBottom: '40px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UploadCloud size={20} /> PUSH NEW ASSET
                </h3>
                <form onSubmit={handlePush}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#71717a', marginBottom: '8px' }}>IMAGE FILE</label>
                            <input 
                                type="file" 
                                onChange={(e) => setFile(e.target.files[0])} 
                                style={{ width: '100%', padding: '8px', border: '1px solid #e4e4e7', borderRadius: '6px', fontSize: '14px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#71717a', marginBottom: '8px' }}>ALT TEXT / DESCRIPTION</label>
                            <input 
                                type="text" 
                                placeholder="Describe the work..." 
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                style={{ width: '100%', padding: '10px', border: '1px solid #e4e4e7', borderRadius: '6px', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            backgroundColor: '#09090b', 
                            color: '#fff', 
                            padding: '12px 24px', 
                            border: 'none', 
                            borderRadius: '6px', 
                            fontWeight: '700', 
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {loading ? "COMMITTING PUSH..." : "PUSH TO REGISTRY"}
                    </button>
                </form>
            </div>

            {/* DROP / INVENTORY INTERFACE */}
            <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} /> LIVE REGISTRY NODES
            </h3>

            {fetching ? (
                <p>Synchronizing with Authority...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                    {features.length > 0 ? features.map((item) => (
                        <div key={item.id} style={{ border: '1px solid #e4e4e7', borderRadius: '10px', overflow: 'hidden', backgroundColor: '#fff', transition: 'transform 0.2s' }}>
                            <div style={{ height: '160px', overflow: 'hidden', backgroundColor: '#f4f4f5' }}>
                                <img 
                                    src={item.src} 
                                    alt={item.alt} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                />
                            </div>
                            <div style={{ padding: '15px' }}>
                                <p style={{ fontSize: '14px', fontWeight: '500', color: '#27272a', margin: '0 0 15px 0', minHeight: '40px' }}>
                                    {item.alt}
                                </p>
                                <button 
                                    onClick={() => handleDrop(item.id)}
                                    style={{ 
                                        width: '100%', 
                                        padding: '10px', 
                                        backgroundColor: '#fff', 
                                        color: '#e11d48', 
                                        border: '1px solid #e11d48', 
                                        borderRadius: '6px', 
                                        fontWeight: '700', 
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseEnter={(e) => { e.target.style.backgroundColor = '#e11d48'; e.target.style.color = '#fff'; }}
                                    onMouseLeave={(e) => { e.target.style.backgroundColor = '#fff'; e.target.style.color = '#e11d48'; }}
                                >
                                    <Trash2 size={14} /> DROP ASSET
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#a1a1aa', border: '2px dashed #e4e4e7', borderRadius: '12px' }}>
                            No active nodes in the registry.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminFeatures;