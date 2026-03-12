import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Utilisateurs",
      version: "1.0.0",
    },
    paths: {
      "/api/users": {
        get: {
          summary: "Liste des utilisateurs",
          tags: ["Users"],
          responses: { 200: { description: "Succès" } }
        },
        post: {
          summary: "Créer un utilisateur",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    email: { type: "string" }
                  }
                }
              }
            }
          },
          responses: { 201: { description: "Créé" } }
        }
      },
      "/api/users/{id}": {
        delete: {
          summary: "Supprimer un utilisateur",
          tags: ["Users"],
          parameters: [{ in: "path", name: "id", required: true, schema: { type: "integer" } }],
          responses: { 204: { description: "Supprimé" } }
        }
      }
    }
  },
  apis: [], // On laisse vide pour stopper le scan qui fait planter le serveur
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);


