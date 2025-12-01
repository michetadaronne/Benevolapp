import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logoImage from "../assets/unnamed.jpg";

// Images du hero (slideshow)
import hero1 from "../assets/personnes-a-plan-moyen-s-embrassant.jpg";
import hero2 from "../assets/gros-plan-de-diverses-personnes-joignant-leurs-mains.jpg";
import hero3 from "../assets/gros-plan-des-personnes-tenant-une-boite.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";

// Liste des images du hero
const HERO_IMAGES = [
  {
    src: hero1,
    alt: "Personnes qui se prennent dans les bras",
  },
  {
    src: hero2,
    alt: "Diverses personnes joignant leurs mains",
  },
  {
    src: hero3,
    alt: "Personnes tenant une boîte de dons",
  },
];

export default function HomePage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // index de l'image actuelle du hero
  const [heroIndex, setHeroIndex] = useState(0);

  // Chargement des missions
  useEffect(() => {
    async function load() {
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

    load();
  }, []);

  // Changement automatique de l'image toutes les 15 secondes
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000); // 15000 ms = 15 secondes

    return () => clearInterval(id);
  }, []);

  const currentHero = HERO_IMAGES[heroIndex];

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-0">
          {/* Logo + nom */}
          <div className="d-flex align-items-center">
            <Link
              className="navbar-brand d-flex align-items-center gap-2 ms-3"
              to="/"
            >
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
            {/* Liens à côté du logo */}
            <ul className="navbar-nav ms-3 gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  À propos de nous
                </Link>
              </li>
              <li className="nav-item">
                {/* ancre vers la section missions */}
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

            {/* Dropdown compte à droite */}
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

      {/* HERO */}
      <header
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f4f7f5 0%, #ffffff 35%, #f7faf9 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-5">
            {/* Texte à gauche */}
            <div className="col-lg-6 text-lg-start text-center">
              <span
                className="badge rounded-pill mb-3"
                style={{
                  backgroundColor: "#e3f3ec",
                  color: BRAND_GREEN,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}
              >
                PLATEFORME DE BÉNÉVOLAT LOCALE
              </span>

              <h1 className="fw-bold mb-3" style={{ fontSize: "2.6rem" }}>
                Trouve des missions utiles
                <br />
                près de chez toi.
              </h1>

              <p className="text-muted mb-4 fs-5">
                Benevolapp connecte les associations et les bénévoles pour
                faciliter l&apos;engagement sur des missions concrètes.
              </p>

              <div className="d-flex flex-wrap justify-content-lg-start justify-content-center gap-3">
                <div className="d-flex flex-column align-items-start">
                  <span className="fw-bold" style={{ color: BRAND_GREEN }}>
                    +120
                  </span>
                  <span className="text-muted small">
                    missions publiées cette année
                  </span>
                </div>
                <div className="d-flex flex-column align-items-start">
                  <span className="fw-bold" style={{ color: BRAND_GREEN }}>
                    40+
                  </span>
                  <span className="text-muted small">
                    organisations partenaires
                  </span>
                </div>
              </div>

              {/* Lien discret vers les missions */}
              <div className="mt-4">
                <a
                  href="#missions"
                  className="text-decoration-none"
                  style={{ color: BRAND_GREEN, fontWeight: 600 }}
                >
                  Voir les missions ↓
                </a>
              </div>
            </div>

            {/* Slideshow à droite */}
            <div className="col-lg-6">
              <div className="position-relative mx-auto" style={{ maxWidth: 480 }}>
                <div
                  className="rounded-4 shadow-sm overflow-hidden bg-white border"
                  style={{ borderColor: "#e5ede8" }}
                >
                  <img
                    src={currentHero.src}
                    alt={currentHero.alt}
                    className="w-100"
                    style={{ display: "block", objectFit: "cover" }}
                  />
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
                  Découvre les opportunités actuellement proposées par les
                  organisations.
                </p>
              </div>
              <span className="text-muted small">
                {loading
                  ? "Chargement..."
                  : `${opportunities.length} mission(s) disponible(s)`}
              </span>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="text-center py-5">
                <div
                  className="spinner-border"
                  role="status"
                  style={{ color: BRAND_GREEN }}
                />
                <p className="text-muted mb-0 mt-3">
                  Chargement des missions en cours...
                </p>
              </div>
            ) : opportunities.length === 0 ? (
              <div className="alert alert-info">
                Aucune mission n&apos;est publiée pour le moment. Revenez
                prochainement ou créez une opportunité via votre espace
                organisation.
              </div>
            ) : (
              <div className="row g-4">
                {opportunities.map((opp) => (
                  <div className="col-md-6 col-lg-4" key={opp._id}>
                    <div
                      className="card h-100 border-0 shadow-sm"
                      style={{ borderRadius: "1rem" }}
                    >
                      <div
                        className="card-body d-flex flex-column"
                        style={{ padding: "1.25rem 1.4rem" }}
                      >
                        <div className="d-flex justify-content-between mb-2">
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: "#e3f3ec",
                              color: BRAND_GREEN,
                              fontSize: "0.7rem",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {opp.city || "Local"}
                          </span>
                          {opp.date && (
                            <span className="text-muted small">
                              {opp.date}
                              {opp.time ? ` · ${opp.time}` : ""}
                            </span>
                          )}
                        </div>

                        <h5 className="fw-semibold mb-1">{opp.title}</h5>
                        <p className="text-muted small mb-2">
                          {opp.organization}
                        </p>

                        <p className="text-muted small flex-grow-1 mb-3">
                          {opp.description || "Aucune description fournie."}
                        </p>

                        <Link
                          to={`/opportunity/${opp._id}`}
                          className="btn btn-sm text-white mt-auto"
                          style={{
                            backgroundColor: BRAND_GREEN,
                            borderColor: BRAND_GREEN,
                            borderRadius: "999px",
                            paddingInline: "1.1rem",
                          }}
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
