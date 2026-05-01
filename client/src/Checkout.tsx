import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Checkout.css";

interface CheckoutState {
  forfait: string;
  prix: string;
  dureeJours: number;
}

const API_URL = "http://localhost:3000/api";

export default function Checkout() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  // MODIFICATION : Valeurs par défaut si le state est vide (clic direct)
  const forfait = state?.forfait || "PASS 6 JOURS";
  const prix = state?.prix || "330";
  const dureeJours = state?.dureeJours || 6;

  // ── États ──
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<{ id: number; nom: string; prenom: string; email: string } | null>(null);

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerError, setRegisterError] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  // ── Helpers ──
  const displayCard = cardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••";
  const displayExpiry = cardExpiry || "MM/AA";
  const displayName = cardName || "VOTRE NOM";

  const formatCardInput = (val: string) => val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  const handleLogin = async () => {
    setLoginError("");
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setLoggedInUser({ id: data.user.id, nom: data.user.nom, prenom: data.user.prenom, email: loginEmail });
      } else {
        setLoginError(data.error || "Erreur de connexion.");
      }
    } catch { setLoginError("Serveur injoignable."); }
  };

  const createAbonnement = async (utilisateurId: number) => {
    await fetch(`${API_URL}/abonnements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ utilisateurId, forfaitNom: forfait, prix: parseFloat(prix), dureeJours }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === "login") {
      if (!loggedInUser) return setLoginError("Connectez-vous d'abord.");
      await createAbonnement(loggedInUser.id);
      setConfirmed(true);
      return;
    }
    if (password !== confirmPassword) return setPasswordError("Mots de passe différents.");
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, email, motDePasse: password, telephone, role: "user" }),
      });
      if (res.ok) {
        const newUser = await res.json();
        await createAbonnement(newUser.id);
        setConfirmed(true);
      } else { setRegisterError("Erreur création compte."); }
    } catch { setRegisterError("Serveur injoignable."); }
  };

  if (confirmed) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>
          <h2 className="checkout-success-title">COMMANDE CONFIRMÉE !</h2>
          <div className="checkout-success-forfait">🎿 {forfait} — {prix} €</div>
          <Link to="/" className="checkout-success-btn">← RETOUR AU SITE</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <img src="/logoarcs.png" alt="L" className="checkout-header-logo" />
        <h1 className="checkout-header-title">FINALISER MON FORFAIT</h1>
        <Link to="/" className="checkout-header-back">← Retour</Link>
      </header>

      <div className="checkout-content">
        <aside className="checkout-summary">
          <p className="checkout-summary-label">Votre sélection</p>
          <h2 className="checkout-summary-forfait">🎿 {forfait}</h2>
          <hr className="checkout-summary-divider" />
          <div className="checkout-summary-total-row"><span>TOTAL</span><span className="checkout-summary-total-price">{prix} €</span></div>
          <div className="checkout-summary-badge">🔒 Paiement sécurisé</div>
        </aside>

        <form className="checkout-form-wrapper" onSubmit={handleSubmit}>
          <div className="checkout-section">
            <h3 className="checkout-section-title"><span>1</span>IDENTIFICATION</h3>
            <div className="checkout-auth-row">
              <div className={`checkout-auth-panel ${authMode === "login" ? "auth-active" : "auth-inactive"}`} onClick={() => setAuthMode("login")}>
                <h4 className="checkout-auth-panel-title">CONNEXION</h4>
                {loggedInUser ? <p>Connecté : {loggedInUser.prenom}</p> : (
                  <div onClick={e => e.stopPropagation()}>
                    <div className="checkout-field"><label>Email</label><input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} disabled={authMode !== "login"} /></div>
                    <div className="checkout-field"><label>Pass</label><input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} disabled={authMode !== "login"} /></div>
                    <button type="button" className="checkout-auth-btn" onClick={handleLogin} disabled={authMode !== "login"}>SE CONNECTER</button>
                  </div>
                )}
              </div>
              <div className="checkout-auth-separator"><span className="checkout-auth-separator-ou">OU</span></div>
              <div className={`checkout-auth-panel ${authMode === "register" ? "auth-active" : "auth-inactive"}`} onClick={() => setAuthMode("register")}>
                <h4 className="checkout-auth-panel-title">INSCRIPTION</h4>
                <div onClick={e => e.stopPropagation()}>
                  <div className="checkout-row">
                    <div className="checkout-field"><label>Prénom</label><input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} required={authMode === "register"} disabled={authMode !== "register"} /></div>
                    <div className="checkout-field"><label>Nom</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required={authMode === "register"} disabled={authMode !== "register"} /></div>
                  </div>
                  <div className="checkout-field"><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required={authMode === "register"} disabled={authMode !== "register"} /></div>
                  <div className="checkout-field"><label>Pass</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} minLength={8} required={authMode === "register"} disabled={authMode !== "register"} /></div>
                  <div className="checkout-field"><label>Confirmer</label><input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required={authMode === "register"} disabled={authMode !== "register"} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h3 className="checkout-section-title"><span>2</span>PAIEMENT</h3>
            <div className="checkout-card-visual">
              <div className="checkout-card-chip" /><div className="checkout-card-number">{displayCard}</div>
              <div className="checkout-card-bottom"><span>{displayName}</span><span>{displayExpiry}</span></div>
            </div>
            <div className="checkout-field"><label>Numéro</label><input type="text" value={cardNumber} onChange={e => setCardNumber(formatCardInput(e.target.value))} maxLength={19} required /></div>
            <div className="checkout-row">
              <div className="checkout-field"><label>Nom</label><input type="text" value={cardName} onChange={e => setCardName(e.target.value.toUpperCase())} required /></div>
              <div className="checkout-field"><label>Exp</label><input type="text" value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))} maxLength={5} required /></div>
              <div className="checkout-field"><label>CVV</label><input type="text" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))} maxLength={3} required /></div>
            </div>
            <button type="submit" className="checkout-submit-btn">🎿 CONFIRMER — {prix} €</button>
          </div>
        </form>
      </div>
    </div>
  );
}