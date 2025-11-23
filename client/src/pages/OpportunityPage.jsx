import { useParams } from 'react-router-dom'

export default function OpportunityPage() {
  const { id } = useParams()

  return (
    <div>
      <h1>Opportunité #{id}</h1>
      <p>Détails de l&apos;opportunité (placeholder).</p>
    </div>
  )
}
