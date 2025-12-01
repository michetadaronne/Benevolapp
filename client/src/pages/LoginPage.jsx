import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";
const CARD_WIDTH = 460;

export default function LoginPage() {
  const [form, setForm] = useState({
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
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Erreur de connexion");
        return;
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      setStatus(`Connecté en tant que ${data.user.email}`);
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
        <div className="card-body p-4 p-md-5">
          {/* Logo + titre */}
          <div className="text-center mb-4">
            <img
              src={logoImage}
              alt="Benevolapp"
              style={{ height: "56px", borderRadius: "8px" }}
            />
            <h1 className="h3 fw-semibold mt-3 mb-1">Bienvenue</h1>
            <p className="text-muted mb-0">
              Accédez à votre espace bénévole ou organisation.
            </p>
          </div>

          {/* Boutons Connexion / Inscription */}
          <div className="d-flex justify-content-center mb-4 gap-2">
            <button className="btn btn-success" type="button" disabled>
              Connexion
            </button>
            <Link to="/register" className="btn btn-outline-success">
              Inscription
            </Link>
          </div>

          {/* Formulaire de connexion */}
          <form className="d-grid gap-3" onSubmit={handleSubmit}>
            <div>
              <label className="form-label fw-semibold small text-uppercase">
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
              <label className="form-label fw-semibold small text-uppercase">
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
              Se connecter
            </button>
          </form>

          {status && (
            <p className="text-center text-muted mt-3 mb-0">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
