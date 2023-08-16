import { displayErrorMessage } from "./functions.js";

const header = document.querySelector("header");
header.classList.add("header-logout");
let loginForm = document.querySelector("form");
loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  try {
    // Requête POST pour envoyer des données à l'API
    const url = "http://localhost:5678/api/users/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const responseData = await response.json();

    // Vérification du code d'état de la réponse du serveur
    if (response.status === 200) {
      const token = responseData.token;

      // Sauvegarde du token et redirection vers la page d'accueil
      window.localStorage.setItem("token", token);
      window.location.href = "./index.html";
      // Mise en place de messages d'erreur selon le code reçu
    } else if (response.status === 401) {
      displayErrorMessage("Mot de passe incorrect", "#error");
    } else if (response.status === 404) {
      displayErrorMessage("Utilisateur inconnu.", "#error");
    }

    // Affichage d'un message d'erreur s'il n'y a pas de connexion au serveur
  } catch (error) {
    displayErrorMessage(
      "Une erreur est survenue lors de la connexion.<br>Veuillez réessayer plus tard.",
      "#error"
    );
  }
});
