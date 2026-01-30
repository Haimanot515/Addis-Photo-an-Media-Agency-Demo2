import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; 
import { Cookie, Trash2, RefreshCw, Loader2, Edit3 } from 'lucide-react';

const AdminCookiesPolicy = () => {
    const [cookies, setCookies] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    
    // Form State (Handles both New and Edits)
    const [formData, setFormData] = useState({ id: null, serial_number: '', title: '', content: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const syncRegistry = async () => {
        setFetching(true);
        try {
            const res = await api.get('/admin/legal'); // Calls getAdminLegalRegistry
            if (res.data.success) {
                setCookies(res.data.registry.cookies);
            }
        } catch (err) { console.error("SYNC_ERROR"); }
        finally { setFetching(false); }
    };

    useEffect(() => { syncRegistry(); }, []);

    const handlePush = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // This maps to your pushCookieRule (handles both Update and Insert)
            const res = await api.put('/admin/legal/cookie', formData);
            if (res.data.success) {
                setStatus({ type: 'success', msg: `NODE ${formData.id ? 'UPDATED' : 'COMMITTED'}` });
                setFormData({ id: null, serial_number: '', title: '', content: '' });
                syncRegistry();
            }
        } catch (err) { setStatus({ type: 'error', msg: "PUSH REJECTED" }); }
        finally { setLoading(false); }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("EXECUTE DROP: PERMANENT PURGE?")) return;
        try {
            await api.delete(`/admin/legal/cookie/${id}`); // Calls dropCookieRule
            syncRegistry();
        } catch (err) { alert("DROP_FAILED"); }
    };

    // Load existing node into form for editing
    const prepEdit = (node) => {
        setFormData({ id: node.id, serial_number: node.serial_number, title: node.title, content: node.content });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="container contact" style={{ maxWidth: '1190px', marginTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Cookie size={28} /> Cookie Authority</h1>
                <button onClick={syncRegistry} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}>
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* REGISTRY COLUMN */}
                <section className="contact-details" style={{ flex: '1 1 500px', maxHeight: '800px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#fff' }}>Active Nodes</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '2rem' }}>
                        {cookies.map((node) => (
                            <div key={node.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#f59e0b', fontWeight: '800' }}>#{node.serial_number}</span>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button onClick={() => prepEdit(node)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}><Edit3 size={16}/></button>
                                        <button onClick={() => handleDrop(node.id)} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                    </div>
                                </div>
                                <h4 style={{ color: '#fff', fontSize: '0.9rem', marginTop: '10px' }}>{node.title}</h4>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PUSH FORM COLUMN */}
                <section className="contact-form-section" style={{ flex: '1 1 450px' }}>
                    <form className="contact-form" onSubmit={handlePush}>
                        <h2>{formData.id ? "Execute UPDATE" : "Execute PUSH"}</h2>
                        {status.msg && <div className={`status-msg ${status.type}`} style={{ marginBottom: '1rem', color: status.type === 'success' ? '#4ade80' : '#f87171' }}>{status.msg}</div>}
                        
                        <div className="form-group">
                            <label>S/N</label>
                            <input type="number" value={formData.serial_number} onChange={(e) => setFormData({...formData, serial_number: e.target.value})} placeholder="Priority..." required />
                        </div>
                        <div className="form-group">
                            <label>Title *</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Identifier..." required />
                        </div>
                        <div className="form-group">
                            <label>Protocol Detail *</label>
                            <textarea value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} style={{ minHeight: '180px' }} placeholder="Legal string..." required />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "COMMIT TO REGISTRY"}
                        </button>
                        {formData.id && (
                            <button type="button" onClick={() => setFormData({ id: null, serial_number: '', title: '', content: '' })} style={{ width: '100%', marginTop: '10px', background: 'transparent', color: '#ccc', border: '1px solid #444' }} className="btn-submit">CANCEL EDIT</button>
                        )}
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminCookiesPolicy;