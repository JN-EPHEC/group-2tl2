import { useEffect, useState } from "react";

// Définition de l'interface pour le typage TypeScript
interface User { 
  id: number; 
  name: string;
}

function App() {
  // 1. Définition de l'état (store initialement vide)
  const [data, setData] = useState<User[]>([]);

  // 2. Appel API au montage du composant
  useEffect(() => { 
    fetch("http://localhost:3000/api/users")
      .then(res => res.json())
      .then(result => setData(result))
      .catch(err => console.error(err));
  }, []); // Le tableau vide assure que l'appel ne se fait qu'une fois

  // 3. Rendu (JSX)
  return (
    <div>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li> 
        ))}
      </ul>
    </div>
  );
}

export default App;