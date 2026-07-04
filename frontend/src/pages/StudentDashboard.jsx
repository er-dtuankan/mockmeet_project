// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/StudentDashboard.jsx — Student Workspace Dashboard
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getInterviewers, updateProfile } from '../services/user.service';
import { getStudentBookings } from '../services/booking.service';
import StatsCard from '../components/StatsCard';
import InterviewerCard from '../components/InterviewerCard';
import BookingModal from '../components/BookingModal';
import ReviewModal from '../components/ReviewModal';

const DOMAINS = ['All', 'DSA', 'System Design', 'HR', 'Frontend', 'Backend', 'Machine Learning', 'DevOps', 'DBMS'];
const SPECIALIZATION_DOMAINS = ['DSA', 'System Design', 'HR', 'Frontend', 'Backend', 'Machine Learning', 'DevOps', 'DBMS'];

export default function StudentDashboard() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'find');
  const [interviewers, setInterviewers] = useState([]);
  const [filteredInterviewers, setFilteredInterviewers] = useState([]);
  const [bookings, setBookings] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  
  const [loadingData, setLoadingData] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Settings states
  const [isInterviewer, setIsInterviewer] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [bio, setBio] = useState('');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');

  // Modals state
  const [selectedInterviewer, setSelectedInterviewer] = useState(null);
  const [reviewBooking, setReviewBooking] = useState(null);

  // Guard redirection
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user && user.role === 'teacher') {
      navigate('/teacher/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Sync settings state with current user info
  useEffect(() => {
    if (user) {
      setIsInterviewer(user.isInterviewer || false);
      setSelectedDomains(user.domains || []);
      setBio(user.bio || '');
      setCollege(user.college || '');
      setYear(user.year || '');
    }
  }, [user]);

  // Sync url param
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const loadInterviewersData = async () => {
    setLoadingData(true);
    try {
      const data = await getInterviewers();
      setInterviewers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadBookingsData = async () => {
    setLoadingData(true);
    try {
      const data = await getStudentBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'find') {
      loadInterviewersData();
    } else if (activeTab === 'bookings') {
      loadBookingsData();
    }
  }, [activeTab, user]);

  // Client-side search and tag filtering
  useEffect(() => {
    let list = [...interviewers];
    if (user) {
      list = list.filter((i) => i._id !== user._id); // exclude self
    }
    if (domainFilter !== 'All') {
      list = list.filter((i) => i.domains && i.domains.includes(domainFilter));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.college && i.college.toLowerCase().includes(q))
      );
    }
    setFilteredInterviewers(list);
  }, [interviewers, searchQuery, domainFilter, user]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setUpdatingSettings(true);
    try {
      await updateProfile({
        isInterviewer,
        domains: selectedDomains,
        bio,
        college,
        year,
      });
      await refreshUser();
      alert('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update settings. Please try again.');
    } finally {
      setUpdatingSettings(false);
    }
  };

  const handleDomainCheckbox = (domain) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  if (authLoading || !user) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  // Calculate quick metrics for KPIs
  const totalBooked = bookings.length;
  const upcomingCount = bookings.filter((b) => b.status === 'confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

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
          <h1>Welcome, {user.name}! 🎓</h1>
          <p>Schedule peer mock interviews, swap roles to review, and track metrics.</p>
        </div>

        {/* KPIs */}
        <div className="stats-grid">
          <StatsCard icon="📅" label="Upcoming" value={upcomingCount} color="blue" />
          <StatsCard icon="⏳" label="Pending" value={pendingCount} color="orange" />
          <StatsCard icon="✅" label="Completed" value={completedCount} color="green" />
          <StatsCard icon="⭐" label="Your Rating" value={user.rating > 0 ? `${user.rating.toFixed(1)}★` : '—'} color="purple" />
        </div>

        {/* Tab Bar */}
        <div className="tab-bar">
          <button
            className={`tab-btn ${activeTab === 'find' ? 'active' : ''}`}
            onClick={() => handleTabChange('find')}
          >
            🔍 Find Interviewers
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleTabChange('bookings')}
          >
            📋 My Bookings ({totalBooked})
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => handleTabChange('settings')}
          >
            ⚙️ Account Settings
          </button>
        </div>

        {/* TAB 1: Browse Interviewers */}
        {activeTab === 'find' && (
          <div>
            <div className="search-bar-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search interviewers by name or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-row">
              {DOMAINS.map((d) => (
                <button
                  key={d}
                  className={`filter-chip ${domainFilter === d ? 'active' : ''}`}
                  onClick={() => setDomainFilter(d)}
                >
                  {d}
                </button>
              ))}
            </div>

            {loadingData ? (
              <div className="spinner" />
            ) : filteredInterviewers.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🔍</span>
                <h3>No interviewers found</h3>
                <p>Try clearing filters or adjusting your query terms.</p>
              </div>
            ) : (
              <div className="interviewers-grid">
                {filteredInterviewers.map((i) => (
                  <InterviewerCard
                    key={i._id}
                    interviewer={i}
                    onBook={(iv) => setSelectedInterviewer(iv)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Bookings */}
        {activeTab === 'bookings' && (
          <div>
            {loadingData ? (
              <div className="spinner" />
            ) : bookings.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No mock bookings yet</h3>
                <p>Browse available peer interviewers to lock in your first practice session!</p>
              </div>
            ) : (
              <div className="bookings-list">
                {bookings.map((b) => (
                  <div key={b._id} className="booking-item">
                    <div className="booking-avatar">
                      {b.interviewer.avatar ? <img src={b.interviewer.avatar} alt={b.interviewer.name} /> : b.interviewer.name[0]?.toUpperCase()}
                    </div>
                    <div className="booking-info">
                      <div className="booking-name">{b.interviewer.name}</div>
                      <div className="booking-meta">
                        <span>📅 {formatDate(b.scheduledAt)}</span>
                        <span className={`domain-badge ${b.domain === 'DSA' ? 'badge-blue' : 'badge-purple'}`}>
                          {b.domain}
                        </span>
                      </div>
                      {b.notes && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          📝 Notes: {b.notes}
                        </p>
                      )}

                      <div className="booking-actions">
                        {b.status === 'confirmed' && (
                          <a href={b.meetLink} target="_blank" rel="noopener noreferrer" className="btn-primary btn-sm">
                            🎥 Join Meet
                          </a>
                        )}
                        {b.status === 'completed' && (
                          <button className="btn-outline btn-sm" onClick={() => setReviewBooking(b)}>
                            ⭐ Write Review
                          </button>
                        )}
                      </div>
                    </div>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Account & Interviewer Settings */}
        {activeTab === 'settings' && (
          <form className="settings-card" onSubmit={handleSettingsSubmit}>
            <h3 className="section-title">Profile Settings</h3>

            <div className="form-group">
              <label>College / University</label>
              <input
                type="text"
                className="form-input"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. BITS Pilani"
              />
            </div>

            <div className="form-group">
              <label>Year / Class Batch</label>
              <input
                type="text"
                className="form-input"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 4th Year"
              />
            </div>

            <div className="form-group">
              <label>Bio / Resume Summary</label>
              <textarea
                className="form-textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly state your domains, tech stacks, or internships..."
                maxLength={500}
              />
            </div>

            <div className="toggle-row my-4">
              <div className="toggle-info">
                <h4>🎤 Enable Interviewer Mode</h4>
                <p>Become searchable as an interviewer for peers and allow scheduling.</p>
              </div>
              <button
                type="button"
                className={`toggle ${isInterviewer ? 'on' : ''}`}
                onClick={() => setIsInterviewer(!isInterviewer)}
              />
            </div>

            {isInterviewer && (
              <div className="form-group my-4">
                <label className="mb-2 block">Choose Domains of Expertise</label>
                <div className="flex flex-wrap gap-3">
                  {SPECIALIZATION_DOMAINS.map((domain) => (
                    <label key={domain} className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                      <input
                        type="checkbox"
                        checked={selectedDomains.includes(domain)}
                        onChange={() => handleDomainCheckbox(domain)}
                        className="accent-brand-purple"
                      />
                      {domain}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-fit self-end mt-4" disabled={updatingSettings}>
              {updatingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>

      {/* Booking Modal */}
      {selectedInterviewer && (
        <BookingModal
          interviewer={selectedInterviewer}
          onClose={() => setSelectedInterviewer(null)}
          onSuccess={() => {
            setSelectedInterviewer(null);
            handleTabChange('bookings');
          }}
        />
      )}

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setReviewBooking(null);
            loadBookingsData();
          }}
        />
      )}
    </div>
  );
}
