# Les Arcs 1800 — Gestion de forfaits de ski

Application web de gestion et vente de forfaits de ski. Les visiteurs peuvent acheter un forfait, les administrateurs gèrent les utilisateurs via un espace pro sécurisé.

**Production :** [http://91.134.138.162:5173/](http://91.134.138.162:5173/)

---

## Stack

- **Backend :** Node.js, Express, TypeScript, Sequelize, PostgreSQL (Supabase), JWT, bcrypt
- **Frontend :** React 19, Vite, React Router
- **DevOps :** Docker, Nginx, GitHub Actions, VPS OVH

---

## Lancer le projet en local

### Prérequis
- Node.js >= 20
- npm >= 9

### Installation

```bash
git clone https://github.com/<votre-org>/group-2tl2.git
cd group-2tl2
npm run setup
```

### Configuration

Créer `server/.env` :

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_ACCESS_SECRET=votre_secret_access
JWT_REFRESH_SECRET=votre_secret_refresh
CLIENT_URL=http://localhost:5173
```

### Démarrer

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api-docs |

---

## Tests

```bash
npm test
# ou avec la couverture :
cd server && npm run test:coverage
```

---

## Déploiement Docker

```bash
docker compose up --build -d
```
