import {
  setDisplayStyle,
  createButtonElement,
  createIconElement,
} from "./index.js";

// Fonction pour afficher ou non la première page de la modale
function firstPageModalDisplay(displayValue) {
  const modalPageOne = document.getElementById("modal-page-one");
  setDisplayStyle(modalPageOne, displayValue);
}

// Fonction pour afficher ou non la seconde page de la modale
function secondPageModalDisplay(displayValue) {
  const modalPageTwo = document.getElementById("modal-page-two");
  setDisplayStyle(modalPageTwo, displayValue);
  if (displayValue !== "none") {
    createPrevArrow();
  }
}

// Fonction pour afficher la 1ère page
function modalePagefirst() {
  firstPageModalDisplay("flex");
  secondPageModalDisplay("none");
}

// Fonction pour afficher la 2nd page
function modalePageSecond() {
  firstPageModalDisplay("none");
  secondPageModalDisplay("flex");
}

// Appel de la Fonction pour afficher la 1ère page de la modale et cacher la seconde page de la modale
firstPageModalDisplay("flex");
secondPageModalDisplay("none");

// Fonction pour créer la flèche "retour" de la modale
function createPrevArrow() {
  const btnPrev = createButtonElement(["modal-prev"]);

  const iconPrev = createIconElement("fa-solid", "fa-arrow-left-long");
  btnPrev.appendChild(iconPrev);

  document.getElementById("modal-page-two").appendChild(btnPrev);

  btnPrev.addEventListener("click", modalePagefirst);
  return btnPrev;
}

// Fonction pour créer le bouton "fermer (X)" de la modale
function createCloseButton() {
  const buttonClose = createButtonElement(["modal-close", "modal-trigger"]);

  const iconClose = createIconElement("fa-solid", "fa-xmark");

  document.querySelector(".modal-wrapper").appendChild(buttonClose);
  buttonClose.appendChild(iconClose);
  return buttonClose;
}

// Appel de la fonction createCloseButton et ajout de la classe "modal-trigger" au bouton "X" et aux id et classes des boutons edit

createCloseButton();
const elements = document.querySelectorAll(
  "#editMod .positionEdit, .modal-overlay"
);
elements.forEach((element) => {
  element.classList.add("modal-trigger");
});

// Fonction pour déplacer la classe active vers la modale
function toggleModal() {
  const modal = document.getElementById("modal");
  modal.classList.toggle("active");
  const modalElement = document.querySelector(".modal-wrapper");
  // Fonction permettant de défiler automatiquement au début de la modale
  modalElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Boucle pour parcourir les différentes classes et en cliquant sur l'une d'elles, exécuter la fonction toggleModal
const modalTriggers = document.querySelectorAll(".modal-trigger");
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

let worksModal;
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

async function fetchWorksModal() {
  await fetch("http://localhost:5678/api/works")
    .then(async (resp) => {
      if (resp.status == 200) {
        worksReal = genererWorksModal(await resp.json());
        worksModal = worksReal;
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

function genererWorksModal(worksModal) {
  for (let i = 0; i < worksModal.length; i++) {
    // Récupération de l'élément du DOM qui accueillera les cartes
    const divGallery = document.querySelector("#modal-gallery");

    // Création d’une balise dédiée aux travaux (works)
    const figure = document.createElement("figure");
    figure.id = "figure" + worksModal[i].id;
    figure.classList.add("figure");
    divGallery.appendChild(figure);

    // Création des balises
    const image = document.createElement("img");
    image.src = worksModal[i].imageUrl;
    figure.appendChild(image);

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = "éditer";
    figure.appendChild(figcaption);
  }
  return worksModal;
}

fetchWorksModal();
