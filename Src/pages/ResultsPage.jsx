import React, { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { STUDENTS } from "../data/schoolData";

export default function ResultsPage() {
  const [students, setStudents] = useState(STUDENTS);

  const stats = useMemo(() => {
    return {
      admitted: students.filter((s) => s.status === "Admis").length,
      repeaters: students.filter((s) => s.status === "Redoublant").length,
      pending: students.filter((s) => s.status === "À traiter").length,
    };
  }, [students]);

  function handleDecision(id, decision) {
    setStudents((prev) =>
      prev.map((student) => (student.id === id ? { ...student, status: decision } : student))
    );
  }

  return (
    <PageShell title="Admis / Redoublants" subtitle="Décider le statut final des élèves">
      <section className="stats-grid">
        <article className="stat-card">
          <p>Admis</p>
          <h3>{stats.admitted}</h3>
          <span>Élèves promus</span>
        </article>
        <article className="stat-card">
          <p>Redoublants</p>
          <h3>{stats.repeaters}</h3>
          <span>À reprendre</span>
        </article>
        <article className="stat-card">
          <p>À traiter</p>
          <h3>{stats.pending}</h3>
          <span>En attente</span>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Décisions à valider</h3>
          <span className="muted">Cliquer sur un statut pour le mettre à jour</span>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Élève</th>
                <th>Classe</th>
                <th>Moyenne</th>
                <th>Statut actuel</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.className}</td>
                  <td>{student.average}</td>
                  <td>
                    <span className={`badge ${student.status === "Admis" ? "success" : student.status === "Redoublant" ? "warning" : "neutral"}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-inline">
                      <button className="btn-small success" onClick={() => handleDecision(student.id, "Admis")}>Admis</button>
                      <button className="btn-small warning" onClick={() => handleDecision(student.id, "Redoublant")}>Redoublant</button>
                      <button className="btn-small neutral" onClick={() => handleDecision(student.id, "À traiter")}>À traiter</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}
