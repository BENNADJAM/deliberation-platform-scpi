import React, { useState } from "react";
import { SCHOOL_SUBJECTS } from "../data/schoolData";

const initialForm = {
  id: "",
  label: "",
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState(SCHOOL_SUBJECTS);
  const [form, setForm] = useState(initialForm);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const id = form.id.trim().toLowerCase().replace(/\s+/g, "-");
    const label = form.label.trim();

    if (!id || !label) return;

    setSubjects((prev) => [...prev, { id, label }]);
    setForm(initialForm);
  }

  function handleDelete(id) {
    setSubjects((prev) => prev.filter((subject) => subject.id !== id));
  }

  return (
    <div className="subject-page">
      <div className="hero-card compact">
        <div>
          <p className="eyebrow">Gestion</p>
          <h2>Ajouter ou supprimer des matières</h2>
          <p>Ajoutez une nouvelle matière ou retirez-en une existante.</p>
        </div>
      </div>

      <div className="panel">
        <h3>Ajouter une matière</h3>
        <form className="subject-form" onSubmit={handleSubmit}>
          <div className="subject-form-grid">
            <input
              name="id"
              value={form.id}
              onChange={handleChange}
              placeholder="Identifiant (ex: histoire)"
              required
            />
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Nom de la matière"
              required
            />
          </div>
          <button className="btn-primary" type="submit">
            Ajouter
          </button>
        </form>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Liste des matières</h3>
          <span className="muted">{subjects.length} matière(s)</span>
        </div>

        {subjects.length === 0 ? (
          <p className="empty-state">Aucune matière pour le moment.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.label}</td>
                    <td>
                      <button
                        className="btn-small warning"
                        onClick={() => handleDelete(subject.id)}
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
