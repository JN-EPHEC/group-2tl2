import express from "express";
import cors from "cors";
import path from "path";

const auth = require('http-auth'); 
const authConnect = require('http-auth-connect'); 

import { Database } from "./config/database";
import { errorHandler } from "./middlewares/errorHandler";
import { basicAuth } from "./middlewares/basicAuth";

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION DIGEST CORRIGÉE ---
const digest = auth.digest({ 
    realm: "Zone securisee" 
}, (username: string, callback: any) => {
    if (username === "admin") {
        callback("supersecret"); // <- L'erreur était là : il faut le mot de passe en clair !
    } else {
        callback();
    }
});

// --- ROUTES ---
app.get('/api/admin/digest', authConnect(digest), (req: any, res: any) => { 
    res.json({ message: `Bienvenue dans la zone Digest, ${req.user} !` }); 
});

app.get("/api/admin/basic", basicAuth, (req, res) => {
    res.status(200).send("Accès autorisé (Basic) !");
});

app.use(errorHandler);

const PORT = 3000;

// --- DÉMARRAGE ---
app.listen(PORT, () => {
    console.log("-------------------------------------------------------");
    console.log(`🚀 SERVEUR ACTIF SUR http://localhost:${PORT}`);
    console.log(`🔐 Identifiants : admin / supersecret`);
    console.log("-------------------------------------------------------");
});

// On ignore l'erreur DB pour que le serveur ne s'éteigne pas
Database.getInstance().sync().catch(() => {});