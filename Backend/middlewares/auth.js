/* chargement package jsonwebtoken */
const jwt = require('jsonwebtoken');

/* Chargement package dotenv */
const dotenv = require('dotenv');
dotenv.config();

/* vérification user avec token */
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.tokenSecret);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch (error) {
        res.status(401).json({ error: error | 'requête non authentifiée' });
    }
};