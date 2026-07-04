// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/InterviewerCard.jsx — Card Component for Browsing
// ─────────────────────────────────────────────────────────────────────────────

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

export default function InterviewerCard({ interviewer, onBook }) {
  const { name, avatar, rating, reviewCount, domains, college, year, bio, totalInterviews } = interviewer;

  // Generate star string rating representations
  const renderStars = () => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= roundedRating ? 'filled text-[#f59e0b]' : 'text-gray-600'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="interviewer-card">
      <div className="card-header">
        <div className="card-avatar">
          {avatar ? <img src={avatar} alt={name} /> : name[0]?.toUpperCase()}
          <span className="online-dot"></span>
        </div>
        <div className="card-info">
          <h3 className="card-name">{name}</h3>
          {college && (
            <p className="card-college">
              🎓 {college} {year ? `(${year})` : ''}
            </p>
          )}
          <div className="star-rating">
            {renderStars()}
            <span className="rating-text">
              {rating > 0 ? `${rating.toFixed(1)} (${reviewCount} reviews)` : 'No ratings'}
            </span>
          </div>
        </div>
      </div>

      <div className="card-stats">
        <div className="stat-pill">
          <span>🎤</span> {totalInterviews || 0} interviews given
        </div>
      </div>

      {bio && <p className="card-bio" title={bio}>{bio}</p>}

      {domains && domains.length > 0 && (
        <div className="card-domains">
          {domains.map((d) => (
            <span key={d} className={`domain-badge ${DOMAIN_COLORS[d] || 'badge-gray'}`}>
              {d}
            </span>
          ))}
        </div>
      )}

      <div className="card-actions mt-auto">
        <button className="btn-primary" onClick={() => onBook(interviewer)}>
          📅 Book Mock Session
        </button>
      </div>
    </div>
  );
}
