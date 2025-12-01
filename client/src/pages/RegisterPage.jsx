import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";
const CARD_WIDTH = 440; // un tout petit peu plus étroit

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    role: "volunteer",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          role: form.role,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Erreur lors de l'inscription");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setStatus(`Compte créé pour ${data.user.email}`);
    } catch (err) {
      console.error(err);
      setStatus("Erreur réseau");
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      {/* Bouton retour */}
      <div className="position-absolute top-0 start-0 p-3">
        <Link to="/" className="text-muted small text-decoration-none">
          ← Retour à l&apos;accueil
        </Link>
      </div>

      <div
        className="card shadow-sm border-0"
        style={{ maxWidth: CARD_WIDTH, width: "100%" }}
      >
        <div className="card-body p-4">
          {/* Logo + titre */}
          <div className="text-center mb-3">
            <img
              src={logoImage}
              alt="Benevolapp"
              style={{ height: "52px", borderRadius: "8px" }}
            />
            <h1 className="h4 fw-semibold mt-3 mb-1">Bienvenue</h1>
            <p className="text-muted mb-0 small">
              Créez votre compte Benevolapp pour commencer.
            </p>
          </div>

          {/* Boutons Connexion / Inscription */}
          <div className="d-flex justify-content-center mb-3 gap-2">
            <Link to="/login" className="btn btn-sm btn-outline-success">
              Connexion
            </Link>
            <button
              className="btn btn-sm btn-success"
              type="button"
              disabled
            >
              Inscription
            </button>
          </div>

          {/* Formulaire d'inscription */}
          <form className="d-grid gap-2" onSubmit={handleSubmit}>
            <div>
              <label className="form-label fw-semibold small text-uppercase mb-1">
                Nom
              </label>
              <input
                type="text"
                name="name"
                className="form-control form-control-lg"
                placeholder="Votre nom"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase mb-1">
                Rôle
              </label>
              <select
                name="role"
                className="form-select form-select-lg"
                value={form.role}
                onChange={handleChange}
              >
                <option value="volunteer">Volontaire</option>
                <option value="organizer">Organisateur</option>
              </select>
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="vous@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn btn-lg w-100 text-white mt-2"
              type="submit"
              style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
            >
              Créer un compte
            </button>
          </form>

          {status && (
            <p className="text-center text-muted mt-3 mb-0 small">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
