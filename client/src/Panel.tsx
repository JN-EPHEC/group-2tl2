import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Panel.css";

export default function Panel() {
  const [users, setUsers] = useState<{ id: number; username: string; email: string }[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msg, setMsg] = useState("");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    localStorage.removeItem("accessToken");
  }, []);

  const loadPersonnel = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Erreur serveur", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        setIsAuthenticated(true);
        loadPersonnel(data.accessToken);
      } else {
        setMsg(data.error || "Identifiants incorrects.");
      }
    } catch (err) {
      setMsg("Erreur de connexion au serveur.");
    }
  };

  const handleAdd = async () => {
    if (!nom || !email) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: nom, email }),
      });
      if (res.ok) {
        setNom("");
        setEmail("");
        loadPersonnel(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <form onSubmit={handleLogin} className="login-form">
          <img src="/logoarcs.png" alt="Logo" className="login-logo" />
          <h2 className="login-title">INTRANET SÉCURISÉ</h2>

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

          <button type="submit" className="login-btn">
            OUVRIR MA SESSION
          </button>
          {msg && <p className="login-error">{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="panel-page">
      <header className="panel-header">
        <img src="/logoarcs.png" alt="Logo" className="panel-header-logo" />
        <h2 className="panel-header-title">PANNEAU DE GESTION</h2>
        <button className="panel-logout-btn" onClick={() => setIsAuthenticated(false)}>
          DÉCONNEXION
        </button>
      </header>

      <nav className="panel-nav">
        <Link to="/" className="panel-nav-link">⬅ REVENIR AU SITE PUBLIC</Link>
      </nav>

      <main className="panel-main">
        <div className="panel-add-section">
          <h3 className="panel-add-title">AJOUTER UN COLLABORATEUR</h3>
          <div className="panel-add-form">
            <input
              className="panel-add-input"
              placeholder="Nom complet"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <input
              className="panel-add-input"
              placeholder="Email professionnel"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="panel-add-btn" onClick={handleAdd}>
              ENREGISTRER
            </button>
          </div>
        </div>

        <table className="panel-table">
          <thead>
            <tr>
              <th>NOM COMPLET</th>
              <th>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="panel-table-name">{u.username.toUpperCase()}</td>
                <td className="panel-table-email">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
