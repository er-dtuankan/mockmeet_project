// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/TeacherDashboard.jsx — Teacher Monitoring Center
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudents } from '../services/user.service';
import { getAllBookings } from '../services/booking.service';
import StatsCard from '../components/StatsCard';

export default function TeacherDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Guards
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user && user.role !== 'teacher') {
      navigate('/student/dashboard');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchBookings = async () => {
      setLoadingBookings(true);
      try {
        const data = await getAllBookings();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchStudents();
    fetchBookings();
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Statistics calculation
  const totalStudents = students.length;
  const activeInterviewers = students.filter((s) => s.isInterviewer).length;
  const totalSessions = bookings.length;
  const pendingSessions = bookings.filter((b) => b.status === 'pending').length;

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.college && s.college.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="page-header">
          <h1>Teacher Dashboard 👩‍🏫</h1>
          <p>Monitor student progress, track platform metrics, and verify feedback reviews.</p>
        </div>

        {/* KPIs */}
        <div className="stats-grid">
          <StatsCard icon="👥" label="Total Students" value={totalStudents} color="blue" />
          <StatsCard icon="🎤" label="Active Interviewers" value={activeInterviewers} color="purple" />
          <StatsCard icon="📋" label="Total Sessions" value={totalSessions} color="green" />
          <StatsCard icon="⏳" label="Pending Requests" value={pendingSessions} color="orange" />
        </div>

        {/* Tabs */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            👥 Students ({totalStudents})
          </button>
          <button
            className={`tab-btn ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            📋 All Sessions ({totalSessions})
          </button>
        </div>

        {/* TAB 1: Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Status Breakdown card */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📋 Session Status Distribution</h3>
              {[
                { label: 'Pending Requests', count: pendingSessions, badge: 'status-pending' },
                { label: 'Confirmed Sessions', count: confirmedCount, badge: 'status-confirmed' },
                { label: 'Completed Sessions', count: completedCount, badge: 'status-completed' },
                { label: 'Cancelled/Declined', count: cancelledCount, badge: 'status-cancelled' },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{row.label}</span>
                  <span className={`status-badge ${row.badge}`}>{row.count}</span>
                </div>
              ))}
            </div>

            {/* Top Interviewers ranking */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>🏆 Top Active Interviewers</h3>
              {loadingStudents ? (
                <div className="spinner" />
              ) : students.filter((s) => s.isInterviewer).length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No active interviewers on board.</p>
              ) : (
                students
                  .filter((s) => s.isInterviewer)
                  .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
                  .slice(0, 5)
                  .map((s, idx) => (
                    <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.8rem', width: 20 }}>#{idx + 1}</span>
                      <Link to={`/profile/${s._id}`} style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--accent-light)', flex: 1 }}>
                        {s.name}
                      </Link>
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-orange)' }}>
                        {'★'.repeat(Math.round(s.rating || 0))} {s.rating ? s.rating.toFixed(1) : '—'}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Students List */}
        {activeTab === 'students' && (
          <div>
            <div className="search-bar-wrapper" style={{ maxWidth: 400 }}>
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search students by name or college..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="students-table mt-4">
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>College/University</th>
                    <th>Class Year</th>
                    <th>Status Mode</th>
                    <th>Rating</th>
                    <th>Total Interviews</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center' }}>Loading student list...</td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center' }}>No students match your query.</td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s._id}>
                        <td>
                          <div className="table-user">
                            <div className="table-avatar">
                              {s.avatar ? <img src={s.avatar} alt={s.name} /> : s.name[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.college || '—'}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{s.year || '—'}</td>
                        <td>
                          <span className={`status-badge ${s.isInterviewer ? 'status-confirmed' : 'status-pending'}`}>
                            {s.isInterviewer ? '🎤 Interviewer' : '🎓 Student'}
                          </span>
                        </td>
                        <td style={{ color: 'var(--accent-orange)' }}>
                          {s.rating > 0 ? `${s.rating.toFixed(1)}★` : '—'}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>{s.totalInterviews || 0}</td>
                        <td>
                          <Link to={`/profile/${s._id}`} className="btn-ghost btn-sm">
                            View Profile
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: All Sessions */}
        {activeTab === 'sessions' && (
          <div>
            {loadingBookings ? (
              <div className="spinner" />
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No mock sessions scheduled yet</h3>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <div key={b._id} className="booking-item">
                    <div className="booking-avatar">
                      {b.student.avatar ? <img src={b.student.avatar} alt={b.student.name} /> : b.student.name[0]?.toUpperCase()}
                    </div>
                    <div className="booking-info">
                      <div className="booking-name">
                        <Link to={`/profile/${b.student._id}`} style={{ color: 'var(--accent-light)' }}>{b.student.name}</Link>
                        <span style={{ color: 'var(--text-muted)' }}> requested </span>
                        <Link to={`/profile/${b.interviewer._id}`} style={{ color: 'var(--accent-light)' }}>{b.interviewer.name}</Link>
                      </div>
                      <div className="booking-meta">
                        <span>📅 {formatDate(b.scheduledAt)}</span>
                        <span className="domain-badge badge-blue">{b.domain}</span>
                      </div>
                    </div>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
