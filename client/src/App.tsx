import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Panel from "./Panel"; 
import Checkout from "./Checkout"; 

const LandingPage = () => {
  const [weather, setWeather] = useState<{ temperature: number; windspeed: number; weathercode: number } | null>(null);

  useEffect(() => {
    fetch("https://api.open-meteo.com/v1/forecast?latitude=45.5733&longitude=6.8043&current_weather=true")
      .then(res => res.json())
      .then(data => setWeather(data.current_weather))
      .catch(err => console.error("Erreur API Météo:", err));
  }, []);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f4f7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Barre de navigation - BOUTON ROUGE SUPPRIMÉ */}
      <nav style={{ background: '#2c3e50', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <img src="/logoarcs.png" alt="Logo" style={{ width: '50px', background: 'white', padding: '5px', borderRadius: '10px' }} />
          <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.3em' }}>ACCUEIL</Link>
          <a href="#forfaits" style={{ color: '#ecf0f1', textDecoration: 'none', fontSize: '1.1em' }}>NOS FORFAITS</a>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/app" style={{ background: '#2ecc71', padding: '12px 30px', color: 'white', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1em' }}>
            ESPACE PRO
          </Link>
        </div>
      </nav>

      {/* Section Principale */}
      <section style={{ textAlign: 'center', padding: '60px 20px', flex: 1 }}>
        <img src="/logoarcs.png" alt="Logo Large" style={{ width: '250px', marginBottom: '30px' }} />
        <h1 style={{ fontSize: '4em', color: '#2c3e50', fontWeight: '900', marginBottom: '20px', textTransform: 'uppercase' }}>LES ARCS 1800</h1>
        
        <div style={{ maxWidth: '800px', margin: '0 auto 40px auto', fontSize: '1.2em', color: '#555', lineHeight: '1.6em', padding: '0 20px' }}>
          <p>
            Bienvenue aux Arcs 1800, la station au cœur du domaine Paradiski. Réputée pour son ambiance dynamique et conviviale, 
            elle offre un accès direct à des centaines de kilomètres de pistes, une vue imprenable sur le Mont Blanc et des activités 
            variées pour tous, été comme hiver. Un véritable paradis pour les amateurs de glisse et de montagne.
          </p>
        </div>

        <div style={{ marginBottom: '50px' }}>
          <img 
            src="/paysage1.png" 
            alt="Paysage" 
            style={{ maxWidth: '90%', height: 'auto', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: '2px solid white' }} 
          />
        </div>

        {/* Section Météo avec Emojis */}
        <div style={{ display: 'inline-flex', gap: '50px', background: '#34495e', color: 'white', padding: '30px 60px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '3px solid #2c3e50' }}>
          {weather ? (
            <>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.2em', color: '#bdc3c7' }}>TEMPÉRATURE</span><br/>
                <strong style={{ fontSize: '3.5em' }}>
                  {weather.temperature}°C {weather.temperature <= 0 ? "🥶" : weather.temperature <= 5 ? "❄️" : weather.temperature <= 12 ? "🌤️" : weather.temperature <= 20 ? "☀️" : "🔥"}
                </strong>
              </div>
              <div style={{ width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '1.2em', color: '#bdc3c7' }}>VENT</span><br/>
                <strong style={{ fontSize: '3em' }}>{weather.windspeed} km/h</strong>
              </div>
            </>
          ) : (
            <div style={{ fontSize: '1.5em', padding: '10px 0' }}>Chargement des conditions...</div>
          )}
        </div>
      </section>

      {/* Section Forfaits - STRUCTURE ORIGINALE RÉTABLIE */}
      <main id="forfaits" style={{ padding: '70px 40px 100px 40px', maxWidth: '1300px', margin: '0 auto', width: '100%' }}>
        <h2 style={{ textAlign: 'center', fontSize: '3em', color: '#2c3e50', marginBottom: '60px' }}>NOS FORFAITS</h2>
        
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 300px', background: 'white', padding: '40px 25px', textAlign: 'center', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.8em', color: '#2c3e50', margin: '0' }}>PASS 1 JOUR</h3>
            <p style={{ fontSize: '4em', fontWeight: 'bold', color: '#2c3e50', margin: '20px 0' }}>65 €</p>
            <Link to="/checkout" style={{ display: 'inline-block', background: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>SÉLECTIONNER</Link>
          </div>

          <div style={{ flex: '1.1 1 320px', background: '#2c3e50', color: 'white', padding: '50px 30px', textAlign: 'center', borderRadius: '30px', transform: 'scale(1.05)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '2.2em', color: '#f1c40f', margin: '0' }}>PASS 6 JOURS</h3>
            <p style={{ fontSize: '5em', fontWeight: 'bold', margin: '30px 0' }}>330 €</p>
            <Link to="/checkout" style={{ display: 'inline-block', background: '#f1c40f', color: '#2c3e50', padding: '15px 30px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1em' }}>SÉLECTIONNER</Link>
          </div>

          <div style={{ flex: '1 1 300px', background: 'white', padding: '40px 25px', textAlign: 'center', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.8em', color: '#2c3e50', margin: '0' }}>PASS SAISON</h3>
            <p style={{ fontSize: '4em', fontWeight: 'bold', color: '#2c3e50', margin: '20px 0' }}>950 €</p>
            <Link to="/checkout" style={{ display: 'inline-block', background: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>SÉLECTIONNER</Link>
          </div>

        </div>
      </main>

      {/* Footer - Ajout des réseaux sociaux sans rien casser */}
      <footer style={{ background: '#2c3e50', color: 'white', padding: '40px 20px', textAlign: 'center', marginTop: 'auto' }}>
        <h3 style={{ fontSize: '1.5em', marginBottom: '20px', fontWeight: 'normal' }}>SUIVEZ-NOUS SUR LES RÉSEAUX</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px' }}>
          <a href="https://www.facebook.com/lesarcs/" target="_blank" rel="noopener noreferrer">
            <img src="/facebook.png" alt="Facebook" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          </a>
          <a href="https://www.instagram.com/lesarcs/" target="_blank" rel="noopener noreferrer">
            <img src="/insta.png" alt="Instagram" style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
          </a>
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.9em', color: '#bdc3c7' }}>© 2024 Les Arcs 1800. Tous droits réservés.</p>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/checkout" element={<Checkout />} /> 
        <Route path="/app" element={<Panel />} />
      </Routes>
    </Router>
  );
}