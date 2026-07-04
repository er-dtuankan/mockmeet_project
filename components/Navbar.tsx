'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { userProfile, logout, loading } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!userProfile) return '/';
    if (userProfile.role === 'teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">MockMeet</span>
        </Link>

        {/* Desktop nav */}
        <div className="navbar-links">
          {userProfile && (
            <>
              <Link href={getDashboardLink()} className="nav-link">
                Dashboard
              </Link>
              {userProfile.role === 'student' && userProfile.isInterviewer && (
                <Link href="/interviewer/dashboard" className="nav-link">
                  Interviewer Panel
                </Link>
              )}
              {userProfile.role === 'student' && (
                <Link href="/student/dashboard?tab=find" className="nav-link">
                  Find Interviewers
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side */}
        <div className="navbar-right">
          {!loading && (
            <>
              {userProfile ? (
                <div className="navbar-user">
                  <NotificationBell />
                  <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
                    <div className="user-avatar">
                      {userProfile.avatar ? (
                        <img src={userProfile.avatar} alt={userProfile.name} />
                      ) : (
                        <span>{userProfile.name[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <span className="user-name">{userProfile.name.split(' ')[0]}</span>
                    <span className="chevron">{menuOpen ? '▲' : '▼'}</span>
                  </div>
                  {menuOpen && (
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <p className="dropdown-name">{userProfile.name}</p>
                        <p className="dropdown-role">{userProfile.role === 'teacher' ? '👩‍🏫 Teacher' : userProfile.isInterviewer ? '🎤 Student & Interviewer' : '🎓 Student'}</p>
                      </div>
                      <Link href={`/profile/${userProfile.uid}`} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link href={getDashboardLink()} className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        📊 Dashboard
                      </Link>
                      <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link href="/login" className="btn-ghost">Login</Link>
                  <Link href="/register" className="btn-primary">Get Started</Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
