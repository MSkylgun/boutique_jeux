
// BOUTIQUE D'ECHECS


// LISTE DES PIECES
const pieces = [

    { id: 1, nom: "Pion classique", symbole: "♟\uFE0E", description: "Avance d'une case, capture en diagonale.", prix: 5, or: false },

    { id: 2, nom: "Pion en bois", symbole: "♙\uFE0E", description: "Un pion au style rustique, taillé à la main.", prix: 10, or: false },

    { id: 3, nom: "Cavalier", symbole: "♞\uFE0E", description: "Se déplace en L et saute par-dessus les pièces.", prix: 30, or: false },

    { id: 4, nom: "Fou", symbole: "♝\uFE0E", description: "Se déplace en diagonale, aussi loin qu'il veut.", prix: 30, or: false },

    { id: 5, nom: "Tour", symbole: "♜\uFE0E", description: "Se déplace en ligne droite, horizontalement ou verticalement.", prix: 50, or: false },

    { id: 6, nom: "Dame", symbole: "♛\uFE0E", description: "La pièce la plus puissante du jeu.", prix: 90, or: false },

    { id: 7, nom: "Roi", symbole: "♚\uFE0E", description: "La pièce à protéger à tout prix.", prix: 100, or: false },

    { id: 8, nom: "Pion en or", symbole: "♟\uFE0E", description: "Pion légendaire, très rare.", prix: 120, or: true }

];


// POINTS DE DEPART
const POINTS_DE_DEPART = 150;


// DONNEES DU JOUEUR
let points = POINTS_DE_DEPART;
let inventaire = [];


// CHARGEMENT DES DONNEES
function charger() {

    const pointsSauves = localStorage.getItem("echecs_points");
    const inventaireSauve = localStorage.getItem("echecs_inventaire");

    // Chargement des points
    if (pointsSauves !== null) {
        points = parseInt(pointsSauves);
    }

    // Chargement de l'inventaire
    if (inventaireSauve !== null) {
        inventaire = JSON.parse(inventaireSauve);
    }

}


// SAUVEGARDE
function sauvegarder() {

    localStorage.setItem("echecs_points", points);
    localStorage.setItem("echecs_inventaire", JSON.stringify(inventaire));

}


// AFFICHAGE DES MESSAGES
function afficherMessage(texte, type) {

    const zone = document.getElementById("message");

    zone.innerText = texte;
    zone.className = "message " + type;

}


// AFFICHAGE DE LA BOUTIQUE
function afficherBoutique() {

    const boutique = document.getElementById("boutique");

    boutique.innerHTML = "";

    // Affichage des pièces
    pieces.forEach(function(piece) {

        // Vérification achat
        const dejaPossedee = inventaire.includes(piece.id);

        // Création de la carte
        const carte = document.createElement("div");

        carte.className = dejaPossedee ? "carte possedee" : "carte";

        // Contenu de la carte
        carte.innerHTML =

            '<div class="symbole' + (piece.or ? ' or' : '') + '">' + piece.symbole + '</div>' +

            '<h2>' + piece.nom + '</h2>' +

            '<p class="description">' + piece.description + '</p>' +

            '<p class="prix">' + piece.prix + ' points</p>' +

            '<button onclick="acheterPiece(' + piece.id + ')"' +
            (dejaPossedee ? ' disabled' : '') + '>' +

            (dejaPossedee ? 'Déjà possédée' : 'Acheter') +

            '</button>';

        boutique.appendChild(carte);

    });


    // Mise à jour des informations
    document.getElementById("points-display").innerText = points;

    document.getElementById("nb-pieces").innerText = inventaire.length;

}


// ACHAT D'UNE PIECE
function acheterPiece(idPiece) {

    // Recherche de la pièce
    const piece = pieces.find(function(p) {
        return p.id === idPiece;
    });

    // Vérification de la pièce
    if (!piece) {
        return;
    }

    // Déjà achetée
    if (inventaire.includes(idPiece)) {

        afficherMessage("Pièce déjà possédée.", "erreur");
        return;

    }

    // Vérification des points
    if (points < piece.prix) {

        afficherMessage("Pas assez de points.", "erreur");
        return;

    }

    // Paiement
    points = points - piece.prix;

    // Ajout inventaire
    inventaire.push(idPiece);

    // Sauvegarde
    sauvegarder();

    // Actualisation
    afficherBoutique();

    afficherMessage(piece.nom + " ajouté à votre inventaire !", "ok");

}


// BOUTON RECOMMENCER
document.getElementById("btn-reset").addEventListener("click", function() {

    // Remise à zéro
    points = POINTS_DE_DEPART;
    inventaire = [];

    // Sauvegarde
    sauvegarder();

    // Actualisation
    afficherBoutique();

    afficherMessage("Boutique réinitialisée.", "ok");

});


// LANCEMENT
charger();
afficherBoutique();

// OUVRIR ET FERMER LE PROFIL

const profilBouton = document.getElementById("profil-bouton");
const profilMenu = document.getElementById("profil-menu");

profilBouton.addEventListener("click", function() {
    profilMenu.classList.toggle("actif");
});