// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/pages/RegisterPage.jsx — User Registration Page
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [college, setCollege] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register({ name, email, password, role, college, year });
      // navigation handled by useEffect
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <span className="auth-logo-text">MockMeet</span>
          </div>
          <h1>Create Your Account 🚀</h1>
          <p>Join MockMeet to start peer mock interviewing and grow your coding profile stats.</p>
          <ul className="auth-features">
            <li><span>✓</span> Dual registration path for Students & Teachers</li>
            <li><span>✓</span> Zero-config custom Mongoose database storage</li>
            <li><span>✓</span> Fully structured MongoDB schemas</li>
          </ul>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container py-8">
          <h2>Create Free Account</h2>
          <p className="auth-subtitle">Get started with your mock interview prep.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="form-group">
              <label>Select Role *</label>
              <div className="role-selector">
                <div
                  className={`role-option ${role === 'student' ? 'selected' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <span className="role-icon">🎓</span>
                  <div className="role-name">Student</div>
                  <div className="role-desc">Practice & review sessions</div>
                </div>
                <div
                  className={`role-option ${role === 'teacher' ? 'selected' : ''}`}
                  onClick={() => setRole('teacher')}
                >
                  <span className="role-icon">👩‍🏫</span>
                  <div className="role-name">Teacher</div>
                  <div className="role-desc">Monitor student activities</div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {role === 'student' && (
              <>
                <div className="form-group">
                  <label>College / University</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Stanford University"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Year / Class Batch</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 3rd Year (Class of 2027)"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
              </>
            )}

            <button type="submit" className="btn-primary w-full mt-4 justify-center" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
