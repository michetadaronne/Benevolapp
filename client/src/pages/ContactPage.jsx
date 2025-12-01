import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

const BRAND_GREEN = "#0b6b4c";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setStatus("Merci pour votre message, nous vous répondrons au plus vite.");
  }

  return (
    <div className="bg-light min-vh-100">
      {/* NAVBAR – même que Home / About */}
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
                <a className="nav-link" href="/#missions">
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

      {/* CONTENU */}
      <main className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* Formulaire de contact */}
            <div className="col-lg-7">
              <h1 className="h3 fw-bold mb-3">Contactez-nous</h1>
              <p className="text-muted mb-4">
                Une question sur la plateforme, une idée de partenariat ou une
                suggestion ? Écrivez-nous directement via ce formulaire.
              </p>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <form className="d-grid gap-3" onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-uppercase">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Prénom Nom"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold text-uppercase">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="vous@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label small fw-semibold text-uppercase">
                        Sujet
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Objet de votre message"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label small fw-semibold text-uppercase">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Expliquez-nous en quelques lignes comment nous pouvons vous aider."
                        required
                      />
                    </div>

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="consent"
                        required
                      />
                      <label
                        className="form-check-label small text-muted"
                        htmlFor="consent"
                      >
                        J&apos;accepte que Benevolapp utilise ces informations
                        pour me répondre.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn text-white"
                      style={{
                        backgroundColor: BRAND_GREEN,
                        borderColor: BRAND_GREEN,
                      }}
                    >
                      Envoyer le message
                    </button>
                  </form>

                  {status && (
                    <p className="text-success small mt-3 mb-0">{status}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Infos pratiques */}
            <div className="col-lg-5">
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body p-4">
                  <h2 className="h5 fw-semibold mb-3">Nos coordonnées</h2>
                  <p className="mb-2">
                    <strong>Benevolapp – Bureau Paris</strong>
                  </p>
                  <p className="text-muted mb-3">
                    15 rue de l&apos;Engagement<br />
                    75011 Paris<br />
                    France
                  </p>

                  <p className="mb-1">
                    <strong>Email :</strong>{" "}
                    <a
                      href="mailto:contact@benevolapp.fr"
                      style={{ color: BRAND_GREEN }}
                    >
                      contact@benevolapp.fr
                    </a>
                  </p>
                  <p className="mb-3">
                    <strong>Téléphone :</strong> +33 (0)1 23 45 67 89
                  </p>

                  <h3 className="h6 fw-semibold mt-3 mb-2">
                    Horaires d&apos;ouverture
                  </h3>
                  <ul className="list-unstyled text-muted small mb-0">
                    <li>Lundi – Vendredi : 9h00 – 18h30</li>
                    <li>Samedi : 10h00 – 13h00 (sur rendez-vous)</li>
                    <li>Dimanche & jours fériés : fermé</li>
                  </ul>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h3 className="h6 fw-semibold mb-2">Sur place</h3>
                  <p className="text-muted small mb-0">
                    Nos locaux accueillent les bénévoles et organisations pour
                    des rendez-vous d&apos;information, des ateliers et des
                    sessions de co-construction de projets.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
