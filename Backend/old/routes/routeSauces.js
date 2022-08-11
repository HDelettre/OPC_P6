/*1/ Appel du package expres */
const express = require('express');

/*2/ Définition du router */
const router = express.Router();

/* */
const auth = require('../middleware/auth');

/*3/ Définition du chemin vers les controlers */
const sauceCtrl = require('../controlers/sauceControlers');

/*4/ Définition des routes vers controlers */
router.post('/',auth, sauceCtrl.createSauce);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.put('/:id',auth, sauceCtrl.modifySauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.get('/',auth, sauceCtrl.getAllSauce);

/*5/ exportation du router vers le serveur */
module.exports = router;