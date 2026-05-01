// @ts-nocheck
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "TP JWT - Étape 3", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Authentification"],
          requestBody: {
            content: { "application/json": { schema: { type: "object", properties: { username: { type: "string", example: "student" }, password: { type: "string", example: "password123" } } } } }
          },
          responses: { 200: { description: "OK" } }
        }
      },
      "/api/auth/refresh": {
        post: {
          tags: ["Authentification"],
          summary: "Générer un nouvel Access Token (Étape 3)",
          requestBody: {
            content: {
              "application/json": {
                schema: { type: "object", properties: { refreshToken: { type: "string" } } }
              }
            }
          },
          responses: { 200: { description: "Nouveau Token généré" } }
        }
      },
      "/api/profile": {
        get: {
          tags: ["Utilisateur"],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "OK" } }
        }
      }
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
