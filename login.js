// PAGE CONNEXION / INSCRIPTION


// Vérification connexion
if (pseudoConnecte() !== null && lireUtilisateurs()[pseudoConnecte()]) {
    window.location.href = "index.html";
}


// Récupération des formulaires
const formConnexion = document.getElementById("form-connexion");
const formInscription = document.getElementById("form-inscription");


// Affichage message
function afficherMessage(texte, type) {
    const zone = document.getElementById("message");

    zone.innerText = texte;
    zone.className = "message " + type;
}


// Passage inscription
document.getElementById("lien-inscription").addEventListener("click", function(e) {
    e.preventDefault();

    formConnexion.classList.add("cache");
    formInscription.classList.remove("cache");

    afficherMessage("", "");
});


// Passage connexion
document.getElementById("lien-connexion").addEventListener("click", function(e) {
    e.preventDefault();

    formInscription.classList.add("cache");
    formConnexion.classList.remove("cache");

    afficherMessage("", "");
});


// CONNEXION
formConnexion.addEventListener("submit", function(e) {
    e.preventDefault();

    // Récupération des données
    const pseudo = document.getElementById("login-pseudo").value.trim();
    const mdp = document.getElementById("login-mdp").value;

    const utilisateurs = lireUtilisateurs();


    // Vérification pseudo
    if (!utilisateurs[pseudo]) {
        afficherMessage("Pseudo incorrect.", "erreur");
        return;
    }

    // Vérification mot de passe
    if (utilisateurs[pseudo].mdp !== mdp) {
        afficherMessage("Mot de passe incorrect.", "erreur");
        return;
    }

    // Connexion réussie
    connecter(pseudo);

    window.location.href = "index.html";
});


// INSCRIPTION
formInscription.addEventListener("submit", function(e) {
    e.preventDefault();

    // Récupération des données
    const pseudo = document.getElementById("ins-pseudo").value.trim();
    const mdp = document.getElementById("ins-mdp").value;
    const mdp2 = document.getElementById("ins-mdp2").value;

    const utilisateurs = lireUtilisateurs();


    // Vérification pseudo
    if (pseudo.length < 3) {
        afficherMessage("Pseudo trop court.", "erreur");
        return;
    }

    if (utilisateurs[pseudo]) {
        afficherMessage("Pseudo déjà utilisé.", "erreur");
        return;
    }

    // Vérification mot de passe
    if (mdp.length < 4) {
        afficherMessage("Mot de passe trop court.", "erreur");
        return;
    }

    if (mdp !== mdp2) {
        afficherMessage("Mots de passe différents.", "erreur");
        return;
    }


    // Création compte
    utilisateurs[pseudo] = {
        mdp: mdp,
        points: POINTS_DE_DEPART,
        inventaire: [],
        avatar: "♟️"
    };


    // Sauvegarde
    sauvegarderUtilisateurs(utilisateurs);


    // Retour connexion
    formInscription.classList.add("cache");
    formConnexion.classList.remove("cache");

    document.getElementById("login-pseudo").value = pseudo;
    document.getElementById("login-mdp").value = "";

    afficherMessage("Compte créé !", "ok");
});