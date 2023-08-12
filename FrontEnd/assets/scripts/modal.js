import {
  setDisplayStyle,
  createButtonElement,
  createIconElement,
  genererWorks,
} from "./index.js";
import { displayErrorMessage } from "./login.js";

// Appel de la fonction pour cacher la 2nd page de la modale
secondPageModalDisplay("none");

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

genererWorks("#modal-gallery");

// Boucle pour parcourir les différentes classes et en cliquant sur l'une d'elles, exécuter la fonction toggleModal
const modalTriggers = document.querySelectorAll(".modal-trigger");
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

// Ajout d'une icone de suppression (trash)
export function displayTrashBtn(figure, workId) {
  const trashBtn = createButtonElement(["modal-delete-button"]);
  trashBtn.style.cursor = "pointer";
  const trashIcon = createIconElement("fa-solid", "fa-trash-can");
  trashBtn.appendChild(trashIcon);
  figure.appendChild(trashBtn);
  // Ajout d'un évènement d'écoute sur le bouton trash
  trashBtn.addEventListener("click", () => {
    const confirmTrashBtn = createButtonElement(
      ["confirm-delete"],
      "Confirmer suppression"
    );
    confirmTrashBtn.addEventListener("click", function () {
      deleteWork(workId);
      figure.removeChild(confirmTrashBtn);
    });
    figure.appendChild(confirmTrashBtn);
  });

  return trashBtn;
}

// Fonction pour afficher le bouton de déplacement
function displayMoveBtn(figure) {
  const moveButton = createButtonElement(["modal-move-button"]);
  moveButton.style.cursor = "pointer";
  const moveIcon = createIconElement("fa-solid", "fa-up-down-left-right");
  moveButton.appendChild(moveIcon);
  figure.appendChild(moveButton);
  return moveButton;
}

// Fonction pour ajouter le bouton de déplacement apparaissant lors du survol d'un projet
export function displayMoveBtnHover(figure) {
  const moveButton = displayMoveBtn(figure);

  setDisplayStyle(moveButton, "none");

  figure.addEventListener("mouseenter", () => {
    setDisplayStyle(moveButton, "flex");
  });

  figure.addEventListener("mouseleave", () => {
    setDisplayStyle(moveButton, "none");
  });
}

// Ajout d'un évènement d'écoute sur le bouton "Ajouter une photo" pour afficher la 2nd page de la modale
const buttonAddPhoto = document.querySelector(".modal-btn");
buttonAddPhoto.addEventListener("click", modalePageSecond);

// Création de fonctions pour supprimer un ou des éléments de la galerie
// Fonction pour raffraîchir la galerie
function refreshGallery(selector) {
  const gallery = document.querySelector(selector);
  if (gallery) {
    gallery.innerHTML = "";
    genererWorks(selector);
  }
}

// Fonction pour supprimer un projet

function deleteWork(workId) {
  const token = window.localStorage.getItem("token");

  // Demande de suppression à l'API avec autorisation
  fetch(`http://localhost:5678/api/works/${workId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        // Raffraichissement des galeries après suppression d'éléments
        refreshGallery("#modal-gallery");
        refreshGallery(".gallery");
      } else if (response.status === 401) {
        // Gestion des erreurs de suppression
        displayErrorMessage(
          "Utilisateur non autorisé!!! Vous allez être redirigé vers la page connexion.",
          ".modal-title"
        );
        setTimeout(() => {
          window.location.href = "login.html";
        }, 4000);
      }
    })
    .catch((error) => {
      displayErrorMessage(
        "Une erreur s'est produite lors de la suppression de l'élément.",
        ".modal-title",
        error
      );
    });
}
