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

// Fonction pour créer un element avec attributs et une classe css
function createAndAppendElement(tagName, parent, className, attributes = {}) {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  for (const attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  parent.appendChild(element);
  return element;
}

// fonction pour modifier la valeur existante
function setDisplayStyle(element, displayValue) {
  element.style.display = displayValue;
}
// Remplacement du lien "login" par "logout"
const logout = document.getElementById("logout");
console.log(logout);
const token = window.localStorage.getItem("token");
if (token) {
  logout.textContent = "logout";
  setDisplayStyle(filterBar, "none");

  const editMod = document.getElementById("editMod");
  editMod.appendChild(createEditElement());

  displayHeadbandEditMod();
}

const displayLogout = document.getElementById("logout");

// Quand l'utilisateur clique sur le bouton "logout", il se déconnecte
displayLogout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.href = "./index.html";
});

// Si l'utilisateur ferme le navigateur ou la page, il se déconnecte
window.addEventListener("unload", () => {
  // window.localStorage.removeItem("token");
});

// Fonction pour créer un bouton, en lui appliquant une ou plusieurs classes, et en insérant un texte
function createButtonElement(classNames = [], textContent = "") {
  const button = document.createElement("div");
  button.setAttribute("role", "button");

  if (Array.isArray(classNames)) {
    classNames.forEach((className) => {
      button.classList.add(className);
    });
  } else {
    button.classList.add(classNames);
  }

  if (textContent) {
    button.textContent = textContent;
  }

  return button;
}

// Fonction pour créer une icone awesome
function createIconElement(...classNames) {
  const icon = document.createElement("i");
  classNames.forEach((className) => {
    icon.classList.add(className);
  });
  return icon;
}

// Fonction pour créer le bouton "modifier" et l'icone

function createEditElement() {
  const editMod = document.getElementById("editMod");
  const iconEdit = createIconElement("fa-regular", "fa-pen-to-square");
  const displayEdit = createButtonElement(["positionEdit"], "modifier");

  displayEdit.insertBefore(iconEdit, displayEdit.firstChild);
  return displayEdit;
}

// Fonction pour la mise en place du bandeau noir en mode édition
function displayHeadbandEditMod() {
  const header = document.querySelector("header");
  header.style.marginTop = "100px";

  const headerH1 = document.querySelector("header h1");
  const divBlackHeadband = document.createElement("div");
  divBlackHeadband.id = "blackHeadband";
  header.insertBefore(divBlackHeadband, headerH1);

  const divEditMod = createButtonElement(["positionEdit"], "Mode édition");
  divEditMod.style.paddingTop = "0";
  divEditMod.insertBefore(
    createEditElement().firstChild,
    divEditMod.firstChild
  );

  const publishChangesButton = createButtonElement(
    ["publish-changes-button"],
    "publier les changements"
  );

  divBlackHeadband.appendChild(divEditMod);
  divBlackHeadband.appendChild(publishChangesButton);
}
