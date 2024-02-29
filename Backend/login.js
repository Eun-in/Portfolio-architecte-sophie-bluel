const formulaireConnexion = document.querySelector(".form-login");
const loginButton = document.querySelector("#loginButton");

const errorMsg = document.querySelector(".error-msg");

// console.log(errorMsg);

function ajoutListenerConnexion() {
  formulaireConnexion.addEventListener("submit", function (event) {
    event.preventDefault();
    // ici je récupère les valeurs
    const connexion = {
      email: event.target.querySelector("[name=e-mail]").value,
      password: event.target.querySelector("[name=password]").value,
    };
    console.log("Données de connexion envoyées au serveur :", connexion);

    const payload = JSON.stringify(connexion);

    fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
    })
      .then((response) => {
        // console.log("Réponse du serveur :", response);
        return response.json();
      })
      .then((data) => {
        console.log("Données reçues du serveur :", data);

        if (data.userId === 1) {
          // if (data.length > 0) {
          sessionStorage.setItem("auth", data.token);
          sessionStorage.setItem("userInfo", data.userId);
          errorMsg.textContent = "";
          window.location.href = "index.html";
        } else {
          sessionStorage.clear();
          errorMsg.textContent = "Un problème est survenu, try again later.";
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la connexion :", error);
      });
  });
}

function switchText() {
  const loginButton = document.querySelector("#loginButton");
  const editionModeDiv = document.querySelector(".js-edition-mode");

  if (sessionStorage.getItem("auth") && sessionStorage.getItem("userInfo")) {
    loginButton.textContent = "logout";
    editionModeDiv.style.display = "block"; // Afficher l'élément
  } else {
    loginButton.textContent = "login";
    editionModeDiv.style.display = "none"; // Cacher l'élément
  }
}

if (formulaireConnexion !== null) {
  ajoutListenerConnexion();
}

loginButton.addEventListener("click", function () {
  sessionStorage.removeItem("auth");
  sessionStorage.removeItem("userInfo");
});

switchText()