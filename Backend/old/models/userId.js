/* chargement mongoose */
const mongoose = require('mongoose');

/* chargement package unique validator */
const uniqueValidator = require('mongoose-unique-validator');

/* Définition models user Id */
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

/* application uniquevalidator à userSchema */
userSchema.plugin(uniqueValidator);

/* Exportation du model */
module.exports = mongoose.model('User', userSchema);