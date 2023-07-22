// Récupération des travaux sur API

async function fetchWorks() {
  await fetch("http://localhost:5678/api/works")
    .then(async (resp) => {
      if (resp.status == 200) {
        genererWorks(await resp.json());
      } else {
        console.log("Pas authorisé");
      }
    })
    .catch((err) => {
      if (!err.data?.message) {
        console.log("Le site n'arrive pas à communiquer avec le serveur");
      }
    });
}
// Fonction pour la déserialisation de la réponse reçue

function genererWorks(works) {
  for (let i = 0; i < works.length; i++) {
    // Récupération de l'élément du DOM qui accueillera les cartes
    const divGallery = document.querySelector(".gallery");

    // Création d’une balise dédiée aux travaux (works)
    const figure = document.createElement("figure");
    figure.id = "figure" + works[i].id;
    figure.classList.add("figure");
    divGallery.appendChild(figure);

    // Création des balises
    const image = document.createElement("img");
    image.src = works[i].imageUrl;
    figure.appendChild(image);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = works[i].title;

    figure.appendChild(figcaption);
  }
}

fetchWorks();

// function init() {
//   genererWorks(works);
// }
// premier affichage de la page
