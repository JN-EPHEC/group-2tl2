import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeApp from "./Home";
import "./App.css";

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
    <div className="landing-page">
      <nav className="nav">
        <div className="nav-left">
          <img src="/logoarcs.png" alt="Logo" className="nav-logo" />
          <Link to="/" className="nav-link">ACCUEIL</Link>
          <a href="#forfaits" className="nav-link-sm">FORFAITS</a>
        </div>
        <Link to="/app" className="nav-btn-pro">ESPACE PRO</Link>
      </nav>

      <section className="hero">
        <img src="/logoarcs.png" alt="Logo Large" className="hero-logo" />
        <h1 className="hero-title">LES ARCS 1800</h1>

        <div className="weather-card">
          {weather ? (
            <>
              <div className="weather-item">
                <span className="weather-label">TEMPÉRATURE</span><br />
                <strong className="weather-value">{weather.temperature}°C</strong>
              </div>
              <div className="weather-divider"></div>
              <div className="weather-item">
                <span className="weather-label">VENT</span><br />
                <strong className="weather-value">{weather.windspeed} km/h</strong>
              </div>
            </>
          ) : (
            <div className="weather-loading">Actualisation en cours...</div>
          )}
        </div>
      </section>

      <main id="forfaits" className="forfaits">
        <h2 className="forfaits-title">NOS FORFAITS</h2>

        <div className="forfaits-grid">
          <div className="forfait-card">
            <h3 className="forfait-title">PASS 1 JOUR</h3>
            <p className="forfait-price">65 €</p>
          </div>

          <div className="forfait-card-featured">
            <h3 className="forfait-title-featured">PASS 6 JOURS</h3>
            <p className="forfait-price-featured">330 €</p>
          </div>

          <div className="forfait-card">
            <h3 className="forfait-title">PASS SAISON</h3>
            <p className="forfait-price">950 €</p>
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
