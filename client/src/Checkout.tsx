import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import "./Checkout.css";

interface CheckoutState {
  forfait: string;
  prix: string;
}

const API_URL = "http://localhost:3000/api";

export default function Checkout() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  if (!state?.forfait || !state?.prix) {
    return <Navigate to="/" replace />;
  }

  const { forfait, prix } = state;

  // ── Mode d'authentification ──────────────────────────
  const [authMode, setAuthMode] = useState<"register" | "login">("register");

  // Connexion compte existant
  const [loginEmail, setLoginEmail]   = useState("");
  const [loginPass, setLoginPass]     = useState("");
  const [loginError, setLoginError]   = useState("");
  const [loggedInUser, setLoggedInUser] = useState<{ nom: string; prenom: string; email: string } | null>(null);

  // Création de compte
  const [nom, setNom]                       = useState("");
  const [prenom, setPrenom]                 = useState("");
  const [email, setEmail]                   = useState("");
  const [telephone, setTelephone]           = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError]   = useState("");

  // Paiement
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName]     = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv]       = useState("");

  const [confirmed, setConfirmed] = useState(false);

  // ── Helpers carte ────────────────────────────────────
  const displayCard   = cardNumber.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim() || "•••• •••• •••• ••••";
  const displayExpiry = cardExpiry || "MM/AA";
  const displayName   = cardName   || "VOTRE NOM";

  const formatCardInput = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? `${clean.slice(0, 2)}/${clean.slice(2)}` : clean;
  };

  // ── Connexion ────────────────────────────────────────
  const handleLogin = async () => {
    setLoginError("");
    if (!loginEmail || !loginPass) {
      setLoginError("Veuillez remplir tous les champs.");
      return;
    }
    try {
      const res  = await fetch(`${API_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: loginEmail, password: loginPass }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        setLoggedInUser({
          nom:    data.user?.nom    ?? "",
          prenom: data.user?.prenom ?? "",
          email:  loginEmail,
        });
      } else {
        setLoginError(data.error || "Identifiants incorrects.");
      }
    } catch {
      setLoginError("Erreur de connexion au serveur.");
    }
  };

  // ── Submit global (paiement) ─────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (authMode === "login" && !loggedInUser) {
      setLoginError("Veuillez vous connecter avant de continuer.");
      return;
    }

    if (authMode === "register") {
      if (password !== confirmPassword) {
        setPasswordError("Les mots de passe ne correspondent pas.");
        return;
      }
      setPasswordError("");
    }

    setConfirmed(true);
  };

  // Nom affiché dans la confirmation
  const displayUserName = loggedInUser
    ? `${loggedInUser.prenom} ${loggedInUser.nom}`.trim() || loggedInUser.email
    : `${prenom} ${nom}`.trim();
  const displayUserEmail = loggedInUser ? loggedInUser.email : email;

  // ── Confirmation ─────────────────────────────────────
  if (confirmed) {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <img src="/logoarcs.png" alt="Logo" className="checkout-header-logo" />
          <h1 className="checkout-header-title">LES ARCS 1800</h1>
        </header>
        <div className="checkout-success">
          <div className="checkout-success-icon">✓</div>
          <h2 className="checkout-success-title">COMMANDE CONFIRMÉE !</h2>
          <p className="checkout-success-sub">
            Bienvenue {displayUserName}, votre forfait a bien été enregistré.
          </p>
          <p className="checkout-success-sub">
            Un email de confirmation a été envoyé à <strong>{displayUserEmail}</strong>
          </p>
          <div className="checkout-success-forfait">🎿 {forfait} — {prix} €</div>
          <Link to="/" className="checkout-success-btn">← RETOUR AU SITE</Link>
        </div>
      </div>
    );
  }

  // ── Page principale ───────────────────────────────────
  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <img src="/logoarcs.png" alt="Logo" className="checkout-header-logo" />
        <h1 className="checkout-header-title">LES ARCS 1800 — FINALISER MON FORFAIT</h1>
        <Link to="/" className="checkout-header-back">← Retour au site</Link>
      </header>

      <div className="checkout-content">
        {/* ── Récapitulatif ── */}
        <aside className="checkout-summary">
          <p className="checkout-summary-label">Votre sélection</p>
          <h2 className="checkout-summary-forfait">🎿 {forfait}</h2>
          <hr className="checkout-summary-divider" />
          <div className="checkout-summary-row"><span>Sous-total</span><span>{prix} €</span></div>
          <div className="checkout-summary-row"><span>Frais de dossier</span><span>Offerts</span></div>
          <div className="checkout-summary-row"><span>TVA (20%)</span><span>incluse</span></div>
          <hr className="checkout-summary-divider" />
          <div className="checkout-summary-total-row">
            <span>TOTAL</span>
            <span className="checkout-summary-total-price">{prix} €</span>
          </div>
          <div className="checkout-summary-badge">
            🔒 Paiement 100% sécurisé<br />
            ✓ Accès immédiat après confirmation<br />
            ✓ Annulation sous 14 jours
          </div>
        </aside>

        {/* ── Formulaire ── */}
        <form className="checkout-form-wrapper" onSubmit={handleSubmit}>

          {/* ── Section 1 — Identification ── */}
          <div className="checkout-section">
            <h3 className="checkout-section-title">
              <span>1</span>IDENTIFICATION
            </h3>

            <div className="checkout-auth-row">

              {/* Panneau — Connexion */}
              <div
                className={`checkout-auth-panel ${authMode === "login" ? "auth-active" : "auth-inactive"}`}
                onClick={() => { setAuthMode("login"); setPasswordError(""); }}
              >
                <h4 className="checkout-auth-panel-title">J'AI DÉJÀ UN COMPTE</h4>

                {loggedInUser ? (
                  /* ── Connecté ── */
                  <div className="checkout-auth-logged">
                    <div className="checkout-auth-logged-icon">✓</div>
                    <p className="checkout-auth-logged-name">
                      {loggedInUser.prenom} {loggedInUser.nom}
                    </p>
                    <p className="checkout-auth-logged-email">{loggedInUser.email}</p>
                    <button
                      type="button"
                      className="checkout-auth-logout"
                      onClick={(e) => { e.stopPropagation(); setLoggedInUser(null); setLoginEmail(""); setLoginPass(""); }}
                    >
                      Changer de compte
                    </button>
                  </div>
                ) : (
                  /* ── Formulaire login ── */
                  <div onClick={(e) => e.stopPropagation()}>
                    <div className="checkout-field">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        disabled={authMode !== "login"}
                      />
                    </div>
                    <div className="checkout-field" style={{ marginTop: "14px" }}>
                      <label>Mot de passe</label>
                      <input
                        type="password"
                        placeholder="Votre mot de passe"
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        disabled={authMode !== "login"}
                      />
                    </div>
                    {loginError && <p className="checkout-password-error">{loginError}</p>}
                    <button
                      type="button"
                      className="checkout-auth-btn"
                      onClick={handleLogin}
                      disabled={authMode !== "login"}
                    >
                      SE CONNECTER
                    </button>
                  </div>
                )}
              </div>

              {/* Séparateur */}
              <div className="checkout-auth-separator">
                <div className="checkout-auth-separator-line" />
                <span className="checkout-auth-separator-ou">OU</span>
                <div className="checkout-auth-separator-line" />
              </div>

              {/* Panneau — Inscription */}
              <div
                className={`checkout-auth-panel ${authMode === "register" ? "auth-active" : "auth-inactive"}`}
                onClick={() => { setAuthMode("register"); setLoginError(""); }}
              >
                <h4 className="checkout-auth-panel-title">CRÉER MON COMPTE</h4>

                <div onClick={(e) => e.stopPropagation()}>
                  <div className="checkout-row">
                    <div className="checkout-field">
                      <label>Prénom</label>
                      <input
                        type="text"
                        placeholder="Jean"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required={authMode === "register"}
                        disabled={authMode !== "register"}
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Nom</label>
                      <input
                        type="text"
                        placeholder="Dupont"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required={authMode === "register"}
                        disabled={authMode !== "register"}
                      />
                    </div>
                  </div>

                  <div className="checkout-row">
                    <div className="checkout-field">
                      <label>Email</label>
                      <input
                        type="email"
                        placeholder="jean.dupont@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={authMode === "register"}
                        disabled={authMode !== "register"}
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Téléphone</label>
                      <input
                        type="tel"
                        placeholder="+33 6 00 00 00 00"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        disabled={authMode !== "register"}
                      />
                    </div>
                  </div>

                  <div className="checkout-row">
                    <div className="checkout-field">
                      <label>Mot de passe</label>
                      <input
                        type="password"
                        placeholder="Minimum 8 caractères"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={authMode === "register"}
                        disabled={authMode !== "register"}
                        minLength={8}
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Confirmer le mot de passe</label>
                      <input
                        type="password"
                        placeholder="Répétez le mot de passe"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                        required={authMode === "register"}
                        disabled={authMode !== "register"}
                      />
                    </div>
                  </div>
                  {passwordError && <p className="checkout-password-error">{passwordError}</p>}
                </div>
              </div>

            </div>
          </div>

          {/* ── Section 2 — Paiement ── */}
          <div className="checkout-section">
            <h3 className="checkout-section-title">
              <span>2</span>INFORMATIONS DE PAIEMENT
            </h3>

            <div className="checkout-card-visual">
              <span className="checkout-fake-badge">DEMO</span>
              <div className="checkout-card-chip" />
              <div className="checkout-card-number">{displayCard}</div>
              <div className="checkout-card-bottom">
                <span>{displayName}</span>
                <span>{displayExpiry}</span>
              </div>
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>Numéro de carte</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
            </div>

            <div className="checkout-row">
              <div className="checkout-field">
                <label>Nom sur la carte</label>
                <input
                  type="text"
                  placeholder="JEAN DUPONT"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>Date d'expiration</label>
                <input
                  type="text"
                  placeholder="MM/AA"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  required
                />
              </div>
              <div className="checkout-field">
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="•••"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  maxLength={3}
                  required
                />
              </div>
            </div>

            <button type="submit" className="checkout-submit-btn">
              🎿 CONFIRMER MON FORFAIT — {prix} €
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
