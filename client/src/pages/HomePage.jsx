import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import brasImage from "../assets/bras.webp";
import logoImage from "../assets/unnamed.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";

export default function HomePage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    title: "",
    organization: "",
    city: "",
    date: "",
    time: "",
    description: "",
  });

  useEffect(() => {
    // Récupération utilisateur
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("authUser");
      }
    }

    // Chargement des missions
    async function loadOpportunities() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE_URL}/api/opportunities`);
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        setOpportunities(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les missions.");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunities();
  }, []);

  // Création d'une opportunité
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Connectez-vous en tant qu'organisateur pour créer une opportunité");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          organization: form.organization,
          city: form.city,
          date: form.date || null,
          time: form.time || null,
          description: form.description || "",
        }),
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Erreur lors de la création de l'opportunité");
        return;
      }

      const created = await res.json();
      setOpportunities((prev) => [created, ...prev]);
      setForm({
        title: "",
        organization: "",
        city: "",
        date: "",
        time: "",
        description: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la création");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Affichage
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-0">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand d-flex align-items-center gap-2 ms-3" to="/">
              <img
                src={logoImage}
                alt="Benevolapp"
                style={{ height: "40px", borderRadius: "4px" }}
              />
              <span className="fw-bold">Benevolapp</span>
            </Link>

            <button
              className="navbar-toggler ms-2"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navMenu"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-3 gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  À propos de nous
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#missions">
                  Missions à pourvoir
                </a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>

            <div className="dropdown ms-auto me-3">
              <button
                className="btn btn-outline-light dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Mon compte
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link className="dropdown-item" to="/login">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/register">
                    Créer un compte
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="py-5" style={{ background: "linear-gradient(135deg, #f4f7f5 0%, #ffffff 35%, #f7faf9 100%)" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6 text-lg-start text-center">
              <span
                className="badge rounded-pill mb-3"
                style={{
                  backgroundColor: "#e3f3ec",
                  color: BRAND_GREEN,
                  fontWeight: 600,
                }}
              >
                PLATEFORME DE BÉNÉVOLAT LOCALE
              </span>

              <h1 className="fw-bold mb-3" style={{ fontSize: "2.6rem" }}>
                Trouve des missions utiles <br />
                près de chez toi.
              </h1>

              <p className="text-muted mb-4 fs-5">
                Benevolapp connecte les associations et les bénévoles pour
                faciliter l’engagement sur des missions concrètes.
              </p>

              <a
                href="#missions"
                className="text-decoration-none"
                style={{ color: BRAND_GREEN, fontWeight: 600 }}
              >
                Voir les missions ↓
              </a>
            </div>

            <div className="col-lg-6">
              <div className="position-relative mx-auto" style={{ maxWidth: 480 }}>
                <div className="rounded-4 shadow-sm overflow-hidden bg-white border">
                  <img src={brasImage} alt="Volontaires unis" className="w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION MISSIONS */}
      <main className="py-5" style={{ backgroundColor: "#f5f7f6" }}>
        <div className="container">
          <section id="missions">
            <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
              <div>
                <h2 className="h4 fw-semibold mb-1">Missions à pourvoir</h2>
                <p className="text-muted small mb-0">
                  Découvre les opportunités actuellement proposées.
                </p>
              </div>

              <span className="text-muted small">
                {loading ? "Chargement…" : `${opportunities.length} mission(s)`}
              </span>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border" role="status" style={{ color: BRAND_GREEN }}></div>
                <p className="text-muted mt-3">Chargement…</p>
              </div>
            ) : (
              <div className="row g-4">
                {opportunities.map((opp) => (
                  <div className="col-md-6 col-lg-4" key={opp._id}>
                    <div className="card h-100 border-0 shadow-sm">
                      <div className="card-body d-flex flex-column">
                        <h5 className="fw-semibold mb-1">{opp.title}</h5>
                        <p className="text-muted small mb-2">{opp.organization}</p>
                        <p className="text-muted small mb-3">
                          {opp.city} • {opp.date} {opp.time}
                        </p>

                        <Link
                          to={`/opportunity/${opp._id}`}
                          className="btn btn-sm text-white mt-auto"
                          style={{ backgroundColor: BRAND_GREEN }}
                        >
                          Voir les détails
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
