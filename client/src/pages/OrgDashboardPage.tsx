import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Opportunity, User } from "../types";
import { API_BASE_URL } from "../lib/api";

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

const emptyForm: OpportunityForm = {
  title: "",
  organization: "",
  city: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  categories: "",
};

export default function OrgDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<OpportunityForm>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<OpportunityForm | null>(null);
  const [editStatus, setEditStatus] = useState("");

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
      const data = await res.json();
      setOpportunities(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos opportunités");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMine();
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  function handleEditChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setEditForm((prev) => (prev ? { ...prev, [name]: value } : prev));
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
        throw new Error(data.error || "Erreur serveur");
      }
      setCreateStatus("Mission créée");
      setForm(emptyForm);
      await loadMine();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Impossible de créer la mission";
      setCreateStatus(message);
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
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }
      setEditStatus("Mission mise à jour");
      setEditingId(null);
      setEditForm(null);
      await loadMine();
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Impossible de mettre à jour";
      setEditStatus(message);
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
      const message = err instanceof Error ? err.message : "Impossible de supprimer";
      setEditStatus(message);
    }
  }

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  if (!user || user.role !== "organizer") {
    return <p>Réservé aux organisateurs.</p>;
  }

  return (
    <div className="container py-4">
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm" id="create">
            <div className="card-body">
              <h2 className="h5 mb-3">Publier une mission</h2>
              <form className="d-grid gap-3" onSubmit={handleCreate}>
                <div>
                  <label className="form-label small fw-semibold">Titre</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    placeholder="Nom de la mission"
                    value={form.title}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                  />
                </div>
                <button className="btn btn-success" type="submit" disabled={creating}>
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
            <h1 className="h4 mb-0">Vos opportunités</h1>
            <Link to="/" className="small">
              &lt; Retour aux missions
            </Link>
          </div>
          {opportunities.length === 0 && <p>Aucune opportunité pour le moment.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {opportunities.map((opp) => (
              <li
                key={opp._id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "1rem",
                  marginBottom: "0.75rem",
                }}
              >
                <h2 style={{ margin: 0 }}>{opp.title}</h2>
                <p style={{ margin: "0.25rem 0" }}>
                  {opp.organization} - {opp.city}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                  {opp.date} : {(opp.startTime || opp.time || "--")} - {(opp.endTime || opp.time || "--")}
                </p>
                {opp.categories && opp.categories.length > 0 && (
                  <p style={{ margin: "0.25rem 0", fontSize: "0.9rem" }}>
                    Catégories : {opp.categories.join(", ")}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Volontaires inscrits :</strong> {opp.volunteerCount || 0}
                </p>
                {opp.volunteers && opp.volunteers.length > 0 && (
                  <ul className="small mb-2">
                    {opp.volunteers.map((v) => (
                      <li key={v._id}>
                        {v.name || v.email} {v.email && v.name ? `(${v.email})` : ""}
                        {v.role ? ` - ${v.role}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="d-flex flex-wrap gap-2 align-items-center mt-2">
                  <Link to={`/opportunity/${opp._id}`}>Voir la page</Link>
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
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small">Organisation</label>
                        <input
                          className="form-control"
                          name="organization"
                          value={editForm.organization}
                          onChange={handleEditChange}
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
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small">Date</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date"
                          value={editForm.date}
                          onChange={handleEditChange}
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
                            onChange={handleEditChange}
                          />
                          <input
                            type="time"
                            className="form-control"
                            name="endTime"
                            value={editForm.endTime}
                            onChange={handleEditChange}
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
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="mt-2">
                      <label className="form-label small">Catégories (virgules)</label>
                      <input
                        className="form-control"
                        name="categories"
                        value={editForm.categories}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
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
              </li>
            ))}
          </ul>
          {editStatus && <p className="small text-muted mb-0">{editStatus}</p>}
        </div>
      </div>
    </div>
  );
}
