import React, { useEffect, useState } from "react";

// Interface pour TypeScript
interface User { id: number; username: string; email: string; role?: string; }

function App() {
  // États pour l'Annuaire
  const [users, setUsers] = useState<User[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  // États pour l'Authentification
  const [loginUser, setLoginUser] = useState("student");
  const [loginPass, setLoginPass] = useState("password123");
  const [authMessage, setAuthMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ADRESSE DE TON API
  const API_URL = "http://localhost:3000/api";

  // --- GESTION DE LA CONNEXION ---
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
        loadProfileAndData();
      } else {
        setAuthMessage("❌ " + data.error);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setAuthMessage("❌ Erreur serveur");
    }
  };

  // --- CHARGEMENT DES DONNÉES ---
  const loadProfileAndData = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const profileResponse = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (profileResponse.status === 401 || profileResponse.status === 403) {
        setIsAuthenticated(false);
        return;
      }
      setIsAuthenticated(true);
      // On simule une donnée ou on appelle une route users si elle existe
      setUsers([{ id: 1, username: loginUser, email: "user@lesarcs.com" }]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = () => {
    if (!nom || !email) return;
    const token = localStorage.getItem('accessToken');
    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ username: nom, email: email, password: "password123" })
    })
    .then((res) => {
      if (res.ok) {
        setNom(""); setEmail("");
        loadProfileAndData();
      } else {
        alert("Action rejetée.");
      }
    });
  };

  return (
    <div className="site-wrapper" style={{ fontFamily: 'sans-serif' }}>
      
      {/* 1. SECTION LOGIN (S'affiche si pas connecté) */}
      {!isAuthenticated ? (
        <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <img src="/logoarcs.png" alt="Logo" style={{ width: '150px', marginBottom: '20px' }} />
            <h2>Accès Station Les Arcs</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }}
                value={loginUser} onChange={(e) => setLoginUser(e.target.value)} placeholder="Utilisateur" 
              />
              <input 
                style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '5px' }} type="password"
                value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="Mot de passe" 
              />
              <button type="submit" style={{ padding: '12px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Entrer sur le site
              </button>
              <span style={{ color: authMessage.includes('❌') ? 'red' : 'green' }}>{authMessage}</span>
            </form>
          </div>
        </div>
      ) : (
        
        /* 2. LE SITE COMPLET (S'affiche si connecté) */
        <>
          <header>
            <img src="/logoarcs.png" alt="Logo Les Arcs" />
            <h1>Bienvenue, {loginUser}</h1>
            <button onClick={() => { localStorage.removeItem('accessToken'); setIsAuthenticated(false); }} 
                    style={{ float: 'right', marginTop: '-40px', padding: '5px 10px', cursor: 'pointer' }}>
              Déconnexion
            </button>
          </header>

          <nav>
            <a href="#">Accueil</a>
            <a href="#">Plan des pistes</a>
            <a href="#">Forfait</a>
          </nav>

          <video src="/video.mp4" controls autoPlay loop muted style={{ width: '100%' }}></video>

          <main style={{ padding: '20px' }}>
            <h2>Les Arcs : La station</h2>
            <p>Située en Savoie, au nord du Parc National de la Vanoise...</p>

            {/* SECTION ANNUAIRE API INTEGRÉE AU SITE */}
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', border: '1px solid #ddd', margin: '20px 0' }}>
                <h3>Gestion de l'Annuaire (API)</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input style={{ flex: 1, padding: '8px' }} placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
                    <input style={{ flex: 1, padding: '8px' }} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <button style={{ background: '#27ae60', color: 'white', border: 'none', padding: '0 15px', borderRadius: '4px' }} onClick={handleAdd}>Ajouter</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                    <thead>
                        <tr style={{ background: '#2c3e50', color: 'white' }}>
                            <th style={{ padding: '10px', textAlign: 'left' }}>NOM</th>
                            <th style={{ padding: '10px', textAlign: 'left' }}>EMAIL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px' }}>{u.username}</td>
                                <td style={{ padding: '10px' }}>{u.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="stations">
                <div className="station"><h3>Bourg-Saint-Maurice</h3><p>Les contemplatifs sont dans leur élément...</p></div>
                <div className="station"><h3>Arc 1600</h3><p>Le site originel, moderne et convivial...</p></div>
                <div className="station"><h3>Arc 1800</h3><p>Shopping, dancing, cocooning...</p></div>
            </div>
          </main>

          <div className="naav">
            <h2>Inscrivez-vous à notre newsletter</h2>
          </div>
          <form style={{ textAlign: 'center', padding: '20px' }}>
            <input type="email" placeholder="Votre email" required style={{ padding: '10px', width: '250px' }} />
            <button type="submit" style={{ padding: '10px 20px', background: '#2c3e50', color: 'white', border: 'none' }}>S'inscrire</button>
          </form>

          <section className="section" style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><img src="/facebook.png" width="50" alt="FB" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><img src="/insta.png" width="50" alt="Insta" /></a>
          </section>

          <footer>
            <p>&copy; 2024 Les Arcs. Tous droits réservés.</p>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;