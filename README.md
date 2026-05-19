# Les Arcs 1800 — Gestion de forfaits de ski

Application web fullstack pour la gestion et la vente de forfaits de ski de la station Les Arcs 1800. Elle permet aux visiteurs de consulter les forfaits disponibles, d'acheter un abonnement, et aux administrateurs de gérer les utilisateurs via un espace pro sécurisé.

---
[Le lien de production](http://91.134.138.162:5174/)
---
## Table des matières

- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation et lancement local](#installation-et-lancement-local)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer les tests](#lancer-les-tests)
- [Déploiement avec Docker](#déploiement-avec-docker)
- [CI/CD GitHub Actions](#cicd-github-actions)
- [Routes API](#routes-api)
- [Design Patterns](#design-patterns-implémentés)

---

## Technologies utilisées

### Backend
| Technologie | Rôle |
|-------------|------|
| **Node.js** + **Express** | Serveur HTTP / API REST |
| **TypeScript** | Typage statique |
| **Sequelize** | ORM PostgreSQL |
| **PostgreSQL** (Supabase) | Base de données relationnelle |
| **JWT** | Authentification (access token + refresh token) |
| **bcrypt** | Hachage des mots de passe |
| **swagger-ui-express** | Documentation API |

### Frontend
| Technologie | Rôle |
|-------------|------|
| **React 19** + **TypeScript** | Interface utilisateur |
| **Vite** | Bundler / Dev server |
| **React Router v7** | Routing SPA (pages publiques + protégées) |

### DevOps
| Technologie | Rôle |
|-------------|------|
| **Docker** | Conteneurisation backend + frontend |
| **Nginx** | Serveur web pour le frontend |
| **GitHub Actions** | CI/CD (tests + déploiement automatique) |
| **VPS OVH** | Hébergement production |

### Tests
| Technologie | Rôle |
|-------------|------|
| **Jest** + **ts-jest** | Tests unitaires et d'intégration |
| **Supertest** | Tests des routes HTTP |

---

## Architecture du projet

```
group-2tl2/
├── client/                        # Frontend React
│   ├── src/
│   │   ├── App.tsx                # Routing principal
│   │   ├── Panel.tsx              # Espace pro (admin + utilisateur)
│   │   └── Checkout.tsx           # Tunnel d'achat
│   ├── Dockerfile                 # Build Nginx
│   └── package.json
│
├── server/                        # Backend Express
│   ├── src/
│   │   ├── app.ts                 # Configuration Express (middlewares + routes)
│   │   ├── server.ts              # Point d'entrée (listen + sync BDD)
│   │   ├── controllers/           # Logique métier
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   └── abonnementController.ts
│   │   ├── routes/                # Définition des routes HTTP
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── abonnementRoutes.ts
│   │   ├── middlewares/           # Middlewares Express
│   │   │   ├── jwtAuth.ts         # Vérification JWT
│   │   │   ├── errorHandler.ts    # Gestion centralisée des erreurs
│   │   │   └── validationHandler.ts
│   │   ├── models/                # Modèles Sequelize
│   │   │   ├── User.ts
│   │   │   ├── Abonnement.ts
│   │   │   └── Forfait.ts
│   │   ├── config/
│   │   │   └── database.ts        # Singleton Sequelize
│   │   ├── services/
│   │   │   ├── orderTracker.ts    # Pattern Observer
│   │   │   └── stripeAdapter.ts   # Pattern Adapter
│   │   └── tests/                 # Tests Jest (88% de couverture)
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       └── routes/
│   └── package.json
│
├── .github/workflows/
│   └── docker.yml                 # Pipeline CI/CD
├── docker-compose.yml
└── README.md
```

---

## Prérequis

- **Node.js** >= 20
- **npm** >= 9
- **Docker** et **Docker Compose** (pour le déploiement)
- Un projet **Supabase** avec une base PostgreSQL (ou toute autre base PostgreSQL)

---

## Installation et lancement local

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-org>/group-2tl2.git
cd group-2tl2
```

### 2. Installer toutes les dépendances

```bash
npm run setup
```

> Cette commande installe les dépendances du `client/` et du `server/` en une seule fois.

### 3. Configurer les variables d'environnement

```bash
# Copier le fichier exemple et le remplir
cp server/.env.example server/.env
```

### 4. Lancer en mode développement

```bash
# Lancer backend + frontend simultanément
npm run dev
```

Ou séparément :

```bash
# Backend uniquement (port 3000)
npm run start:server

# Frontend uniquement (port 5173)
npm run start:client
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000 |
| Documentation Swagger | http://localhost:3000/api-docs |

---

## Variables d'environnement

Créer un fichier `server/.env` basé sur le modèle suivant :

```env
# Base de données PostgreSQL (Supabase)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Secrets JWT (utiliser des valeurs longues et aléatoires en production)
JWT_ACCESS_SECRET=votre_secret_access_tres_long_et_aleatoire
JWT_REFRESH_SECRET=votre_secret_refresh_different_et_securise

# URL du client (pour la configuration CORS)
CLIENT_URL=http://localhost:5173
```

> **Important :** Ne jamais committer le fichier `.env`. Il est déjà inclus dans `.gitignore`.

---

## Lancer les tests

```bash
# Lancer tous les tests depuis la racine
npm test

# Avec le rapport de couverture
cd server && npm run test:coverage
```

**Couverture actuelle : ~88%** sur la logique métier et les routes critiques.

```
authController.ts      → 96%
userController.ts      → 86%
jwtAuth.ts             → 100%
validationHandler.ts   → 100%
authRoutes.ts          → 100%
userRoutes.ts          → 100%
```

---

## Déploiement avec Docker

### Avec Docker Compose (recommandé)

```bash
# Construire et démarrer les deux conteneurs
docker compose up --build -d

# Vérifier que les conteneurs tournent
docker ps

# Consulter les logs
docker logs skidev2-server
docker logs skidev2-client
```

| Conteneur | Port | Description |
|-----------|------|-------------|
| `skidev2-server` | 3000 | API Express |
| `skidev2-client` | 82 | Frontend Nginx |

### Manuellement (sans Compose)

```bash
# Backend
docker build -t skidev2-server ./server
docker run -d --name skidev2-server -p 3000:3000 --env-file server/.env skidev2-server

# Frontend
docker build --build-arg VITE_API_URL=http://localhost:3000/api -t skidev2-client ./client
docker run -d --name skidev2-client -p 82:80 skidev2-client
```

---

## CI/CD GitHub Actions

Le pipeline se déclenche automatiquement à chaque **push sur `main`** en deux étapes séquentielles :

```
push sur main
      │
      ▼
 [1] Tests Jest
      │  si les tests échouent → déploiement bloqué
      ▼
 [2] Build & Push vers Docker Hub (server + client)
      │
      ▼
 [3] SSH → déploiement automatique sur le VPS OVH
```

### Secrets GitHub à configurer

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKER_PASSWORD` | Mot de passe Docker Hub |
| `VITE_API_URL` | URL de l'API en production (ex: `http://IP:3000/api`) |
| `SERVER_HOST` | IP ou domaine du VPS |
| `SERVER_USER` | Utilisateur SSH du VPS |
| `SERVER_SSH_KEY` | Clé privée SSH (contenu complet avec en-têtes) |

---

## Routes API

| Méthode | Route | Auth | Description |
|---------|-------|------|-------------|
| `POST` | `/api/auth/login` | ❌ | Connexion |
| `POST` | `/api/auth/logout` | ❌ | Déconnexion |
| `GET` | `/api/users` | ✅ JWT | Liste des utilisateurs |
| `POST` | `/api/users` | ❌ | Inscription |
| `PATCH` | `/api/users/:id` | ✅ JWT | Modifier un utilisateur |
| `DELETE` | `/api/users/:id` | ✅ JWT | Supprimer un utilisateur |
| `GET` | `/api/users/:id/abonnements` | ✅ JWT | Abonnements d'un utilisateur |
| `POST` | `/api/abonnements` | ❌ | Créer un abonnement |

> La documentation interactive complète est disponible sur `/api-docs` (Swagger UI).

---

## Design Patterns implémentés

| Pattern | Fichier | Description |
|---------|---------|-------------|
| **Singleton** | `config/database.ts` | Instance Sequelize unique partagée dans toute l'app |
| **Observer** | `services/orderTracker.ts` | Notifications automatiques sur changement de statut |
| **Adapter** | `services/stripeAdapter.ts` | Abstraction du système de paiement |
| **MVC** | `controllers/` + `routes/` + `models/` | Séparation claire des responsabilités |
| **Middleware Chain** | `middlewares/` | Pipeline de traitement des requêtes HTTP |
