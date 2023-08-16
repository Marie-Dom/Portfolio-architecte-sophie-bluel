// Fonction pour récupérer les projets sur l'API
export async function fetchWorks() {
  const data = await fetch("http://localhost:5678/api/works");
  return await data.json();
}

// Fonction pour afficher les filtres
export function displayFilters(dataWork) {
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
        displayTrashButton(figure, workId);
        displayMoveButtonHover(figure);
      }

      galleryElement.appendChild(figure);
    });
  });
}

// Fonction pour supprimer la classe "filter_active" de tous les filtres
export function deleteActiveClass() {
  const buttonFilters = document.querySelectorAll(".filterButton");
  buttonFilters.forEach((buttonFilter) =>
    buttonFilter.classList.remove("filterButton_active")
  );
}

// Fonction pour afficher tous les projets au clic sur le boutons "Tous"
export function showAllWorks() {
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
export function filterWorks(event) {
  const buttonFilterIdValue = event.target.getAttribute("id");
  deleteActiveClass();
  // Ajout de la classe "filterButton_active" au filtre actif
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
  element.style.display = displayValue;
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
  const buttonEdit = createButtonElement(["positionEdit"], "Modifier");
  editModal.appendChild(buttonEdit);
  const buttonIconEdit = createIconElement("fa-regular", "fa-pen-to-square");
  editModal.appendChild(buttonIconEdit);
  buttonEdit.insertBefore(buttonIconEdit, buttonEdit.firstChild);
  return buttonEdit;
}

// Fonctions pour la modale

// Fonction pour créer le bouton "fermer (X)" de la modale
export function createCloseButton() {
  const buttonClose = createButtonElement(["modal-close", "modal-trigger"]);

  const iconClose = createIconElement("fa-solid", "fa-xmark");

  document.querySelector(".modal-wrapper").appendChild(buttonClose);
  buttonClose.appendChild(iconClose);
  return buttonClose;
}

// Fonction pour créer la flèche "retour" de la modale
export function createPrevArrow() {
  const buttonPrev = createButtonElement(["modal-prev"]);

  const iconPrev = createIconElement("fa-solid", "fa-arrow-left-long");
  buttonPrev.appendChild(iconPrev);

  document.getElementById("modal-page-two").appendChild(buttonPrev);

  buttonPrev.addEventListener("click", modalePagefirst);
  return buttonPrev;
}

// Fonction pour déplacer la classe active vers la modale
export function toggleModal() {
  const modal = document.querySelector(".modal");
  modal.classList.toggle("active");
  const modalElement = document.querySelector(".modal-wrapper");
  // Fonction permettant de défiler automatiquement au début de la modale
  modalElement.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Fonction pour afficher ou non la première page de la modale
export function firstPageModalDisplay(displayValue) {
  const modalPageOne = document.getElementById("modal-page-one");
  setDisplayStyle(modalPageOne, displayValue);
}

// Fonction pour afficher ou non la seconde page de la modale
export function secondPageModalDisplay(displayValue) {
  const modalPageTwo = document.getElementById("modal-page-two");
  setDisplayStyle(modalPageTwo, displayValue);
  if (displayValue != "none") {
    createPrevArrow();
  }
}

// Fonction pour afficher la 1ère page
export function modalePagefirst() {
  firstPageModalDisplay("flex");
  secondPageModalDisplay("none");
}

// Fonction pour afficher la 2nd page
export function modalePageSecond() {
  firstPageModalDisplay("none");
  secondPageModalDisplay("flex");
}

// Création de fonctions pour supprimer un ou des éléments de la galerie
// Fonction pour raffraîchir la galerie
export function refreshGallery(selector) {
  const gallery = document.querySelector(selector);
  if (gallery) {
    gallery.innerHTML = "";
    genererWorks(selector);
  }
}

// Ajout d'une icone de suppression (trash)
export function displayTrashButton(figure, workId) {
  const trashButton = createButtonElement(["modal-delete-button"]);
  trashButton.style.cursor = "pointer";
  const trashIcon = createIconElement("fa-solid", "fa-trash-can");
  trashButton.appendChild(trashIcon);
  figure.appendChild(trashButton);
  // Ajout d'un évènement d'écoute sur le bouton trash
  trashButton.addEventListener("click", () => {
    const confirmTrashButton = createButtonElement(
      ["confirm-delete"],
      "Confirmer suppression"
    );
    figure.appendChild(confirmTrashButton);
    confirmTrashButton.addEventListener("click", function () {
      deleteWork(workId);
      figure.removeChild(confirmTrashButton);
    });
  });

  return trashButton;
}

// Fonction pour afficher le bouton de déplacement
function displayMoveButton(figure) {
  const moveButton = createButtonElement(["modal-move-button"]);
  moveButton.style.cursor = "pointer";
  const moveIcon = createIconElement("fa-solid", "fa-up-down-left-right");
  moveButton.appendChild(moveIcon);
  figure.appendChild(moveButton);
  return moveButton;
}

// Fonction pour ajouter le bouton de déplacement apparaissant lors du survol d'un projet
export function displayMoveButtonHover(figure) {
  const moveButton = displayMoveButton(figure);

  setDisplayStyle(moveButton, "none");
  figure.addEventListener("mouseenter", () => {
    setDisplayStyle(moveButton, "flex");
  });

  figure.addEventListener("mouseleave", () => {
    setDisplayStyle(moveButton, "none");
  });
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
        console.log("suppression ok");
        // Raffraichissement des galeries après suppression d'éléments
        refreshGallery("#modal-gallery");
        refreshGallery(".gallery");
      } else if (response.status === 401) {
        // Gestion des erreurs de suppression
        displayErrorMessage("Utilisateur non autorisé!", ".modal-title");
      }
    })
    .catch((error) => {
      displayErrorMessage("Une erreur s'est produite.", ".modal-title", error);
    });
}

// Ajouts des fonctions pour la création du formulaire pour ajouter une photo

// Fonction pour créer un élément enfant avec attributs et classe CSS
export function createChildElement(
  tagName,
  parent,
  className,
  attributes = {}
) {
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

// Fonction pour créer un input enfant avec attributs
export function createChildInputElement(parent, type, name, attributes = {}) {
  const input = createChildElement("input", parent, null, {
    type,
    name,
    ...attributes,
  });
  return input;
}

// Fonction pour récupérer le titre d'une image
export function formatFileName(fileName) {
  // Extraction du nom sans l'extension
  const fileNameWithoutExtension = fileName.substring(
    0,
    fileName.lastIndexOf(".")
  );

  // Suppression des chiffres à la fin du nom de fichier
  const formattedFileName = fileNameWithoutExtension.replace(/\d+$/, "");

  // Suppression des tirets au début et à la fin du nom
  const trimmedFileName = formattedFileName.replace(/^-+|-+$/g, "");

  // Remplacement des tirets restants par des espaces
  const finalFileName = trimmedFileName.replace(/-/g, " ");

  return finalFileName;
}

export function fetchCategories(dataWork) {
  const categorySelect = document.getElementById("categorie");
  categorySelect.innerHTML = "";

  // Création d'une option pour choisir une catégorie
  const chooseOption = createChildElement("option", categorySelect, null, {
    value: "",
    disabled: true,
    selected: true,
  });
  chooseOption.textContent = "Choisissez une catégorie";

  // Création des options de catégorie :
  // la liste des identifiants de catégories uniques est extraite des données dataWork
  const categoryList = Array.from(
    new Set(dataWork.map((jsonWork) => jsonWork.categoryId))
  );

  categoryList.forEach((categoryId) => {
    // Récupération du nom de la catégorie correspondante à partir des données dataWork
    const categoryName = dataWork.find((work) => work.categoryId === categoryId)
      .category.name;
    // Création et ajout d'une nouvelle option à l'élément de la sélection
    const option = createChildElement("option", categorySelect, null, {
      value: categoryId,
    });
    option.textContent = categoryName;
  });
}

// Fonction pour vérifier si tous les champs sont remplis et changer la couleur du bouton d'envoi en conséquence
export function checkFormFields() {
  const titleValue = titleInput.value;
  const categoryValue = categorySelect.value;
  const imageFile = photoInput.files[0];

  // Vérification que tous les champs sont remplis. La méthode trim() permet de nettoyer les champs
  // et de supprimer automatiquement les espaces et autres tabulations autour de la chaîne à tester.
  const allFieldsFilled =
    titleValue.trim() !== "" &&
    categoryValue.trim() !== "" &&
    imageFile !== undefined;

  const submitButton = document.getElementById("modal-button-submit");
  // Mise à jour de la couleur du bouton de validation
  submitButton.style.backgroundColor = allFieldsFilled ? "#1D6154" : "#A7A7A7";
}

// Fonction pour afficher un message d'erreur
export function displayErrorMessage(message, selector) {
  const errorContainer = document.querySelector(selector);
  const errorMessageElement = errorContainer.querySelector(".error-message");
  if (errorMessageElement) {
    errorMessageElement.remove();
  }
  const errorMessage = document.createElement("p");

  errorMessage.classList.add("error-message");
  errorMessage.innerHTML = message;

  errorContainer.appendChild(errorMessage);
}
