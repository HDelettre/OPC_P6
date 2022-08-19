/* appel du model sauce */
const Sauce = require('../models/sauces');

/* Chargement package fs */
const fs = require('fs');

// Appel des fonctions
/* Créer une sauce */
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce); /* fonction parse sur l'objet de la requête pour séparer les champs */
    delete sauceObject._id;                         /* suppression de l'id, qui sera généré par la bdd */
    delete sauceObject._userid;                     /* suppression de l'id pour utilisation du token */
    const sauce = new Sauce({                       /* creation nouvel objet */
        ...sauceObject,                             /* recuperation objet */
        userid: req.auth.userId,                   /* changement id par le token */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` /* changement nom du fichier image */
  });
  sauce.save()                                      /* je sauvegarde la nouvelle sauce */
    .then(() => {                                   /* succès */
        res.status(201).json({message: 'la sauce a été créée avec succès !'});
    }
  ).catch((error) => {                               /* erreur */
      res.status(400).json({error: error});
    }
  );
};

/* Modifier une sauce */
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {                /* je vérifie si une image est dans la requête */
        ...JSON.parse(req.body.sauce),              /* si oui je défini le nom du fichier */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };                            /* sinon je récupère les datas de la requête */
    delete sauceObject._userId;                     /* suppression de l'id pour que objet ne soit pas pris par qqun */
    Sauce.findOne({_id: req.params.id})             /* recherche objet dans bdd */
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {      /* je vérifie s'il appartient au user */
            res.status(403).json({                  /* si ce n'est pas le cas */
                message : 'Vous n\'êtes pas autorisé à modifier cette sauce !'
            });    
        } else {
            const oldImageUrl = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${oldImageUrl}`, () => {} );                 /* je supprime ancienne image */
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) /* sinon je l'inclus dans la bdd */
            .then(() => res.status(200).json({
                message : 'La sauce a été modifiée !'
            }))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

/* Supprimer une sauce */
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id})                        /* je recherche la sauce ds la bdd */
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {               /* je vérifie le propriétaire */
               res.status(401).json({                           /* si ce n'est pas le bon erreur */
                message: 'Vous n\'êtes pas autorisé à supprimer cette sauce !'
            });                           
           } else {                                             /* si le propriétaire est bon */
               const filename = sauce.imageUrl.split('/images/')[1]; /* jerécupére le nom du fichier image */
               fs.unlink(`images/${filename}`, () => {          /* je le supprime du dossier image */
                   Sauce.deleteOne({_id: req.params.id})        /* je supprime l'objet de la bdd */
                       .then(() => { res.status(200).json({
                        message: 'La sauce a été supprimée !'
                    })})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};

/* Afficher toutes les sauces */
exports.getAllSauces = (req, res) => {
    Sauce.find()                                    /* je cherche toutes les sauces */
        .then((sauces) => {                             
            res.status(200).json(sauces);           /* je renvoie les données des sauces */
        })
    .catch((error) => {                              /* affichage message d'erreur */
        res.status(400).json({error: error});
        });
};

/* Afficher une sauce */
exports.getOneSauce = (req, res) => {
    Sauce.findOne({                                 /* je cherche la sauce demandée */
        _id: req.params.id                          /* suivant l'id de la requête */
    })
    .then((singleSauce) => {                        /* j'ai trouvé la sauce */
        res.status(200).json(singleSauce);          /* je renvoie ses données */
    }
  ).catch((error) => {                              /* erreur */
      res.status(404).json({error: error});
    }
  );
};

/* Likes / Dislikes */
exports.likeSauce = (req, res) => {
    const like = req.body.like;             // je récupére la valeur de like depuis la requête
    let likeValue = 1;
    let userString = {};

    Sauce.findOne({ _id: req.params.id })   // je recherche la sauce
        .then(sauce => {

            let nblike = sauce.usersLiked.length - 1;
            let nbdislike = sauce.usersDisliked.length - 1;

            if (like === 0 && sauce.usersLiked.includes(req.body.userId)) {
                likeValue = -1;
                userString = 'usersLiked'
                nblike --;
            } else if ( like === 0 && sauce.usersDisliked.includes(req.body.userId)) {
                likeValue = -1;
                userString = 'usersDisliked';
                nbdislike --;
            } else if (  like === 1 && sauce.usersLiked.includes(req.body.userId) == false) {
                userString = 'usersLiked'
                nblike ++;
            } else if ( like === -1  && sauce.usersDisliked.includes(req.body.userId) == false) {
                likeValue = 1;
                userString = 'usersDisliked';
                nbdislike ++;
            } else {
                likeValue = 0;
                userString ='';
            }

            if (likeValue === -1) {
                sauce.updateOne({
                    $pull: {[userString]: req.body.userId},
                    $set: {likes: nblike, dislikes: nbdislike}
                })
                . then(() => { res.status(200).json({
                    message: 'Like/Dislike user supprimé !'
                })})
                .catch(error => res.status(401).json({ error }));
            } else if (likeValue === 1) {
                sauce.updateOne({
                    $push: { [userString]: req.body.userId},
                    $set: {likes: nblike, dislikes: nbdislike}
                })
                . then(() => { res.status(200).json({
                    message: 'Like/Dislike user ajouté !'
                })})
                .catch(error => res.status(401).json({ error }));
            }
            })
            .catch(error => res.status(401).json({ error }));

            
        }