// PARAMÈTRES

const POINTS_DE_DEPART = 150;

const CLE_UTILISATEURS = "echecs_utilisateurs";
const CLE_SESSION = "echecs_connecte";


// COMPTES

function lireUtilisateurs() {
    const texte = localStorage.getItem(CLE_UTILISATEURS);

    if (texte === null) {
        return {};
    }

    return JSON.parse(texte);
}


// SAUVEGARDE

function sauvegarderUtilisateurs(utilisateurs) {
    localStorage.setItem(CLE_UTILISATEURS, JSON.stringify(utilisateurs));
}


// CONNEXION

function pseudoConnecte() {
    return sessionStorage.getItem(CLE_SESSION);
}

function connecter(pseudo) {
    sessionStorage.setItem(CLE_SESSION, pseudo);
}


// DÉCONNEXION

function deconnecter() {
    sessionStorage.removeItem(CLE_SESSION);
    window.location.href = "login.html";
}