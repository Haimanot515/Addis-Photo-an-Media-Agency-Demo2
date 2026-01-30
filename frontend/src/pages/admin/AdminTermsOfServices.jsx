import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Scale, Trash2, RefreshCw, Loader2 } from 'lucide-react';

const AdminTermsOfService = () => {
    const [terms, setTerms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [newRule, setNewRule] = useState({ serial_number: '', title: '', content: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const syncRegistry = async () => {
        setFetching(true);
        try {
            const res = await api.get('/admin/legal');
            if (res.data.success) {
                setTerms(res.data.registry.terms.sort((a, b) => a.serial_number - b.serial_number));
            }
        } catch (err) { console.error("TERMS_SYNC_FAIL"); }
        finally { setFetching(false); }
    };

    useEffect(() => { syncRegistry(); }, []);

    const handlePush = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/admin/legal/terms', newRule);
            setStatus({ type: 'success', msg: "REGISTRY PUSH: Terms node committed." });
            setNewRule({ serial_number: '', title: '', content: '' });
            syncRegistry();
        } catch (err) { setStatus({ type: 'error', msg: "PUSH rejected." }); }
        finally { setLoading(false); }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("EXECUTE DROP: Purge this terms rule?")) return;
        try {
            await api.delete(`/admin/legal/terms/${id}`);
            syncRegistry();
        } catch (err) { console.error(err); }
    };

    return (
        <main className="container contact" style={{ maxWidth: '1190px', marginTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Scale size={28} /> Terms Registry</h1>
                <button onClick={syncRegistry} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}>
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>
            <div className="contact-wrapper">
                <section className="contact-details" style={{ flex: '1 1 500px', maxHeight: '800px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#fff' }}>Active Nodes</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '2rem' }}>
                        {terms.map((item) => (
                            <div key={item.id} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#10b981', fontWeight: '800', fontSize: '0.75rem' }}>NODE #{item.serial_number}</span>
                                    <button onClick={() => handleDrop(item.id)} style={{ background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                </div>
                                <h4 style={{ color: '#fff', fontSize: '0.9rem', margin: '5px 0' }}>{item.title}</h4>
                                <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="contact-form-section" style={{ flex: '1 1 450px' }}>
                    <form className="contact-form" onSubmit={handlePush}>
                        <h2>Execute PUSH</h2>
                        {status.msg && <div className={`status-msg ${status.type}`}>{status.msg}</div>}
                        <div className="form-group"><label>S/N</label><input type="number" value={newRule.serial_number} onChange={(e)=>setNewRule({...newRule, serial_number: e.target.value})} /></div>
                        <div className="form-group"><label>Title *</label><input type="text" value={newRule.title} onChange={(e)=>setNewRule({...newRule, title: e.target.value})} required /></div>
                        <div className="form-group"><label>Terms Detail *</label><textarea value={newRule.content} onChange={(e)=>setNewRule({...newRule, content: e.target.value})} style={{ minHeight: '180px' }} required /></div>
                        <button type="submit" className="btn-submit" disabled={loading}>{loading ? <Loader2 className="animate-spin" size={20} /> : "COMMIT TO REGISTRY"}</button>
                    </form>
                </section>
            </div>
        </main>
    );
};
export default AdminTermsOfService;