import { displayTrashBtn, displayMoveBtnHover } from "./modal.js";

// // Récupération des travaux sur API
async function fetchWorks() {
  const data = await fetch("http://localhost:5678/api/works");
  return await data.json();
}

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

// Fonction pour afficher les filtres
function displayFilters(dataWork) {
  const filters = document.querySelector(".filterBar");

  // Ajout du filtre "tous" comme 1er bouton filtre
  filters.innerHTML += `<li class="filterButton" id="0">Tous</li>`;

  // Création d'une liste de catégories en triant les catégories des différents projets récupérés
  const categoryList = Array.from(
    new Set(dataWork.map((jsonWork) => jsonWork.categoryId))
  );

  //  find() trouve le premier élément du tableau dataWork
  //   qui a le même categoryId que le categoryId actuel.
  categoryList.forEach((categoryId) => {
    const categoryName = dataWork.find((work) => work.categoryId === categoryId)
      .category.name;
    filters.innerHTML += `<li class="filterButton" id="${categoryId}">${categoryName}</li>`;
  });
}

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
        displayTrashBtn(figure, workId);
        displayMoveBtnHover(figure);
      }

      galleryElement.appendChild(figure);
    });
  });
}

// Fonction pour supprimer la classe "filter_active" de tous les filtres
function deleteActiveClass() {
  const buttonFilters = document.querySelectorAll(".filterButton");
  buttonFilters.forEach((buttonFilter) =>
    buttonFilter.classList.remove("filterButton_active")
  );
}

// Fonction pour afficher tous les projets au clic sur le boutons "Tous"
function showAllWorks() {
  //Récupération de tous les filtres et projets
  const buttonFilters = document.querySelectorAll(".filterButton");
  const filterAll = buttonFilters[0];
  const works = document.querySelectorAll(".work");
  // Afficher tous les projets
  works.forEach((work) => (work.style.display = "block"));
  deleteActiveClass();
  // Ajoute la classe "filterButton_active" au filtre "Tous"
  filterAll.classList.add("filterButton_active");
}

// Fonction pour filtrer par catégorie et afficher les projets
function filterWorks(event) {
  const buttonFilterIdValue = event.target.getAttribute("id");
  deleteActiveClass();
  // Ajout de la classe "filter_active" au filtre actif
  event.target.classList.add("filterButton_active");
  // Récupération de tous les projets
  const works = document.querySelectorAll(".work");
  works.forEach((work) => {
    // Si le projet correspond à la catégorie sélectionnée affichage de celle-ci
    work.style.display =
      work.dataset.category === buttonFilterIdValue ? "block" : "none";
  });
}

// fonction pour modifier la valeur existante
export function setDisplayStyle(element, displayValue) {
  var elem = document.getElementsByClassName(element);
  for (var i = 0; i < elem.length; i++) {
    elem[i].style.display = displayValue;
  }
}
// Fonction pour créer un bouton, en lui appliquant une ou plusieurs classes, et en insérant un texte
export function createButtonElement(classNames = [], textContent = "") {
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
export function createIconElement(...classNames) {
  const icon = document.createElement("i");
  classNames.forEach((className) => {
    icon.classList.add(className);
  });
  return icon;
}

// Fonction pour créer le bouton "modifier" et l'icone

export function createEditElement() {
  const iconEdit = createIconElement("fa-regular", "fa-pen-to-square");
  const displayEdit = createButtonElement(["positionEdit"], "modifier");

  displayEdit.insertBefore(iconEdit, displayEdit.firstChild);
  return displayEdit;
}

// Fonction pour la mise en place du bandeau noir en mode édition
export function displayHeadbandEditMod() {
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

// Fonction pour créer le bouton en mode edit sous l'image

export function createEditButton() {
  const editModal = document.querySelector(".editModal");
  const btnEdit = createButtonElement(["positionEdit"], "Modifier");
  editModal.appendChild(btnEdit);
  const btnIconEdit = createIconElement("fa-regular", "fa-pen-to-square");
  editModal.appendChild(btnIconEdit);
  btnEdit.insertBefore(btnIconEdit, btnEdit.firstChild);
  return btnEdit;
}

// Remplacement du lien "login" par "logout"
const logout = document.getElementById("logout");
console.log(logout);
const token = window.localStorage.getItem("token");
if (token != null && token != "") {
  logout.textContent = "logout";
  setDisplayStyle("filterBar", "none");

  const editMod = document.getElementById("editMod");
  editMod.appendChild(createEditElement());

  displayHeadbandEditMod();

  const editModal = document.querySelector(".editModal");
  createEditButton();
}

const displayLogout = document.getElementById("logout");

// Quand l'utilisateur clique sur le bouton "logout", il se déconnecte
displayLogout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.href = "./index.html";
});
