import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Panel.css";

// ── Types ─────────────────────────────────────────────────
interface UserInfo {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  isAdmin: boolean;
  role: string;
}

interface Abonnement {
  id: number;
  statut: string;
  dateDebut: string;
  dateFin: string;
  forfait: { nom: string; prix: number; dureeJours: number };
}

interface UserRow {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
  dateInscription: string;
}

interface StatsData {
  parMois: { mois: string; total: number }[];
  parForfait: { nom: string; total: number }[];
  parMoisParForfait: { mois: string; forfait: string; total: number }[];
}

// ── Utilitaire JWT ─────────────────────────────────────────
function decodeToken(token: string): Partial<UserInfo> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
const API_URL = "http://91.134.138.162:3000/api";
// ══════════════════════════════════════════════════════════
export default function Panel() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginMsg, setLoginMsg] = useState("");

  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        // Récupère les infos user depuis la réponse ou le JWT
        const payload = decodeToken(data.accessToken);
        const user: UserInfo = {
          id:      data.user?.id       ?? payload?.id      ?? 0,
          nom:     data.user?.nom      ?? payload?.nom     ?? "",
          prenom:  data.user?.prenom   ?? payload?.prenom  ?? "",
          email:   data.user?.email    ?? payload?.email   ?? loginEmail,
          isAdmin: data.user?.isAdmin  ?? payload?.isAdmin ?? (payload?.role === "admin"),
          role:    data.user?.role     ?? payload?.role    ?? "user",
        };
        setCurrentUser(user);
      } else {
        setLoginMsg(data.error || "Identifiants incorrects.");
      }
    } catch {
      setLoginMsg("Erreur de connexion au serveur.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setCurrentUser(null);
  };

  // ── Écran de connexion ─────────────────────────────────
  if (!currentUser) {
    return (
      <div className="login-page">
        <form onSubmit={handleLogin} className="login-form">
          <img src="/logoarcs.png" alt="Logo" className="login-logo" />
          <h2 className="login-title">MON ESPACE</h2>
          <p className="login-subtitle">Les Arcs 1800</p>

          <input
            className="login-input"
            type="email"
            placeholder="Adresse e-mail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
          <input
            className="login-input-last"
            type="password"
            placeholder="Mot de passe"
            value={loginPass}
            onChange={(e) => setLoginPass(e.target.value)}
          />
          <button type="submit" className="login-btn">SE CONNECTER</button>
          {loginMsg && <p className="login-error">{loginMsg}</p>}
        </form>
      </div>
    );
  }

  // ── Header commun ──────────────────────────────────────
  const Header = () => (
    <>
      <header className="panel-header">
        <img src="/logoarcs.png" alt="Logo" className="panel-header-logo" />
        <div className="panel-header-center">
          <h2 className="panel-header-title">
            {currentUser.isAdmin ? "ADMINISTRATION" : "MON ESPACE"}
          </h2>
          <span className={`panel-role-badge ${currentUser.isAdmin ? "badge-admin" : "badge-user"}`}>
            {currentUser.isAdmin ? "⚙ ADMIN" : "🎿 MEMBRE"}
          </span>
        </div>
        <div className="panel-header-right">
          <span className="panel-header-username">
            {currentUser.prenom || currentUser.nom
              ? `${currentUser.prenom} ${currentUser.nom}`.trim()
              : currentUser.email}
          </span>
          <button className="panel-logout-btn" onClick={handleLogout}>
            DÉCONNEXION
          </button>
        </div>
      </header>
      <nav className="panel-nav">
        <Link to="/" className="panel-nav-link">← REVENIR AU SITE</Link>
      </nav>
    </>
  );

  // ── Vue ADMIN ──────────────────────────────────────────
  if (currentUser.isAdmin) {
    return <AdminView user={currentUser} Header={Header} onLogout={handleLogout} />;
  }

  // ── Vue UTILISATEUR ────────────────────────────────────
  return <UserView user={currentUser} Header={Header} />;
}

// ══════════════════════════════════════════════════════════
// COMPOSANT PARTAGÉ — affichage des forfaits d'un utilisateur
// ══════════════════════════════════════════════════════════
function MesForfaits({ user }: { user: UserInfo }) {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_URL}/users/${user.id}/abonnements`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAbonnements(Array.isArray(data) ? data : []))
      .catch(() => setAbonnements([]))
      .finally(() => setLoading(false));
  }, [user.id]);

  const statutClass = (s: string) =>
    s === "actif" ? "statut-actif" : s === "annule" ? "statut-annule" : "statut-expire";

  return (
    <>
      <div className="section-title-row">
        <h3 className="section-title">🎿 MES FORFAITS</h3>
        <Link to="/" className="section-link">+ Souscrire à un forfait</Link>
      </div>

      {loading ? (
        <p className="panel-loading">Chargement…</p>
      ) : abonnements.length === 0 ? (
        <div className="user-no-forfait">
          <p className="user-no-forfait-text">Aucun forfait actif.</p>
          <Link to="/" className="user-no-forfait-btn">VOIR NOS OFFRES</Link>
        </div>
      ) : (
        <div className="user-forfaits-grid">
          {abonnements.map((a) => (
            <div key={a.id} className="user-forfait-card">
              <div className={`user-forfait-statut ${statutClass(a.statut)}`}>
                {a.statut.toUpperCase()}
              </div>
              <h4 className="user-forfait-nom">{a.forfait?.nom ?? "Forfait"}</h4>
              <p className="user-forfait-prix">{a.forfait?.prix ?? "—"} €</p>
              <div className="user-forfait-dates">
                <span>Du {new Date(a.dateDebut).toLocaleDateString("fr-FR")}</span>
                <span>au {new Date(a.dateFin).toLocaleDateString("fr-FR")}</span>
              </div>
              <p className="user-forfait-duree">
                {a.forfait?.dureeJours ?? "?"} jour{(a.forfait?.dureeJours ?? 1) > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// VUE UTILISATEUR
// ══════════════════════════════════════════════════════════
function UserView({ user, Header }: { user: UserInfo; Header: React.FC }) {
  return (
    <div className="panel-page">
      <Header />
      <main className="panel-main">

        <div className="user-welcome-card">
          <div className="user-welcome-avatar">
            {(user.prenom?.[0] ?? user.nom?.[0] ?? "?").toUpperCase()}
          </div>
          <div>
            <h2 className="user-welcome-name">
              Bonjour, {user.prenom || user.nom || user.email} !
            </h2>
            <p className="user-welcome-email">{user.email}</p>
          </div>
        </div>

        <MesForfaits user={user} />

      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// VUE ADMIN — gestion utilisateurs
// ══════════════════════════════════════════════════════════
function AdminView({
  user,
  Header,
}: {
  user: UserInfo;
  Header: React.FC;
  onLogout: () => void;
}) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<StatsData | null>(null);

  // Formulaire ajout
  const [fNom, setFNom] = useState("");
  const [fPrenom, setFPrenom] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fMdp, setFMdp] = useState("");
  const [fRole, setFRole] = useState("user");
  const [addMsg, setAddMsg] = useState("");

  // Modération
  const [expandedUser, setExpandedUser]       = useState<number | null>(null);
  const [userAbonnements, setUserAbonnements] = useState<Record<number, Abonnement[]>>({});
  const [resetTarget, setResetTarget]         = useState<number | null>(null);
  const [resetPwd, setResetPwd]               = useState("");
  const [resetMsg, setResetMsg]               = useState("");

  const token = () => localStorage.getItem("accessToken") ?? "";

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = res.ok ? await res.json() : [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    fetch(`${API_URL}/abonnements/stats`, {
      headers: { Authorization: `Bearer ${token()}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setStatsData(data))
      .catch(() => {});
  }, []);


  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddMsg("");
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ nom: fNom, prenom: fPrenom, email: fEmail, motDePasse: fMdp, role: fRole }),
      });
      if (res.ok) {
        setFNom(""); setFPrenom(""); setFEmail(""); setFMdp(""); setFRole("user");
        setAddMsg("✓ Utilisateur créé avec succès.");
        loadUsers();
      } else {
        const d = await res.json();
        setAddMsg(d.error ?? "Erreur lors de la création.");
      }
    } catch {
      setAddMsg("Erreur de connexion au serveur.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token()}` },
      });
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  const handleRoleChange = async (u: UserRow, newRole: string) => {
    try {
      await fetch(`${API_URL}/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ role: newRole }),
      });
      setUsers((prev) => prev.map((r) => (r.id === u.id ? { ...r, role: newRole } : r)));
    } catch { alert("Erreur lors du changement de rôle."); }
  };

  const handleResetPassword = async (userId: number) => {
    if (!resetPwd.trim()) return;
    try {
      await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ motDePasse: resetPwd }),
      });
      setResetMsg("✓ Mot de passe réinitialisé.");
      setResetPwd("");
      setTimeout(() => { setResetTarget(null); setResetMsg(""); }, 2000);
    } catch { alert("Erreur lors de la réinitialisation."); }
  };

  const toggleAbonnements = async (userId: number) => {
    if (expandedUser === userId) { setExpandedUser(null); return; }
    if (!userAbonnements[userId]) {
      try {
        const res = await fetch(`${API_URL}/users/${userId}/abonnements`, {
          headers: { Authorization: `Bearer ${token()}` },
        });
        const data = res.ok ? await res.json() : [];
        setUserAbonnements((prev) => ({ ...prev, [userId]: Array.isArray(data) ? data : [] }));
      } catch { setUserAbonnements((prev) => ({ ...prev, [userId]: [] })); }
    }
    setExpandedUser(userId);
  };

  const toggleActif = async (u: UserRow) => {
    try {
      await fetch(`${API_URL}/users/${u.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token()}`,
        },
        body: JSON.stringify({ actif: !u.actif }),
      });
      setUsers((prev) =>
        prev.map((r) => (r.id === u.id ? { ...r, actif: !r.actif } : r))
      );
    } catch {
      alert("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="panel-page">
      <Header />
      <main className="panel-main">

        {/* Forfaits de l'admin */}
        <MesForfaits user={user} />

        {/* Séparateur */}
        <div className="admin-section-divider">
          <div className="admin-section-divider-line" />
          <span className="admin-section-divider-label">⚙ GESTION</span>
          <div className="admin-section-divider-line" />
        </div>

        {/* Stats rapides */}
        <div className="admin-stats-row">
          <div className="admin-stat-card">
            <span className="admin-stat-number">{users.length}</span>
            <span className="admin-stat-label">Utilisateurs</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-number">{users.filter((u) => u.actif).length}</span>
            <span className="admin-stat-label">Comptes actifs</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-number">{users.filter((u) => u.role === "moderateur" || u.role === "super_admin").length}</span>
            <span className="admin-stat-label">Modérateurs</span>
          </div>
        </div>

        {/* Statistiques d'achats — graphique en ligne */}
        {statsData && (
          <div className="admin-chart-card">
            <h3 className="admin-chart-title">📈 Fréquence d'achats par type de forfait (12 derniers mois)</h3>
            <LineChart parMois={statsData.parMois} parMoisParForfait={statsData.parMoisParForfait} />
          </div>
        )}

        {/* Formulaire ajout */}
        <div className="panel-add-section">
          <h3 className="panel-add-title">AJOUTER UN UTILISATEUR</h3>
          <form className="admin-add-form" onSubmit={handleAdd}>
            <div className="admin-add-row">
              <input className="panel-add-input" placeholder="Prénom" value={fPrenom} onChange={(e) => setFPrenom(e.target.value)} required />
              <input className="panel-add-input" placeholder="Nom" value={fNom} onChange={(e) => setFNom(e.target.value)} required />
              <input className="panel-add-input" placeholder="Email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} required />
              <input className="panel-add-input" placeholder="Mot de passe" type="password" value={fMdp} onChange={(e) => setFMdp(e.target.value)} required />
              <select className="panel-add-select" value={fRole} onChange={(e) => setFRole(e.target.value)}>
                <option value="user">Membre</option>
                <option value="moderateur">Modérateur</option>
                <option value="super_admin">Super Admin</option>
              </select>
              <button type="submit" className="panel-add-btn">CRÉER</button>
            </div>
            {addMsg && (
              <p className={addMsg.startsWith("✓") ? "admin-msg-ok" : "admin-msg-err"}>
                {addMsg}
              </p>
            )}
          </form>
        </div>

        {/* Table utilisateurs */}
        <div className="section-title-row">
          <h3 className="section-title">👥 LISTE DES UTILISATEURS</h3>
        </div>

        {loading ? (
          <p className="panel-loading">Chargement…</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr>
                <th>NOM</th>
                <th>EMAIL</th>
                <th>RÔLE</th>
                <th>INSCRIPTION</th>
                <th>STATUT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <>
                  {/* ── Ligne principale ── */}
                  <tr key={u.id} className={!u.actif ? "row-inactive" : ""}>
                    <td className="panel-table-name">{u.prenom} {u.nom}</td>
                    <td className="panel-table-email">{u.email}</td>
                    <td>
                      {u.id !== user.id ? (
                        <select
                          className={`mod-role-select role-${u.role ?? "user"}`}
                          value={u.role ?? "user"}
                          onChange={(e) => handleRoleChange(u, e.target.value)}
                        >
                          <option value="user">Membre</option>
                          <option value="moderateur">Modérateur</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      ) : (
                        <span className={`role-badge role-${u.role ?? "user"}`}>{u.role ?? "user"}</span>
                      )}
                    </td>
                    <td className="panel-table-date">
                      {u.dateInscription ? new Date(u.dateInscription).toLocaleDateString("fr-FR") : "—"}
                    </td>
                    <td>
                      <button
                        className={`actif-toggle ${u.actif ? "toggle-on" : "toggle-off"}`}
                        onClick={() => toggleActif(u)}
                        title={u.actif ? "Désactiver" : "Activer"}
                      >
                        {u.actif ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td className="mod-actions-cell">
                      <button
                        className="mod-action-btn mod-btn-forfaits"
                        onClick={() => toggleAbonnements(u.id)}
                        title="Voir les forfaits"
                      >
                        🎿
                      </button>
                      {u.id !== user.id && (
                        <>
                          <button
                            className="mod-action-btn mod-btn-reset"
                            onClick={() => { setResetTarget(resetTarget === u.id ? null : u.id); setResetPwd(""); setResetMsg(""); }}
                            title="Réinitialiser le mot de passe"
                          >
                            🔑
                          </button>
                          <button
                            className="admin-delete-btn"
                            onClick={() => handleDelete(u.id)}
                            title="Supprimer"
                          >
                            🗑
                          </button>
                        </>
                      )}
                    </td>
                  </tr>

                  {/* ── Panneau reset mot de passe ── */}
                  {resetTarget === u.id && (
                    <tr className="mod-expand-row">
                      <td colSpan={6}>
                        <div className="mod-reset-panel">
                          <span className="mod-reset-label">🔑 Nouveau mot de passe pour <strong>{u.prenom} {u.nom}</strong></span>
                          <input
                            className="mod-reset-input"
                            type="password"
                            placeholder="Nouveau mot de passe"
                            value={resetPwd}
                            onChange={(e) => setResetPwd(e.target.value)}
                          />
                          <button className="mod-reset-confirm" onClick={() => handleResetPassword(u.id)}>
                            CONFIRMER
                          </button>
                          {resetMsg && <span className="mod-reset-msg">{resetMsg}</span>}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* ── Panneau abonnements ── */}
                  {expandedUser === u.id && (
                    <tr className="mod-expand-row">
                      <td colSpan={6}>
                        <div className="mod-abo-panel">
                          <span className="mod-abo-title">🎿 Forfaits de {u.prenom} {u.nom}</span>
                          {(userAbonnements[u.id] ?? []).length === 0 ? (
                            <span className="mod-abo-empty">Aucun forfait souscrit.</span>
                          ) : (
                            <div className="mod-abo-list">
                              {(userAbonnements[u.id] ?? []).map((a) => (
                                <div key={a.id} className="mod-abo-item">
                                  <span className={`user-forfait-statut ${a.statut === "actif" ? "statut-actif" : a.statut === "annule" ? "statut-annule" : "statut-expire"}`}>
                                    {a.statut}
                                  </span>
                                  <strong>{a.forfait?.nom ?? "—"}</strong>
                                  <span>{a.forfait?.prix ?? "—"} €</span>
                                  <span>
                                    {new Date(a.dateDebut).toLocaleDateString("fr-FR")} → {new Date(a.dateFin).toLocaleDateString("fr-FR")}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// GRAPHIQUE EN LIGNE SVG — fréquence d'achats
// ══════════════════════════════════════════════════════════
function LineChart({
  parMois,
  parMoisParForfait,
}: {
  parMois: { mois: string; total: number }[];
  parMoisParForfait: { mois: string; forfait: string; total: number }[];
}) {
  if (parMois.length === 0) {
    return <p style={{ color: '#999', textAlign: 'center', padding: '16px 0' }}>Aucune donnée sur les 12 derniers mois.</p>;
  }

  const months = parMois.map(m => m.mois);
  const forfaitNames = [...new Set(parMoisParForfait.map(r => r.forfait))].sort();

  const totalByMonth: Record<string, number> = {};
  parMois.forEach(m => { totalByMonth[m.mois] = m.total; });

  const forfaitByMonth: Record<string, Record<string, number>> = {};
  forfaitNames.forEach(nom => { forfaitByMonth[nom] = {}; });
  parMoisParForfait.forEach(r => { forfaitByMonth[r.forfait][r.mois] = r.total; });

  // Calcul de l'échelle Y
  const allValues = [...parMois.map(m => m.total), ...parMoisParForfait.map(r => r.total)];
  const rawMax = Math.max(...allValues, 1);
  const yStep = rawMax <= 5 ? 1 : rawMax <= 20 ? 5 : rawMax <= 50 ? 10 : rawMax <= 100 ? 20 : 50;
  const yMax = Math.ceil(rawMax / yStep) * yStep + yStep;
  const yTicks: number[] = [];
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(v);

  const W = 680;
  const H = 320;
  const PAD = { top: 20, right: 30, bottom: 75, left: 55 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const xScale = (i: number) =>
    months.length === 1 ? PAD.left + chartW / 2 : PAD.left + (i / (months.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - (v / yMax) * chartH;

  const COLORS = ['#2c3e50', '#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#e67e22'];
  const MARKERS = ['circle', 'triangle', 'square', 'diamond'];

  const series = [
    { label: 'Total', values: months.map(m => totalByMonth[m] ?? 0), color: COLORS[0], marker: 'circle' },
    ...forfaitNames.map((nom, i) => ({
      label: nom,
      values: months.map(m => forfaitByMonth[nom]?.[m] ?? 0),
      color: COLORS[(i + 1) % COLORS.length],
      marker: MARKERS[(i + 1) % MARKERS.length],
    })),
  ];

  const formatLabel = (mois: string) => {
    const [y, m] = mois.split('-');
    return new Date(Number(y), Number(m) - 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
  };

  const legendCols = Math.min(series.length, 3);
  const legendRows = Math.ceil(series.length / legendCols);
  const LEGEND_ITEM_W = 180;
  const svgH = H + legendRows * 24 + 10;

  const renderMarker = (mx: number, my: number, type: string, color: string, key: string) => {
    if (type === 'triangle') return <polygon key={key} points={`${mx},${my - 6} ${mx - 5},${my + 4} ${mx + 5},${my + 4}`} fill={color} />;
    if (type === 'square')   return <rect    key={key} x={mx - 4} y={my - 4} width={8} height={8} fill={color} />;
    if (type === 'diamond')  return <polygon key={key} points={`${mx},${my - 6} ${mx + 5},${my} ${mx},${my + 6} ${mx - 5},${my}`} fill={color} />;
    return <circle key={key} cx={mx} cy={my} r={5} fill={color} />;
  };

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${W} ${svgH}`}
      style={{ display: 'block', maxWidth: '100%', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Fond zone graphique */}
      <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH} fill="#fafafa" stroke="#e0e0e0" strokeWidth={1} />

      {/* Grille horizontale */}
      {yTicks.map(v => (
        <line key={`g${v}`} x1={PAD.left} y1={yScale(v)} x2={PAD.left + chartW} y2={yScale(v)}
          stroke={v === 0 ? '#ccc' : '#e8e8e8'} strokeWidth={1} strokeDasharray={v === 0 ? '' : '4,3'} />
      ))}

      {/* Axes */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + chartH} stroke="#555" strokeWidth={1.5} />
      <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH} stroke="#555" strokeWidth={1.5} />

      {/* Labels axe Y */}
      {yTicks.map(v => (
        <text key={`yt${v}`} x={PAD.left - 8} y={yScale(v) + 4} textAnchor="end" fontSize={11} fill="#555">{v}</text>
      ))}

      {/* Titre axe Y */}
      <text x={13} y={PAD.top + chartH / 2} textAnchor="middle" fontSize={11} fill="#666"
        transform={`rotate(-90, 13, ${PAD.top + chartH / 2})`}>
        Nombre d'achats
      </text>

      {/* Labels axe X */}
      {months.map((m, i) => (
        <text key={`xt${m}`} x={xScale(i)} y={PAD.top + chartH + 18} textAnchor="middle" fontSize={11} fill="#555">
          {formatLabel(m)}
        </text>
      ))}

      {/* Titre axe X */}
      <text x={PAD.left + chartW / 2} y={PAD.top + chartH + 42} textAnchor="middle" fontSize={12} fill="#666">
        Mois
      </text>

      {/* Lignes + marqueurs */}
      {series.map(s => {
        const pts = s.values.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
        return (
          <g key={s.label}>
            <polyline points={pts} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" />
            {s.values.map((v, i) => renderMarker(xScale(i), yScale(v), s.marker, s.color, `${s.label}-${i}`))}
          </g>
        );
      })}

      {/* Légende */}
      {series.map((s, idx) => {
        const col = idx % legendCols;
        const row = Math.floor(idx / legendCols);
        const legendStartX = (W - legendCols * LEGEND_ITEM_W) / 2;
        const lx = legendStartX + col * LEGEND_ITEM_W;
        const ly = H + 8 + row * 24;
        return (
          <g key={`leg-${s.label}`}>
            {renderMarker(lx + 10, ly + 6, s.marker, s.color, `legm-${s.label}`)}
            <text x={lx + 24} y={ly + 11} fontSize={12} fill="#333">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
