import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeApp() {
  const [users, setUsers] = useState<{id: number, username: string, email: string}[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msg, setMsg] = useState("");

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    localStorage.removeItem('accessToken');
  }, []);

  const loadData = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) setUsers(await res.json());
    } catch (err) { console.error("Erreur API", err); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: "student", password: "password123" })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        setIsAuthenticated(true);
        loadData(data.accessToken);
      } else { setMsg(data.error); }
    } catch (err) { setMsg("Serveur HS"); }
  };

  const handleAdd = async () => {
    if (!nom || !email) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ username: nom, email: email })
      });
      if (res.ok) { setNom(""); setEmail(""); loadData(token); }
    } catch (err) { console.error(err); }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '60px', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', width: '450px', textAlign: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '160px', marginBottom: '40px' }} />
          <h2 style={{ marginBottom: '40px', fontSize: '2em' }}>ACCÈS SÉCURISÉ</h2>
          <input style={{ width: '100%', padding: '18px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '12px' }} placeholder="student" defaultValue="student" />
          <input style={{ width: '100%', padding: '18px', marginBottom: '30px', border: '1px solid #ddd', borderRadius: '12px' }} type="password" placeholder="password123" defaultValue="password123" />
          <button type="submit" style={{ width: '100%', padding: '20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.2em', cursor: 'pointer' }}>SE CONNECTER</button>
          {msg && <p style={{ color: 'red', marginTop: '20px' }}>{msg}</p>}
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header style={{ padding: '25px 60px', background: 'white', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img src="/logoarcs.png" alt="Logo" style={{ width: '100px' }} />
        <button onClick={() => setIsAuthenticated(false)} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>DÉCONNEXION</button>
      </header>

      <nav style={{ background: '#34495e', padding: '15px 60px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>⬅ RETOUR SITE PUBLIC</Link>
      </nav>

      <video src="/video.mp4" controls autoPlay loop muted style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}></video>

      <main style={{ padding: '60px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#ecf0f1', padding: '50px', borderRadius: '30px', marginBottom: '60px' }}>
          <h3 style={{ fontSize: '2em', marginBottom: '30px' }}>AJOUTER UN COLLABORATEUR</h3>
          <div style={{ display: 'flex', gap: '20px' }}>
            <input style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #ccc' }} placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
            <input style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #ccc' }} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <button style={{ padding: '20px 50px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }} onClick={handleAdd}>VALIDER</button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: 'white' }}>
              <th style={{ padding: '30px', textAlign: 'left' }}>NOM</th>
              <th style={{ padding: '30px', textAlign: 'left' }}>EMAIL</th>
              <th style={{ padding: '30px', textAlign: 'left' }}>STATUT</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '30px', fontWeight: 'bold' }}>{u.username.toUpperCase()}</td>
                <td style={{ padding: '30px' }}>{u.email}</td>
                <td style={{ padding: '30px' }}><span style={{ padding: '10px 20px', background: '#d5f5e3', color: '#1d8348', borderRadius: '8px', fontSize: '0.9em', fontWeight: 'bold' }}>ACTIF</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}