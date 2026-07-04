// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/AvailabilityCalendar.jsx — Availability Slot Manager
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { createSlot, getMySlots, deleteSlot } from '../services/slot.service';

export default function AvailabilityCalendar() {
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  const loadSlots = async () => {
    setFetching(true);
    try {
      const data = await getMySlots();
      setSlots(data);
    } catch (err) {
      console.error('Failed to load slots:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');

    if (!date || !startTime || !endTime) {
      setError('All fields are required.');
      return;
    }
    if (startTime >= endTime) {
      setError('Start time must be before end time.');
      return;
    }

    setLoading(true);
    try {
      const newSlot = await createSlot({ date, startTime, endTime });
      setSlots((prev) => [...prev, newSlot].sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)));
      setDate('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add slot.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) return;
    try {
      await deleteSlot(slotId);
      setSlots((prev) => prev.filter((s) => s._id !== slotId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete slot.');
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="availability-calendar">
      <h3 className="section-title">📅 Set Availability Slots</h3>

      {/* Form */}
      <form className="slot-form" onSubmit={handleAdd}>
        <div className="slot-form-fields">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Start Time</label>
            <input
              type="time"
              className="form-input"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              className="form-input"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : '+ Add Slot'}
          </button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </form>

      {/* Listing Slots */}
      <div className="slots-list">
        <h4 className="slots-list-title">Your Availability Slots ({slots.length})</h4>

        {fetching ? (
          <div className="loading-slots">Loading your slots...</div>
        ) : slots.length === 0 ? (
          <div className="no-slots">
            <span>📭</span>
            <p>No availability slots set yet. Use the form above to add some!</p>
          </div>
        ) : (
          slots.map((slot) => (
            <div key={slot._id} className={`slot-item ${slot.isBooked ? 'booked opacity-60' : 'available'}`}>
              <div className="slot-item-info">
                <span className="slot-item-date">📅 {formatDate(slot.date)}</span>
                <span className="slot-item-time">⏰ {slot.startTime} - {slot.endTime}</span>
              </div>
              <div className="slot-item-right">
                <span className={`slot-status-badge ${slot.isBooked ? 'booked' : 'available'}`}>
                  {slot.isBooked ? '🔒 Booked' : '✅ Available'}
                </span>
                {!slot.isBooked && (
                  <button
                    className="btn-danger-sm ml-2"
                    type="button"
                    onClick={() => handleDelete(slot._id)}
                    title="Delete Slot"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
