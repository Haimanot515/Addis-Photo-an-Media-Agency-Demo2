import React, { useState, useEffect } from 'react'; // ✅ Added useEffect
import { NavLink, Link } from 'react-router-dom';
import { Users, UserCircle, ShieldCheck, Inbox, LayoutDashboard, Home, X, Settings } from 'lucide-react'; 
import api from '../api/axios'; // ✅ Imported your axios instance
import DynamicSidebar from './DynamicSidebar'; 

const AdminNavbar = () => {
  const [sidebarMode, setSidebarMode] = useState(null); 
  const [adminData, setAdminData] = useState({ full_name: 'Admin', photo_url: '' }); // ✅ State for profile

  // ✅ Fetch Admin Identity on Mount
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await api.get('/admin/profile');
        if (res.data.success && res.data.profile) {
          setAdminData(res.data.profile);
        }
      } catch (err) {
        console.error("NAVBAR_SYNC_ERROR");
      }
    };
    fetchAdmin();
  }, []);

  const toggleSidebar = (mode) => {
    setSidebarMode(sidebarMode === mode ? null : mode);
  };

  const styles = {
    nav: {
      width: '100%',
      height: '80px',
      backgroundColor: '#000',
      position: 'sticky',
      top: 0,
      zIndex: 2000,
      fontFamily: "'Inter', sans-serif",
    },
    container: {
      maxWidth: '100%',
      padding: '0 40px',
      width: '100%',
      margin: '0 auto',
      height: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
    },
    brandSection: { 
      display: 'flex', 
      alignItems: 'center', 
      flexShrink: 0 
    },
    logo: { 
      fontSize: '24px', 
      fontWeight: '900', 
      textDecoration: 'none', 
      color: '#ffffff', 
      letterSpacing: '2px',
      whiteSpace: 'nowrap'
    },
    navLinks: { 
      listStyle: 'none', 
      display: 'flex', 
      gap: '30px', 
      alignItems: 'center', 
      margin: '0 20px', 
      padding: 0,
      flex: 1,
      justifyContent: 'center' 
    },
    link: {
      background: 'none', 
      border: 'none', 
      color: '#ffffff', 
      fontSize: '17px', 
      fontWeight: '600', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      cursor: 'pointer',
      whiteSpace: 'nowrap', 
      flexShrink: 0
    },
    activeToggle: { color: '#e11d48', fontWeight: '900' },
    rightSection: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      flexShrink: 0 
    },
    profileBtn: { 
      background: 'none',
      border: 'none',
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px', 
      color: '#ffffff', 
      borderRight: '1px solid #333', 
      paddingRight: '20px',
      cursor: 'pointer',
      transition: '0.2s',
      fontSize: '17px',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    // ✅ Added circular photo style
    profileImg: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid #333'
    }
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.brandSection}>
            <Link to="/admin/dashboard" style={styles.logo}>ADDIS<span style={{ color: '#e11d48' }}> ADMIN</span></Link>
          </div>

          <ul style={styles.navLinks}>
            <li>
              <button onClick={() => toggleSidebar('terminal')} style={sidebarMode === 'terminal' ? {...styles.link, ...styles.activeToggle} : styles.link}>
                <LayoutDashboard size={20} /> Dashboard
              </button>
            </li>

            <li>
              <button onClick={() => toggleSidebar('users')} style={sidebarMode === 'users' ? {...styles.link, ...styles.activeToggle} : styles.link}>
                <Users size={20} /> Users
              </button>
            </li>

            <li>
              <button onClick={() => toggleSidebar('inbox')} style={sidebarMode === 'inbox' ? {...styles.link, ...styles.activeToggle} : styles.link}>
                <Inbox size={20} /> Inbox
              </button>
            </li>

            <li>
              <button onClick={() => toggleSidebar('compliance')} style={sidebarMode === 'compliance' ? {...styles.link, ...styles.activeToggle} : styles.link}>
                <ShieldCheck size={20} /> Compliance
              </button>
            </li>
          </ul>

          <div style={styles.rightSection}>
            <button 
              onClick={() => toggleSidebar('settings')} 
              style={sidebarMode === 'settings' ? {...styles.profileBtn, ...styles.activeToggle} : styles.profileBtn}
            >
              {/* ✅ Dynamic Image Logic */}
              {adminData.photo_url ? (
                <img src={adminData.photo_url} alt="Profile" style={styles.profileImg} />
              ) : (
                <UserCircle size={24} />
              )}
              {/* ✅ Dynamic Name */}
              <span>{adminData.full_name.split(' ')[0]}</span> 
            </button>
            
            <Link to="/home" style={{...styles.link, fontSize: '15px'}}><Home size={18} />Home</Link>
          </div>
        </div>
      </nav>

      {sidebarMode && (
        <DynamicSidebar 
          mode={sidebarMode} 
          closeSidebar={() => setSidebarMode(null)} 
        />
      )}
    </>
  );
};

export default AdminNavbar;