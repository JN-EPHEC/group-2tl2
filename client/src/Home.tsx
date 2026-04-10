import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeApp() {
  const [users, setUsers] = useState<{id: number, username: string, email: string}[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msg, setMsg] = useState("");

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    localStorage.removeItem('accessToken');
  }, []);

  const loadPersonnel = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (err) { console.error("Erreur serveur", err); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        setIsAuthenticated(true);
        loadPersonnel(data.accessToken);
      } else { 
        setMsg(data.error || "Identifiants incorrects."); 
      }
    } catch (err) { setMsg("Erreur de connexion au serveur."); }
  };

  const handleAdd = async () => {
    if (!nom || !email || !password) {
        alert("Veuillez remplir Nom, Email ET Mot de passe");
        return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ username: nom, email: email, password: password }) 
      });
      if (res.ok) {
        setNom("");
        setEmail("");
        setPassword("");
        loadPersonnel(token!);
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer ce collaborateur ?")) return;
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setUsers(users.filter(u => u.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleUpdatePass = async (id: number) => {
    const newP = prompt("Entrez le nouveau mot de passe :");
    if (!newP) return;
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ newPassword: newP })
      });
      if (res.ok) alert("Mot de passe mis à jour !");
    } catch (err) { console.error(err); }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f7f6' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '60px', borderRadius: '30px', boxShadow: '0 25px 60px rgba(0,0,0,0.1)', width: '460px', textAlign: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '160px', marginBottom: '30px' }} />
          <h2 style={{ color: '#2c3e50', fontSize: '2.2em', marginBottom: '35px', fontWeight: 'bold' }}>INTRANET SÉCURISÉ</h2>
          <input style={{ width: '100%', padding: '18px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1.1em', boxSizing: 'border-box' }} placeholder="Identifiant" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
          <input style={{ width: '100%', padding: '18px', marginBottom: '30px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1.1em', boxSizing: 'border-box' }} type="password" placeholder="Mot de passe" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
          <button type="submit" style={{ width: '100%', padding: '20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.3em' }}>OUVRIR MA SESSION</button>
          {msg && <p style={{ color: '#e74c3c', marginTop: '25px', fontWeight: 'bold' }}>{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <header style={{ padding: '25px 60px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/logoarcs.png" alt="Logo" style={{ width: '110px' }} />
        <h2 style={{ color: '#2c3e50' }}>PANNEAU DE GESTION</h2>
        <button onClick={() => setIsAuthenticated(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>DÉCONNEXION</button>
      </header>

      <nav style={{ background: '#34495e', padding: '15px 60px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>⬅ REVENIR AU SITE PUBLIC</Link>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#ecf0f1', padding: '40px', borderRadius: '30px', marginBottom: '40px', border: '1px solid #dcdde1' }}>
          <h3 style={{ marginBottom: '25px', color: '#2c3e50' }}>CRÉER UN COMPTE COLLABORATEUR</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc' }} placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
            <input style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc' }} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input style={{ flex: 1, padding: '15px', borderRadius: '10px', border: '1px solid #ccc' }} type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} />
            <button style={{ padding: '0 40px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleAdd}>ENREGISTRER</button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: 'white' }}>
              <th style={{ padding: '20px', textAlign: 'left' }}>NOM</th>
              <th style={{ padding: '20px', textAlign: 'left' }}>EMAIL</th>
              <th style={{ padding: '20px', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '20px', fontWeight: 'bold' }}>{u.username ? u.username.toUpperCase() : "SANS NOM"}</td>
                <td style={{ padding: '20px' }}>{u.email}</td>
                <td style={{ padding: '20px', textAlign: 'center' }}>
                  <button onClick={() => handleUpdatePass(u.id)} style={{ marginRight: '10px', padding: '8px 15px', borderRadius: '5px', border: '1px solid #2c3e50', cursor: 'pointer' }}>Modifier MDP 🔑</button>
                  <button onClick={() => handleDelete(u.id)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}