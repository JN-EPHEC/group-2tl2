import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeApp from "./Home"; 

const LandingPage = () => {
  const [weather, setWeather] = useState<{ temperature: number; windspeed: number; weathercode: number } | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.5733&longitude=6.8043&current_weather=true")
      .then(res => res.json())
      .then(data => {
        console.log("🌤️ Météo reçue de l'API :", data.current_weather);
        setWeather(data.current_weather);
      })
      .catch(err => console.error("Erreur API Météo:", err));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <nav style={{ background: '#2c3e50', padding: '20px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '60px', background: 'white', padding: '5px', borderRadius: '10px' }} />
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.3em' }}>ACCUEIL</Link>
          <a href="#forfaits" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2em' }}>FORFAITS</a>
        </div>
        <Link to="/app" style={{ background: '#2ecc71', padding: '15px 35px', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1em' }}>ESPACE PRO</Link>
      </nav>

      <section style={{ textAlign: 'center', padding: '100px 20px' }}>
        <img src="/logoarcs.png" alt="Logo Large" style={{ width: '300px', marginBottom: '40px' }} />
        <h1 style={{ fontSize: '4.5em', color: '#2c3e50', fontWeight: '900', marginBottom: '40px' }}>LES ARCS 1800</h1>
        
        <div style={{ display: 'inline-flex', gap: '80px', background: '#34495e', color: 'white', padding: '60px 120px', borderRadius: '40px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          {weather ? (
            <>
              <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5em', opacity: 0.8 }}>TEMPÉRATURE</span><br/><strong style={{ fontSize: '4em' }}>{weather.temperature}°C</strong></div>
              <div style={{ width: '3px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ textAlign: 'center' }}><span style={{ fontSize: '1.5em', opacity: 0.8 }}>VENT</span><br/><strong style={{ fontSize: '4em' }}>{weather.windspeed} km/h</strong></div>
            </>
          ) : <div style={{ fontSize: '2em' }}>Actualisation en cours...</div>}
        </div>
      </section>

      <main id="forfaits" style={{ padding: '100px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3.5em', marginBottom: '80px', color: '#2c3e50' }}>NOS OFFRES</h2>
        <div style={{ display: 'flex', gap: '50px', justifyContent: 'center' }}>
          <div style={{ flex: 1, background: 'white', padding: '80px 40px', textAlign: 'center', borderRadius: '30px', border: '2px solid #eee' }}>
            <h3 style={{ fontSize: '2.5em' }}>PASS JOURNÉE</h3><p style={{ fontSize: '5em', fontWeight: 'bold', color: '#2c3e50' }}>65 €</p>
            <button style={{ background: '#2c3e50', color: 'white', border: 'none', padding: '15px 35px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>S'INSCRIRE</button>
          </div>
          <div style={{ flex: 1.2, background: '#2c3e50', color: 'white', padding: '100px 40px', textAlign: 'center', borderRadius: '30px', transform: 'scale(1.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '2.8em', color: '#f1c40f' }}>PASS 6 JOURS</h3><p style={{ fontSize: '6em', fontWeight: 'bold' }}>330 €</p>
            <button style={{ background: '#f1c40f', color: 'white', border: 'none', padding: '15px 35px', fontSize: '1.2em', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer' }}>S'INSCRIRE</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<HomeApp />} />
      </Routes>
    </Router>
  );
}