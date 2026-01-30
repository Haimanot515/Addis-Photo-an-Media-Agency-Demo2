import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2, Briefcase } from 'lucide-react';

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        id: '',
        full_name: '',
        email: '',
        phone: '',
        location: '',
        job_title: '',
        photo_url: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const fetchIdentity = async () => {
        try {
            const res = await api.get('/admin/profile');
            if (res.data.success && res.data.profile) {
                setProfile(res.data.profile);
            }
        } catch (err) {
            console.error("IDENTITY_SYNC_FAIL");
        }
    };

    useEffect(() => { fetchIdentity(); }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handlePush = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        const formData = new FormData();
        // Matching the Controller req.body keys exactly
        formData.append('id', profile.id);
        formData.append('full_name', profile.full_name);
        formData.append('email', profile.email);
        formData.append('phone', profile.phone);
        formData.append('location', profile.location);
        formData.append('job_title', profile.job_title);
        
        if (file) {
            formData.append('photo', file); // Field name must be "photo"
        }

        try {
            const res = await api.post('/admin/profile', formData);
            if (res.data.success) {
                setStatus({ type: 'success', msg: "IDENTITY REGISTRY UPDATED" });
                fetchIdentity(); // Refresh to get the new Supabase URL
                setFile(null);
            }
        } catch (err) {
            setStatus({ type: 'error', msg: "PUSH REJECTED: Check server logs" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container contact" style={{ maxWidth: '1100px', marginTop: '100px' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <User size={32} color="#3b82f6" /> Identity Authority
            </h1>

            <div className="contact-wrapper">
                {/* PREVIEW PANEL */}
                <section className="contact-details" style={{ flex: '1' }}>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ 
                            width: '180px', height: '180px', borderRadius: '50%', margin: '0 auto', 
                            border: '3px solid #3b82f6', overflow: 'hidden', background: '#1a1a1a' 
                        }}>
                            <img 
                                src={preview || profile.photo_url || 'https://via.placeholder.com/180'} 
                                alt="Admin Profile" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                        <h2 style={{ color: '#fff', marginTop: '20px' }}>{profile.full_name || 'Registry Empty'}</h2>
                        <p style={{ color: '#3b82f6', fontWeight: 'bold' }}>{profile.job_title || 'Role not defined'}</p>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                            <Mail size={18} /> {profile.email}
                        </div>
                        <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                            <Phone size={18} /> {profile.phone}
                        </div>
                        <div className="detail-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ccc' }}>
                            <MapPin size={18} /> {profile.location}
                        </div>
                    </div>
                </section>

                {/* UPDATE FORM */}
                <section className="contact-form-section" style={{ flex: '1.5' }}>
                    <form className="contact-form" onSubmit={handlePush}>
                        <h2>Modify Identity Node</h2>
                        {status.msg && (
                            <div style={{ color: status.type === 'success' ? '#4ade80' : '#f87171', marginBottom: '1rem' }}>
                                {status.msg}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={profile.full_name} onChange={(e) => setProfile({...profile, full_name: e.target.value})} required />
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Email Address</label>
                                <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Phone</label>
                                <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Job Title</label>
                                <input type="text" value={profile.job_title} onChange={(e) => setProfile({...profile, job_title: e.target.value})} required />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Location</label>
                                <input type="text" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label><Camera size={16} /> Update Profile Photo</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> PUSH TO REGISTRY</>}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminProfile;