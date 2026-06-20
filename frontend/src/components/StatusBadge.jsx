export default function StatusBadge({ value }) {
  const cls = value === 'Registered' ? 'badge-registered' : 'badge-pending'
  return <span className={`badge ${cls}`}>{value}</span>
}
