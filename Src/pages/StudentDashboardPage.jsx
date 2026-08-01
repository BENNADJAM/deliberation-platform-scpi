import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SCHOOL_SUBJECTS } from "../data/schoolData";

export default function StudentDashboardPage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const student = user?.student;

  function handleLogout() {
    setUser(null);
    navigate("/login");
  }

  if (!student) {
    return null;
  }

  const notes = SCHOOL_SUBJECTS
    .filter((subject) => student.subjects?.[subject.id] !== undefined)
    .map((subject) => ({
      ...subject,
      note: student.subjects[subject.id],
    }));

  const average = Number(student.average || 0).toFixed(2);
  const isAdmitted = student.status === "Admis";
  const statusLabel = isAdmitted
    ? "Vous êtes admis à la classe supérieure"
    : student.status === "Redoublant"
    ? "Vous devez redoubler la classe"
    : "Votre décision est en attente";

  return (
    <div className="student-dashboard">
      <div className="student-card">
        <div className="student-header">
          <div>
            <p className="eyebrow">Espace élève</p>
            <h1>{student.firstName} {student.lastName}</h1>
            <p className="subtitle">Code permanent : {student.permanentCode}</p>
            <p className="subtitle">Classe : {student.className}</p>
          </div>
          <button className="btn-secondary" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>

        <div className="student-grid">
          <div className="student-panel">
            <h3>Décision de délibération</h3>
            <div className="student-result-box">
              <p className="result-badge">{student.status}</p>
              <h2>{statusLabel}</h2>
              <p>Moyenne générale : <strong>{average}</strong></p>
              <p>Résultat final validé par le comité académique.</p>
            </div>
          </div>

          <div className="student-panel">
            <h3>Bulletin de notes</h3>
            <ul className="student-list">
              {notes.map((subject) => (
                <li key={subject.id}>
                  <strong>{subject.label}</strong>
                  <span>{subject.note}/20</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="student-panel" style={{ marginTop: "1rem" }}>
          <h3>Informations académiques</h3>
          <ul className="student-list">
            <li><strong>Classe :</strong> {student.className}</li>
            <li><strong>Statut :</strong> {student.status}</li>
            <li><strong>Décision :</strong> {isAdmitted ? "Admission confirmée" : "Redoublement confirmé"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
