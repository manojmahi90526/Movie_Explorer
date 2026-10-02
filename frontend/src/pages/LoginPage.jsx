import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, Film, Shield, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = ({ onLoginSuccess }) => {
  const { login, register, quickDemoLogin } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegisterMode) {
        const res = await register(formData.name, formData.email, formData.password, formData.role);
        if (res.success) {
          onLoginSuccess?.();
        } else {
          setError(res.message);
        }
      } else {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          onLoginSuccess?.();
        } else {
          setError(res.message);
        }
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role) => {
    setLoading(true);
    setError('');
    const res = await quickDemoLogin(role);
    setLoading(false);
    if (res.success) {
      onLoginSuccess?.();
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      style={{
        maxWidth: '480px',
        margin: '40px auto 80px auto',
        padding: '0 16px',
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '36px',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Film size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '6px' }}>
            {isRegisterMode ? 'Create CineSphere Account' : 'Welcome to CineSphere'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            {isRegisterMode
              ? 'Join to explore films, hero filmographies, and reviews'
              : 'Sign in to access personalized features or admin controls'}
          </p>
        </div>


        {error && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.88rem',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit}>
          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input
                  type="text"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
          </div>

          {isRegisterMode && (
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator (Movie CMS Access)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '1rem' }}
          >
            {loading ? (
              'Authenticating...'
            ) : isRegisterMode ? (
              <>
                <UserPlus size={18} /> Create Account
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#818cf8',
              fontSize: '0.88rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isRegisterMode
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
