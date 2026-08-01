import React from "react";
import PageShell from "../components/PageShell";

const metrics = [
  { title: "Élèves admis", value: "1 248", change: "+8% ce mois" },
  { title: "Élèves redoublants", value: "186", change: "-3% ce mois" },
  { title: "Classes concernées", value: "7 niveaux", change: "6e à Terminale" },
];

const classes = [
  { name: "6e", status: "Validation en cours" },
  { name: "5e", status: "Validé" },
  { name: "4e", status: "Validation en cours" },
  { name: "3e", status: "Validé" },
  { name: "2nde", status: "À valider" },
  { name: "1ère", status: "À valider" },
  { name: "Terminale", status: "À valider" },
];

export default function DashboardPage() {
  return (
    <PageShell title="Tableau de bord" subtitle="Vue générale de la délibération">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Mission du comité</p>
          <h2>Valider les résultats des élèves admis et redoublants</h2>
          <p>Suivi des décisions de promotion et des cas de redoublement de la 6e à la Terminale.</p>
        </div>
        <button className="btn-primary">Nouvelle délibération</button>
      </section>

      <section className="stats-grid">
        {metrics.map((item) => (
          <article key={item.title} className="stat-card">
            <p>{item.title}</p>
            <h3>{item.value}</h3>
            <span>{item.change}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h3>Classes à traiter</h3>
            <a href="#">Voir tout</a>
          </div>
          <ul className="list">
            {classes.map((item) => (
              <li key={item.name}>
                <strong>{item.name}</strong>
                <span>{item.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h3>Décisions récentes</h3>
            <a href="#">Actualiser</a>
          </div>
          <ul className="list">
            <li>
              <strong>Promotion validée</strong>
              <span>Classe de 5e – 14 élèves admis</span>
            </li>
            <li>
              <strong>Redoublement confirmé</strong>
              <span>Classe de 3e – 6 élèves redoublants</span>
            </li>
            <li>
              <strong>Comité en cours</strong>
              <span>Terminale – validation des derniers cas</span>
            </li>
          </ul>
        </article>
      </section>
    </PageShell>
  );
}
