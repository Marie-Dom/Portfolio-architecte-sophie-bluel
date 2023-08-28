import {
  fetchWorks,
  createCloseButton,
  secondPageModalDisplay,
  toggleModal,
  modalePagefirst,
  modalePageSecond,
  refreshGallery,
  createChildElement,
  createChildInputElement,
  formatFileName,
  displayErrorMessage,
} from "./functions.js";
import { genererWorks } from "./index.js";

// Appel de la fonction pour cacher la 2nd page de la modale
secondPageModalDisplay("none");

// Appel de la fonction createCloseButton et ajout de la classe "modal-trigger" au bouton "X" et aux id et classes des boutons edit

createCloseButton();
const elements = document.querySelectorAll(
  "#editMod .positionEdit, .modal-overlay"
);
elements.forEach((element) => {
  element.classList.add("modal-trigger");
});

// Boucle pour parcourir les différentes classes et en cliquant sur l'une d'elles, exécuter la fonction toggleModal
const modalTriggers = document.querySelectorAll(".modal-trigger");
modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", toggleModal)
);

genererWorks("#modal-gallery");

// Ajout d'un évènement d'écoute sur le bouton "Ajouter une photo" pour afficher la 2nd page de la modale
const buttonAddPhoto = document.querySelector(".modal-button");
buttonAddPhoto.addEventListener("click", modalePageSecond);

// Récupération de la balise pour le formulaire de la modale
const form = document.getElementById("modal-form");

// Création de l'emplacement pour ajout de la photo
const addPhotoDiv = createChildElement("div", form, "modal-add-photo");

const svg = document.querySelector("#modal-form svg");
addPhotoDiv.appendChild(svg);

const containerImg = createChildElement("img", addPhotoDiv, "container-img", {
  id: "container-image",
});
containerImg.style.display = "none";

const photoInput = createChildInputElement(addPhotoDiv, "file", "photo", {
  accept: "image/jpeg, image/png",
  "max-size": "4194304",
  style: "display: none",
});

const addButton = createChildElement("div", addPhotoDiv, "modal-btn");
addButton.textContent = "+ Ajouter photo";

const infoParagraph = createChildElement("p", addPhotoDiv);
infoParagraph.textContent = "jpg, png : 4 mo max";

// Création du champ pour le titre
const formFieldDiv = createChildElement("div", form, "modal-form-field");

const titleInputLabel = createChildElement("label", formFieldDiv, null, {
  for: "title",
});
titleInputLabel.textContent = "Titre";
const titleInput = createChildInputElement(formFieldDiv, "text", "title", {
  id: "title",
});

// Création du contrôle de la catégorie
const categoryLabel = createChildElement("label", formFieldDiv, null, {
  for: "categorie",
});
categoryLabel.textContent = "Catégorie";
const categorySelect = createChildElement("select", formFieldDiv, null, {
  name: "categorie",
  id: "categorie",
});

// Création du bouton pour soummettre le formulaire
const submitInput = createChildInputElement(form, "submit", null, {
  value: "Valider",
  id: "modal-button-submit",
});

// Récupération des données sur l'API pour remplir les champs de sélection des différentes catégories
fetchWorks().then((dataWork) => {
  fetchCategories(dataWork);
});

function fetchCategories(dataWork) {
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

// Au clic sur le bouton "ajouter une photo" ou sur le conteneur d'images, cela déclenche la sélection du fichier
addButton.addEventListener("click", function () {
  photoInput.click();
});
containerImg.addEventListener("click", function () {
  photoInput.click();
});

photoInput.addEventListener("change", function (event) {
  const selectedFile = event.target.files[0];

  if (selectedFile) {
    // L'objet FileReader permet de lire le contenu d'un fichier en tant que données brutes à partir d'un objet File.
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // Accès à l'url du contenu du fichier
      const imageUrl = reader.result;

      containerImg.style.display = "block";
      containerImg.src = imageUrl;
      addButton.style.visibility = "hidden";

      // Obtenir le nom du fichier (titre de l'image)
      const fileName = selectedFile.name;

      // Formatage du nom du fichier
      const formattedFileName = formatFileName(fileName);

      // Pré-remplissage du champ "titre" avec le nom du fichier formaté pour lire le contenu du fichier en tant qu'URL de données
      titleInput.value = formattedFileName;
    });
    reader.readAsDataURL(selectedFile);
  } else {
    // Réinitialisation de l'image si aucun fichier n'est sélectionné
    containerImg.style.display = "none";
    containerImg.src = "";
    addButton.style.visibility = "visible";
    // Réinitialisation du champ "titre"
    titleInput.value = "";
  }
});

// Fonction pour vérifier si tous les champs sont remplis et changer la couleur du bouton d'envoi en conséquence
function checkFormFields() {
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

// Ajout d'un évènement d'écoute sur chaque champ du formulaire
titleInput.addEventListener("input", checkFormFields);
categorySelect.addEventListener("change", checkFormFields);
photoInput.addEventListener("change", checkFormFields);

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const token = window.localStorage.getItem("token");

  // Récupération des valeurs des champs du formulaire
  const title = titleInput.value;
  const categoryId = categorySelect.value;
  const imageFile = photoInput.files[0];

  // Création d'un nouvel objet FormData
  const formData = new FormData();

  formData.append("title", title);
  formData.append("image", imageFile);
  formData.append("category", categoryId);

  // Envoi des données du formulaire à l'API
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "multipart/form-data",
    },
    body: formData,
  }).then((response) => {
    // Si la requête est correcte
    if (response.status === 201) {
      // Actualisation de l'affichage de la galerie, réinitialisation du formulaire à son état d'origine
      // et affiche la première page de la modale
      refreshGallery("#modal-gallery");
      refreshGallery(".gallery");
      form.reset();
      containerImg.style.display = "none";
      containerImg.src = "";
      addButton.style.visibility = "visible";
      const submitButton = document.getElementById("modal-button-submit");
      submitButton.style.backgroundColor = "#A7A7A7";
      window.scrollTo(600, 600);
      modalePagefirst();
    } else if (response.status === 400) {
      displayErrorMessage(
        "Veuillez remplir tous les champs du formulaire.",
        "#modal-form"
      );
    } else if (response.status === 401) {
      displayErrorMessage("Utilisateur non autorisé!!!", "#modal-form");
    }
  });
  // .catch((error) => {
  //   // console.log(error);
  //   displayErrorMessage("Une erreur est survenue.", "#modal-form", error);
  // });
});
