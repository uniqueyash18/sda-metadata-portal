import { memo } from 'react'
import ClassificationBadge from './ClassificationBadge'
import StatusBadge from './StatusBadge'

function DatasetCard({ dataset, onClick }) {
  const { title, department, sector, formats, last_updated, classification, status, description } = dataset

  return (
    <div className="dataset-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}
    >
      <div className="card-top">
        <span className="card-title">{title}</span>
        <ClassificationBadge value={classification} />
      </div>
      <div className="card-dept">{department}</div>
      <p className="card-desc">{description}</p>
      <div className="card-meta">
        <span className="badge badge-sector">{sector}</span>
        {formats.map(f => <span key={f} className="badge badge-format">{f}</span>)}
      </div>
      <div className="card-footer">
        <span>Updated: {last_updated}</span>
        <StatusBadge value={status} />
      </div>
    </div>
  )
}

export default memo(DatasetCard)
