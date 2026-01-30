import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trash2, UploadCloud, RefreshCw, X, Loader2, GraduationCap, Phone } from 'lucide-react';

const AdminTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    // Form State
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [education, setEducation] = useState("");
    const [phone, setPhone] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fetchTeam = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/admin/team');
            if (res.data.success) setTeam(res.data.data);
        } catch (err) {
            console.error("Registry Fetch Error:", err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchTeam();
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
        if (!file || !name || !role) {
            setStatus({ type: 'error', msg: "Authority requires Name, Role, and Image." });
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('name', name);
        formData.append('role', role);
        formData.append('education', education);
        formData.append('phone', phone);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/team', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });

            if (res.data.success) {
                setStatus({ type: 'success', msg: "REGISTRY PUSH: Member node committed." });
                setName(""); setRole(""); setEducation(""); setPhone(""); setFile(null); setPreview(null);
                fetchTeam();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "PUSH Rejected: Authority denied the request." });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("CRITICAL: Confirm REGISTRY DROP? This member will be purged.")) return;

        try {
            const res = await axios.delete(`/api/admin/team/${id}`, { withCredentials: true });
            if (res.data.success) {
                fetchTeam();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "DROP Failure: Authority rejected purge." });
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Users size={28} /> Team Authority
                </h1>
                <button 
                    onClick={fetchTeam} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}
                >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: TEAM REGISTRY */}
                <section className="contact-details" style={{ flex: '1 1 450px', maxHeight: '850px', overflowY: 'auto' }}>
                    <h2 style={{ color: '#fff' }}>Active Nodes</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Current personnel synchronization ({team.length} members).
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {team.map((member) => (
                            <div key={member.id} style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                borderRadius: '12px',
                                padding: '12px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                gap: '15px',
                                alignItems: 'center'
                            }}>
                                <img 
                                    src={member.image} 
                                    alt={member.name} 
                                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} 
                                />
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>{member.name}</h4>
                                    <p style={{ color: '#f2ca18', fontSize: '0.75rem', margin: '2px 0', textTransform: 'uppercase' }}>{member.role}</p>
                                </div>
                                <button 
                                    onClick={() => handleDrop(member.id)}
                                    style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '10px' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT COLUMN: PUSH FORM */}
                <section className="contact-form-section" style={{ flex: '1 1 550px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>PUSH Member Node</h2>

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

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" required />
                            </div>
                            <div className="form-group">
                                <label>Role *</label>
                                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Agronomist" required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Education / Credentials</label>
                            <div style={{ position: 'relative' }}>
                                <GraduationCap size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: '#999' }} />
                                <input 
                                    type="text" 
                                    style={{ paddingLeft: '40px' }}
                                    value={education} 
                                    onChange={(e) => setEducation(e.target.value)} 
                                    placeholder="BSc. Agricultural Science" 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Contact Phone</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: '#999' }} />
                                <input 
                                    type="text" 
                                    style={{ paddingLeft: '40px' }}
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="+1 234 567 890" 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Profile Image *</label>
                            {!preview ? (
                                <div style={{ 
                                    border: '2px dashed #ccc', borderRadius: '8px', padding: '30px', 
                                    textAlign: 'center', position: 'relative', backgroundColor: '#fafafa'
                                }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={24} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Click to upload member photo</p>
                                    <input type="file" onChange={onFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '120px', width: '120px', margin: '0 auto', borderRadius: '50%', overflow: 'hidden', border: '3px solid #eee' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    <button 
                                        type="button" onClick={() => {setFile(null); setPreview(null);}} 
                                        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" className="btn-submit" disabled={loading}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "COMMIT PUSH"}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminTeam;