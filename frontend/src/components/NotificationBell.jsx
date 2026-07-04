// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/NotificationBell.jsx — Notification Bell Dropdown
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markAllNotificationsRead } from '../services/notification.service';

export default function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unread = notifications.filter((n) => !n.read).length;

  const fetchNotifs = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      try {
        await markAllNotificationsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      } catch (err) {
        console.error('Failed to mark notifications read:', err);
      }
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'booking_request':
        return '📥';
      case 'booking_confirmed':
        return '✅';
      case 'booking_cancelled':
        return '❌';
      case 'booking_completed':
        return '🏁';
      case 'review_received':
        return '⭐';
      default:
        return '🔔';
    }
  };

  return (
    <div className="notif-wrapper" ref={dropdownRef}>
      <button className="notif-bell" onClick={handleOpen} title="Notifications">
        🔔
        {unread > 0 && <span className="notif-badge">{unread}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h4>Notifications</h4>
            <span className="notif-count">{unread} unread</span>
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span>📭</span>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className={`notif-item ${!n.read ? 'notif-unread' : ''}`}>
                  <span className="notif-icon">{getNotifIcon(n.type)}</span>
                  <div className="notif-text">
                    <p>{n.message}</p>
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
