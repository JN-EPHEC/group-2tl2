import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeApp from "./Home"; 

// Interface pour typer nos données météo
interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

// Fonction pour traduire le code météo en texte et emoji
const getWeatherDescription = (code: number) => {
  if (code === 0) return "Ensoleillé ☀️";
  if (code === 1 || code === 2 || code === 3) return "Nuageux ⛅";
  if (code === 45 || code === 48) return "Brouillard 🌫️";
  if (code >= 51 && code <= 67) return "Pluie 🌧️";
  if (code >= 71 && code <= 77) return "Neige ❄️";
  if (code >= 80 && code <= 82) return "Averses 🌦️";
  if (code >= 95) return "Orage ⛈️";
  return "Inconnu 🌍";
};

const LandingPage = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.5733&longitude=6.8043&current_weather=true")
      .then(res => res.json())
      .then(data => {
        setWeather({
          temperature: data.current_weather.temperature,
          windspeed: data.current_weather.windspeed,
          weathercode: data.current_weather.weathercode
        });
      })
      .catch(err => console.error("Erreur météo:", err));
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      
      {/* Barre de navigation SANS la météo */}
      <nav style={{ 
        background: '#2c3e50', 
        padding: '15px 40px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        color: 'white',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '40px', background: 'white', padding: '5px', borderRadius: '5px' }} />
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2em' }}>Accueil</Link>
          <a href="#forfaits" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '1.2em' }}>Forfaits</a>
        </div>

        <div>
          <Link to="/app" style={{ 
            background: '#27ae60', 
            padding: '12px 30px', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px', 
            fontWeight: 'bold',
            fontSize: '1.1em'
          }}>
            Connexion
          </Link>
        </div>
      </nav>

      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <img src="/logoarcs.png" alt="Logo" style={{ width: '250px', marginBottom: '20px' }} />
        <h1 style={{ color: '#2c3e50', fontSize: '3em', marginBottom: '30px' }}>Bienvenue à la Station Les Arcs</h1>
        
        {/* LA MÉTÉO COMPLÈTE CENTRÉE ET EN GRAND */}
        <div style={{ 
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center', 
          background: '#34495e', 
          color: 'white', 
          padding: '25px 60px', 
          borderRadius: '20px', 
          marginBottom: '40px', 
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)' 
        }}>
          <span style={{ fontSize: '1.2em', marginBottom: '10px', color: '#bdc3c7' }}>🏔️ Conditions en direct aux Arcs</span>
          {weather ? (
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginTop: '10px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1em', color: '#ecf0f1', display: 'block' }}>Température</span>
                <strong style={{ fontSize: '2.5em' }}>{weather.temperature}°C</strong>
              </div>
              <div style={{ width: '2px', height: '50px', background: 'rgba(255,255,255,0.2)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1em', color: '#ecf0f1', display: 'block' }}>Ciel</span>
                <strong style={{ fontSize: '2em' }}>{getWeatherDescription(weather.weathercode)}</strong>
              </div>
              <div style={{ width: '2px', height: '50px', background: 'rgba(255,255,255,0.2)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1em', color: '#ecf0f1', display: 'block' }}>Vent</span>
                <strong style={{ fontSize: '2em' }}>{weather.windspeed} km/h 💨</strong>
              </div>
            </div>
          ) : (
            <strong style={{ fontSize: '1.8em' }}>Chargement des données météo...</strong>
          )}
        </div>

        <p style={{ fontSize: '1.4em', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', color: '#555' }}>
          Découvrez l'un des plus grands domaines skiables au monde. 
          Espaces débutants, pistes mythiques et paysages à couper le souffle vous attendent au cœur de la Savoie.
        </p>
      </div>

      <main id="forfaits" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '2.5em', marginBottom: '40px' }}>Nos Forfaits Paradiski</h2>
        
        <div className="stations" style={{ display: 'flex', gap: '30px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="station" style={{ flex: 1, border: '1px solid #ddd', padding: '40px 20px', background: 'white', textAlign: 'center', borderRadius: '15px', minWidth: '300px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#2980b9', fontSize: '2em', margin: '0' }}>Pass 1 Jour</h3>
            <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '20px 0', color: '#2c3e50' }}>65 €</p>
            <p style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Accès illimité au domaine pour la journée.</p>
          </div>

          <div className="station" style={{ flex: 1, border: 'none', padding: '40px 20px', background: '#2c3e50', color: 'white', textAlign: 'center', borderRadius: '15px', minWidth: '300px', transform: 'scale(1.05)', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#f1c40f', fontSize: '2em', margin: '0' }}>Pass 6 Jours</h3>
            <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '20px 0' }}>330 €</p>
            <p style={{ fontSize: '1.2em', color: '#bdc3c7' }}>Le classique pour une semaine de ski parfaite.</p>
          </div>

          <div className="station" style={{ flex: 1, border: '1px solid #ddd', padding: '40px 20px', background: 'white', textAlign: 'center', borderRadius: '15px', minWidth: '300px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#2980b9', fontSize: '2em', margin: '0' }}>Pass Saison</h3>
            <p style={{ fontSize: '3em', fontWeight: 'bold', margin: '20px 0', color: '#2c3e50' }}>950 €</p>
            <p style={{ fontSize: '1.2em', color: '#7f8c8d' }}>Skiez tout l'hiver sans aucune limite.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<HomeApp />} />
      </Routes>
    </Router>
  );
}

export default App;