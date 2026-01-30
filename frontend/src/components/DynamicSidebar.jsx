import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Film, Layers, Info, BookOpen, UserPlus, UserMinus, Search, 
  Database, Home, ChevronRight, Mail, ShieldAlert, FileText, 
  Gavel, Lock, Settings, Bell, BarChart3, Globe, ShieldCheck,
  Cpu, Activity, HardDrive, Key, PlusCircle, RefreshCw,
  Edit3, Briefcase, UserCircle, LogOut, Sliders, ShieldCheck as ShieldIcon,
  Users as UsersIcon, Image as ImageIcon, UploadCloud, UserCheck, Layout
} from 'lucide-react';

const DynamicSidebar = ({ mode, closeSidebar }) => {
  const styles = {
    overlay: {
      position: 'fixed',
      top: '80px',
      left: 0,
      width: '100%',
      height: 'calc(100vh - 80px)',
      backgroundColor: 'transparent',
      zIndex: 1500,
    },
    sidebar: {
      width: '300px',
      height: '100%',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e4e4e7',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, sans-serif",
      boxShadow: '10px 0 25px rgba(0,0,0,0.03)',
      animation: 'slideIn 0.25s ease-out',
    },
    header: { padding: '30px 20px 20px 20px', borderBottom: '1px solid #f4f4f5' },
    title: { 
      fontSize: '20px', 
      fontWeight: '900', 
      color: '#09090b', 
      margin: 0, 
      letterSpacing: '-0.5px',
      textTransform: 'uppercase'
    },
    scrollArea: { flex: 1, overflowY: 'auto', padding: '20px 12px' },
    groupLabel: {
      fontSize: '11px',
      fontWeight: '800',
      color: '#a1a1aa',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      margin: '24px 0 8px 12px',
    },
    navItem: {
      textDecoration: 'none',
      color: '#3f3f46',
      padding: '12px 14px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '4px',
      transition: 'all 0.15s ease',
    },
    active: {
      backgroundColor: '#09090b', 
      color: '#ffffff',
      fontWeight: '700',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    },
    footer: { padding: '20px', borderTop: '1px solid #f4f4f5', background: '#fafafa' }
  };

  const SidebarLink = ({ to, icon: Icon, label, color }) => (
    <NavLink 
      to={to} 
      onClick={closeSidebar}
      style={({ isActive }) => isActive ? { ...styles.navItem, ...styles.active } : styles.navItem}
      className="sidebar-link-action"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Icon size={18} strokeWidth={2.5} color={color || 'inherit'} />
        {label}
      </div>
      <ChevronRight size={14} className="chevron-icon" opacity={0.3} />
    </NavLink>
  );

  return (
    <>
      <style>
        {`
          @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          .sidebar-link-action:hover:not(.active) { background-color: #f4f4f5; color: #000 !important; }
          .sidebar-link-action:hover .chevron-icon { opacity: 0.8 !important; transform: translateX(2px); }
        `}
      </style>

      <div style={styles.overlay} onClick={closeSidebar}>
        <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <h2 style={styles.title}>
              {mode === 'terminal' && "Content Engine"}
              {mode === 'team' && "Personnel Registry"}
              {mode === 'users' && "Identity Manager"}
              {mode === 'inbox' && "Signal Center"}
              {mode === 'compliance' && "Legal & Safety"}
              {mode === 'settings' && "Admin Account"}
            </h2>
          </div>

          <div style={styles.scrollArea}>
            {/* ✅ TERMINAL MODE */}
            {mode === 'terminal' && (
              <>
                <div style={styles.groupLabel}>Landing Configuration</div>
                <SidebarLink to="/admin/hero" icon={Layout} label="Hero Authority" />
                <SidebarLink to="/admin/features" icon={ImageIcon} label="Feature Control" />

                <div style={styles.groupLabel}>Portfolio & Team Assets</div>
                <SidebarLink to="/admin/portfolio" icon={PlusCircle} label="Manage Portfolio" />
                <SidebarLink to="/admin/team" icon={UsersIcon} label="Manage Team" />
                
                <div style={styles.groupLabel}>Services Hub</div>
                <SidebarLink to="/admin/services" icon={Layers} label="Manage Services" />
                
                <div style={styles.groupLabel}>Blog & Media</div>
                <SidebarLink to="/admin/blog" icon={Edit3} label="Compose Post" />
              </>
            )}

            {/* ✅ TEAM MODE */}
            {mode === 'team' && (
              <>
                <div style={styles.groupLabel}>Staff Management</div>
                <SidebarLink to="/admin/team" icon={UsersIcon} label="Team Registry" />
                <div style={styles.groupLabel}>Access Control</div>
                <SidebarLink to="/admin/users" icon={UserCheck} label="Verification" />
              </>
            )}

            {/* ✅ COMPLIANCE MODE */}
            {mode === 'compliance' && (
              <>
                <div style={styles.groupLabel}>Terms of Service</div>
                <SidebarLink to="/admin/edit-terms" icon={PlusCircle} label="Edit Terms" />
                <div style={styles.groupLabel}>Privacy Policy</div>
                <SidebarLink to="/admin/edit-privacy" icon={RefreshCw} label="Edit Privacy" />
                <div style={styles.groupLabel}>Cookie Policies</div>
                <SidebarLink to="/admin/edit-cookies" icon={ShieldCheck} label="Edit Cookies" />
              </>
            )}

            {/* ✅ INBOX MODE */}
            {mode === 'inbox' && (
              <>
                <div style={styles.groupLabel}>Internal Comms</div>
                <SidebarLink to="/admin/messages" icon={ShieldIcon} label="Admin Messages" />
                <div style={styles.groupLabel}>Public Inquiries</div>
                <SidebarLink to="/admin/messages" icon={UsersIcon} label="From Users" />
              </>
            )}

            {/* ✅ USERS MODE */}
            {mode === 'users' && (
              <>
                <div style={styles.groupLabel}>Registry Control</div>
                <SidebarLink to="/admin/users" icon={Search} label="Identity Registry" />
              </>
            )}

            {/* ✅ SETTINGS MODE */}
            {mode === 'settings' && (
              <>
                <div style={styles.groupLabel}>Identity</div>
                <SidebarLink to="/admin/dashboard" icon={Home} label="Dashboard Home" />
                <SidebarLink to="/admin/profile" icon={UserCircle} label="Edit Profile" /> {/* ✅ Added Admin Profile Link */}
                <div style={styles.groupLabel}>Session Control</div>
                <SidebarLink to="/login" icon={LogOut} label="DROP Session" color="#e11d48" />
              </>
            )}
          </div>

          <div style={styles.footer}>
            <Link to="/home" style={{ color: '#71717a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800' }}>
              <Home size={16} /> <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicSidebar;