/*1/ Appel du package express */
const express = require('express');

/*2/ Création de l'application express */
const app = express();

/*3/ Chargement package Mongodb */
const mongoose = require('mongoose');

/*4/ Connection du serveur à Mongodb */
mongoose.connect('mongodb+srv://HDelettre:!meab4P3F5hLf8Z@cluster0.uc94k.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  /*5/ Autorisations des vers API */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*6/ Définition du json dans express */
app.use(express.json());

/*7/ Définition des chemins des routes */
const userRoutes = require('./routes/routeUsers');
const saucesRoutes = require('./routes/routeSauces');

/*8/ Définition des routes ;*/
app.use('/api/auth', userRoutes);
app.use('/api/sauces',saucesRoutes);

/*9/ Exportation de l'application vers le serveur */
module.exports = app;