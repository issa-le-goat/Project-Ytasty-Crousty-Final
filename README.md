# Ytasty Crousty

Application de commande pour restaurants, avec catalogue client, panier et espace de gestion pour l'équipe. Le frontend est développé avec React, TypeScript et Vite ; l'API utilise FastAPI et PostgreSQL.

## Fonctionnalités

- Sélection d'un restaurant et consultation de sa carte.
- Panier et parcours de commande côté client.
- Connexion administrateur et tableau de suivi cuisine.
- API pour gérer les utilisateurs, restaurants, produits et commandes.

## Prérequis

- Node.js et npm.
- Docker Desktop démarré avec le moteur Linux disponible.

## Démarrer l'application

Depuis le dossier `Project-Ytasty-Crousty-Final`, lance le frontend dans un terminal :

```powershell
npm install
npm run dev
```

Ouvre l'adresse indiquée par Vite, généralement `http://localhost:5173`. Si ce port est déjà utilisé, Vite choisira le suivant, par exemple `5174`.

Dans un autre terminal, démarre l'API et PostgreSQL depuis la racine du projet :

```powershell
docker compose -f .\backend\docker-compose.yml up --build
```

L'API est disponible sur `http://localhost:8000`, et sa documentation interactive sur `http://localhost:8000/docs`.

Pour arrêter les services, utilise `Ctrl+C`. Pour les arrêter depuis un autre terminal :

```powershell
docker compose -f .\backend\docker-compose.yml down
```

## Compte administrateur de développement

Les identifiants de démonstration sont :

- Identifiant : `admin`
- Mot de passe : `ytasty2026`

Le backend crée ce compte au démarrage de l'environnement Docker de développement et stocke son mot de passe sous forme de hash. Le frontend principal utilise aussi ces identifiants pour sa connexion de démonstration.

**Ces identifiants sont réservés au développement.** Le compte du frontend de démonstration est défini côté client et ne constitue pas une authentification adaptée à la production. Change les identifiants et configure une authentification serveur avant tout déploiement public.

## Structure du dépôt

```text
backend/   API FastAPI, modèles SQLAlchemy et configuration Docker
frontend/  Interface Back-Office distincte pour le personnel
src/       Application React principale, catalogue et espace client/admin
public/    Ressources statiques
```

## Commandes utiles

```powershell
npm run build
npm run lint
```
