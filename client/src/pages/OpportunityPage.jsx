import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:3000'

export default function OpportunityPage() {
  const { id } = useParams()
  const [opportunity, setOpportunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadOpportunity() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}`)
        if (res.status === 404) {
          setError("Opportunité introuvable")
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
    </div>
  )
}
