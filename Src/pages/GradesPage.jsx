import React, { useEffect, useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { SCHOOL_SUBJECTS, STUDENTS } from "../data/schoolData";

function buildGradesFromStudent(student) {
  const initial = {};
  SCHOOL_SUBJECTS.forEach((subject) => {
    initial[subject.id] = student?.subjects?.[subject.id] ?? "";
  });
  return initial;
}

export default function GradesPage() {
  const [students, setStudents] = useState(STUDENTS);
  const [selectedStudentId, setSelectedStudentId] = useState(STUDENTS[0].id);
  const [subjectGrades, setSubjectGrades] = useState(() => buildGradesFromStudent(STUDENTS[0]));
  const [message, setMessage] = useState("");

  const selectedStudent = students.find((student) => student.id === selectedStudentId) || students[0];

  useEffect(() => {
    setSubjectGrades(buildGradesFromStudent(selectedStudent));
  }, [selectedStudent]);

  const average = useMemo(() => {
    const values = Object.values(subjectGrades).filter((value) => value !== "").map(Number);
    if (!values.length) return "0.0";
    const sum = values.reduce((acc, val) => acc + val, 0);
    return (sum / values.length).toFixed(1);
  }, [subjectGrades]);

  function handleChange(e) {
    const { name, value } = e.target;
    setSubjectGrades((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const normalized = Object.fromEntries(
      Object.entries(subjectGrades).map(([key, value]) => [key, Number(value)])
    );

    const finalAverage = Number(average);
    const finalStatus = finalAverage >= 10 ? "Admis" : "Redoublant";

    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudentId
          ? { ...student, average: finalAverage, status: finalStatus, subjects: normalized }
          : student
      )
    );

    setMessage(`${selectedStudent.name} — Moyenne : ${average} — Statut prévu : ${finalStatus}`);
  }

  return (
    <PageShell title="Saisie des notes" subtitle="Enregistrer les performances et calculer la décision">
      <section className="panel">
        <div className="panel-header">
          <h3>Formulaire de saisie</h3>
          <span className="muted">Calcul automatique de la moyenne</span>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Élève
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(Number(e.target.value))}>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.className})
                </option>
              ))}
            </select>
          </label>

          {SCHOOL_SUBJECTS.map((subject) => (
            <label key={subject.id}>
              {subject.label}
              <input
                type="number"
                name={subject.id}
                value={subjectGrades[subject.id] ?? ""}
                onChange={handleChange}
              />
            </label>
          ))}

          <div className="form-actions">
            <button type="submit" className="btn-primary">Calculer la décision</button>
          </div>
        </form>

        <div className="preview-card">
          <h4>Résultat prévisionnel</h4>
          <p>Moyenne : <strong>{average}</strong></p>
          <p>{message || "Aucune décision calculée pour l’instant."}</p>
        </div>
      </section>
    </PageShell>
  );
}
