import { useState, useEffect } from 'react'
import { datasetService, metaService } from '../services/api'

const FORMAT_OPTIONS = ['CSV', 'XLSX', 'JSON', 'API', 'PDF', 'GeoJSON']

const emptyForm = {
  title: '',
  department: '',
  sector: '',
  formats: [],
  update_frequency: '',
  coverage: '',
  description: '',
  classification: '',
  tags: '',
}

export default function RegistrationPage() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [sectors, setSectors] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    metaService.sectors().then(({ data }) => setSectors(data)).catch(() => {})
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function toggleFormat(fmt) {
    setForm(prev => ({
      ...prev,
      formats: prev.formats.includes(fmt)
        ? prev.formats.filter(f => f !== fmt)
        : [...prev.formats, fmt],
    }))
    if (errors.formats) setErrors(prev => ({ ...prev, formats: '' }))
  }

  function validate() {
    const required = ['title', 'department', 'sector', 'update_frequency', 'description', 'classification']
    const next = {}
    required.forEach(f => { if (!form[f].trim()) next[f] = 'This field is required' })
    if (form.formats.length === 0) next.formats = 'Select at least one format'
    return next
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    setResult(null)

    try {
      const { data } = await datasetService.create({
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      })
      setResult({ ok: true, id: data.id })
      setForm(emptyForm)
      setErrors({})
    } catch (err) {
      const detail = err.response?.data?.detail ?? err.response?.data?.error
      let msg = 'Something went wrong. Please try again.'
      if (typeof detail === 'string') msg = detail
      else if (Array.isArray(detail)) msg = detail.map(d => d.msg || d.message).join(', ')
      else if (err.response?.data?.details) msg = err.response.data.details.map(d => d.message).join(', ')
      setResult({ ok: false, msg })
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setForm(emptyForm)
    setErrors({})
    setResult(null)
  }

  return (
    <div className="page-wrapper form-page">
      <div className="page-header">
        <h1>Register a New Dataset</h1>
        <p>Fill in the details below to add your department's dataset to the UP Metadata Registry.</p>
      </div>

      {result && (
        <div className={`alert ${result.ok ? 'alert-success' : 'alert-error'}`}>
          {result.ok ? (
            <>
              <h4>Dataset submitted successfully!</h4>
              Registered with ID <strong>{result.id}</strong>. Status is set to pending review.
            </>
          ) : (
            <><h4>Submission failed</h4>{result.msg}</>
          )}
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit} noValidate>

          <div className={`form-field${errors.title ? ' field-error' : ''}`}>
            <label>Dataset Title <span className="required">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Land Records – Bhulekh UP"
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className={`form-field${errors.department ? ' field-error' : ''}`}>
              <label>Department <span className="required">*</span></label>
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="e.g. Revenue Department"
              />
              {errors.department && <span className="error-msg">{errors.department}</span>}
            </div>

            <div className={`form-field${errors.sector ? ' field-error' : ''}`}>
              <label>Sector <span className="required">*</span></label>
              <select name="sector" value={form.sector} onChange={handleChange}>
                <option value="">Select a sector</option>
                {sectors.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.sector && <span className="error-msg">{errors.sector}</span>}
            </div>
          </div>

          <div className={`form-field${errors.formats ? ' field-error' : ''}`}>
            <label>Data Formats <span className="required">*</span></label>
            <div className="formats-grid">
              {FORMAT_OPTIONS.map(f => (
                <label key={f} className="format-option">
                  <input
                    type="checkbox"
                    checked={form.formats.includes(f)}
                    onChange={() => toggleFormat(f)}
                  />
                  {f}
                </label>
              ))}
            </div>
            {errors.formats && <span className="error-msg">{errors.formats}</span>}
          </div>

          <div className="form-row">
            <div className={`form-field${errors.update_frequency ? ' field-error' : ''}`}>
              <label>Update Frequency <span className="required">*</span></label>
              <select name="update_frequency" value={form.update_frequency} onChange={handleChange}>
                <option value="">Select frequency</option>
                <option>Daily</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual</option>
                <option>Seasonal</option>
                <option>One-time</option>
              </select>
              {errors.update_frequency && <span className="error-msg">{errors.update_frequency}</span>}
            </div>

            <div className="form-field">
              <label>Coverage Level</label>
              <select name="coverage" value={form.coverage} onChange={handleChange}>
                <option value="">Select coverage</option>
                <option>Village</option>
                <option>Block</option>
                <option>District</option>
                <option>Division</option>
                <option>State</option>
              </select>
            </div>
          </div>

          <div className={`form-field${errors.description ? ' field-error' : ''}`}>
            <label>Description <span className="required">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe what this dataset contains, its source, and how it can be used."
            />
            {errors.description && <span className="error-msg">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className={`form-field${errors.classification ? ' field-error' : ''}`}>
              <label>Data Classification <span className="required">*</span></label>
              <select name="classification" value={form.classification} onChange={handleChange}>
                <option value="">Select classification</option>
                <option>Public</option>
                <option>Restricted</option>
                <option>Confidential</option>
              </select>
              {errors.classification && <span className="error-msg">{errors.classification}</span>}
            </div>

            <div className="form-field">
              <label>Tags</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. health, rural, 2024"
              />
              <span className="hint">Separate multiple tags with commas</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Dataset'}
            </button>
            <button type="button" className="btn-secondary" onClick={reset}>
              Clear Form
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
