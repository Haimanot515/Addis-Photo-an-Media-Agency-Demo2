import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, UploadCloud, RefreshCw, CheckCircle2, 
  AlertCircle, X, Image as ImageIcon, Hash 
} from 'lucide-react';

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleTitleChange = (e) => {
        const val = e.target.value;
        setTitle(val);
        setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    };

    const fetchPosts = async () => {
        setFetching(true);
        try {
            const res = await axios.get('/api/admin/blog');
            if (res.data.success) setPosts(res.data.data);
        } catch (err) {
            setStatus({ type: 'error', msg: 'Sync Failed.' });
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => { fetchPosts(); }, []);

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
        formData.append('slug', slug);
        formData.append('excerpt', excerpt);
        formData.append('content', content);

        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            const res = await axios.post('/api/admin/blog', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.success) {
                setStatus({ type: 'success', msg: 'Message sent successfully!' });
                setTitle(""); setSlug(""); setExcerpt(""); setContent("");
                setFile(null); setPreview(null);
                fetchPosts();
            }
        } catch (err) {
            setStatus({ type: 'error', msg: 'Failed to update registry.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = async (id) => {
        if (!window.confirm("DROP this post?")) return;
        try {
            await axios.delete(`/api/admin/blog/${id}`);
            fetchPosts();
        } catch (err) {
            setStatus({ type: 'error', msg: 'DROP command failed.' });
        }
    };

    return (
        <main 
            className="container contact" 
            style={{ maxWidth: '1190px', marginTop: '100px' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Blog Management</h1>
                <button 
                    onClick={fetchPosts} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#151414' }}
                >
                    <RefreshCw className={fetching ? 'animate-spin' : ''} size={20} />
                </button>
            </div>

            <div className="contact-wrapper">
                {/* LEFT COLUMN: REGISTRY LIST (Styled like contact-details) */}
                <section className="contact-details" style={{ flex: '1 1 350px' }}>
                    <h2 style={{ color: '#fff' }}>Active Registry</h2>
                    <p style={{ color: '#ccc', fontSize: '0.9rem' }}>
                        Manage active transmissions ({posts.length} nodes).
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                        {posts.map(post => (
                            <div key={post.id} style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '15px', 
                                background: 'rgba(255,255,255,0.05)', 
                                padding: '10px', 
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', background: '#222' }}>
                                    {post.image_url ? (
                                        <img src={post.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            <ImageIcon size={18} color="#444" />
                                        </div>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h4 style={{ margin: 0, color: '#fff', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.title}</h4>
                                    <span style={{ color: '#f2ca18', fontSize: '0.75rem', fontFamily: 'monospace' }}>/{post.slug}</span>
                                </div>
                                <button onClick={() => handleDrop(post.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* RIGHT COLUMN: FORM (Styled like contact-form-section) */}
                <section className="contact-form-section" style={{ flex: '1 1 500px' }}>
                    <form className="contact-form" onSubmit={handlePush} noValidate>
                        <h2>Create New Post</h2>

                        {status.msg && (
                            <div style={{ 
                                color: status.type === 'success' ? 'green' : 'red', 
                                padding: '10px', 
                                backgroundColor: status.type === 'success' ? '#f0fff4' : '#fff5f5',
                                borderRadius: '4px',
                                marginBottom: '1rem',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}>
                                {status.msg}
                            </div>
                        )}

                        <div className="form-group">
                            <label>Post Headline *</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={handleTitleChange} 
                                placeholder="Enter title" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Registry Slug</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem', background: '#eee', borderRadius: '4px', fontSize: '0.85rem' }}>
                                <Hash size={14} /> <span>{slug || 'auto-generated'}</span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            {!preview ? (
                                <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '20px', textAlign: 'center', position: 'relative' }}>
                                    <UploadCloud style={{ margin: '0 auto 10px' }} size={24} color="#999" />
                                    <p style={{ fontSize: '0.8rem', color: '#999' }}>Click to upload asset</p>
                                    <input type="file" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                                </div>
                            ) : (
                                <div style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                    <button onClick={() => {setFile(null); setPreview(null);}} style={{ position: 'absolute', top: '5px', right: '5px', background: 'red', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        <X size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Excerpt (Summary)</label>
                            <textarea 
                                rows="2" 
                                value={excerpt} 
                                onChange={(e) => setExcerpt(e.target.value)} 
                                placeholder="Short description..." 
                            />
                        </div>

                        <div className="form-group">
                            <label>Content *</label>
                            <textarea 
                                rows="6" 
                                value={content} 
                                onChange={(e) => setContent(e.target.value)} 
                                placeholder="Write the full post content..." 
                                required 
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-submit" 
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Commit Post'}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default AdminBlog;