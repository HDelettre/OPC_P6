/*1/ Appel du package express */
const express = require('express');

/*2/ Définition du router */
const router = express.Router();

/*3/ Définition du chemin vers controlers */
const userCtrl = require('../controlers/userControlers');

/*4/ Définition des routes vers controlers */
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

/*5/ exportation du router vers le serveur */
module.exports = router;