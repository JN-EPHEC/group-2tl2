import { useEffect, useState } from "react";

interface User { id: number; name: string; email: string; }

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");

  const loadData = () => {
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = () => {
    if (!nom || !prenom) return;
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nom, email: prenom })
    }).then(() => {
      setNom(""); setPrenom("");
      loadData();
    });
  };

  return (
    <div className="final-screen">
      <style>{`
        /* On force l'alignement à gauche sur TOUT le conteneur */
        .final-screen { 
          text-align: left !important; 
          padding: 40px; 
          background: #f0f2f5; 
          min-height: 100vh; 
          font-family: sans-serif;
          display: block !important;
        }

        .final-card { 
          background: white; 
          padding: 30px; 
          border-radius: 12px; 
          max-width: 800px; 
          margin: 0 auto 20px auto; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .final-inputs { display: flex; gap: 10px; margin-top: 15px; }
        .final-input { flex: 1; padding: 12px; border: 1px solid #ccc; border-radius: 6px; }
        .final-btn { background: #27ae60; color: white; border: none; padding: 0 25px; border-radius: 6px; cursor: pointer; font-weight: bold; }

        /* Tableau avec colonnes fixes pour un alignement vertical parfait */
        .final-table { 
          width: 100%; 
          max-width: 800px; 
          margin: 0 auto; 
          background: white; 
          border-collapse: collapse; 
          border-radius: 12px; 
          overflow: hidden;
        }

        .final-th { 
          background: #2c3e50; 
          color: white; 
          padding: 15px 20px; 
          text-align: left !important; 
        }

        .final-td { 
          padding: 15px 20px; 
          border-bottom: 1px solid #eee; 
          text-align: left !important; 
        }

        /* On bloque les largeurs pour que NOM et PRENOM soient l'un sous l'autre */
        .col-1 { width: 40%; }
        .col-2 { width: 50%; }
        .col-3 { width: 10%; text-align: right !important; }
      `}</style>

      <div className="final-card">
        <h1 style={{margin: 0, color: '#2c3e50'}}>Annuaire Étudiants</h1>
        <div className="final-inputs">
          <input className="final-input" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
          <input className="final-input" placeholder="Prénom" value={prenom} onChange={e => setPrenom(e.target.value)} />
          <button className="final-btn" onClick={handleAdd}>Ajouter</button>
        </div>
      </div>

      <table className="final-table">
        <thead>
          <tr>
            <th className="final-th col-1">NOM</th>
            <th className="final-th col-2">PRÉNOM</th>
            <th className="final-th col-3">ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="final-td col-1" style={{fontWeight: 'bold'}}>{u.name}</td>
              <td className="final-td col-2">{u.email}</td>
              <td className="final-td col-3" style={{color: '#ccc'}}>#{u.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;