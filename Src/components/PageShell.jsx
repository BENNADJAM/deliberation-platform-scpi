import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function PageShell({ title, subtitle, children }) {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    setUser(null);
    navigate("/login");
  }

  return (
    <div className={`dashboard-page ${theme}`}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-icon">DO</div>
          <div>
            <h3>Délibération OS</h3>
            <p>Résultats scolaires</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>Vue générale</NavLink>
          <NavLink to="/students" className={({ isActive }) => (isActive ? "active" : "")}>Élèves</NavLink>
          <NavLink to="/results" className={({ isActive }) => (isActive ? "active" : "")}>Admis / Redoublants</NavLink>
          <NavLink to="/grades" className={({ isActive }) => (isActive ? "active" : "")}>Saisie des notes</NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>Rapports</NavLink>
          <NavLink to="/subjects" className={({ isActive }) => (isActive ? "active" : "")}>Matières</NavLink>
          <NavLink to="/classes" className={({ isActive }) => (isActive ? "active" : "")}>Classes</NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>Connecté en tant que</p>
          <strong>{user?.name || "Admin"}</strong>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">Tableau de bord</p>
            <h1>{title}</h1>
            {subtitle ? <p className="subtitle">{subtitle}</p> : null}
          </div>

          <div className="topbar-actions">
            <button className="btn-ghost" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              {theme === "light" ? "Mode sombre" : "Mode clair"}
            </button>
            <button className="btn-secondary" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
