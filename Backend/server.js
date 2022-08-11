/* Chargement package 'http' de node */
const http = require('http');

/* Chargement package dotenv */
const dotenv = require('dotenv');
dotenv.config();

/* Déclaration variable dotenv */
const PORT = process.env.portServer;

/* Appel application express */
const app = require('./app');

/* Lancement de l'application */
app.set(PORT);
const server = http.createServer(app);

/* Ecoute du port par le serveur*/
server.listen(PORT, () => console.log ('Le server utilise le port: ' + PORT));