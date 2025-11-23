import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import OpportunityPage from './pages/OpportunityPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import OrgDashboardPage from './pages/OrgDashboardPage.jsx'

function App() {
  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
        <Link to="/">Opportunités</Link> |{' '}
        <Link to="/profile">Mon profil</Link> |{' '}
        <Link to="/org">Organisation</Link> |{' '}
        <Link to="/login">Connexion</Link> |{' '}
        <Link to="/register">Inscription</Link>
      </nav>

      <main style={{ padding: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/opportunity/:id" element={<OpportunityPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/org" element={<OrgDashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
