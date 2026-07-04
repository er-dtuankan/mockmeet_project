// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/Navbar.jsx — Persistent App Navigation Bar
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Scroll handler for navbar background transparency/blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dropdown click outside close handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">MockMeet</span>
        </Link>

        {user && (
          <div className="navbar-links">
            {user.role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  className={`nav-link ${location.pathname === '/student/dashboard' ? 'active' : ''}`}
                >
                  🎓 Student Panel
                </Link>
                {user.isInterviewer && (
                  <Link
                    to="/interviewer/dashboard"
                    className={`nav-link ${location.pathname === '/interviewer/dashboard' ? 'active' : ''}`}
                  >
                    🎤 Interviewer Panel
                  </Link>
                )}
              </>
            )}
            {user.role === 'teacher' && (
              <Link
                to="/teacher/dashboard"
                className={`nav-link ${location.pathname === '/teacher/dashboard' ? 'active' : ''}`}
              >
                👩‍🏫 Teacher Panel
              </Link>
            )}
          </div>
        )}

        <div className="navbar-right">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <NotificationBell />

              <div className="navbar-user" ref={dropdownRef}>
                <div className="user-menu" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="user-avatar">
                    {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name[0]?.toUpperCase()}
                  </div>
                  <span className="user-name hidden sm:inline">{user.name.split(' ')[0]}</span>
                  <span className="chevron">▼</span>
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-role">
                        {user.role === 'teacher' ? 'Teacher' : user.isInterviewer ? 'Interviewer & Student' : 'Student'}
                      </div>
                    </div>
                    <Link
                      to={`/profile/${user._id}`}
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Public Profile
                    </Link>
                    {user.role === 'student' && (
                      <Link
                        to="/student/dashboard?tab=settings"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ⚙️ Settings
                      </Link>
                    )}
                    <button onClick={handleLogout} className="dropdown-item dropdown-logout">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
