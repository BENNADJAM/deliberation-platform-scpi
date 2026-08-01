import React from "react";
import PageShell from "../components/PageShell";
import { SCHOOL_CLASSES } from "../data/schoolData";

export default function ClassesPage() {
  return (
    <PageShell title="Classes" subtitle="Suivi des classes et de leur statut">
      <section className="panel">
        <div className="panel-header">
          <h3>Liste des classes</h3>
          <span className="muted">Par niveau scolaire</span>
        </div>

        <div className="classes-grid">
          {SCHOOL_CLASSES.map((item) => (
            <article key={item.id} className="class-card">
              <h4>{item.name}</h4>
              <p>Niveau : {item.level}</p>
              <span className={`badge ${item.status === "Validé" ? "success" : item.status === "En cours" ? "neutral" : "warning"}`}>
                {item.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
