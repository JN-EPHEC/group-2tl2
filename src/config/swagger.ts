import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mon API Géniale",
      version: "1.0.0",
    },
    // On définit la route DIRECTEMENT ici pour éviter le scan problématique
    paths: {
      "/api/users": {
        get: {
          summary: "Récupère la liste des utilisateurs",
          tags: ["Users"],
          responses: {
            200: {
              description: "Succès",
            },
          },
        },
      },
    },
  },
  // On met un tableau VIDE ici pour arrêter de scanner les fichiers .ts
  apis: [], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);