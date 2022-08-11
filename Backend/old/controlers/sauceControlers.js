/* Définition du model */
const dataSauce = require('../models/dataSauce');

/* Ajouter une sauce */
exports.createSauce = (req, res, next) => {
    const sauce = new dataSauce({
        ...req.body
    });
    sauce.save()
        .then(() => { res.status(201).json({message: 'La nouvelle sauce a été ajoutée'})})
        .catch (error => res.status(400).json({ error }))
};

/* Afficher une sauce */
exports.getOneSauce = (req, res, next) => {

}
