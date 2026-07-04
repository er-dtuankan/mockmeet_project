// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/ProfilePage.jsx — User Public Profile View
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicProfile } from '../services/user.service';
import { getReviewsForUser } from '../services/review.service';

const DOMAIN_COLORS = {
  'DSA': 'badge-blue',
  'System Design': 'badge-purple',
  'HR': 'badge-green',
  'Frontend': 'badge-orange',
  'Backend': 'badge-red',
  'Machine Learning': 'badge-indigo',
  'DevOps': 'badge-teal',
  'DBMS': 'badge-yellow',
};

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const loadProfileData = async () => {
      setLoading(true);
      setError('');
      try {
        const [profData, revData] = await Promise.all([
          getPublicProfile(id),
          getReviewsForUser(id),
        ]);
        setProfile(profData);
        setReviews(revData);
      } catch (err) {
        console.error(err);
        setError('User profile not found.');
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
        <p>Loading Profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-loading">
        <p style={{ color: 'var(--text-muted)' }}>{error || 'User not found.'}</p>
      </div>
    );
  }

  const isOwnProfile = currentUser && currentUser._id === id;

  return (
    <div className="page-container">
      <div style={{ padding: '0 0 60px' }}>
        <div className="profile-cover">
          <div className="profile-avatar-wrap">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} />
            ) : (
              profile.name[0]?.toUpperCase()
            )}
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Main Info Column */}
          <div>
            <div className="profile-main">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div>
                  <h1 className="profile-name">{profile.name}</h1>
                  {profile.college && (
                    <p className="profile-college">
                      🎓 {profile.college} {profile.year ? `• ${profile.year}` : ''}
                    </p>
                  )}
                </div>
                {isOwnProfile ? (
                  <Link to="/student/dashboard?tab=settings" className="btn-ghost btn-sm">
                    ✏️ Edit Profile
                  </Link>
                ) : (
                  profile.isInterviewer && (
                    <Link to="/student/dashboard?tab=find" className="btn-primary btn-sm">
                      📅 Book Session
                    </Link>
                  )
                )}
              </div>

              {profile.bio && <p className="profile-bio">{profile.bio}</p>}

              <div style={{ display: 'flex', gap: 8, marginTop: '1rem', flexWrap: 'wrap' }}>
                <span className="domain-badge badge-gray">
                  {profile.role === 'teacher' ? '👩‍🏫 Teacher' : '🎓 Student'}
                </span>
                {profile.isInterviewer && <span className="domain-badge badge-purple">🎤 Interviewer</span>}
              </div>

              {profile.domains && profile.domains.length > 0 && (
                <div className="card-domains" style={{ marginTop: '1rem' }}>
                  {profile.domains.map((d) => (
                    <span key={d} className={`domain-badge ${DOMAIN_COLORS[d] || 'badge-gray'}`}>
                      {d}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats KPIs */}
              <div className="profile-stats-row">
                <div className="profile-stat">
                  <div className="profile-stat-value">{profile.totalInterviews || 0}</div>
                  <div className="profile-stat-label">Mock Interviews</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{profile.rating > 0 ? profile.rating.toFixed(1) : '—'}</div>
                  <div className="profile-stat-label">Rating</div>
                </div>
                <div className="profile-stat">
                  <div className="profile-stat-value">{profile.reviewCount || 0}</div>
                  <div className="profile-stat-label">Reviews</div>
                </div>
              </div>
            </div>

            {/* Review Cards List */}
            <div style={{ marginTop: '2rem' }}>
              <h2 style={{ fontWeight: 700, marginBottom: '1rem' }}>Reviews Received ({reviews.length})</h2>
              {reviews.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">⭐</span>
                  <h3>No reviews yet</h3>
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
          </div>

          {/* Quick Info Sidebar */}
          <div style={{ position: 'sticky', top: '84px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Info Summary</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {profile.college && <div>🏫 {profile.college}</div>}
                {profile.year && <div>📅 {profile.year}</div>}
                <div>📅 Joined {new Date(profile.createdAt).toLocaleDateString([], { month: 'long', year: 'numeric' })}</div>
              </div>
              {profile.isInterviewer && !isOwnProfile && (
                <Link to="/student/dashboard?tab=find" className="btn-primary w-full justify-center mt-4">
                  📅 Book a Mock Session
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
