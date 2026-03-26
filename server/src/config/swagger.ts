import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Utilisateurs",
      version: "1.0.0",
    },
    // 1. Définition du schéma (le "moyen" de s'authentifier)
    components: {
      securitySchemes: {
        basicAuth: {
          type: "http",
          scheme: "basic",
        },
      },
    },
    paths: {
      // 2. Application de la sécurité sur la route spécifique
      "/api/admin/basic": {
        get: {
          summary: "Accès zone admin via Basic Auth",
          tags: ["Admin"],
          // C'est ici qu'on applique la sécurité
          security: [
            {
              basicAuth: [], 
            },
          ],
          responses: {
            200: { 
              description: "Accès autorisé",
              content: { "text/plain": { example: "Bienvenue admin !" } }
            },
            401: { description: "Non autorisé - Identifiants incorrects" },
          },
        },
      },
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
  apis: [], 
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);



