import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 1100 }}>
        <div className="auth-hero">
          <div className="hero-top">
            <div className="logo-badge">
              <svg viewBox="0 0 100 100" className="logo-mark" aria-hidden="true">
                <rect x="12" y="12" width="76" height="76" rx="18" />
                <path d="M28 72 L50 32 L72 72" />
                <circle cx="50" cy="44" r="8" />
              </svg>
            </div>
            <div>
              <p className="hero-kicker">Plateforme académique en ligne</p>
              <h1>Délibération scolaire</h1>
              <p className="hero-text">
                Consultez les résultats, suivez votre décision de délibération et accédez à votre espace élève en toute simplicité.
              </p>
            </div>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <strong>Résultats officiels</strong>
              <span>Consultation rapide des décisions académiques</span>
            </div>
            <div className="feature-item">
              <strong>Accès élève</strong>
              <span>Voir ses notes et son état de délibération</span>
            </div>
            <div className="feature-item">
              <strong>Administration</strong>
              <span>Suivi des classes, des élèves et des décisions</span>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="form-header">
            <p className="eyebrow">Bienvenue</p>
            <h2>Accédez à votre espace</h2>
            <p>Choisissez le mode d’accès adapté à votre profil.</p>
          </div>

          <div className="form-block">
            <h3>Élève</h3>
            <p>Consultez votre décision d’admission ou de redoublement.</p>
            <Link to="/login" className="btn-secondary" style={{ display: "inline-block", textDecoration: "none" }}>
              Se connecter en tant qu’élève
            </Link>
          </div>

          <div className="form-block">
            <h3>Administration</h3>
            <p>Gérez les classes, les notes et les délibérations.</p>
            <Link to="/login" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
              Espace administration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
