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
        res.status(201).json({message: 'Sauce créée avec succès !'});
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

    delete sauceObject._userId;                     /* suppression de l'id pour que objet non pris par qqun */

    Sauce.findOne({_id: req.params.id})             /* recherche objet dans bdd */
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {      /* je vérifie s'il appartient au user */
            res.status(403).json({                  /* si ce n'est pas le cas */
                message : 'Vous n\'êtes pas autorisé à modifier l\'objet !'
            });    
        } else {
            const oldImageUrl = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${oldImageUrl}`, () => {} );                 /* je supprime ancienne image */
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id}) /* sinon je l'inclus dans la bdd */
            .then(() => res.status(200).json({
                message : 'Objet modifié!'
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
                message: 'Vous n\'êtes pas autorisé à modifier l\'objet !'
            });                           
           } else {                                             /* si le propriétaire est bon */
               const filename = sauce.imageUrl.split('/images/')[1]; /* jerécupére le nom du fichier image */
               fs.unlink(`images/${filename}`, () => {          /* je le supprime du dossier image */
                   Sauce.deleteOne({_id: req.params.id})        /* je supprime l'objet de la bdd */
                       .then(() => { res.status(200).json({
                        message: 'Objet supprimé !'
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
    const like = req.body.like;
    /* Si c'est un like */
    switch(like) {
        case 1:                                             /* si c'est un like */
        Sauce.updateOne({ _id: req.params.id}, {            /* je mets à jour la bdd */
                $inc: {likes: 1},                           /* incrémentation like */
                $push: {usersLiked: req.body.userId}        /* ajout userid userlike */
                })
            .then(() => { res.status(200).json({
                message: 'Like Ajouté !'
                })
            })
            .catch(error => res.status(401).json({ error }));
        break;               
        case -1:                                                /* si c'est un dislike */
            Sauce.updateOne({ _id: req.params.id},{             /* je mets à jour la bdd */
                $inc: {dislikes: 1},                            /* incrémentation dislike */
                $push: {usersDisliked: req.body.userId}})       /* ajout userid userdislike*/
            .then(() => { res.status(200).json({
                message: 'DisLike Ajouté !'
            })})
            .catch(error => res.status(401).json({ error }));
        break;
        default:                             /* si like = 0 */
            Sauce.findOne({ _id: req.params.id })               /* je recherche la sauce dans bdd */
            .then(sauce => {
                if (sauce.usersLiked.includes(req.body.userId)) {   /* si le userid est dans userlike */
                    Sauce.updateOne({ _id: req.params.id }, {       /* je mets à jour la bdd */
                        $inc: { likes: -1 },                        /* je retire 1 au like */
                        $pull: { usersLiked: req.body.userId } })   /* je retire userid des likes */
                    .then(() => { res.status(200).json({ message:
                        'Like supprimé !' 
                        }) 
                    })
                    .catch(error => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.body.userId)) {  /* Sinon */
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },                     /* je retire 1 au dislike */
                        $pull: { usersDisliked: req.body.userId } }) /* je retire userid des dislikes */
                    .then(() => { res.status(200).json({ message:
                        'Dislike supprimé !' 
                    }) 
                })
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }))
        
    }

}