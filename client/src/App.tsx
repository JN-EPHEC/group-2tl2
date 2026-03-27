import React, { useEffect, useState } from "react";

// Interface pour TypeScript
interface User { id: number; username: string; email: string; role?: string; }

function App() {
  // États pour l'Annuaire
  const [users, setUsers] = useState<User[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  // États pour l'Authentification (NOUVEAU)
  const [loginUser, setLoginUser] = useState("student");
  const [loginPass, setLoginPass] = useState("password123");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ADRESSE DE TON API LOCALE (Modifié pour pointer sur ton API locale JWT)
  const API_URL = "http://localhost:3000/api";

  // --- NOUVEAU : GESTION DE LA CONNEXION ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        setAuthMessage("✅ Connecté");
        setIsAuthenticated(true);
        // Si connecté, on essaie de charger les données
        loadProfileAndData();
      } else {
        setAuthMessage("❌ " + data.error);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAuthMessage("❌ Erreur serveur");
    }
  };

  // --- NOUVEAU : TEST DU PROFIL & CHARGEMENT DES DONNÉES ---
  const loadProfileAndData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      // 1. On teste si le token est valide sur la route /profile
      const profileResponse = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.status === 401 || profileResponse.status === 403) {
        setAuthMessage("⚠️ Token expiré, reconnecte-toi.");
        setIsAuthenticated(false);
        return;
      }

      // 2. Si valide, on charge la liste (On simule ici si tu n'as pas de route /users protégée)
      // Normalement, tu devrais taper sur une route protégée de ton API
      console.log("Accès autorisé, on pourrait charger les utilisateurs ici.");
      // Pour l'exemple visuel de ton TP, on met une donnée bidon si l'API users n'est pas prête :
      setUsers([{ id: 1, username: "student", email: "student@test.com" }]);

    } catch (err) {
      console.error(err);
    }
  };

  // --- ANCIENNE FONCTION D'AJOUT (Adaptée pour envoyer le token) ---
  const handleAdd = () => {
    if (!nom || !email) return;
    const token = localStorage.getItem('accessToken');

    fetch(`${API_URL}/users`, { // Assure-toi que cette route existe sur ton port 3000
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Ajout du token
      },
      body: JSON.stringify({ username: nom, email: email, password: "password123" })
    })
    .then((res) => {
      if (res.ok) {
        setNom("");
        setEmail("");
        loadProfileAndData();
      } else {
        alert("Action rejetée. Es-tu bien connecté ?");
      }
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <style>{`
        .tp-card { background: white; padding: 20px; border-radius: 10px; max-width: 700px; margin: 0 auto 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .tp-table { width: 100%; max-width: 700px; margin: 0 auto; background: white; border-collapse: collapse; border-radius: 10px; overflow: hidden; }
        .tp-th { background: #2c3e50; color: white; padding: 12px; text-align: left; }
        .tp-td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
      `}</style>

      {/* --- PANNEAU DE CONNEXION --- */}
      <div className="tp-card" style={{ borderLeft: '5px solid #3498db' }}>
        <h2 style={{ marginTop: 0 }}>Sécurité JWT (Étape 1 React)</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            style={{ padding: '8px', border: '1px solid #ccc' }}
            value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="User" 
          />
          <input 
            style={{ padding: '8px', border: '1px solid #ccc' }} type="password"
            value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Pass" 
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#3498db', color: 'white', border: 'none', cursor: 'pointer' }}>
            Login
          </button>
          <span style={{ fontWeight: 'bold' }}>{authMessage}</span>
        </form>
      </div>

      {/* --- ANNUAIRE (Protégé) --- */}
      <div style={{ opacity: isAuthenticated ? 1 : 0.5, pointerEvents: isAuthenticated ? 'auto' : 'none' }}>
        <div className="tp-card">
          <h1 style={{ marginTop: 0 }}>Annuaire Sécurisé</h1>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)}
            />
            <input
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
              placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
            />
            <button
              style={{ background: '#27ae60', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer', borderRadius: '5px' }}
              onClick={handleAdd}
            >
              Ajouter
            </button>
          </div>
        </div>

        <table className="tp-table">
          <thead>
            <tr>
              <th className="tp-th">NOM</th>
              <th className="tp-th">EMAIL</th>
              <th className="tp-th" style={{ textAlign: 'right' }}>ID</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(u => (
                <tr key={u.id}>
                  <td className="tp-td" style={{ fontWeight: 'bold' }}>{u.username}</td>
                  <td className="tp-td">{u.email}</td>
                  <td className="tp-td" style={{ textAlign: 'right', color: '#999' }}>#{u.id}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="tp-td" style={{ textAlign: 'center' }}>Connectez-vous pour voir les données</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;