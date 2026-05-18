import { Link, NavLink, useNavigate, Outlet, useOutletContext } from 'react-router-dom';
import { useState } from 'react';

const AdminLayout = () => {
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to sign out of the Admin Panel?')) {
      setLoggingOut(true);
      try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        if (response.ok) {
          navigate('/admin/login', { replace: true });
        } else {
          alert('Failed to log out. Please try again.');
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
      } finally {
        setLoggingOut(false);
      }
    }
  };

  return (
    <div className="admin-page-container">
      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <aside className="admin-sidebar" role="complementary" aria-label="Admin Sidebar">
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-brand-link">
            <span className="brand-logo-accent">VIAN</span>
            <span className="brand-logo-text">GLOBAL</span>
          </Link>
          <div className="admin-panel-badge">NEWS ADMIN</div>
        </div>

        <nav className="admin-nav" role="navigation" aria-label="Admin Navigation">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/articles"
            end
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📰</span>
            <span className="nav-text">Articles</span>
          </NavLink>

          <NavLink
            to="/admin/articles/new"
            className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">✍️</span>
            <span className="nav-text">Create Article</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="user-avatar">{user.username[0].toUpperCase()}</div>
            <div className="user-meta-details">
              <span className="user-username">{user.username}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span className="nav-icon">🚪</span>
            <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ───────────────────────────── */}
      <main className="admin-main-content" role="main">
        <header className="admin-top-bar">
          <div className="admin-section-breadcrumbs">
            <span>Admin</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">Management</span>
          </div>
          <div className="admin-system-status">
            <span className="status-pulse" />
            <span className="status-label">Database Connected</span>
          </div>
        </header>

        <div className="admin-content-inner">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
