import React, { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { STUDENTS } from "../data/schoolData";

export default function ReportsPage() {
  const [students] = useState(STUDENTS);

  const stats = useMemo(() => {
    return {
      admitted: students.filter((s) => s.status === "Admis").length,
      repeaters: students.filter((s) => s.status === "Redoublant").length,
      pending: students.filter((s) => s.status === "À traiter").length,
    };
  }, [students]);

  return (
    <PageShell title="Rapports" subtitle="Générer les résultats de la délibération">
      <section className="hero-card compact">
        <div>
          <p className="eyebrow">Export</p>
          <h2>Générer les rapports de délibération</h2>
          <p>Produisez un résumé des admissions, des redoublements et des décisions à valider.</p>
        </div>
        <button className="btn-primary">Exporter le rapport</button>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Résumé du comité</h3>
            <a href="#">Télécharger</a>
          </div>
          <ul className="list">
            <li><strong>{stats.admitted} élèves admis</strong><span>Promotion validée pour les classes traitées</span></li>
            <li><strong>{stats.repeaters} redoublants</strong><span>Cas à revoir en conseil</span></li>
            <li><strong>{stats.pending} dossiers à traiter</strong><span>Élèves encore en attente</span></li>
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Actions recommandées</h3>
            <a href="#">Voir détails</a>
          </div>
          <ul className="list">
            <li><strong>Valider les dossiers de 4e B</strong><span>3 dossiers à compléter</span></li>
            <li><strong>Vérifier 2nde A</strong><span>Moyennes proches du seuil</span></li>
            <li><strong>Finaliser Terminale</strong><span>Derniers cas à traiter</span></li>
          </ul>
        </article>
      </section>
    </PageShell>
  );
}
