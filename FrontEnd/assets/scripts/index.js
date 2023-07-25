// Récupération des travaux sur API
let works;
let worksReal;
let idSet = 0;
let categoriesInMemory;

async function fetchCategories() {
  await fetch("http://localhost:5678/api/categories")
    .then(async (resp) => {
      if (resp.status == 200) {
        genererCategories(await resp.json());
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

async function fetchWorks() {
  await fetch("http://localhost:5678/api/works")
    .then(async (resp) => {
      if (resp.status == 200) {
        worksReal = genererWorks(await resp.json());
        works = worksReal;
        fetchCategories();
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
  return works;
}

function cleanFigure() {
  let figure = document.querySelectorAll("figure");
  for (let i = 1; i < figure.length; i++) {
    figure[i].remove();
  }
}

fetchWorks();

// Ajout des catégories avec les boutons filtres

const filterBar = document.querySelector(".filterBar");

function genererCategories(category) {
  const objectTous = { id: 0, name: "Tous" };
  const categories = [objectTous];
  categories.push(...category);
  categoriesInMemory = categories;
  for (let i = 0; i < categories.length; i++) {
    const filterButton = document.createElement("button");
    filterButton.innerText = categories[i].name;
    filterButton.classList.add("filterButton");
    filterBar.appendChild(filterButton);
    filterButton.addEventListener("click", () => {
      let cat = categoriesInMemory.find(
        (element) => element.name === filterButton.innerText
      );
      idSet = cat.id;
      if (idSet != 0) {
        works = worksReal.filter((work) => work.categoryId === idSet);
      } else {
        works = worksReal;
      }
      cleanFigure();
      genererWorks(works);
    });
  }
}
