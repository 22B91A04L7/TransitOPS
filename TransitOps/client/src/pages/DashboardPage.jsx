import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { dashboardApi } from '../lib/dashboardApi.js'
import '../App.css'

function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const response = await dashboardApi.getSummary()
        if (active) setSummary(response.data.data.summary)
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Failed to load dashboard data')
      }
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [])

  const statusCounts = summary?.statusCounts || {}
  const fuelCounts = summary?.fuelTypeCounts || {}

  return (
    <AppLayout>
      <header className="dashboard-header">
        <div>
          <p className="card-kicker">Operations overview</p>
          <h1>Fleet dashboard</h1>
          <p>Live vehicle availability and fleet status from TransitOps.</p>
        </div>
      </header>

      {error ? <div className="error-message">{error}</div> : null}
      {!summary && !error ? <div className="loading">Loading dashboard...</div> : null}

      {summary ? <>
        <section className="metrics-grid">
          <article className="metric-card"><span>Total vehicles</span><strong>{summary.totalVehicles}</strong></article>
          <article className="metric-card"><span>Active vehicles</span><strong>{statusCounts.active || 0}</strong></article>
          <article className="metric-card"><span>In maintenance</span><strong>{statusCounts.maintenance || 0}</strong></article>
        </section>

        <section className="dashboard-panels">
          <article className="dashboard-panel">
            <h2>Fleet status</h2>
            <div className="summary-list">
              {['active', 'maintenance', 'retired'].map((status) => <div key={status}><span className={`status-badge status-${status}`}>{status}</span><strong>{statusCounts[status] || 0}</strong></div>)}
            </div>
          </article>
          <article className="dashboard-panel">
            <h2>Fuel mix</h2>
            <div className="summary-list">
              {Object.keys(fuelCounts).length ? Object.entries(fuelCounts).map(([fuelType, count]) => <div key={fuelType}><span className={`status-badge status-${fuelType}`}>{fuelType}</span><strong>{count}</strong></div>) : <p>No fuel data yet.</p>}
            </div>
          </article>
        </section>
      </> : null}
    </AppLayout>
  )
}

export default DashboardPage
