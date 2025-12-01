import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";
const CARD_WIDTH = 460;

export default function LoginPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "volunteer",
  });
  const [status, setStatus] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "Erreur");
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

      <div className="card shadow-sm border-0" style={{ maxWidth: CARD_WIDTH, width: "100%" }}>
        <div className="card-body p-4 p-md-5">
          {/* Logo + titre */}
          <div className="text-center mb-4">
            <img src={logoImage} alt="Benevolapp" style={{ height: "56px", borderRadius: "8px" }} />
            <h1 className="h3 fw-semibold mt-3 mb-1">Bienvenue</h1>
            <p className="text-muted mb-0">
              {mode === "login"
                ? "Accédez à votre espace bénévole ou organisation."
                : "Créez votre compte Benevolapp pour commencer."}
            </p>
          </div>

          {/* Mode login/register */}
          <div className="d-flex justify-content-center mb-4 gap-2">
            <button
              className={`btn ${mode === "login" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setMode("login")}
            >
              Connexion
            </button>
            <button
              className={`btn ${mode === "register" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setMode("register")}
            >
              Inscription
            </button>
          </div>

          {/* Formulaire */}
          <form className="d-grid gap-3" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <div>
                  <label className="form-label fw-semibold small text-uppercase">Nom</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="Votre nom"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="form-label fw-semibold small text-uppercase">Rôle</label>
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
              </>
            )}

            <div>
              <label className="form-label fw-semibold small text-uppercase">Email</label>
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
              <label className="form-label fw-semibold small text-uppercase">Mot de passe</label>
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
              {mode === "login" ? "Se connecter" : "Créer un compte"}
            </button>
          </form>

          {/* Messages d’erreur / succès */}
          {status && <p className="text-center text-muted mt-3">{status}</p>}

          {/* Lien vers inscription */}
          {mode === "login" && (
            <div className="mt-4 text-center">
              <p className="mb-1 text-muted small">Pas encore de compte ?</p>
              <button
                className="btn btn-link fw-semibold"
                style={{ color: BRAND_GREEN }}
                onClick={() => setMode("register")}
              >
                Créer un compte
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
