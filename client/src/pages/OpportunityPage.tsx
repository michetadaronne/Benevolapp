import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { Opportunity, User } from "../types";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";
const HEADER_GRADIENT = "linear-gradient(135deg, #f4f7f5 0%, #ffffff 35%, #f7faf9 100%)";

export default function OpportunityPage() {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("authUser");
      }
    }
  }, []);

  useEffect(() => {
    async function loadOpportunity() {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Identifiant de mission manquant");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}`);
        if (res.status === 404) {
          setError("Opportunité introuvable");
          setOpportunity(null);
          return;
        }
        if (!res.ok) throw new Error("Erreur réseau");

        const data = (await res.json()) as Opportunity;
        setOpportunity(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l'opportunité");
      } finally {
        setLoading(false);
      }
    }

    loadOpportunity();
  }, [id]);

  const isJoined = useMemo(() => {
    if (!opportunity || !user?._id || !opportunity.volunteers) return false;
    return opportunity.volunteers.some((v) => v._id === user._id);
  }, [opportunity, user]);

  async function handleJoin() {
    if (!user) {
      alert("Connectez-vous pour rejoindre.");
      return;
    }
    if (user.role !== "volunteer") {
      alert("Seuls les volontaires peuvent rejoindre.");
      return;
    }
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Connectez-vous pour rejoindre.");
      return;
    }
    try {
      setJoining(true);
      const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}/join`, {
        method: isJoined ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Erreur serveur");
      }
      const data = await res.json();
      setOpportunity(data);
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour l'inscription");
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" role="status" />
          <p className="text-muted mb-0">Chargement de la mission...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0" style={{ maxWidth: 480 }}>
          <div className="card-body text-center p-4">
            <p className="text-danger fw-semibold mb-2">{error}</p>
            <Link to="/" className="text-decoration-none">
              ← Retour aux missions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0" style={{ maxWidth: 480 }}>
          <div className="card-body text-center p-4">
            <p className="fw-semibold mb-2">Opportunité introuvable.</p>
            <Link to="/" className="text-decoration-none">
              ← Retour aux missions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const volunteerCount =
    opportunity.volunteerCount ??
    (opportunity.volunteers ? opportunity.volunteers.length : 0);
  const isOrganizer = user?.role === "organizer";
  const canSeeVolunteers =
    isOrganizer &&
    opportunity.createdBy &&
    user?._id &&
    `${opportunity.createdBy}` === `${user._id}`;
  const startTime = opportunity.startTime || opportunity.time || "--";
  const endTime = opportunity.endTime || opportunity.time || "--";
  const categories = opportunity.categories || [];

  return (
    <div className="bg-light" style={{ minHeight: "100vh" }}>
      <div className="container py-5">
        <div className="d-flex align-items-center gap-2 mb-4">
          <Link
            to="/"
            className="text-muted text-decoration-none d-inline-flex align-items-center gap-1"
          >
            <span aria-hidden>←</span>
            <span>Retour aux missions</span>
          </Link>
          <span className="badge rounded-pill text-bg-light border">Mission solidaire</span>
        </div>

        <div
          className="p-4 rounded-4 shadow-sm border mb-4"
          style={{ background: HEADER_GRADIENT }}
        >
          <div className="d-flex flex-wrap justify-content-between gap-3">
            <div>
              <span
                className="badge rounded-pill mb-3"
                style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN, fontWeight: 600 }}
              >
                Opportunité locale
              </span>
              <h1 className="h3 fw-bold mb-1">{opportunity.title}</h1>
              <p className="text-muted mb-3">{opportunity.organization}</p>

              <div className="d-flex flex-wrap gap-2">
                <span className="badge text-dark bg-white border">📍 {opportunity.city}</span>
                <span className="badge text-dark bg-white border">📅 {opportunity.date}</span>
                <span className="badge text-dark bg-white border">
                  ⏰ {startTime} - {endTime}
                </span>
              </div>

              {categories.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {categories.map((cat) => (
                    <span
                      key={cat}
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: "#f5f7f6",
                        color: BRAND_GREEN,
                        border: `1px solid ${BRAND_GREEN}`,
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="text-end">
              <p className="text-muted small mb-1">Volontaires inscrits</p>
              <div className="h1 fw-bold mb-2" style={{ color: BRAND_GREEN }}>
                {volunteerCount}
              </div>

              {user && user.role === "volunteer" ? (
                <button
                  className="btn btn-lg text-white px-4"
                  style={{ backgroundColor: BRAND_GREEN, borderColor: BRAND_GREEN }}
                  onClick={handleJoin}
                  disabled={joining}
                >
                  {joining ? "Patientez..." : isJoined ? "Se désinscrire" : "Je participe"}
                </button>
              ) : (
                <div className="text-muted small">
                  Connectez-vous en tant que bénévole pour rejoindre.
                </div>
              )}

              {isJoined && (
                <div className="mt-2">
                  <span
                    className="badge rounded-pill"
                    style={{ backgroundColor: "#eaf8f1", color: BRAND_GREEN }}
                  >
                    Vous êtes inscrit·e
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <h5 className="fw-semibold mb-3">Ce que vous ferez</h5>
                <p className="text-muted mb-0">
                  {opportunity.description ||
                    "L'organisateur ajoutera bientôt une description plus détaillée de la mission."}
                </p>
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="text-uppercase text-muted small mb-3">
                  Informations pratiques
                </h6>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3 border rounded-3 bg-white h-100">
                      <p className="fw-semibold mb-1">Quand ?</p>
                      <p className="text-muted mb-0">
                        {opportunity.date} — {startTime} à {endTime}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded-3 bg-white h-100">
                      <p className="fw-semibold mb-1">Où ?</p>
                      <p className="text-muted mb-0">{opportunity.city}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded-3 bg-white h-100">
                      <p className="fw-semibold mb-1">Association</p>
                      <p className="text-muted mb-0">{opportunity.organization}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3 border rounded-3 bg-white h-100">
                      <p className="fw-semibold mb-1">Catégories</p>
                      <p className="text-muted mb-0">
                        {categories.length > 0 ? categories.join(", ") : "Non renseigné"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body p-4">
                <h6 className="text-uppercase text-muted small mb-3">
                  Checklist bénévole
                </h6>
                <ul className="list-unstyled small mb-0">
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                    >
                      1
                    </span>
                    <span>Confirme ta disponibilité et ton moyen de transport.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2 mb-2">
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                    >
                      2
                    </span>
                    <span>Arrive 10 minutes en avance pour te présenter à l'équipe.</span>
                  </li>
                  <li className="d-flex align-items-start gap-2">
                    <span
                      className="badge rounded-pill"
                      style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                    >
                      3
                    </span>
                    <span>Prévoyez une tenue adaptée (chaussures fermées, vêtement confortable).</span>
                  </li>
                </ul>
              </div>
            </div>

            {canSeeVolunteers && opportunity.volunteers && opportunity.volunteers.length > 0 && (
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="text-uppercase text-muted small mb-3">
                    Volontaires inscrits
                  </h6>
                  <ul className="list-group list-group-flush">
                    {opportunity.volunteers.map((v) => (
                      <li key={v._id} className="list-group-item px-0">
                        {v.name || v.email}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
