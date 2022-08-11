/* Chargement package mongoose */
const mongoose = require('mongoose');

/* Chargement package unique-validator */
const uniqueValidator = require('mongoose-unique-validator');

/* Définition du model User */
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

/* application unique-validator au schema */
userSchema.plugin(uniqueValidator);

/*exportation du model vers le serveur */
module.exports = mongoose.model('User', userSchema);