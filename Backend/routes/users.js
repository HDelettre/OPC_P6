/* Chargement package express */
const express = require('express');

/* Définition du router */
const router = express.Router();

/* Chemin vers controlers */
const userCtrl = require('../controlers/users');

/* Lancement des fonctions dans controlers */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/* exportation router */
module.exports = router;