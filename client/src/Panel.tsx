import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function HomeApp() {
  const [users, setUsers] = useState<{id: number, username: string, email: string}[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [msg, setMsg] = useState("");

  // VARIABLES POUR LIRE CE QUE TU TAPES VRAIMENT
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const API_URL = "http://localhost:3000/api";

  useEffect(() => {
    localStorage.removeItem('accessToken');
  }, []);

  const loadPersonnel = async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/users`, { headers: { 'Authorization': `Bearer ${token}` } });
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
        // ICI C'EST CORRIGÉ : On envoie tes vraies frappes au clavier
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
    if (!nom || !email) return;
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ username: nom, email: email })
      });
      if (res.ok) {
        setNom("");
        setEmail("");
        loadPersonnel(token);
      }
    } catch (err) { console.error(err); }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f4f7f6' }}>
        <form onSubmit={handleLogin} style={{ background: 'white', padding: '60px', borderRadius: '30px', boxShadow: '0 25px 60px rgba(0,0,0,0.1)', width: '460px', textAlign: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '160px', marginBottom: '30px' }} />
          <h2 style={{ color: '#2c3e50', fontSize: '2.2em', marginBottom: '35px', fontWeight: 'bold' }}>INTRANET SÉCURISÉ</h2>
          
          <input 
            style={{ width: '100%', padding: '18px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1.1em', boxSizing: 'border-box' }} 
            placeholder="Identifiant" 
            value={loginUser} 
            onChange={e => setLoginUser(e.target.value)} 
          />
          <input 
            style={{ width: '100%', padding: '18px', marginBottom: '30px', border: '1px solid #ddd', borderRadius: '12px', fontSize: '1.1em', boxSizing: 'border-box' }} 
            type="password" 
            placeholder="Mot de passe" 
            value={loginPass} 
            onChange={e => setLoginPass(e.target.value)} 
          />
          
          <button type="submit" style={{ width: '100%', padding: '20px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.3em' }}>
            OUVRIR MA SESSION
          </button>
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

      <main style={{ padding: '60px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ background: '#ecf0f1', padding: '50px', borderRadius: '30px', marginBottom: '70px', border: '1px solid #dcdde1' }}>
          <h3 style={{ marginBottom: '35px', fontSize: '2em', color: '#2c3e50' }}>AJOUTER UN COLLABORATEUR</h3>
          <div style={{ display: 'flex', gap: '30px' }}>
            <input style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '1.2em' }} placeholder="Nom complet" value={nom} onChange={e => setNom(e.target.value)} />
            <input style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #ccc', fontSize: '1.2em' }} placeholder="Email professionnel" value={email} onChange={e => setEmail(e.target.value)} />
            <button style={{ padding: '0 60px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.2em' }} onClick={handleAdd}>ENREGISTRER</button>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ background: '#2c3e50', color: 'white' }}>
              <th style={{ padding: '30px', textAlign: 'left' }}>NOM COMPLET</th>
              <th style={{ padding: '30px', textAlign: 'left' }}>EMAIL</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '30px', fontWeight: 'bold', color: '#2c3e50', fontSize: '1.2em' }}>{u.username.toUpperCase()}</td>
                <td style={{ padding: '30px', color: '#7f8c8d', fontSize: '1.1em' }}>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}