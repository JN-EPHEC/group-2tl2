import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Checkout.css"; // Assure-toi que ton fichier CSS porte ce nom

export default function Checkout() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.prenom,
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la création du compte.");
      }
    } catch (err) {
      setError("Le serveur ne répond pas. Vérifie qu'il est bien allumé !");
    }
  };

  if (isSubmitted) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>
          <h1 className="checkout-success-title">MERCI !</h1>
          <p className="checkout-success-sub">Votre commande a été validée avec succès.</p>
          <div className="checkout-success-forfait">PASS LES ARCS 1800</div>
          <Link to="/app" className="checkout-success-btn">ACCÉDER À MON ESPACE PRO</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <img src="/logoarcs.png" alt="Logo" className="checkout-header-logo" />
        <h1 className="checkout-header-title">PAIEMENT SÉCURISÉ</h1>
        <Link to="/" className="checkout-header-back">← Retour à l'accueil</Link>
      </header>

      <div className="checkout-content">
        {/* Formulaire Principal */}
        <div className="checkout-form-wrapper">
          <form onSubmit={handleSubmit}>
            
            {/* Section 1 : Authentification / Création */}
            <div className="checkout-section">
              <h2 className="checkout-section-title"><span>1</span>VOS INFORMATIONS</h2>
              
              {error && <div className="checkout-password-error">{error}</div>}

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Prénom</label>
                  <input type="text" name="prenom" placeholder="Ex: Jean" required onChange={handleChange} />
                </div>
                <div className="checkout-field">
                  <label>Nom</label>
                  <input type="text" name="nom" placeholder="Ex: Dupont" required onChange={handleChange} />
                </div>
              </div>

              <div className="checkout-field" style={{ marginBottom: '20px' }}>
                <label>Adresse Email</label>
                <input type="email" name="email" placeholder="jean.dupont@email.com" required onChange={handleChange} />
              </div>

              <div className="checkout-field">
                <label>Mot de passe</label>
                <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
              </div>
            </div>

            {/* Section 2 : Paiement */}
            <div className="checkout-section" style={{ marginTop: '30px' }}>
              <h2 className="checkout-section-title"><span>2</span>PAIEMENT PAR CARTE</h2>
              
              {/* Carte Visuelle */}
              <div className="checkout-card-visual">
                <div className="checkout-fake-badge">SECURE PAYMENT</div>
                <div className="checkout-card-chip"></div>
                <div className="checkout-card-number">•••• •••• •••• ••••</div>
                <div className="checkout-card-bottom">
                  <span>NOM DU TITULAIRE</span>
                  <span>MM/YY</span>
                </div>
              </div>

              <div className="checkout-field" style={{ marginBottom: '20px' }}>
                <label>Numéro de carte</label>
                <input type="text" placeholder="0000 0000 0000 0000" required />
              </div>

              <div className="checkout-row">
                <div className="checkout-field">
                  <label>Expiration</label>
                  <input type="text" placeholder="MM / YY" required />
                </div>
                <div className="checkout-field">
                  <label>CVC</label>
                  <input type="text" placeholder="123" required />
                </div>
              </div>
            </div>

            <button type="submit" className="checkout-submit-btn">
              VALIDER LE PAIEMENT
            </button>
          </form>
        </div>

        {/* Récapitulatif (Sticky) */}
        <aside className="checkout-summary">
          <div className="checkout-summary-label">Votre sélection</div>
          <h3 className="checkout-summary-forfait">PASS 6 JOURS</h3>
          <p style={{ opacity: 0.6, fontSize: '0.9em' }}>Station : Les Arcs 1800</p>
          
          <hr className="checkout-summary-divider" />
          
          <div className="checkout-summary-row">
            <span>Prix unitaire</span>
            <span>330,00 €</span>
          </div>
          <div className="checkout-summary-row">
            <span>Frais de dossier</span>
            <span>0,00 €</span>
          </div>
          
          <div className="checkout-summary-total-row">
            <span>TOTAL</span>
            <span className="checkout-summary-total-price">330,00 €</span>
          </div>

          <div className="checkout-summary-badge">
            🔒 Paiement 100% sécurisé via cryptage SSL. Vos données bancaires ne sont pas conservées.
          </div>
        </aside>
      </div>
    </div>
  );
}