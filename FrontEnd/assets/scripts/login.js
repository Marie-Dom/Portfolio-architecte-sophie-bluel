const header = document.querySelector("header");
header.classList.add("header-logout");

const form = document.getElementById("login_form");
form.addEventListener("submit", async (event) => {
  const dataLogin = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  event.preventDefault();
  try {
    // Requête POST pour envoyer des données à l'API
    const url = "http://localhost:5678/api/users/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataLogin),
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
      displayErrorMessage(
        "L'email et/ou le mot de passe est erronné.",
        "#error"
      );
    } else if (response.status === 404) {
      displayErrorMessage("Utilisateur inconnu.", "#error");
    }

    // Mise en place d'un message d'erreur s'il n'y a pas de connexion au serveur
  } catch (error) {
    displayErrorMessage(
      "Une erreur est survenue lors de la connexion.<br>Veuillez réessayer plus tard.",
      "#error"
    );
  }
});
