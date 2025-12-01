import { Link } from "react-router-dom";
import logoImage from "../assets/unnamed.jpg";

import p1 from "../assets/propos/pexels-thatguycraig000-1467588.jpg";
import p2 from "../assets/propos/pexels-helenalopes-27176164.jpg";
import p3 from "../assets/propos/pexels-rdne-6646871.jpg";
import p4 from "../assets/propos/pexels-rdne-6646874.jpg";
import p5 from "../assets/propos/pexels-rdne-6646884.jpg";
import p6 from "../assets/propos/pexels-rdne-6646914.jpg";
import p7 from "../assets/propos/pexels-rdne-6646967.jpg";
import p8 from "../assets/propos/pexels-rdne-6647025.jpg";
import p9 from "../assets/propos/pexels-rdne-6647110.jpg";
import p10 from "../assets/propos/pexels-rdne-7464377.jpg";
import p11 from "../assets/propos/pexels-rdne-7464407.jpg";
import p12 from "../assets/propos/pexels-rdne-7464699.jpg";
import p13 from "../assets/propos/pexels-rdne-7464729.jpg";
import p14 from "../assets/propos/pexels-rdne-7683880.jpg";

// les 2 nouvelles images (dossier assets/)
import p15 from "../assets/pexels-pavel-danilyuk-7591300.jpg";
import p16 from "../assets/pexels-julia-m-cameron-6995109.jpg";

const BRAND_GREEN = "#0b6b4c";

const photos = [
  { src: p1, alt: "Atelier avec des bénévoles" },
  { src: p2, alt: "Photo de groupe des bénévoles" },
  { src: p3, alt: "Distribution lors d'une action solidaire" },
  { src: p4, alt: "Animation auprès de jeunes" },
  { src: p5, alt: "Préparation d'une collecte" },
  { src: p6, alt: "Accompagnement de personnes dans le besoin" },
  { src: p7, alt: "Bénévoles en mission de terrain" },
  { src: p8, alt: "Organisation d'un événement associatif" },
  { src: p9, alt: "Sensibilisation et échanges" },
  { src: p10, alt: "Temps d'écoute et de soutien" },
  { src: p11, alt: "Moment de convivialité entre bénévoles" },
  { src: p12, alt: "Atelier éducatif" },
  { src: p13, alt: "Rencontre avec des bénéficiaires" },
  { src: p14, alt: "Action de proximité dans le quartier" },
  { src: p15, alt: "Préparation de repas solidaires" },
  { src: p16, alt: "Atelier pédagogique avec des jeunes" },
];

export default function AboutPage() {
  return (
    <div className="bg-light min-vh-100">
      {/* NAVBAR – même que sur la home */}
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

      {/* HERO / INTRO */}
      <header className="py-5 border-bottom bg-white">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={logoImage}
                  alt="Logo Benevolapp"
                  style={{ height: "50px", borderRadius: "8px" }}
                />
                <h1 className="h2 fw-bold mb-0">À propos de Benevolapp</h1>
              </div>

              <p className="text-muted fs-5">
                Benevolapp est une plateforme qui facilite la rencontre entre
                <strong> bénévoles</strong> et
                <strong> organisations locales</strong>. Notre objectif : rendre
                l&apos;engagement plus simple, plus visible et plus concret.
              </p>

              <p className="text-muted">
                Le projet est né d&apos;un constat : beaucoup de personnes
                souhaitent aider, mais ne savent pas toujours où, comment ou à
                qui s&apos;adresser. En face, les associations manquent de
                visibilité et de temps pour recruter des bénévoles et suivre
                leurs missions.
              </p>

              <p className="text-muted mb-0">
                Avec Benevolapp, nous proposons un espace unique pour publier,
                trouver et suivre des missions de bénévolat : maraudes,
                collectes, événements solidaires, accompagnement scolaire,
                actions environnementales, etc. L&apos;idée : que chacun puisse
                trouver une mission qui lui ressemble, près de chez lui.
              </p>
            </div>

            <div className="col-lg-5">
              <div
                className="p-4 rounded-4 shadow-sm bg-white"
                style={{ borderLeft: `4px solid ${BRAND_GREEN}` }}
              >
                <h2 className="h5 fw-semibold mb-3">Notre vision</h2>
                <ul className="list-unstyled mb-0 text-muted small">
                  <li className="mb-2">
                    <span style={{ color: BRAND_GREEN }}>✔ </span>
                    Rendre le bénévolat accessible aux étudiants, actifs,
                    familles et retraités.
                  </li>
                  <li className="mb-2">
                    <span style={{ color: BRAND_GREEN }}>✔ </span>
                    Donner de la visibilité aux structures locales
                    (associations, collectivités, collectifs citoyens).
                  </li>
                  <li className="mb-2">
                    <span style={{ color: BRAND_GREEN }}>✔ </span>
                    Suivre l&apos;impact : heures de bénévolat, nombre de
                    missions, types d&apos;actions.
                  </li>
                  <li>
                    <span style={{ color: BRAND_GREEN }}>✔ </span>
                    Créer une communauté engagée autour de projets concrets et
                    utiles pour le territoire.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* SECTION PHOTOS */}
      <main className="py-5">
        <div className="container">
          <section>
            <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
              <div>
                <h2 className="h4 fw-semibold mb-1">
                  Photos de nos dernières actions
                </h2>
                <p className="text-muted small mb-0">
                  Quelques moments capturés lors de nos missions récentes :
                  ateliers, temps de rencontre, soutien de terrain et événements
                  solidaires.
                </p>
              </div>
            </div>

            <div className="row g-3">
              {photos.map((photo, index) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={index}>
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-100"
                      style={{
                        height: 210,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
