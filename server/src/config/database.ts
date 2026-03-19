import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

export class Database {
  // 1. Stockage de l'instance unique
  private static instance: Sequelize;

  // 2. Constructeur PRIVÉ : empêche de faire 'new Database()' ailleurs
  private constructor() {}

  // 3. Point d'accès global à l'instance
  public static getInstance(): Sequelize {
    if (!Database.instance) {
      console.log("--- Création de l'instance unique Sequelize (Singleton) ---");
      
      Database.instance = new Sequelize(process.env.DATABASE_URL as string, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      });
    }

    return Database.instance;
  }
}

// Pour garder la compatibilité avec tes anciens fichiers, tu peux exporter l'instance par défaut
export default Database.getInstance();