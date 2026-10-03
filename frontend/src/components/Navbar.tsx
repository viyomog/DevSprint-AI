import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Terminal, LayoutDashboard, FileText, PlayCircle, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      background: 'rgba(17, 17, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '0.45rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={22} color="var(--primary)" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Dev<span style={{ color: 'var(--primary)' }}>Sprint</span></span>
            <span style={{ fontSize: '0.72rem', padding: '0.1rem 0.4rem', background: 'rgba(16, 185, 129, 0.18)', color: 'var(--primary)', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)', fontWeight: 700, letterSpacing: '0.04em' }}>AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/dashboard" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.2s'
            }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>

            <Link to="/resume" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/resume') ? 'var(--primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.2s'
            }}>
              <FileText size={16} /> Resume
            </Link>

            <Link to="/create-interview" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: isActive('/create-interview') ? 'var(--primary)' : 'var(--text-secondary)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'color 0.2s'
            }}>
              <PlayCircle size={16} /> Mock Interview
            </Link>

            {/* Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>
              <Link to="/profile" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.85rem',
                color: isActive('/profile') ? 'var(--primary)' : 'var(--text-main)',
                background: isActive('/profile') ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                padding: '0.35rem 0.75rem',
                borderRadius: '20px',
                border: `1px solid ${isActive('/profile') ? 'var(--primary)' : 'var(--border-color)'}`,
                textDecoration: 'none',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}>
                <UserIcon size={14} color="var(--primary)" />
                {user.full_name.split(' ')[0]}
              </Link>

              <button onClick={handleLogout} className="hm-btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}>
                <LogOut size={14} /> Exit
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/login" className="hm-btn-secondary" style={{ textDecoration: 'none' }}>
              Sign In
            </Link>
            <Link to="/register" className="hm-btn-primary" style={{ textDecoration: 'none' }}>
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
