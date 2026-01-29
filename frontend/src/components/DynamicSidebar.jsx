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
    header: { padding: '24px 20px', borderBottom: '1px solid #f4f4f5' },
    modeTag: {
      display: 'inline-block',
      padding: '2px 8px',
      backgroundColor: 'rgba(225, 29, 72, 0.08)',
      color: '#e11d48',
      fontSize: '10px',
      fontWeight: '800',
      borderRadius: '4px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '8px'
    },
    title: { fontSize: '18px', fontWeight: '800', color: '#09090b', margin: 0 },
    scrollArea: { flex: 1, overflowY: 'auto', padding: '20px 12px' },
    groupLabel: {
      fontSize: '11px',
      fontWeight: '600',
      color: '#a1a1aa',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      margin: '24px 0 8px 12px',
    },
    navItem: {
      textDecoration: 'none',
      color: '#3f3f46',
      padding: '10px 12px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '4px',
      transition: 'all 0.15s ease',
    },
    active: {
      backgroundColor: '#f4f4f5',
      color: '#09090b',
      fontWeight: '700',
      boxShadow: 'inset 4px 0 0 #e11d48',
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
        <Icon size={18} strokeWidth={2} color={color || 'inherit'} />
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
          .sidebar-link-action:hover { background-color: #f4f4f5; color: #000 !important; }
          .sidebar-link-action:hover .chevron-icon { opacity: 0.8 !important; transform: translateX(2px); }
        `}
      </style>

      <div style={styles.overlay} onClick={closeSidebar}>
        <div style={styles.sidebar} onClick={(e) => e.stopPropagation()}>
          <div style={styles.header}>
            <div style={styles.modeTag}>{mode} Authority</div>
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
            {/* ✅ TERMINAL MODE - UPDATED */}
            {mode === 'terminal' && (
              <>
                <div style={styles.groupLabel}>Landing Configuration</div>
                <SidebarLink to="/admin/hero" icon={Layout} label="Hero Authority" />
                <SidebarLink to="/admin/features" icon={ImageIcon} label="Feature Control" />

                <div style={styles.groupLabel}>Portfolio & Team Assets</div>
                <SidebarLink to="/admin/portfolio" icon={PlusCircle} label="Manage Portfolio" />
                {/* Team link added here so it's visible in Terminal mode */}
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
                <SidebarLink to="/admin/dashboard" icon={UserCircle} label="Dashboard Home" />
                <div style={styles.groupLabel}>Session Control</div>
                <SidebarLink to="/login" icon={LogOut} label="DROP Session" color="#e11d48" />
              </>
            )}
          </div>

          <div style={styles.footer}>
            <Link to="/home" style={{ color: '#71717a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700' }}>
              <Home size={16} /> <span>EXIT TO PUBLIC SITE</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicSidebar;