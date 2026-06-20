const styles = {
  public: 'badge-public',
  restricted: 'badge-restricted',
  confidential: 'badge-confidential',
}

export default function ClassificationBadge({ value }) {
  const cls = styles[value?.toLowerCase()] || 'badge-format'
  return <span className={`badge ${cls}`}>{value}</span>
}
