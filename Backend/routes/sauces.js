/* Chargement package express */
const express = require('express');

/* Définition du router */
const router = express.Router();

/* Lien vers le middleware d'authentification */
const auth = require('../middlewares/auth');

/* Lien vers multer / gestion des images */
const multer = require('../middlewares/multer-config');

/* Chemin vers controlers */
const sauceCtrl = require('../controlers/sauces');

/* Lancement des fonctions dans controlers */
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

/* exportation router */
module.exports = router;