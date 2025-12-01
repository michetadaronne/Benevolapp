import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import OpportunityPage from './pages/OpportunityPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import OrgDashboardPage from './pages/OrgDashboardPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/opportunity/:id" element={<OpportunityPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/org" element={<OrgDashboardPage />} />
      <Route path="/about" element={<h1>A propos de nous</h1>} />
      <Route path="/missions" element={<h1>Missions à pourvoir</h1>} />
      <Route path="/contact" element={<h1>Contact</h1>} />
    </Routes>
  )
}

export default App
