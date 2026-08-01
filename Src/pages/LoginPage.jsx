import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { STUDENTS } from "../data/schoolData";

function LogoIcon() {
  return (
    <svg viewBox="0 0 100 100" className="logo-mark" aria-hidden="true">
      <rect x="12" y="12" width="76" height="76" rx="18" />
      <path d="M28 72 L50 32 L72 72" />
      <circle cx="50" cy="44" r="8" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, setUser } = useAuth();

  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });
  const [adminError, setAdminError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [studentForm, setStudentForm] = useState({
    lastName: "",
    firstName: "",
    permanentCode: "",
  });

  const [studentError, setStudentError] = useState("");

  async function handleAdminSubmit(e) {
    e.preventDefault();
    setAdminError("");
    setIsSubmitting(true);

    try {
      await login(adminForm.email, adminForm.password);
      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "Identifiants invalides";
      setAdminError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleStudentChange(e) {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    setStudentError("");
  }

  function handleStudentSubmit(e) {
    e.preventDefault();

    const student = STUDENTS.find(
      (item) =>
        item.lastName.toLowerCase() === studentForm.lastName.trim().toLowerCase() &&
        item.firstName.toLowerCase() === studentForm.firstName.trim().toLowerCase() &&
        item.permanentCode.toLowerCase() === studentForm.permanentCode.trim().toLowerCase()
    );

    if (student) {
      setUser({ role: "student", student });
      navigate("/student-dashboard");
    } else {
      setStudentError("Identifiants introuvables. Vérifiez votre nom, prénom et code permanent.");
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-hero">
          <div className="hero-top">
            <div className="logo-badge">
              <LogoIcon />
            </div>
            <div>
              <p className="hero-kicker">Plateforme académique en ligne</p>
              <h1>Délibération scolaire</h1>
              <p className="hero-text">
                Consultez vos résultats, suivez votre décision de délibération et accédez à votre espace élève en toute simplicité.
              </p>
            </div>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <strong>Accès sécurisé</strong>
              <span>Connexion administrateur et élève séparées</span>
            </div>
            <div className="feature-item">
              <strong>Suivi des résultats</strong>
              <span>Notes, moyenne et décision finale</span>
            </div>
            <div className="feature-item">
              <strong>Interface professionnelle</strong>
              <span>Design moderne inspiré d’un environnement universitaire</span>
            </div>
          </div>
        </div>

        <div className="auth-form-side">
          <div className="form-header">
            <p className="eyebrow">Connexion</p>
            <h2>Bienvenue sur Délibération scolaire</h2>
            <p>Connectez-vous ici pour consulter vos résultats et votre décision académique.</p>
          </div>

          <div className="form-block">
            <h3>Administration</h3>
            <form onSubmit={handleAdminSubmit}>
              <label>Email</label>
              <input
                type="email"
                value={adminForm.email}
                onChange={(e) => setAdminForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />

              <label>Mot de passe</label>
              <input
                type="password"
                value={adminForm.password}
                onChange={(e) => setAdminForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />

              {adminError ? <p className="error-text">{adminError}</p> : null}

              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>

          <div className="form-block">
            <h3>Élève</h3>
            <form onSubmit={handleStudentSubmit}>
              <label>Nom</label>
              <input
                type="text"
                name="lastName"
                value={studentForm.lastName}
                onChange={handleStudentChange}
              />

              <label>Prénom</label>
              <input
                type="text"
                name="firstName"
                value={studentForm.firstName}
                onChange={handleStudentChange}
              />

              <label>Code permanent</label>
              <input
                type="text"
                name="permanentCode"
                value={studentForm.permanentCode}
                onChange={handleStudentChange}
              />

              {studentError ? <p className="error-text">{studentError}</p> : null}

              <button type="submit" className="btn-secondary">
                Se connecter en tant qu’élève
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}


