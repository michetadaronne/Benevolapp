import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logoImage from "../assets/unnamed.jpg";
import type { Opportunity, User } from "../types";

// Images du hero (slideshow)
import hero1 from "../assets/personnes-a-plan-moyen-s-embrassant.jpg";
import hero2 from "../assets/gros-plan-de-diverses-personnes-joignant-leurs-mains.jpg";
import hero3 from "../assets/gros-plan-des-personnes-tenant-une-boite.jpg";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";

// Liste des images du hero
const HERO_IMAGES = [
  { src: hero1, alt: "Personnes qui se prennent dans les bras" },
  { src: hero2, alt: "Diverses personnes joignant leurs mains" },
  { src: hero3, alt: "Personnes tenant une boîte de dons" },
];

export default function HomePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({
    city: "",
    date: "",
    category: "",
  });

  const [heroIndex, setHeroIndex] = useState(0);

  // Chargement des missions avec filtres
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.city) params.set("city", filters.city);
        if (filters.date) params.set("date", filters.date);
        if (filters.category) params.set("category", filters.category);
        const res = await fetch(
          `${API_BASE_URL}/api/opportunities${params.toString() ? `?${params}` : ""}`
        );
        if (!res.ok) throw new Error("Erreur reseau");
        const data = (await res.json()) as Opportunity[];
        setOpportunities(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les missions.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filters]);

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  // Slideshow hero
  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const currentHero = HERO_IMAGES[heroIndex];

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-0">
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
              <span className="navbar-toggler-icon" />
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
              >
                {user ? user.email : "Mon compte"}
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                {user ? (
                  <>
                    <li>
                      <span className="dropdown-item-text text-muted">
                        {user.role === "organizer" ? "Organisateur" : "Volontaire"}
                      </span>
                    </li>
                    {user.role === "organizer" && (
                      <>
                        <li>
                          <Link className="dropdown-item" to="/org">
                            Tableau organisateur
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/org#create">
                            Créer une mission
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                      </>
                    )}
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        Profil
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("authToken")
                          localStorage.removeItem("authUser")
                          setUser(null)
                        }}
                      >
                        Se déconnecter
                      </button>
                    </li>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
                Trouve des missions utiles
                <br />
                près de chez toi.
              </h1>

              <p className="text-muted mb-4 fs-5">
                Benevolapp connecte les associations et les bénévoles pour
                faciliter l'engagement sur des missions concrètes.
              </p>

              <div className="d-flex gap-4">
                <div>
                  <span className="fw-bold" style={{ color: BRAND_GREEN }}>
                    +120
                  </span>
                  <div className="text-muted small">
                    missions publiées cette année
                  </div>
                </div>
                <div>
                  <span className="fw-bold" style={{ color: BRAND_GREEN }}>
                    40+
                  </span>
                  <div className="text-muted small">
                    organisations partenaires
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <a href="#missions" style={{ color: BRAND_GREEN }}>
                  Voir les missions ↓
                </a>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="rounded-4 shadow-sm overflow-hidden border">
                <img
                  src={currentHero.src}
                  alt={currentHero.alt}
                  className="w-100"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOT DU PRÉSIDENT */}
      <section
        className="py-5"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid #e5ede8",
          borderBottom: "1px solid #e5ede8",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="h4 fw-semibold mb-3" style={{ color: BRAND_GREEN }}>
                Le mot du président
              </h2>

              <p className="text-muted fs-5 fst-italic">
                « Chez Benevolapp, nous croyons que chaque engagement compte.
                Cette plateforme est née de la volonté de rapprocher les citoyens
                des associations locales afin de favoriser une entraide durable
                et accessible à tous. Merci pour votre engagement. »
              </p>

              <p className="fw-semibold mb-0">Jean Dupont</p>
              <p className="text-muted small">
                Président de l’association Benevolapp
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAIRE UN DON */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,107,76,0.08) 0%, rgba(11,107,76,0.02) 100%)",
          borderBottom: "1px solid #e5ede8",
        }}
      >
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <h2 className="h4 fw-semibold mb-3" style={{ color: BRAND_GREEN }}>
                Faire un don, c’est multiplier notre impact
              </h2>

              <p className="text-muted mb-3" style={{ textAlign: "justify" }}>
              Vos dons financent le matériel des missions, la formation des bénévoles
              et les accompagnements d’urgence pour les associations locales.
              Chaque euro est utilisé pour rendre l’entraide plus rapide et plus
              proche des besoins du terrain.
            </p>

            <p className="text-muted mb-0" style={{ textAlign: "justify" }}>
              Les dons sont défiscalisés : jusqu’à 66 % de réduction d’impôt pour les
              particuliers et 60 % pour les entreprises, dans la limite prévue par la loi.
              Un don de 50 € ne vous coûte donc que 17 € après déduction.
            </p>

            </div>

            <div className="col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h3 className="h6 fw-semibold mb-2">Envie de soutenir ?</h3>

                  <p className="text-muted small mb-3">
                    Un don régulier nous permet de planifier nos actions,
                    un don ponctuel nous aide à répondre aux urgences.
                    Merci pour votre soutien !
                  </p>

                  <div className="d-flex flex-wrap gap-2">
                    <Link
                      to="/don"
                      className="btn text-white"
                      style={{ backgroundColor: BRAND_GREEN }}
                    >
                      Faire un don
                    </Link>

                    <a
                      className="btn btn-outline-success"
                      href="mailto:contact@benevolapp.org?subject=Question%20sur%20les%20dons"
                    >
                      Poser une question
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* MISSIONS */}
      <main className="py-5" style={{ backgroundColor: "#f5f7f6" }}>
        <div className="container">
          <section id="missions">
            <div className="d-flex justify-content-between mb-3 align-items-center flex-wrap gap-3">
              <h2 className="h4 fw-semibold mb-0">Missions à pourvoir</h2>
              <span className="text-muted small">
                {loading
                  ? "Chargement..."
                  : `${opportunities.length} mission(s) disponible(s)`}
              </span>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Ville</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Filtrer par ville"
                      value={filters.city}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, city: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, date: e.target.value }))
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Catégorie</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ex: logistique"
                      value={filters.category}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, category: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <div className="text-center">
                <div className="spinner-border" />
              </div>
            ) : opportunities.length === 0 ? (
              <div className="alert alert-info">
                Aucune mission n'est publiée pour le moment.
              </div>
            ) : (
              <div className="row g-4">
                {opportunities.map((opp) => (
                  <div key={opp._id} className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body d-flex flex-column">
                        <h5>{opp.title}</h5>
                        <p className="text-muted small">
                          {opp.organization}
                        </p>
                        <p className="text-muted small mb-1">
                          {opp.city} - {opp.date || "Date a venir"} |{" "}
                          {(opp.startTime || opp.time || "--") +
                            " - " +
                            (opp.endTime || opp.time || "--")}
                        </p>
                        {opp.categories && opp.categories.length > 0 && (
                          <p className="text-muted small mb-1">
                            Catégories: {opp.categories.join(", ")}
                          </p>
                        )}
                        <p className="text-muted small flex-grow-1">
                          {opp.description}
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
