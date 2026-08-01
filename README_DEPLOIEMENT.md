# Déploiement de Délibération scolaire

## 1. Préparer le dépôt GitHub

1. Créez un dépôt GitHub vide.
2. Ajoutez tous les fichiers du projet.
3. Poussez-les avec :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_NOM/VOTRE_REPO.git
git push -u origin main
```

## 2. Déployer sur Vercel

1. Ouvrez https://vercel.com
2. Connectez votre compte GitHub
3. Importez le dépôt
4. Choisissez le dossier racine du projet
5. Déployez

## 3. Configurer le domaine

Ajoutez le domaine suivant dans Vercel :

```text
deliberation-scolaire.com
```

## 4. Texte SEO à utiliser

Titre de page :
```text
Délibération scolaire
```

Description :
```text
Délibération scolaire est la plateforme en ligne dédiée à la consultation des résultats scolaires, des décisions de délibération et de l’accès aux informations académiques pour les élèves.
```

## 5. Commande Vercel

Si vous utilisez l’outil CLI Vercel :

```bash
npm install -g vercel
vercel
```
