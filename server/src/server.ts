import { sequelize } from './models/index';
import app from './app';

const PORT = 3000;

// ── Démarrage ──────────────────────────────────────────────
sequelize
    .sync({ alter: true })
    .then(() => {
        console.log("✅ Base de données synchronisée");
        app.listen(PORT, () => console.log(`🚀 SERVEUR: http://localhost:${PORT}`));
    })
    .catch((err) => {
        console.error("❌ Erreur de synchronisation Sequelize :", err);
        process.exit(1);
    });
