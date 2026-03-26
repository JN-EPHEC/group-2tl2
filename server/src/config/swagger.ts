// @ts-nocheck
import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "API JWT TP", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    paths: {
      "/api/auth/login": {
        post: {
          tags: ["Auth"],
          requestBody: { content: { "application/json": { schema: { type: "object", properties: { username: { type: "string", example: "student" }, password: { type: "string", example: "password123" } } } } } },
          responses: { 200: { description: "OK" } }
        }
      },
      "/api/auth/me": {
        get: {
          tags: ["Auth"],
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: "OK" } }
        }
      },
      "/api/auth/refresh": {
        post: {
          tags: ["Auth"],
          responses: { 200: { description: "OK" } }
        }
      }
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);