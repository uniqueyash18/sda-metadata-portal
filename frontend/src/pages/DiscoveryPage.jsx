import { useState, useEffect, useCallback } from 'react'
import { datasetService, metaService } from '../services/api'
import DatasetCard from '../components/DatasetCard'
import DetailPanel from '../components/DetailPanel'

export default function DiscoveryPage() {
  const [datasets, setDatasets] = useState([])
  const [sectors, setSectors] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(null)

  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('')
  const [classification, setClassification] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const filters = {}
    if (search) filters.search = search
    if (sector) filters.sector = sector
    if (classification) filters.classification = classification

    const { data } = await datasetService.list(filters)
    setDatasets(data.datasets)
    setTotal(data.total)
    setLoading(false)
  }, [search, sector, classification])

  useEffect(() => {
    metaService.sectors().then(({ data }) => setSectors(data)).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  return (
    <>
      <div className="page-wrapper">
        <div className="page-header">
          <h1>Dataset Discovery Portal</h1>
          <p>Browse and explore datasets registered by Uttar Pradesh government departments.</p>
        </div>

        <div className="filter-bar">
          <div className="filter-group search-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Sector</label>
            <select value={sector} onChange={e => setSector(e.target.value)}>
              <option value="">All Sectors</option>
              {sectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="filter-group">
            <label>Classification</label>
            <select value={classification} onChange={e => setClassification(e.target.value)}>
              <option value="">All</option>
              <option value="Public">Public</option>
              <option value="Restricted">Restricted</option>
              <option value="Confidential">Confidential</option>
            </select>
          </div>
        </div>

        {!loading && (
          <p className="results-count">
            Showing <strong>{total}</strong> dataset{total !== 1 ? 's' : ''}
            {sector && ` in ${sector}`}
            {classification && ` · ${classification}`}
          </p>
        )}

        {loading ? (
          <p style={{ color: '#888', padding: '40px 0' }}>Loading datasets...</p>
        ) : datasets.length === 0 ? (
          <div className="empty-state">
            <h3>No datasets found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="dataset-grid">
            {datasets.map(d => (
              <DatasetCard key={d.id} dataset={d} onClick={() => setActive(d)} />
            ))}
          </div>
        )}
      </div>

      {active && <DetailPanel dataset={active} onClose={() => setActive(null)} />}
    </>
  )
}
