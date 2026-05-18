import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(true);
  const navigate = useNavigate();

  // Redirect instantly if the admin is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          navigate('/admin', { replace: true });
        }
      } catch (err) {
        console.error('Session verify error:', err);
      } finally {
        setIsVerifying(false);
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        navigate('/admin', { replace: true });
      } else {
        // Handle rate limiting specifically
        if (response.status === 429) {
          setError('Too many failed attempts. Login locked for 15 minutes for your IP.');
        } else {
          setError(data.message || 'Invalid username or password.');
        }
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError('A connection error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="login-page-wrapper">
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-background-glow" />
      
      <div className="login-card-glass">
        <div className="login-card-header">
          <div className="login-logo">
            <span className="logo-accent">VIAN</span>
            <span className="logo-main">GLOBAL</span>
          </div>
          <h1 className="login-title">Control Panel</h1>
          <p className="login-subtitle">Sign in to manage news articles and blog publications</p>
        </div>

        {error && (
          <div className="login-error-alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span className="alert-message">{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group-glass">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group-glass">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="login-submit-btn-premium" 
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="btn-spinner" />
                Authenticating...
              </span>
            ) : (
              'Secure Sign In'
            )}
          </button>
        </form>

        <div className="login-card-footer">
          <span>Protected Session (SSL Encrypted)</span>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
