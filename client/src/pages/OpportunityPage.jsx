import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

const API_BASE_URL = 'http://localhost:3000'

export default function OpportunityPage() {
  const { id } = useParams()
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [joining, setJoining] = useState(false)

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
    async function loadOpportunity() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}`)
        if (res.status === 404) {
          setError('Opportunité introuvable')
          setOpportunity(null)
          return
        }
        if (!res.ok) throw new Error('Erreur réseau')

        const data = await res.json()
        setOpportunity(data)
      } catch (err) {
        console.error(err)
        if (!error) setError("Impossible de charger l'opportunité")
      } finally {
        setLoading(false)
      }
    }

    loadOpportunity()
  }, [id])

  const isJoined = useMemo(() => {
    if (!opportunity || !user?._id || !opportunity.volunteers) return false
    return opportunity.volunteers.some((v) => v._id === user._id)
  }, [opportunity, user])

  async function handleJoin() {
    if (!user) {
      alert('Connectez-vous pour rejoindre.')
      return
    }
    if (user.role !== 'volunteer') {
      alert('Seuls les volontaires peuvent rejoindre.')
      return
    }
    const token = localStorage.getItem('authToken')
    if (!token) {
      alert('Connectez-vous pour rejoindre.')
      return
    }
    try {
      setJoining(true)
      const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}/join`, {
        method: isJoined ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || 'Erreur serveur')
      }
      const data = await res.json()
      setOpportunity(data)
    } catch (err) {
      console.error(err)
      alert("Impossible de mettre à jour l'inscription")
    } finally {
      setJoining(false)
    }
  }

  if (loading) return <p>Chargement...</p>

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <Link to="/">← Retour au catalogue</Link>
      </div>
    )
  }

  if (!opportunity) {
    return (
      <div>
        <p>Opportunité introuvable.</p>
        <Link to="/">← Retour au catalogue</Link>
      </div>
    )
  }

  const volunteerCount =
    opportunity.volunteerCount ??
    (opportunity.volunteers ? opportunity.volunteers.length : 0)
  const isOrganizer = user?.role === 'organizer'
  const canSeeVolunteers =
    isOrganizer && opportunity.createdBy && user?._id && `${opportunity.createdBy}` === `${user._id}`

  return (
    <div>
      <Link to="/">← Retour au catalogue</Link>
      <h1>{opportunity.title}</h1>
      <p>
        <strong>Organisation :</strong> {opportunity.organization}
      </p>
      <p>
        <strong>Lieu :</strong> {opportunity.city}
      </p>
      <p>
        <strong>Date :</strong> {opportunity.date} · {opportunity.time}
      </p>
      <h2>Description</h2>
      <p>{opportunity.description}</p>

      <div style={{ marginTop: '1rem' }}>
        <p>
          <strong>Volontaires inscrits :</strong> {volunteerCount}
        </p>
        {user && user.role === 'volunteer' && (
          <button onClick={handleJoin} disabled={joining}>
            {isJoined ? 'Se désinscrire' : "Je veux aider"}
          </button>
        )}
        {!user && <p>Connectez-vous pour rejoindre.</p>}
        {canSeeVolunteers && opportunity.volunteers && opportunity.volunteers.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Liste des volontaires :</strong>
            <ul>
              {opportunity.volunteers.map((v) => (
                <li key={v._id}>{v.name || v.email}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
