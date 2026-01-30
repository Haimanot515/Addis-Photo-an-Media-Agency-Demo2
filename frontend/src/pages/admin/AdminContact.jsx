import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import {
  Trash2, Search, MoreVertical, Paperclip, SendHorizontal
} from 'lucide-react';

const AdminContact = () => {
  const [rawMessages, setRawMessages] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchRegistry = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRawMessages(res.data.registry || []);
      setLoading(false);
    } catch (err) {
      console.error('REGISTRY_LOAD_FAIL');
      setLoading(false);
    }
  };

  useEffect(() => { fetchRegistry(); }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedUserEmail, rawMessages]);

  const threads = useMemo(() => {
    const groups = rawMessages.reduce((acc, msg) => {
      if (!acc[msg.email]) {
        acc[msg.email] = { name: msg.name, email: msg.email, messages: [] };
      }
      acc[msg.email].messages.push(msg);
      return acc;
    }, {});

    return Object.values(groups)
      .map(thread => {
        const sorted = [...thread.messages].sort((a, b) => a.id - b.id);
        const unreadCount = sorted.filter(m => 
          m.role !== 'admin' && m.name !== 'Admin' && m.is_read === false
        ).length;
          
        return { 
          ...thread, 
          messages: sorted, 
          lastMessage: sorted[sorted.length - 1],
          unreadCount 
        };
      })
      .sort((a, b) => b.lastMessage.id - a.lastMessage.id);
  }, [rawMessages]);

  const handleThreadClick = async (email) => {
    setSelectedUserEmail(email);
    setRawMessages(prev => prev.map(m => 
      (m.email === email && m.role !== 'admin' && m.name !== 'Admin') ? { ...m, is_read: true } : m
    ));

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/messages/mark-read', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('MARK_READ_PERSISTENCE_FAIL');
    }
  };

  const activeThread = threads.find(t => t.email === selectedUserEmail);

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !activeThread) return;

    const outgoingText = replyText;
    const targetEmail = activeThread.email;
    const targetName = activeThread.name;
    const internalId = activeThread.messages[0]?.user_internal_id;

    setReplyText(''); 

    const optimisticMsg = {
      id: Date.now(),
      email: targetEmail,
      name: 'Admin',
      message: outgoingText,
      role: 'admin',
      is_read: true,
      created_at: new Date().toISOString(),
      user_internal_id: internalId
    };

    setRawMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/admin/messages/reply', {
        email: targetEmail,
        messageId: activeThread.lastMessage.id,
        replyText: outgoingText,
        name: targetName,
        user_internal_id: internalId
      }, { headers: { Authorization: `Bearer ${token}` } });

      if (res.data.newMessage) {
        setRawMessages(prev => 
          prev.map(m => m.id === optimisticMsg.id ? { ...res.data.newMessage, role: 'admin' } : m)
        );
      }
    } catch { 
      alert('REPLY_FAILED');
      setRawMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
  };

  const dropNode = async id => {
    if (!window.confirm('EXECUTE DROP?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRawMessages(prev => prev.filter(m => m.id !== id));
    } catch { alert('DROP_FAILED'); }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f4' }}>LOADING...</div>;

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'row', height: 'calc(100vh - 20px)', marginTop: '20px', 
      width: '100%', backgroundColor: '#e7ebf0', overflow: 'hidden', color: '#000000', fontFamily: 'Segoe UI, Tahoma, sans-serif' 
    }}>
      
      {/* SIDEBAR - Fixed width, internal scroll */}
      <div style={{ width: '280px', height: '100%', backgroundColor: '#ffffff', borderRight: '1px solid #dcdcdc', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '8px 12px' }}>
          <div style={{ backgroundColor: '#f1f1f1', borderRadius: '8px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e0e0e0' }}>
            <Search size={14} color="#a8a8a8" />
            <input placeholder="Search" style={{ background: 'transparent', border: 'none', outline: 'none', color: '#000', fontSize: '13px', width: '100%' }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {threads.map(thread => (
            <div key={thread.email} onClick={() => handleThreadClick(thread.email)} style={{ 
              padding: '10px 12px', display: 'flex', gap: '10px', cursor: 'pointer', 
              backgroundColor: selectedUserEmail === thread.email ? '#4ca3ff' : 'transparent',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: selectedUserEmail === thread.email ? '#fff' : '#3390ec', color: selectedUserEmail === thread.email ? '#4ca3ff' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '15px' }}>
                {thread.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: selectedUserEmail === thread.email ? '#fff' : '#000', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {thread.name}
                  </div>
                  <div style={{ fontSize: '10px', color: selectedUserEmail === thread.email ? '#fff' : '#a8a8a8' }}>
                    {new Date(thread.lastMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1px' }}>
                  <div style={{ fontSize: '12.5px', color: selectedUserEmail === thread.email ? '#e0f0ff' : '#707579', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                    {(thread.lastMessage.role === 'admin' || thread.lastMessage.name === 'Admin') ? 'You: ' : ''}{thread.lastMessage.message}
                  </div>
                  {thread.unreadCount > 0 && (
                    <div style={{ backgroundColor: '#31c447', color: 'white', borderRadius: '50%', minWidth: '18px', height: '18px', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', marginLeft: '5px' }}>
                      {thread.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA - Container with no scroll */}
      <div style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#e7ebf0', minWidth: 0, overflow: 'hidden' }}>
        {activeThread ? (
          <>
            {/* Header - Fixed */}
            <div style={{ height: '45px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', padding: '0 15px', borderBottom: '1px solid #dcdcdc', flexShrink: 0 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{activeThread.name}</div>
                <div style={{ fontSize: '11px', color: '#3390ec' }}>{activeThread.email}</div>
              </div>
              <MoreVertical size={18} color="#707579" cursor="pointer" />
            </div>

            {/* THREAD AREA - The only part that scrolls */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '10px 15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeThread.messages.map(m => {
                const isAdmin = m.role === 'admin' || m.name === 'Admin';
                return (
                  <div key={m.id} style={{ alignSelf: isAdmin ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                    <div style={{ 
                        backgroundColor: isAdmin ? '#efffde' : '#ffffff', 
                        padding: '6px 10px', borderRadius: '10px', boxShadow: '0 1px 1px rgba(0,0,0,0.08)' 
                    }}>
                      <p style={{ fontSize: '14px', margin: 0 }}>{m.message}</p>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '9px', color: '#a8a8a8' }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <Trash2 size={11} color="#ff5e5e" cursor="pointer" onClick={() => dropNode(m.id)} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* INPUT AREA - Pinned at the bottom */}
            <div style={{ padding: '6px 12px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', borderTop: '1px solid #dcdcdc', flexShrink: 0 }}>
              <Paperclip size={20} color="#707579" style={{ cursor: 'pointer' }} />
              <div style={{ flex: 1, backgroundColor: '#f4f4f5', borderRadius: '18px', padding: '4px 12px', display: 'flex', alignItems: 'center' }}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Message"
                  style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: '13px', resize: 'none', maxHeight: '100px', lineHeight: '1.4' }}
                  rows="1"
                />
              </div>
              <button 
                onClick={handleReplySubmit} 
                disabled={!replyText.trim()}
                style={{ 
                  backgroundColor: replyText.trim() ? '#3390ec' : '#f4f4f5', 
                  color: replyText.trim() ? '#ffffff' : '#a8a8a8',
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: replyText.trim() ? 'pointer' : 'default',
                  flexShrink: 0
                }}
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#707579', fontSize: '13px' }}>Select a chat</div>
        )}
      </div>
    </div>
  );
};

export default AdminContact;
