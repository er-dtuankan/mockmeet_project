// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/ReviewModal.jsx — Feedback Form Modal
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { submitReview } from '../services/review.service';

export default function ReviewModal({ booking, onClose, onSuccess }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Identify who is being reviewed based on the logged-in role
  const isStudent = user._id === booking.student._id;
  const revieweeId = isStudent ? booking.interviewer._id : booking.student._id;
  const revieweeName = isStudent ? booking.interviewer.name : booking.student.name;
  const role = isStudent ? 'student' : 'interviewer';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      setError('Please provide a rating and a comment.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await submitReview({
        bookingId: booking._id,
        revieweeId,
        rating,
        comment,
        role,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {submitted ? (
          <div className="modal-body success-body">
            <div className="success-icon">⭐</div>
            <h3>Review Submitted!</h3>
            <p>Thank you for sharing your feedback with the MockMeet community.</p>
            <button className="btn-primary mx-auto" onClick={onSuccess}>Done</button>
          </div>
        ) : (
          <form className="modal-body" onSubmit={handleSubmit}>
            {error && <div className="auth-error mb-4">{error}</div>}
            <p className="review-subtitle">
              How was your mock session with <strong>{revieweeName}</strong>?
            </p>

            {/* Star Picker */}
            <div className="form-group my-4">
              <label>Rating *</label>
              <div className="star-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= (hoveredRating || rating) ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="rating-label">
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
                </p>
              )}
            </div>

            {/* Comments Input */}
            <div className="form-group">
              <label>Comment Feedback *</label>
              <textarea
                className="form-input"
                rows={4}
                maxLength={500}
                placeholder="Share your experience — what went well, what could be improved..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <div className="char-count">{comment.length}/500</div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
              <button
                type="submit"
                className="btn-primary"
                disabled={rating === 0 || !comment.trim() || loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
