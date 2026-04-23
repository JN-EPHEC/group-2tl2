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

// ── Utilitaire JWT ─────────────────────────────────────────
function decodeToken(token: string): Partial<UserInfo> | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const API_URL = "http://localhost:3000/api";

// ══════════════════════════════════════════════════════════
export default function Panel() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [loginUser, setLoginUser] = useState("");
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
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        // Récupère les infos user depuis la réponse ou le JWT
        const payload = decodeToken(data.accessToken);
        const user: UserInfo = {
          id:      data.user?.id       ?? payload?.id      ?? 0,
          nom:     data.user?.nom      ?? payload?.nom     ?? loginUser,
          prenom:  data.user?.prenom   ?? payload?.prenom  ?? "",
          email:   data.user?.email    ?? payload?.email   ?? "",
          isAdmin: data.user?.isAdmin  ?? payload?.isAdmin ?? false,
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
            placeholder="Identifiant"
            value={loginUser}
            onChange={(e) => setLoginUser(e.target.value)}
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
// VUE UTILISATEUR — ses forfaits
// ══════════════════════════════════════════════════════════
function UserView({ user, Header }: { user: UserInfo; Header: React.FC }) {
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
    <div className="panel-page">
      <Header />
      <main className="panel-main">

        {/* Carte de bienvenue */}
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

        {/* Forfaits */}
        <div className="section-title-row">
          <h3 className="section-title">🎿 MES FORFAITS</h3>
          <Link to="/#forfaits" className="section-link">+ Souscrire à un forfait</Link>
        </div>

        {loading ? (
          <p className="panel-loading">Chargement…</p>
        ) : abonnements.length === 0 ? (
          <div className="user-no-forfait">
            <p className="user-no-forfait-text">Vous n'avez aucun forfait actif.</p>
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

  // Formulaire ajout
  const [fNom, setFNom] = useState("");
  const [fPrenom, setFPrenom] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fMdp, setFMdp] = useState("");
  const [fRole, setFRole] = useState("user");
  const [addMsg, setAddMsg] = useState("");

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

  useEffect(() => { loadUsers(); }, []);

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
                <tr key={u.id} className={!u.actif ? "row-inactive" : ""}>
                  <td className="panel-table-name">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="panel-table-email">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role ?? "user"}`}>
                      {u.role ?? "user"}
                    </span>
                  </td>
                  <td className="panel-table-date">
                    {u.dateInscription
                      ? new Date(u.dateInscription).toLocaleDateString("fr-FR")
                      : "—"}
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
                  <td>
                    {u.id !== user.id && (
                      <button
                        className="admin-delete-btn"
                        onClick={() => handleDelete(u.id)}
                        title="Supprimer"
                      >
                        🗑
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}