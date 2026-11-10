
let points = 500;

let inventaire = [];

function acheter(prix, nom) {

    if (points >= prix) {

        points = points - prix;

        inventaire.push(nom);

        document.getElementById("points").textContent = points;

        alert("Achat réussi : " + nom);

    } else {

        alert("Tu n'as pas assez de points !");
    }
}

function afficherInventaire() {

    console.log(inventaire);

}
