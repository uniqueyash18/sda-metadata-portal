const express = require('express')
const cors = require('cors')
const compression = require('compression')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 8001

app.use(compression())
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }))
app.use(express.json())

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again in a minute.' },
})

app.use('/api/', limiter)

const datasets = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'seed_datasets.json'), 'utf-8')
)

const REQUIRED = ['title', 'department', 'sector', 'formats', 'update_frequency', 'description', 'classification']

function generateId(dept) {
  const prefix = dept.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')
  const count = datasets.filter(d => d.id.startsWith(`UP-${prefix}-`)).length
  return `UP-${prefix}-${String(count + 1).padStart(3, '0')}`
}

app.get('/api/datasets', (req, res) => {
  const { sector, classification, status, search } = req.query
  let results = datasets.slice()

  if (sector) results = results.filter(d => d.sector.toLowerCase() === sector.toLowerCase())
  if (classification) results = results.filter(d => d.classification.toLowerCase() === classification.toLowerCase())
  if (status) results = results.filter(d => d.status.toLowerCase() === status.toLowerCase())

  if (search) {
    const q = search.toLowerCase()
    results = results.filter(d =>
      d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q)
    )
  }

  res.json({ total: results.length, datasets: results })
})

app.get('/api/datasets/:id', (req, res) => {
  const dataset = datasets.find(d => d.id === req.params.id)
  if (!dataset) return res.status(404).json({ error: `No dataset found with id '${req.params.id}'` })
  res.json(dataset)
})

app.post('/api/datasets', (req, res) => {
  const body = req.body
  const errors = []

  REQUIRED.forEach(field => {
    const val = body[field]
    if (val == null) {
      errors.push({ field, message: `'${field}' is required` })
    } else if (field === 'formats') {
      if (!Array.isArray(val) || val.length === 0)
        errors.push({ field, message: "'formats' must have at least one value" })
    } else if (!val.trim()) {
      errors.push({ field, message: `'${field}' cannot be blank` })
    }
  })

  if (errors.length > 0) return res.status(422).json({ error: 'Validation failed', details: errors })

  const entry = {
    id: generateId(body.department),
    title: body.title.trim(),
    department: body.department.trim(),
    sector: body.sector.trim(),
    formats: body.formats,
    update_frequency: body.update_frequency.trim(),
    last_updated: new Date().toISOString().split('T')[0],
    record_count: 0,
    coverage: body.coverage?.trim() || 'State',
    description: body.description.trim(),
    tags: Array.isArray(body.tags) ? body.tags : [],
    classification: body.classification.trim(),
    status: 'Pending Review',
  }

  datasets.push(entry)
  res.status(201).json({ message: 'Dataset registered successfully', id: entry.id, dataset: entry })
})

app.get('/api/sectors', (req, res) => {
  res.json([...new Set(datasets.map(d => d.sector))].sort())
})

app.get('/api/departments', (req, res) => {
  res.json([...new Set(datasets.map(d => d.department))].sort())
})

app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`))
