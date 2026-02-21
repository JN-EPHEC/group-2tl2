import { useEffect, useState } from "react";

// On définit l'interface pour TypeScript
interface User { id: number; name: string; email: string; }

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");

  const loadData = () => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Erreur API:", err));
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    if (!nom || !email) return;

    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nom, email })
    }).then(() => {
      setNom("");
      setEmail("");
      loadData();
    });
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', textAlign: 'left' }}>
      <style>{`
        .tp-card { background: white; padding: 20px; border-radius: 10px; max-width: 700px; margin: 0 auto 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .tp-table { width: 100%; max-width: 700px; margin: 0 auto; background: white; border-collapse: collapse; border-radius: 10px; overflow: hidden; }
        .tp-th { background: #2c3e50; color: white; padding: 12px; text-align: left; }
        .tp-td { padding: 12px; border-bottom: 1px solid #eee; text-align: left; }
      `}</style>

      <div className="tp-card">
        <h1 style={{ marginTop: 0 }}>Annuaire Étudiants</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ flex: 1, padding: '10px' }}
            placeholder="Nom"
            value={nom}
            onChange={e => setNom(e.target.value)}
          />
          <input
            style={{ flex: 1, padding: '10px' }}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button
            style={{ background: '#27ae60', color: 'white', border: 'none', padding: '0 20px', cursor: 'pointer' }}
            onClick={handleAdd}
          >
            Ajouter
          </button>
        </div>
      </div>

      <table className="tp-table">
        <thead>
          <tr>
            <th className="tp-th" style={{ width: '40%' }}>NOM</th>
            <th className="tp-th" style={{ width: '50%' }}>EMAIL</th>
            <th className="tp-th" style={{ width: '10%', textAlign: 'right' }}>ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="tp-td" style={{ fontWeight: 'bold' }}>{u.name}</td>
              <td className="tp-td">{u.email}</td>
              <td className="tp-td" style={{ textAlign: 'right', color: '#999' }}>#{u.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;