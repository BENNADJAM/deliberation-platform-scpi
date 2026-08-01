import React, { useState } from "react";
import { STUDENTS } from "../data/schoolData";

const initialForm = {
  lastName: "",
  firstName: "",
  permanentCode: "",
  className: "",
  average: "",
};

export default function StudentsPage() {
  const [students, setStudents] = useState(STUDENTS);
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.lastName || !form.firstName || !form.permanentCode) {
      return;
    }

    const newStudent = {
      ...form,
      average: Number(form.average || 0),
      status: "En attente",
      subjects: {},
    };

    setStudents((prev) => [newStudent, ...prev]);
    setForm(initialForm);
  }

  function handleDelete(permanentCode) {
    setStudents((prev) =>
      prev.filter((student) => student.permanentCode !== permanentCode)
    );
  }

  return (
    <div className="student-page">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Gestion</p>
          <h2>Ajouter et supprimer des élèves</h2>
          <p>Ajoutez un nouvel élève ou supprimez un élève existant de la liste.</p>
        </div>
      </div>

      <div className="panel student-form-card">
        <h3>Ajouter un élève</h3>
        <form className="student-form" onSubmit={handleSubmit}>
          <div className="student-form-grid">
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
            />
            <input
              name="permanentCode"
              value={form.permanentCode}
              onChange={handleChange}
              placeholder="Code permanent"
              required
            />
            <input
              name="className"
              value={form.className}
              onChange={handleChange}
              placeholder="Classe"
            />
            <input
              name="average"
              type="number"
              step="0.01"
              value={form.average}
              onChange={handleChange}
              placeholder="Moyenne"
            />
          </div>

          <button className="btn-primary" type="submit">
            Ajouter
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Liste des élèves</h3>
          <span className="muted">{students.length} élève(s)</span>
        </div>

        {students.length === 0 ? (
          <p className="empty-state">Aucun élève pour le moment.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Code permanent</th>
                  <th>Classe</th>
                  <th>Moyenne</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.permanentCode}>
                    <td>{student.lastName}</td>
                    <td>{student.firstName}</td>
                    <td>{student.permanentCode}</td>
                    <td>{student.className || "-"}</td>
                    <td>{student.average ?? "-"}</td>
                    <td>
                      <button
                        className="btn-small warning"
                        onClick={() => handleDelete(student.permanentCode)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
