import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Briefcase, ArrowRight } from 'lucide-react';

const AdminHome = () => {
  return (
    <div className="admin-dashboard-home">
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#111' }}>Dashboard Overview</h1>
        <p style={{ color: '#666' }}>Welcome back, Haimanot. Here is what's happening with Addis Media today.</p>
      </header>

      {/* QUICK STATS CARDS */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={styles.cardLabel}>New Messages</p>
              <h2 style={styles.cardValue}>12</h2>
            </div>
            <MessageSquare color="#e11d48" size={32} />
          </div>
          <Link to="/admin/messages" style={styles.cardLink}>
            View Inbox <ArrowRight size={16} />
          </Link>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={styles.cardLabel}>Legal Policies</p>
              <h2 style={styles.cardValue}>3 Active</h2>
            </div>
            <ShieldCheck color="#e11d48" size={32} />
          </div>
          <Link to="/admin/edit-privacy" style={styles.cardLink}>
            Update Legal <ArrowRight size={16} />
          </Link>
        </div>

        <div style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p style={styles.cardLabel}>Portfolio Items</p>
              <h2 style={styles.cardValue}>24</h2>
            </div>
            <Briefcase color="#e11d48" size={32} />
          </div>
          <Link to="/admin/portfolio" style={styles.cardLink}>
            Manage Work <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardLabel: {
    margin: 0,
    fontSize: '14px',
    color: '#666',
    fontWeight: '500',
  },
  cardValue: {
    margin: '8px 0',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111',
  },
  cardLink: {
    marginTop: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '14px',
    color: '#e11d48',
    textDecoration: 'none',
    fontWeight: '600',
  }
};

export default AdminHome;