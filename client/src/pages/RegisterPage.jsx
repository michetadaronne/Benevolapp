import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

const BRAND_GREEN = "#0b6b4c";
const CARD_WIDTH = 460;

export default function RegisterPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative">
      {/* Lien retour accueil */}
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
            <h1
              className="h3 fw-semibold mt-3 mb-1"
              style={{ letterSpacing: "0.02em" }}
            >
              Créer un compte
            </h1>
            <p className="text-muted mb-0">
              Rejoignez la communauté Benevolapp et proposez ou trouvez des
              missions.
            </p>
          </div>

          {/* Formulaire */}
          <form className="d-grid gap-3">
            <div>
              <label className="form-label fw-semibold small text-uppercase">
                Nom complet
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Prénom Nom"
              />
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase">
                Adresse email
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="vous@example.com"
              />
            </div>

            <div>
              <label className="form-label fw-semibold small text-uppercase">
                Mot de passe
              </label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
              />
            </div>

            <button
              className="btn btn-lg w-100 text-white mt-2"
              type="submit"
              style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
            >
              S&apos;inscrire
            </button>
          </form>

          {/* Lien de retour connexion */}
          <div className="mt-4 text-center">
            <p className="mb-1 text-muted small">
              Vous avez déjà un compte ?
            </p>
            <Link
              to="/login"
              style={{ color: BRAND_GREEN }}
              className="fw-semibold"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
