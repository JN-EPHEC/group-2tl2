// @ts-nocheck
import express from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

// --- CONFIG SWAGGER (Directement ici pour éviter les erreurs 404) ---
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "TP JWT Final", version: "1.0.0" },
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
      }
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
        get: { tags: ["Auth"], security: [{ bearerAuth: [] }], responses: { 200: { description: "OK" } } }
      },
      "/api/auth/refresh": {
        post: { tags: ["Auth"], responses: { 200: { description: "OK" } } }
      }
    }
  },
  apis: []
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token manquant" });
  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalide" });
    req.user = user;
    next();
  });
};

// --- ROUTES ---
app.post('/api/auth/login', (req, res) => {
  if (req.body.username === "student" && req.body.password === "password123") {
    const user = { id: 1, username: "student" };
    const accessToken = jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });

    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "strict" });
    return res.json({ accessToken });
  }
  res.status(401).json({ error: "Identifiants faux" });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ message: "OK", user: req.user });
});

app.post('/api/auth/refresh', (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "Pas de cookie" });
  jwt.verify(token, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Refresh invalide" });
    const newAccess = jwt.sign({ id: user.id, username: user.username }, ACCESS_SECRET, { expiresIn: "15m" });
    res.json({ accessToken: newAccess });
  });
});

app.listen(3000, () => console.log("🚀 Connecté sur http://localhost:3000/api-docs/"));