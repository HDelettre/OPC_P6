/* Chargement package bcrypt */
const bcrypt = require('bcrypt');

/* Chargement package jsonwebtoken */
const jwt = require('jsonwebtoken');

/* Chargement package dotenv */
const dotenv = require('dotenv');
dotenv.config();

/* chargement model user */
const User = require('../models/users');

/* fonction signup */
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {                                             /* hachage mot de passe */
        const user = new User({                                 /* création nouvel utilisateur */
            email: req.body.email,
            password: hash
        });
        user.save()                                             /* enregistrement utilisateur bdd */
            .then(() => res.status(201).json({ 
                message: 'Utilisateur créé'
            }))
            .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

/* fonction login */
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })                     /* recherche utilisateur bdd */
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé'});
            }
            bcrypt.compare(req.body.password, user.password)    /* vérification du mot de passe */
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect'});
                    }
                    res.status(200).json({                      /* création du token */
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.tokenSecret,
                            { expiresIn: '1h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
    };