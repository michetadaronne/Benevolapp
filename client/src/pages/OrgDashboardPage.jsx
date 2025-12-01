import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:3000'

export default function OrgDashboardPage() {
  const [user, setUser] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('authUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('authUser')
      }
    }
  }, [])

  useEffect(() => {
    async function loadMine() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Connectez-vous en tant qu’organisateur.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${API_BASE_URL}/api/opportunities/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (res.status === 403 || res.status === 401) {
          setError('Réservé aux organisateurs.')
          setLoading(false)
          return
        }
        if (!res.ok) {
          throw new Error('Erreur réseau')
        }
        const data = await res.json()
        setOpportunities(data)
      } catch (err) {
        console.error(err)
        setError('Impossible de charger vos opportunités')
      } finally {
        setLoading(false)
      }
    }
    loadMine()
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>

  if (!user || user.role !== 'organizer') {
    return <p>Réservé aux organisateurs.</p>
  }

  return (
    <div>
      <h1>Vos opportunités</h1>
      {opportunities.length === 0 && <p>Aucune opportunité pour le moment.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {opportunities.map((opp) => (
          <li
            key={opp._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <h2 style={{ margin: 0 }}>{opp.title}</h2>
            <p style={{ margin: '0.25rem 0' }}>
              {opp.organization} — {opp.city}
            </p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
              {opp.date} · {opp.time}
            </p>
            <p>
              <strong>Volontaires inscrits :</strong> {opp.volunteerCount || 0}
            </p>
            {opp.volunteers && opp.volunteers.length > 0 && (
              <ul>
                {opp.volunteers.map((v) => (
                  <li key={v._id}>{v.name || v.email}</li>
                ))}
              </ul>
            )}
            <Link to={`/opportunity/${opp._id}`}>Voir la page</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
