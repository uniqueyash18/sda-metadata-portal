import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'

const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage'))
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'))

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <span className="logo-text">SDA Metadata Registry</span>
          <span className="logo-sub">State Data Authority, Uttar Pradesh</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Browse Datasets
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Register Dataset
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Suspense fallback={<p style={{ color: '#888', padding: '40px 20px' }}>Loading...</p>}>
        <Routes>
          <Route path="/" element={<DiscoveryPage />} />
          <Route path="/register" element={<RegistrationPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
