import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:3000'

export default function HomePage() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // pour le formulaire de création rapide
  const [form, setForm] = useState({
    title: '',
    organization: '',
    city: '',
    date: '',
    time: '',
    description: '',
  })

  useEffect(() => {
    async function loadOpportunities() {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${API_BASE_URL}/api/opportunities`)
        if (!res.ok) throw new Error('Erreur réseau')

        const data = await res.json()
        setOpportunities(data)
      } catch (err) {
        console.error(err)
        setError("Impossible de charger les opportunités")
      } finally {
        setLoading(false)
      }
    }

    loadOpportunities()
  }, [])

  


  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE_URL}/api/opportunities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          organization: form.organization,
          city: form.city,
          date: form.date || null,
          time: form.time || null,
          description: form.description || '',
        }),
      })

      if (!res.ok) {
        console.error(await res.text())
        alert("Erreur lors de la création de l'opportunité")
        return
      }

      const created = await res.json()
      // on ajoute la nouvelle opportunité en tête de liste
      setOpportunities((prev) => [created, ...prev])
      // reset du formulaire
      setForm({
        title: '',
        organization: '',
        city: '',
        date: '',
        time: '',
        description: '',
      })
    } catch (err) {
      console.error(err)
      alert("Erreur réseau lors de la création")
    }
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) return <p>Chargement des opportunités...</p>
  if (error) return <p>{error}</p>
  
  return (
    <div>
      <h1>Benevolapp</h1>
      <p>Découvre et crée des opportunités de bénévolat.</p>
      {/* Formulaire simple de création */}
      <section style={{ marginBottom: '2rem' }}>
        <h2>Créer une opportunité</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem', maxWidth: 400 }}>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Titre"
            required
          />
          <input
            name="organization"
            value={form.organization}
            onChange={handleChange}
            placeholder="Organisation"
            required
          />
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Ville"
            required
          />
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
          <input
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Heure (ex: 10:00 - 13:00)"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <button type="submit">Créer</button>
        </form>
      </section>

      {/* Liste des opportunités */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
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
              {opp.organization} – {opp.city}
            </p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
              {opp.date} · {opp.time}
            </p>

            <Link to={`/opportunity/${opp._id}`}>Voir les détails</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
