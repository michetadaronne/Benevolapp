import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Opportunity, User } from "../types";

const API_BASE_URL = "http://localhost:3000";
const BRAND_GREEN = "#0b6b4c";

type OpportunityForm = {
  title: string;
  organization: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  description: string;
  categories: string;
};

export default function OrgDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<OpportunityForm>({
    title: "",
    organization: "",
    city: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    categories: "",
  });
  const [creating, setCreating] = useState<boolean>(false);
  const [createStatus, setCreateStatus] = useState<string>("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OpportunityForm | null>(null);
  const [editStatus, setEditStatus] = useState<string>("");

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

  async function loadMine() {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Connectez-vous en tant qu'organisateur.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/opportunities/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 403 || res.status === 401) {
        setError("Réservé aux organisateurs.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Erreur réseau");
      }
      const data = (await res.json()) as Opportunity[];
      setOpportunities(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos opportunités.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  function handleChangeForm(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleChangeEdit(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setEditForm((prev) => (prev ? { ...prev, [name]: value } : prev));
  }

  function startEdit(opp: Opportunity) {
    setEditingId(opp._id);
    setEditStatus("");
    setEditForm({
      title: opp.title || "",
      organization: opp.organization || "",
      city: opp.city || "",
      date: opp.date || "",
      startTime: opp.startTime || "",
      endTime: opp.endTime || "",
      description: opp.description || "",
      categories: Array.isArray(opp.categories) ? opp.categories.join(", ") : "",
    });
  }

  async function handleCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreateStatus("");

    if (!user || user.role !== "organizer") {
      setCreateStatus("Réservé aux organisateurs.");
      return;
    }

    if (!form.date || !form.startTime || !form.endTime || !form.city) {
      setCreateStatus("Renseignez date, ville, heure début et fin.");
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      setCreateStatus("Connectez-vous pour publier une mission.");
      return;
    }

    try {
      setCreating(true);
      const res = await fetch(`${API_BASE_URL}/api/opportunities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          categories: form.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Erreur serveur");
      }
      setCreateStatus("Mission créée");
      setForm({
        title: "",
        organization: "",
        city: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        categories: "",
      });
      await loadMine();
    } catch (err) {
      console.error(err);
      setCreateStatus((err as Error).message || "Impossible de créer la mission");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: string) {
    if (!editForm) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      setEditStatus("Connectez-vous pour modifier la mission.");
      return;
    }
    try {
      setEditStatus("Enregistrement...");
      const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          categories: editForm.categories
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "Erreur lors de la mise à jour");
      }
      setEditStatus("Mission mise à jour");
      setEditingId(null);
      setEditForm(null);
      await loadMine();
    } catch (err) {
      console.error(err);
      setEditStatus((err as Error).message || "Impossible de mettre à jour");
    }
  }

  async function handleDelete(id: string) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setEditStatus("Connectez-vous pour supprimer la mission.");
      return;
    }
    const confirmed = window.confirm("Supprimer cette mission ?");
    if (!confirmed) return;
    try {
      setEditStatus("Suppression...");
      const res = await fetch(`${API_BASE_URL}/api/opportunities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }
      setEditStatus("Mission supprimée");
      await loadMine();
    } catch (err) {
      console.error(err);
      setEditStatus((err as Error).message || "Impossible de supprimer");
    }
  }

  const totalVolunteers = useMemo(
    () => opportunities.reduce((acc, opp) => acc + (opp.volunteerCount || 0), 0),
    [opportunities]
  );

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

  if (error) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "#f5f7f6" }}
      >
        <div className="card shadow-sm border-0" style={{ maxWidth: 420 }}>
          <div className="card-body text-center p-4">
            <h1 className="h5 mb-2">Espace organisateur</h1>
            <p className="text-muted mb-4">{error}</p>
            <Link className="btn btn-outline-success" to="/">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "organizer") {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Réservé aux organisateurs. <Link to="/login">Connectez-vous</Link>.
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
            <div>
              <p className="text-uppercase small fw-semibold text-muted mb-1">
                Espace organisateur
              </p>
              <h1 className="h3 mb-2" style={{ color: BRAND_GREEN }}>
                Bonjour, {user.name || user.email}
              </h1>
              <div className="d-flex align-items-center flex-wrap gap-3">
                <span
                  className="badge rounded-pill"
                  style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                >
                  Organisateur
                </span>
                <span className="text-muted small">ID : {user._id}</span>
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
                  <p className="text-muted small mb-1">Missions publiées</p>
                  <h2 className="h4 mb-0">{opportunities.length}</h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Volontaires inscrits</p>
                  <h2 className="h4 mb-0">{totalVolunteers}</h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Prochaine mission</p>
                  <h2 className="h6 mb-0">
                    {opportunities[0]?.date || "À planifier"}
                  </h2>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted small mb-1">Créer</p>
                  <h2 className="h6 mb-0">Nouvelle mission</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: "-40px" }}>
        <div className="row g-4">
          <div className="col-lg-5">
            <div className="card shadow-sm border-0" id="create">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h2 className="h6 mb-1">Publier une mission</h2>
                    <p className="text-muted small mb-0">
                      Renseignez les informations clés et publiez.
                    </p>
                  </div>
                  <span
                    className="badge text-uppercase"
                    style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                  >
                    Création
                  </span>
                </div>
                <form className="d-grid gap-3" onSubmit={handleCreate}>
                  <div>
                    <label className="form-label small fw-semibold">Titre</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      placeholder="Nom de la mission"
                      value={form.title}
                      onChange={(e) => handleChange(e, setForm)}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Organisation</label>
                    <input
                      type="text"
                      name="organization"
                      className="form-control"
                      placeholder="Association organisatrice"
                      value={form.organization}
                      onChange={(e) => handleChange(e, setForm)}
                      required
                    />
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Ville</label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        placeholder="Ville"
                        value={form.city}
                        onChange={(e) => handleChange(e, setForm)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Date</label>
                      <input
                        type="date"
                        name="date"
                        className="form-control"
                        value={form.date}
                        onChange={(e) => handleChange(e, setForm)}
                        required
                      />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Heure début</label>
                      <input
                        type="time"
                        name="startTime"
                        className="form-control"
                        value={form.startTime}
                        onChange={(e) => handleChange(e, setForm)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Heure fin</label>
                      <input
                        type="time"
                        name="endTime"
                        className="form-control"
                        value={form.endTime}
                        onChange={(e) => handleChange(e, setForm)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows={3}
                      placeholder="Détails de la mission"
                      value={form.description}
                      onChange={(e) => handleChange(e, setForm)}
                    />
                  </div>
                  <div>
                    <label className="form-label small fw-semibold">Catégories (virgules)</label>
                    <input
                      type="text"
                      name="categories"
                      className="form-control"
                      placeholder="ex: logistique, accueil, animation"
                      value={form.categories}
                      onChange={(e) => handleChange(e, setForm)}
                    />
                  </div>
                  <button
                    className="btn text-white"
                    type="submit"
                    disabled={creating}
                    style={{ backgroundColor: BRAND_GREEN }}
                  >
                    {creating ? "Publication..." : "Créer la mission"}
                  </button>
                  {createStatus && (
                    <p className="small text-muted mb-0">{createStatus}</p>
                  )}
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="h6 mb-1">Vos opportunités</h2>
                <p className="text-muted small mb-0">
                  Gérez vos missions et suivez les inscriptions.
                </p>
              </div>
              <Link to="/" className="small" style={{ color: BRAND_GREEN }}>
                &lt; Retour aux missions
              </Link>
            </div>

            {opportunities.length === 0 && (
              <div className="alert alert-info">
                Aucune opportunité pour le moment.
              </div>
            )}

            <div className="row g-3">
              {opportunities.map((opp) => {
                const timeRange = () => {
                  const start = opp.startTime || opp.time;
                  const end = opp.endTime || opp.time;
                  if (!start && !end) return null;
                  if (start && end) return `${start} - ${end}`;
                  return start || end;
                };

                return (
                  <div key={opp._id} className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5 className="mb-1">{opp.title}</h5>
                            <p className="text-muted small mb-1">
                              {opp.organization}
                            </p>
                            <p className="text-muted small mb-2">
                              {opp.city} · {opp.date || "Date à venir"}{" "}
                              {timeRange() ? `· ${timeRange()}` : ""}
                            </p>
                          </div>
                          <span
                            className="badge text-uppercase"
                            style={{ backgroundColor: "#e3f3ec", color: BRAND_GREEN }}
                          >
                            {opp.city || "Ville"}
                          </span>
                        </div>

                        {opp.categories && opp.categories.length > 0 && (
                          <p className="text-muted small mb-2">
                            Catégories : {opp.categories.join(", ")}
                          </p>
                        )}
                        <p className="text-muted small mb-3">
                          {opp.description || "Pas de description."}
                        </p>

                        <div className="d-flex align-items-center flex-wrap gap-3 mb-3">
                          <span className="badge bg-light text-dark">
                            {opp.volunteerCount || 0} inscrit(s)
                          </span>
                          <Link to={`/opportunity/${opp._id}`} className="small">
                            Voir la page
                          </Link>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => startEdit(opp)}
                          >
                            Modifier
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(opp._id)}
                          >
                            Supprimer
                          </button>
                        </div>

                        {editingId === opp._id && editForm && (
                          <div className="mt-3 p-3 border rounded">
                            <h3 className="h6 mb-2">Modifier la mission</h3>
                            <div className="row g-2">
                              <div className="col-md-6">
                                <label className="form-label small">Titre</label>
                                <input
                                  className="form-control"
                                  name="title"
                                  value={editForm.title}
                                  onChange={(e) => handleChange(e, setEditForm)}
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label small">Organisation</label>
                                <input
                                  className="form-control"
                                  name="organization"
                                  value={editForm.organization}
                                  onChange={(e) => handleChange(e, setEditForm)}
                                />
                              </div>
                            </div>
                            <div className="row g-2 mt-2">
                              <div className="col-md-4">
                                <label className="form-label small">Ville</label>
                                <input
                                  className="form-control"
                                  name="city"
                                  value={editForm.city}
                                  onChange={(e) => handleChange(e, setEditForm)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small">Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="date"
                                  value={editForm.date}
                                  onChange={(e) => handleChange(e, setEditForm)}
                                />
                              </div>
                              <div className="col-md-4">
                                <label className="form-label small">Horaires</label>
                                <div className="d-flex gap-2">
                                  <input
                                    type="time"
                                    className="form-control"
                                    name="startTime"
                                    value={editForm.startTime}
                                    onChange={(e) => handleChange(e, setEditForm)}
                                  />
                                  <input
                                    type="time"
                                    className="form-control"
                                    name="endTime"
                                    value={editForm.endTime}
                                    onChange={(e) => handleChange(e, setEditForm)}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="form-label small">Description</label>
                              <textarea
                                className="form-control"
                                rows={2}
                                name="description"
                                value={editForm.description}
                                onChange={(e) => handleChange(e, setEditForm)}
                              />
                            </div>
                            <div className="mt-2">
                              <label className="form-label small">Catégories (virgules)</label>
                              <input
                                className="form-control"
                                name="categories"
                                value={editForm.categories}
                                onChange={(e) => handleChange(e, setEditForm)}
                              />
                            </div>
                            <div className="d-flex gap-2 mt-3">
                              <button
                                type="button"
                                className="btn btn-success btn-sm text-white"
                                onClick={() => handleUpdate(opp._id)}
                              >
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => {
                                  setEditingId(null);
                                  setEditForm(null);
                                }}
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {editStatus && <p className="small text-muted mb-0 mt-2">{editStatus}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
