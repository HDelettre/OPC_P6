/* Chargement du package express */
const express = require('express');

/* Chargement package dotenv */
const dotenv = require('dotenv');
dotenv.config();

/* Chargement pakage helmet */
const helmet = require('helmet');

// Chargement package rate-limit
const rateLimit = require("express-rate-limit");

// Paramètre rate Limit
const limiter = rateLimit({
  max: 100,                                 // 100 requêtes maximum
  windowMs: 60 * 60 * 1000,                 // 1 heure
  message: "Vous avez atteint la limite de requête, essayer plus tard !"
});

/* Chargement package mongoose */
const mongoose = require('mongoose');

/* chemin vers le dossier image */
const path = require('path');

/* Déclaration des routes */
const routesSauces = require('./routes/sauces');
const routesUsers = require('./routes/users');

/* Connection à mongodb */
mongoose.connect(`mongodb+srv://${process.env.mongodbUser}:${process.env.mongodbPassword}@${process.env.mongodbDatabase}`)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/* Création de l'application express */
const app = express();

// Gestion des images
app.use('/images', express.static(path.join(__dirname, 'images')));

/* Application helmet à application */
app.use(helmet());

// Application package rate-limt
app.use(limiter);

/* CORS */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* Conversion des messages express en json */
app.use(express.json());

/* Appel des routes */
app.use('/api/sauces', routesSauces);

app.use('/api/auth', routesUsers);

/* exportation application vers le serveur */
module.exports = app;