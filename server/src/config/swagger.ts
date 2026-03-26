// @ts-nocheck
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "TP JWT - Étape 2", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Authentification"],
          requestBody: { content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" }, password: { type: "string" } } } } } },
          responses: { 200: { description: "OK" } }
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
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);