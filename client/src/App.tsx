import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import OpportunityPage from './pages/OpportunityPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import OrgDashboardPage from './pages/OrgDashboardPage'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/opportunity/:id" element={<OpportunityPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/org" element={<OrgDashboardPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Routes>
  )
}

export default App
