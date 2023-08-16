import {
  fetchWorks,
  displayFilters,
  genererWorks,
  filterWorks,
  setDisplayStyle,
  showAllWorks,
  createEditElement,
  displayHeadbandEditMod,
  createEditButton,
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

const displayLogout = document.getElementById("logout");

// Quand l'utilisateur clique sur le bouton "logout", il se déconnecte
displayLogout.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.href = "./index.html";
});
