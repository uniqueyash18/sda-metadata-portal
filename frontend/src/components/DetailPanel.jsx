import ClassificationBadge from './ClassificationBadge'
import StatusBadge from './StatusBadge'

function fmtCount(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000) return Math.round(n / 1_000) + 'K'
  return String(n)
}

export default function DetailPanel({ dataset, onClose }) {
  if (!dataset) return null

  const {
    id, title, department, sector, formats,
    update_frequency, last_updated, record_count,
    coverage, description, tags, classification, status,
  } = dataset

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
        <button className="detail-close" onClick={onClose} aria-label="Close">×</button>

        <div>
          <div className="detail-id">{id}</div>
          <h2 className="detail-title">{title}</h2>
        </div>

        <p className="detail-desc">{description}</p>

        <div className="detail-section">
          <h3>Details</h3>
          <div className="detail-row">
            <span className="label">Department</span>
            <span className="value">{department}</span>
          </div>
          <div className="detail-row">
            <span className="label">Sector</span>
            <span className="value">{sector}</span>
          </div>
          <div className="detail-row">
            <span className="label">Coverage</span>
            <span className="value">{coverage}</span>
          </div>
          <div className="detail-row">
            <span className="label">Record Count</span>
            <span className="value">{fmtCount(record_count)}</span>
          </div>
          <div className="detail-row">
            <span className="label">Update Frequency</span>
            <span className="value">{update_frequency}</span>
          </div>
          <div className="detail-row">
            <span className="label">Last Updated</span>
            <span className="value">{last_updated}</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Classification &amp; Status</h3>
          <div className="detail-row">
            <span className="label">Classification</span>
            <span className="value"><ClassificationBadge value={classification} /></span>
          </div>
          <div className="detail-row">
            <span className="label">Status</span>
            <span className="value"><StatusBadge value={status} /></span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Formats</h3>
          <div className="card-meta">
            {formats.map(f => (
              <span key={f} className="badge badge-format">{f}</span>
            ))}
          </div>
        </div>

        {tags?.length > 0 && (
          <div className="detail-section">
            <h3>Tags</h3>
            <div className="tag-list">
              {tags.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
