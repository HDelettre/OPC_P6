/*1/ Chargement du package http */
const http = require('http');

/*2/ Définition de l'application express */
const app = require('./app');

/*3/ Appel de l'application express */
app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

/*4/ Ecoute du port 3000 de l'application */
server.listen(process.env.PORT || 3000);