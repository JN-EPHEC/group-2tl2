// @ts-nocheck
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Sécurisée - TP 07",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        basicAuth: { type: "http", scheme: "basic" },
        digestAuth: { type: "http", scheme: "digest" },
        // AJOUT DU JWT ICI
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    paths: {
      "/api/admin/basic": {
        get: { tags: ["Auth Classique"], security: [{ basicAuth: [] }], responses: { 200: { description: "OK" } } }
      },
      "/api/admin/digest": {
        get: { tags: ["Auth Classique"], security: [{ digestAuth: [] }], responses: { 200: { description: "OK" } } }
      },
      // --- NOUVELLES ROUTES JWT ---
      "/api/login": {
        post: {
          tags: ["JWT"],
          summary: "Obtenir un Access Token",
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string", example: "admin" },
                    password: { type: "string", example: "supersecret" }
                  }
                }
              }
            }
          },
          responses: { 200: { description: "Token généré" } }
        }
      },
      "/api/admin/jwt": {
        get: {
          tags: ["JWT"],
          summary: "Zone protégée par Token",
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "Accès autorisé" } }
        }
      }
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);