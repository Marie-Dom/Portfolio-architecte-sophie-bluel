import {
  fetchWorks,
  displayFilters,
  filterWorks,
  setDisplayStyle,
  showAllWorks,
  createButtonElement,
  createIconElement,
  createEditButton,
  displayTrashButton,
  displayMoveButtonHover,
} from "./functions.js";

// Récupération des travaux sur API

fetchWorks().then((dataWork) => {
  genererWorks(".gallery");
  displayFilters(dataWork);

  // Récupération de tous les filtres
  const buttonFilters = document.querySelectorAll(".filterButton");
  const filterAll = buttonFilters[0];

  // Ecoute sur le bouton "filterAll" pour afficher tous les projets
  filterAll.addEventListener("click", showAllWorks);

  // Parcourir tous les filtres, à l'exception du filtre "Tous",
  //  et pour chaque filtre, ajoutez un événement
  buttonFilters.forEach((buttonFilter) => {
    if (buttonFilter !== filterAll) {
      buttonFilter.addEventListener("click", (event) => {
        filterWorks(event);
      });
    }
  });
});

// Fonction pour générer les projets
export async function genererWorks(targetElement) {
  return fetchWorks().then((dataWork) => {
    // Sélectionne l'élément cible de la galerie dans le sélecteur spécifié
    const galleryElement = document.querySelector(targetElement);
    dataWork.forEach((jsonWork) => {
      // Crée l'élément figure pour représenter le projet
      const figure = document.createElement("figure");
      figure.classList.add("work");
      figure.dataset.category = jsonWork.categoryId;

      // Crée l'élément img pour afficher l'image du projet
      const img = document.createElement("img");
      img.src = jsonWork.imageUrl;
      img.alt = "image du projet";

      figure.appendChild(img);
      // Si l'élément ciblé est la galerie, créer l'élément figcaption avec son titre associé
      if (targetElement === ".gallery") {
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = jsonWork.title;
        figure.appendChild(figcaption);
      }
      // Pour la galerie du modal même chose mais remplace le titre par le mot 'éditer'
      if (targetElement === "#modal-gallery") {
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = "éditer";
        figure.appendChild(figcaption);

        // Sauvegarde de l'identifiant d'un projet
        const workId = jsonWork.id;
        // Fonctions d'appel pour afficher le bouton de suppression et gérer le survol de la souris
        displayTrashButton(figure, workId);
        displayMoveButtonHover(figure);
      }

      galleryElement.appendChild(figure);
    });
  });
}

// Remplacement du lien "login" par "logout"
const logout = document.getElementById("logout");
console.log(logout);
const token = window.localStorage.getItem("token");
if (token != null && token != "") {
  logout.textContent = "logout";
  const filters = document.querySelector(".filterBar");
  setDisplayStyle(filters, "none");

  const editMod = document.getElementById("editMod");
  editMod.appendChild(createEditElement());

  displayHeadbandEditMod();

  createEditButton();
}

// Fonction pour créer le bouton "modifier" et l'icone

function createEditElement() {
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

const displayLogout = document.getElementById("logout");

// Quand l'utilisateur clique sur le bouton "logout", il se déconnecte
displayLogout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.href = "./index.html";
});
