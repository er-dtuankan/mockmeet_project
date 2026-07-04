// ─────────────────────────────────────────────────────────────────────────────
// frontend/src/components/StatsCard.jsx — Reusable Dashboard KPI Widget
// ─────────────────────────────────────────────────────────────────────────────

const COLOR_CLASSES = {
  purple: 'stats-purple',
  blue:   'stats-blue',
  green:  'stats-green',
  orange: 'stats-orange',
  red:    'stats-red',
};

export default function StatsCard({ icon, label, value, color = 'purple' }) {
  const colorClass = COLOR_CLASSES[color] || 'stats-purple';
  return (
    <div className={`stats-card ${colorClass}`}>
      <span className="stats-icon">{icon}</span>
      <div className="stats-value">{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}
