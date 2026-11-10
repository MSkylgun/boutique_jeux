
// SERVEUR DE LA BOUTIQUE D'ECHECS


// IMPORTATION
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');


// CREATION DU SERVEUR
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));


// CONNEXION A LA BASE DE DONNEES
const db = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_gaming'

});


// TEST CONNEXION
db.connect(function(err) {

    if (err) {

        console.log("Erreur de connexion à la base de données.");

    } else {

        console.log("Connexion à la base de données réussie.");

    }

});


// ROUTE : LISTE DES PIECES
app.get('/pieces', function(req, res) {

    // Récupération des pièces
    db.query('SELECT * FROM piece', function(err, resultats) {

        if (err) {

            return res.status(500).json({
                succes: false,
                message: "Erreur lors du chargement des pièces."
            });

        }

        // Envoi des résultats
        res.json(resultats);

    });

});


// ROUTE : POINTS DU JOUEUR
app.get('/mes-points/:id', function(req, res) {

    // Récupération de l'identifiant
    const id_joueur = req.params.id;

    // Recherche des points
    db.query(
        'SELECT points FROM joueur WHERE id_joueur = ?',
        [id_joueur],
        function(err, resultats) {

            if (err) {

                return res.status(500).json({
                    succes: false,
                    message: "Erreur de base de données."
                });

            }

            // Vérification du joueur
            if (resultats.length === 0) {

                return res.json({
                    succes: false,
                    message: "Joueur introuvable."
                });

            }

            // Envoi des points
            res.json({
                succes: true,
                points: resultats[0].points
            });

        }
    );

});


// ROUTE : INVENTAIRE DU JOUEUR
app.get('/inventaire/:id', function(req, res) {

    const id_joueur = req.params.id;

    // Recherche des pièces possédées
    db.query(
        'SELECT id_piece FROM inventaire WHERE id_joueur = ?',
        [id_joueur],
        function(err, resultats) {

            if (err) {

                return res.status(500).json({
                    succes: false,
                    message: "Erreur de base de données."
                });

            }

            // Liste des pièces
            res.json(resultats.map(function(ligne) {
                return ligne.id_piece;
            }));

        }
    );

});


// ROUTE : ACHAT D'UNE PIECE
app.post('/acheter-piece', function(req, res) {

    // Récupération des informations
    const id_joueur = req.body.id_joueur;
    const id_piece = req.body.id_piece;


    // Recherche du prix dans la base
    db.query(
        'SELECT prix FROM piece WHERE id_piece = ?',
        [id_piece],
        function(err, pieces) {

            if (err) {
                return res.status(500).json({
                    succes: false,
                    message: "Erreur de base de données."
                });
            }

            // Vérification pièce
            if (pieces.length === 0) {
                return res.json({
                    succes: false,
                    message: "Pièce introuvable."
                });
            }

            const prix = pieces[0].prix;


            // Recherche des points
            db.query(
                'SELECT points FROM joueur WHERE id_joueur = ?',
                [id_joueur],
                function(err, joueurs) {

                    if (err) {
                        return res.status(500).json({
                            succes: false,
                            message: "Erreur de base de données."
                        });
                    }

                    // Vérification joueur
                    if (joueurs.length === 0) {
                        return res.json({
                            succes: false,
                            message: "Joueur introuvable."
                        });
                    }

                    const points = joueurs[0].points;


                    // Vérification inventaire
                    db.query(
                        'SELECT * FROM inventaire WHERE id_joueur = ? AND id_piece = ?',
                        [id_joueur, id_piece],
                        function(err, deja) {

                            if (err) {
                                return res.status(500).json({
                                    succes: false,
                                    message: "Erreur de base de données."
                                });
                            }

                            // Pièce déjà achetée
                            if (deja.length > 0) {
                                return res.json({
                                    succes: false,
                                    message: "Pièce déjà possédée."
                                });
                            }


                            // Vérification des points
                            if (points < prix) {
                                return res.json({
                                    succes: false,
                                    message: "Pas assez de points."
                                });
                            }


                            // Calcul des nouveaux points
                            const nouveauxPoints = points - prix;


                            // Mise à jour des points
                            db.query(
                                'UPDATE joueur SET points = ? WHERE id_joueur = ?',
                                [nouveauxPoints, id_joueur],
                                function(err) {

                                    if (err) {
                                        return res.status(500).json({
                                            succes: false,
                                            message: "Erreur lors du paiement."
                                        });
                                    }


                                    // Ajout à l'inventaire
                                    db.query(
                                        'INSERT INTO inventaire (id_joueur, id_piece) VALUES (?, ?)',
                                        [id_joueur, id_piece],
                                        function(err) {

                                            if (err) {
                                                return res.status(500).json({
                                                    succes: false,
                                                    message: "Erreur lors de l'ajout."
                                                });
                                            }


                                            // Achat réussi
                                            res.json({

                                                succes: true,
                                                message: "Achat réussi !",
                                                points_restants: nouveauxPoints

                                            });

                                        }
                                    );

                                }
                            );

                        }
                    );

                }
            );

        }
    );

});


// LANCEMENT DU SERVEUR
app.listen(3000, function() {

    console.log("Serveur lancé sur http://localhost:3000");

});
