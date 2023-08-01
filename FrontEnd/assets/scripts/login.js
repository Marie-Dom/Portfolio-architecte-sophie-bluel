const header = document.querySelector("header");
header.classList.add("header-logout");

async function addListenerSendForm() {
  console.log("COUCOU");
  const form = document.getElementById("login_form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  const dataLogin = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
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
    const error = document.getElementById("error");
    const message = document.createElement("p");
    error.appendChild(message);

    // Vérification du code d'état de la réponse du serveur
    if (response.status === 200) {
      error.innerHtml = "";
      const token = responseData.token;
      // Sauvegarde du token et redirection vers la page d'accueil
      window.localStorage.setItem("token", token);
      window.location.href = "./index.html";

      // Mise en place de messages d'erreur selon le code reçu
    } else if (response.status === 401) {
      error.message.innerText = "Mot de passe incorrect.";
    } else if (response.status === 404) {
      error.message.innerText = "Utilisateur inconnu.";
    }

    // Mise en place d'un message d'erreur s'il n'y a pas de connexion au serveur
  } catch (error) {
    error.message.innerText =
      "Une erreur est survenue lors de la connexion.<br>Veuillez réessayer plus tard.";
  }
}
