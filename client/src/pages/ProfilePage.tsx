import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE_URL = 'http://localhost:3000'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [created, setCreated] = useState([])
  const [joined, setJoined] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem('authToken')
      if (!token) {
        setError('Connectez-vous pour voir votre profil.')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        setError(null)

        const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!userRes.ok) {
          throw new Error('Impossible de charger votre compte')
        }
        const userData = await userRes.json()
        setUser(userData.user)

        const joinedRes = await fetch(`${API_BASE_URL}/api/opportunities/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (joinedRes.ok) {
          setJoined(await joinedRes.json())
        }

        if (userData.user?.role === 'organizer') {
          const mineRes = await fetch(`${API_BASE_URL}/api/opportunities/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (mineRes.ok) {
            setCreated(await mineRes.json())
          }
        }
      } catch (err) {
        console.error(err)
        setError(err.message || 'Erreur lors du chargement du profil')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>
  if (!user) return <p>Utilisateur non connecte.</p>

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h4 mb-1">Profil</h1>
          <p className="text-muted mb-0">Vos informations et vos missions</p>
        </div>
        <Link to="/" className="btn btn-outline-secondary btn-sm">
          &lt; Retour
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h6 text-uppercase text-muted">Compte</h2>
              <p className="mb-1"><strong>Nom :</strong> {user.name || 'Non renseigne'}</p>
              <p className="mb-1"><strong>Email :</strong> {user.email}</p>
              <p className="mb-1"><strong>Role :</strong> {user.role}</p>
              <p className="mb-0"><strong>ID :</strong> {user._id}</p>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 mb-0">Missions auxquelles vous participez</h2>
                <span className="text-muted small">{joined.length} mission(s)</span>
              </div>
              {joined.length === 0 ? (
                <p className="mb-0 text-muted">Aucune mission rejointe pour le moment.</p>
              ) : (
                <ul className="mb-0" style={{ listStyle: 'none', padding: 0 }}>
                  {joined.map((opp) => (
                    <li key={opp._id} className="border rounded p-2 mb-2">
                      <div className="d-flex justify-content-between">
                        <div>
                          <strong>{opp.title}</strong> — {opp.organization}
                          <div className="text-muted small">
                            {opp.city} | {opp.date} {opp.startTime && `- ${opp.startTime}-${opp.endTime || ''}`}
                          </div>
                        </div>
                        <Link to={`/opportunity/${opp._id}`} className="small">
                          Voir
                        </Link>
                      </div>
                      {opp.categories && opp.categories.length > 0 && (
                        <div className="text-muted small mt-1">
                          Categories: {opp.categories.join(', ')}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {user.role === 'organizer' && (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h2 className="h6 mb-0">Missions que vous avez creees</h2>
                  <span className="text-muted small">{created.length} mission(s)</span>
                </div>
                {created.length === 0 ? (
                  <p className="mb-0 text-muted">
                    Aucune mission publiee. <Link to="/org">Publiez votre premiere mission</Link>.
                  </p>
                ) : (
                  <ul className="mb-0" style={{ listStyle: 'none', padding: 0 }}>
                    {created.map((opp) => (
                      <li key={opp._id} className="border rounded p-2 mb-2">
                        <div className="d-flex justify-content-between">
                          <div>
                            <strong>{opp.title}</strong> — {opp.organization}
                            <div className="text-muted small">
                              {opp.city} | {opp.date} {opp.startTime && `- ${opp.startTime}-${opp.endTime || ''}`}
                            </div>
                          </div>
                          <Link to={`/opportunity/${opp._id}`} className="small">
                            Gérer
                          </Link>
                        </div>
                        <div className="text-muted small mt-1">
                          Inscrits: {opp.volunteerCount || 0}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
