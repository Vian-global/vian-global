import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminGuard = () => {
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();

        if (response.ok && data.authenticated) {
          setAuthState({
            loading: false,
            authenticated: true,
            user: data.user,
          });
        } else {
          setAuthState({
            loading: false,
            authenticated: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        setAuthState({
          loading: false,
          authenticated: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, []);

  if (authState.loading) {
    // Beautiful Glassmorphic Loader
    return (
      <div className="admin-loading-screen">
        <div className="admin-loader-container">
          <div className="admin-spinner" />
          <p className="admin-loading-text">Verifying Admin Session...</p>
        </div>
      </div>
    );
  }

  if (!authState.authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet context={{ user: authState.user }} />;
};

export default AdminGuard;
