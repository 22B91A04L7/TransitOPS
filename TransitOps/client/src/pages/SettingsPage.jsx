import { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout.jsx'
import { settingsApi } from '../lib/settingsApi.js'
import '../App.css'

function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    async function loadProfile() {
      try {
        const response = await settingsApi.getProfile()
        if (active) {
          setProfile(response.data.data.profile)
          setFullName(response.data.data.profile.fullName || '')
        }
      } catch (requestError) {
        if (active) setError(requestError.response?.data?.message || 'Failed to load settings')
      }
    }
    void loadProfile()
    return () => { active = false }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await settingsApi.updateProfile({ fullName })
      setProfile(response.data.data.profile)
      setFullName(response.data.data.profile.fullName || '')
      setMessage('Profile saved successfully.')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AppLayout>
      <header className="dashboard-header"><div><p className="card-kicker">Account settings</p><h1>Profile</h1><p>Update the name displayed across TransitOps.</p></div></header>
      {error ? <div className="error-message">{error}</div> : null}
      {!profile && !error ? <div className="loading">Loading profile...</div> : null}
      {profile ? <section className="dashboard-panel settings-card"><form className="settings-form" onSubmit={handleSubmit}>
        <label><span>Email</span><input value={profile.email} disabled /></label>
        <label><span>Role</span><input value={profile.roleName || 'Member'} disabled /></label>
        <label className="full-width"><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={120} required /></label>
        {message ? <div className="feedback feedback--success">{message}</div> : null}
        <div><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button></div>
      </form></section> : null}
    </AppLayout>
  )
}

export default SettingsPage
