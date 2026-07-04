// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/InterviewerDashboard.jsx — Interviewer Panel Workspace
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInterviewerBookings, updateBookingStatus } from '../services/booking.service';
import { getReviewsForUser } from '../services/review.service';
import StatsCard from '../components/StatsCard';
import AvailabilityCalendar from '../components/AvailabilityCalendar';

export default function InterviewerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('requests');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  
  const [loadingData, setLoadingData] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  // Guards
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user && !user.isInterviewer) {
      navigate('/student/dashboard');
    }
  }, [user, authLoading, navigate]);

  const loadBookingsData = async () => {
    setLoadingData(true);
    try {
      const data = await getInterviewerBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadReviewsData = async () => {
    if (!user) return;
    setLoadingReviews(true);
    try {
      const data = await getReviewsForUser(user._id);
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'requests' || activeTab === 'upcoming') {
      loadBookingsData();
    } else if (activeTab === 'reviews') {
      loadReviewsData();
    }
  }, [activeTab, user]);

  const handleAction = async (bookingId, newStatus) => {
    setActionLoading(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      await loadBookingsData(); // reload
    } catch (err) {
      console.error(err);
      alert('Failed to update session status.');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading Panel...</p>
      </div>
    );
  }

  // Segmenting bookings list
  const pending = bookings.filter((b) => b.status === 'pending');
  const confirmed = bookings.filter((b) => b.status === 'confirmed');
  const completed = bookings.filter((b) => b.status === 'completed');

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
          <h1>Interviewer panel 🎤</h1>
          <p>Configure availability slots, accept peer requests, and see feedback ratings.</p>
        </div>

        {/* KPIs */}
        <div className="stats-grid">
          <StatsCard icon="📥" label="Pending Requests" value={pending.length} color="orange" />
          <StatsCard icon="📅" label="Confirmed" value={confirmed.length} color="blue" />
          <StatsCard icon="🏆" label="Completed Sessions" value={completed.length} color="green" />
          <StatsCard icon="⭐" label="Interviewer Rating" value={user.rating > 0 ? `${user.rating.toFixed(1)}★` : '—'} color="purple" />
        </div>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            📥 Requests ({pending.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming ({confirmed.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'availability' ? 'active' : ''}`}
            onClick={() => setActiveTab('availability')}
          >
            🗓️ Availability
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Reviews ({reviews.length})
          </button>
        </div>

        {/* TAB 1: Requests */}
        {activeTab === 'requests' && (
          <div>
            {loadingData ? (
              <div className="spinner" />
            ) : pending.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No pending interview requests</h3>
                <p>New booking requests will appear here for you to accept or decline.</p>
              </div>
            ) : (
              <div className="bookings-list">
                {pending.map((b) => (
                  <div key={b._id} className="booking-item">
                    <div className="booking-avatar">
                      {b.student.avatar ? <img src={b.student.avatar} alt={b.student.name} /> : b.student.name[0]?.toUpperCase()}
                    </div>
                    <div className="booking-info">
                      <div className="booking-name">{b.student.name}</div>
                      <div className="booking-meta">
                        <span>📅 {formatDate(b.scheduledAt)}</span>
                        <span className="domain-badge badge-blue">{b.domain}</span>
                      </div>
                      {b.notes && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          📝 Notes: {b.notes}
                        </p>
                      )}

                      <div className="booking-actions">
                        <button
                          className="btn-primary btn-sm"
                          onClick={() => handleAction(b._id, 'confirmed')}
                          disabled={actionLoading === b._id}
                        >
                          Accept request
                        </button>
                        <button
                          className="btn-ghost btn-sm"
                          onClick={() => handleAction(b._id, 'cancelled')}
                          disabled={actionLoading === b._id}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                    <span className="status-badge status-pending">Pending</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Upcoming confirmed sessions */}
        {activeTab === 'upcoming' && (
          <div>
            {loadingData ? (
              <div className="spinner" />
            ) : confirmed.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📅</span>
                <h3>No upcoming sessions</h3>
                <p>Accept pending requests or set more availability slots to lock in sessions!</p>
              </div>
            ) : (
              <div className="bookings-list">
                {confirmed.map((b) => (
                  <div key={b._id} className="booking-item">
                    <div className="booking-avatar">
                      {b.student.avatar ? <img src={b.student.avatar} alt={b.student.name} /> : b.student.name[0]?.toUpperCase()}
                    </div>
                    <div className="booking-info">
                      <div className="booking-name">{b.student.name}</div>
                      <div className="booking-meta">
                        <span>📅 {formatDate(b.scheduledAt)}</span>
                        <span className="domain-badge badge-blue">{b.domain}</span>
                      </div>
                      {b.notes && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          📝 Notes: {b.notes}
                        </p>
                      )}

                      <div className="booking-actions">
                        <a href={b.meetLink} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                          🎥 Join Meet
                        </a>
                        <button
                          className="btn-outline btn-sm"
                          onClick={() => handleAction(b._id, 'completed')}
                          disabled={actionLoading === b._id}
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                    <span className="status-badge status-confirmed">Confirmed</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Availability */}
        {activeTab === 'availability' && <AvailabilityCalendar />}

        {/* TAB 4: Reviews Received */}
        {activeTab === 'reviews' && (
          <div>
            {loadingReviews ? (
              <div className="spinner" />
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⭐</span>
                <h3>No reviews received yet</h3>
                <p>Complete mock interview sessions to start receiving ratings and reviews!</p>
              </div>
            ) : (
              <div className="reviews-section">
                {reviews.map((r) => (
                  <div key={r._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">
                        {r.reviewer.avatar ? <img src={r.reviewer.avatar} alt={r.reviewer.name} /> : r.reviewer.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="reviewer-name">{r.reviewer.name}</div>
                        <div className="review-date">{new Date(r.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', color: 'var(--accent-orange)', fontWeight: 700 }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <p className="review-comment">"{r.comment}"</p>
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
