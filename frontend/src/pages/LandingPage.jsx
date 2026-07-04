// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/LandingPage.jsx — Public Landing Page
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '🤝', title: 'Peer-to-Peer Practice', desc: 'Connect with students who have successfully cleared real tech interviews. Swap roles anytime.' },
  { icon: '📅', title: 'Insta-Scheduling', desc: 'Browse available slots and book immediately. Simulated Google Meet links are generated instantly.' },
  { icon: '⭐', title: 'Double-Sided Reviews', desc: 'Both parties rate and review each other to build reputation and actionable feedback loops.' },
  { icon: '👩‍🏫', title: 'Teacher Supervision', desc: 'Teachers monitor engagement metrics, platform health, and total booking metrics.' },
  { icon: '🔔', title: 'System Alerts', desc: 'Real-time notification bell alerts you when bookings are updated or new reviews are left.' },
  { icon: '🎓', title: 'Resume Builder', desc: 'Top active mock interviewers gain profile visibility and ratings to display on their portfolios.' }
];

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  }, [user, navigate]);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🚀 Empowering Peer Learning</div>
          <h1 className="hero-title">
            Master Mock Interviews With <span className="hero-gradient">MockMeet</span>
          </h1>
          <p className="hero-sub">
            Schedule practice interview sessions with peers, generate mock meet links, swap roles to review each other, and track progress together.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Get Started Free →</Link>
            <Link to="/login" className="btn-ghost">Sign In</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">100%</div>
              <div className="hero-stat-label">Secure & Free</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">500+</div>
              <div className="hero-stat-label">Users Joined</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">4.9★</div>
              <div className="hero-stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="content-wrapper">
          <div className="section-header">
            <h2>Platform <span className="hero-gradient">Features</span></h2>
            <p>A comprehensive mock interview toolset designed for students and teachers.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <span className="feature-icon">{f.icon}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="content-wrapper">
          <div className="section-header">
            <h2>How It <span className="hero-gradient">Works</span></h2>
            <p>From zero to your first practice mock interview session in minutes.</p>
          </div>
          <div className="steps-row">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Register</h4>
              <p>Sign up as a Student or Teacher. Toggle Interviewer Mode at will.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Browse & Book</h4>
              <p>Select interviewers, choose available times, specify notes, and confirm.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Interview</h4>
              <p>Join the generated Meet link, discuss topics, mock code, and practice.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h4>Review</h4>
              <p>Leave feedback ratings. Accumulate reviews and build your credibility.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} MockMeet. Built in standard production architecture.</p>
      </footer>
    </>
  );
}
