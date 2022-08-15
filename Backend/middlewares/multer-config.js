/* chargement package multer */
const multer = require('multer');

/* définition extension image */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/* creation imageUrl */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, Date.now() + '_' + name);
    }
});

/* exportation imageUrl */
module.exports = multer({storage}).single('image');