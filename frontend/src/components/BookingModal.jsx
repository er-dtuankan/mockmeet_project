// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/BookingModal.jsx — Step-by-Step Interview Booking
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { getAvailableSlots } from '../services/slot.service';
import { createBooking } from '../services/booking.service';

export default function BookingModal({ interviewer, onClose, onSuccess }) {
  const [step, setStep] = useState('domain'); // domain -> slot -> confirm -> success
  const [selectedDomain, setSelectedDomain] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [meetLink, setMeetLink] = useState('');
  const [error, setError] = useState('');

  // Use interviewer's domains or fallback to all domains if empty
  const interviewerDomains = interviewer.domains && interviewer.domains.length > 0
    ? interviewer.domains
    : ['DSA', 'System Design', 'HR', 'Frontend', 'Backend', 'Machine Learning', 'DevOps', 'DBMS'];

  useEffect(() => {
    const loadSlots = async () => {
      setFetchingSlots(true);
      setError('');
      try {
        const available = await getAvailableSlots(interviewer._id);
        setSlots(available);
      } catch (err) {
        console.error('Failed to load slots:', err);
        setError('Could not load availability slots.');
      } finally {
        setFetchingSlots(false);
      }
    };
    if (interviewer) {
      loadSlots();
    }
  }, [interviewer]);

  const handleBook = async () => {
    if (!selectedSlot || !selectedDomain) return;
    setLoading(true);
    setError('');
    try {
      const booking = await createBooking({
        interviewerId: interviewer._id,
        slotId: selectedSlot._id,
        domain: selectedDomain,
        notes,
      });
      setMeetLink(booking.meetLink);
      setStep('success');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Booking failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="modal-header">
          <div className="modal-interviewer-info">
            <div className="modal-avatar">
              {interviewer.avatar ? <img src={interviewer.avatar} alt={interviewer.name} /> : interviewer.name[0]?.toUpperCase()}
            </div>
            <div>
              <h2>Book Interview Session</h2>
              <h3>with {interviewer.name}</h3>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Step Indicator */}
        {step !== 'success' && (
          <div className="step-indicator">
            <div className={`step ${step === 'domain' ? 'active' : step !== 'domain' ? 'done' : ''}`}>
              <span>1</span> Domain
            </div>
            <div className="step-line" />
            <div className={`step ${step === 'slot' ? 'active' : step === 'confirm' ? 'done' : ''}`}>
              <span>2</span> Slot
            </div>
            <div className="step-line" />
            <div className={`step ${step === 'confirm' ? 'active' : ''}`}>
              <span>3</span> Confirm
            </div>
          </div>
        )}

        {/* Body Content based on active step */}
        <div className="modal-body">
          {error && <div className="auth-error mb-4">{error}</div>}

          {/* STEP 1: Domain Selection */}
          {step === 'domain' && (
            <div>
              <p className="review-subtitle">Select the topic/domain for this mock session:</p>
              <div className="domain-grid mt-4">
                {interviewerDomains.map((d) => (
                  <button
                    key={d}
                    className={`domain-chip ${selectedDomain === d ? 'selected' : ''}`}
                    onClick={() => setSelectedDomain(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn-ghost" onClick={onClose}>Cancel</button>
                <button
                  className="btn-primary"
                  disabled={!selectedDomain}
                  onClick={() => setStep('slot')}
                >
                  Next: Choose Time Slot →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Time Slot Selection */}
          {step === 'slot' && (
            <div>
              <p className="review-subtitle">Available Time Slots:</p>
              {fetchingSlots ? (
                <div className="loading-slots">Loading available slots...</div>
              ) : slots.length === 0 ? (
                <div className="no-slots">
                  <span>📭</span>
                  <p>No available slots matching this interviewer's profile.</p>
                </div>
              ) : (
                <div className="slots-grid mt-4">
                  {slots.map((s) => (
                    <button
                      key={s._id}
                      className={`slot-card ${selectedSlot?._id === s._id ? 'selected' : ''}`}
                      onClick={() => setSelectedSlot(s)}
                    >
                      <span className="slot-date">📅 {formatDate(s.date)}</span>
                      <span className="slot-time">⏰ {s.startTime} - {s.endTime}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setStep('domain')}>← Back</button>
                <button
                  className="btn-primary"
                  disabled={!selectedSlot}
                  onClick={() => setStep('confirm')}
                >
                  Next: Confirm Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm Details */}
          {step === 'confirm' && (
            <div>
              <div className="confirm-card">
                <div className="confirm-row">
                  <span>Topic Domain:</span>
                  <strong>{selectedDomain}</strong>
                </div>
                <div className="confirm-row">
                  <span>Scheduled Date:</span>
                  <strong>{formatDate(selectedSlot.date)}</strong>
                </div>
                <div className="confirm-row">
                  <span>Session Time:</span>
                  <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
                </div>
                <p className="confirm-meet-note">
                  🎥 Google Meet Link will be generated and provided instantly upon confirmation.
                </p>
              </div>

              <div className="form-group mt-4">
                <label>Add Notes/Topic Details (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Tell the interviewer what topics you want to practice or paste a resume link..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                />
              </div>

              <div className="modal-footer">
                <button className="btn-ghost" onClick={() => setStep('slot')}>← Back</button>
                <button
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleBook}
                >
                  {loading ? 'Confirming...' : '✅ Book Session Now'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Screen */}
          {step === 'success' && (
            <div className="success-body">
              <div className="success-icon">🎉</div>
              <h2>Interview Booked!</h2>
              <p>Your mock interview is scheduled and pending acceptance.</p>

              <div className="meet-link-box">
                <span className="font-semibold text-xs uppercase text-gray-400">Meet link:</span>
                <a href={meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                  {meetLink}
                </a>
              </div>
              <p className="success-note">
                You can join directly from this link or access it anytime via "My Bookings" in your dashboard.
              </p>

              <button className="btn-primary mx-auto" onClick={onSuccess}>
                Go to My Bookings
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
