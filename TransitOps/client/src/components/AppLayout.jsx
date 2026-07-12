import { NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../lib/api.js'

function AppLayout({ children }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    let active = true

    async function loadUser() {
      try {
        const response = await api.get('/v1/auth/me')
        if (active) setUser(response.data.data.user)
      } catch {
        localStorage.removeItem('transitops_token')
        navigate('/login', { replace: true })
      }
    }

    void loadUser()
    return () => {
      active = false
    }
  }, [navigate])

  const logout = () => {
    localStorage.removeItem('transitops_token')
    navigate('/login', { replace: true })
  }

  return (
    <main className="dashboard-page">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">TransitOps</p>
          <h2>Operations</h2>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
            Dashboard
          </NavLink>
          <NavLink to="/vehicles" className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
            Vehicles
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'nav-item--active' : ''}`}>
            Settings
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {user ? <div className="sidebar-user"><strong>{user.fullName || user.email}</strong><span>{user.roleName || 'Member'}</span></div> : null}
          <button type="button" className="secondary-button" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <section className="dashboard-content">{children}</section>
    </main>
  )
}

export default AppLayout
