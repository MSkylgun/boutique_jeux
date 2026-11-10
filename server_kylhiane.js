
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'echecs'
});

db.connect((err) => {
    if (err) {
        console.log("Erreur de connexion !");
    } else {
        console.log("Connexion réussie !");
    }
});

// Page d'accueil
app.get('/', (req, res) => {
    res.send("Bienvenue dans la boutique d'échecs !");
});

// Acheter un objet
app.post('/acheter', (req, res) => {

    const id_joueur = req.body.id_joueur;
    const id_objet = req.body.id_objet;
    const prix = req.body.prix;

    // Vérifier les points du joueur
    const sql = "SELECT points FROM joueur WHERE id_joueur = ?";

    db.query(sql, [id_joueur], (err, resultat) => {

        if (err || resultat.length === 0) {
            return res.send("Joueur introuvable !");
        }

        const points = resultat[0].points;

        if (points >= prix) {

            // Retirer les points
            const nouveauSolde = points - prix;

            db.query(
                "UPDATE joueur SET points = ? WHERE id_joueur = ?",
                [nouveauSolde, id_joueur]
            );

            // Ajouter l'objet à l'inventaire
            db.query(
                "INSERT INTO inventaire (id_joueur, id_objet) VALUES (?, ?)",
                [id_joueur, id_objet]
            );

            res.json({
                succes: true,
                message: "Achat réussi !",
                points_restants: nouveauSolde
            });

        } else {

            res.json({
                succes: false,
                message: "Pas assez de points !"
            });

        }
    });
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log("Serveur lancé sur le port 3000 !");
});
