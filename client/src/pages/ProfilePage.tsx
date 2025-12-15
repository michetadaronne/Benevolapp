import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import type { Opportunity, User } from "../types";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [created, setCreated] = useState<Opportunity[]>([]);
  const [joined, setJoined] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Connectez-vous pour voir votre profil.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const userRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!userRes.ok) {
          throw new Error("Impossible de charger votre compte");
        }
        const userData = await userRes.json();
        setUser(userData.user as User);

        const joinedRes = await fetch(`${API_BASE_URL}/api/opportunities/joined`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (joinedRes.ok) {
          setJoined((await joinedRes.json()) as Opportunity[]);
        }

        if (userData.user?.role === "organizer") {
          const mineRes = await fetch(`${API_BASE_URL}/api/opportunities/mine`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (mineRes.ok) {
            setCreated((await mineRes.json()) as Opportunity[]);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const isOrganizer = user?.role === "organizer";

  const initials = useMemo(() => {
    if (!user) return "?";
    const base = user.name || user.email || "";
    return (
      base
        .split(/[\s.@_-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join("") || base.slice(0, 2).toUpperCase()
    );
  }, [user]);

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
  }

  const renderOpportunityCard = (opp: Opportunity, ctaLabel = "Voir") => {
    const timeRange = () => {
      const start = opp.startTime || opp.time;
      const end = opp.endTime || opp.time;
      if (!start && !end) return null;
      if (start && end) return `${start} - ${end}`;
      return start || end;
    };

    return (
      <div key={opp._id} className="col-md-6 col-lg-4">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body d-flex flex-column">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <h6 className="mb-1">{opp.title}</h6>
                <p className="text-muted small mb-0">{opp.organization}</p>
              </div>
              <span
                className="badge text-uppercase"
                style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
              >
                {opp.city}
              </span>
            </div>

            <p className="text-muted small mb-1">
              {opp.date || "Date à venir"} {timeRange() ? `· ${timeRange()}` : ""}
            </p>
            {opp.categories && opp.categories.length > 0 && (
              <p className="text-muted small mb-3">
                Catégories : {opp.categories.join(", ")}
              </p>
            )}
            <p className="text-muted small flex-grow-1 mb-3">
              {opp.description || "Pas de description pour le moment."}
            </p>
            <div className="d-flex justify-content-between align-items-center">
              {typeof opp.volunteerCount === "number" && (
                <span className="badge bg-light text-dark">
                  {opp.volunteerCount} inscrit(s)
                </span>
              )}
              <Link
                to={`/opportunity/${opp._id}`}
                className="btn btn-sm text-white ms-auto"
                style={{ backgroundColor: BRAND_GREEN }}
              >
                {ctaLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f5f7f6" }}
      >
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f5f7f6" }}
      >
        <div className="card shadow-sm border-0" style={{ maxWidth: 420 }}>
          <div className="card-body text-center p-4">
            <h1 className="h5 mb-2">Profil</h1>
            <p className="text-muted mb-4">
              {error || "Utilisateur non connecté."}
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link className="btn btn-success" to="/login">
                Se connecter
              </Link>
              <Link className="btn btn-outline-success" to="/">
                Retour à l&apos;accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f5f7f6" }}>
      <section
        style={{
          background:
            "linear-gradient(135deg, #f4f7f5 0%, #ffffff 50%, #e8f1ed 100%)",
          borderBottom: "1px solid #e5ede8",
        }}
      >
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  backgroundColor: "#e3f3ec",
                  color: BRAND_GREEN,
                  fontWeight: 700,
                  fontSize: "1.25rem",
                  overflow: "hidden",
                  border: "1px solid #d9e7df",
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="text-uppercase small fw-semibold text-muted mb-1">
                  Espace personnel
                </p>
                <h1 className="h3 mb-2" style={{ color: BRAND_GREEN }}>
                  Bonjour, {user.name || user.email}
                </h1>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  <span
                    className="badge rounded-pill"
                    style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                  >
                    {isOrganizer ? "Organisateur" : "Volontaire"}
                  </span>
                  <span className="text-muted small">ID : {user._id}</span>
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="btn btn-outline-success"
              style={{ borderColor: BRAND_GREEN, color: BRAND_GREEN }}
            >
              &lt; Retour à l&apos;accueil
            </Link>
          </div>

          <div className="row g-3 mt-4">
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Missions rejointes</p>
                  <h2 className="h4 mb-0">{joined.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Missions créées</p>
                  <h2 className="h4 mb-0">{created.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Nom</p>
                  <h2 className="h6 mb-0">{user.name || "Non renseigné"}</h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Email</p>
                  <h2 className="h6 mb-0">{user.email}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: "-50px" }}>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h2 className="h6 text-uppercase text-muted">Mon compte</h2>
                <div className="d-grid gap-2 mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Nom</span>
                    <span className="fw-semibold">
                      {user.name || "Non renseigné"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Email</span>
                    <span className="fw-semibold">{user.email}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Rôle</span>
                    <span className="fw-semibold">
                      {isOrganizer ? "Organisateur" : "Volontaire"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Identifiant</span>
                    <span className="fw-semibold">{user._id}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="btn btn-sm btn-outline-success mb-0">
                    Changer la photo
                    <input
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleAvatarChange}
                    />
                  </label>
                  <p className="text-muted small mb-0 mt-1">
                    JPG ou PNG, aperçu local uniquement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h2 className="h6 mb-1">Missions auxquelles vous participez</h2>
                    <p className="text-muted small mb-0">
                      Retrouvez les missions en cours ou passées.
                    </p>
                  </div>
                  <span className="badge bg-light text-dark">
                    {joined.length} mission(s)
                  </span>
                </div>
                {joined.length === 0 ? (
                  <p className="mb-0 text-muted">
                    Aucune mission rejointe pour le moment.
                  </p>
                ) : (
                  <div className="row g-3">{joined.map((opp) => renderOpportunityCard(opp))}</div>
                )}
              </div>
            </div>

            {isOrganizer && (
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h2 className="h6 mb-1">Missions que vous avez créées</h2>
                      <p className="text-muted small mb-0">
                        Gérez vos missions publiées.
                      </p>
                    </div>
                    <span className="badge bg-light text-dark">
                      {created.length} mission(s)
                    </span>
                  </div>
                  {created.length === 0 ? (
                    <p className="mb-0 text-muted">
                      Aucune mission publiée.{" "}
                      <Link to="/org" style={{ color: BRAND_GREEN }}>
                        Publiez votre première mission
                      </Link>
                      .
                    </p>
                  ) : (
                    <div className="row g-3">
                      {created.map((opp) => renderOpportunityCard(opp, "Gérer"))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
