export function ajoutListenerConnexion() {
    const formulaireConnexion = document.querySelector(".form-login");
    formulaireConnexion.addEventListener("submit", function (event) {
      event.preventDefault();
      // ici je récupère les valeurs
      const connexion = {
        email: event.target.querySelector("[name=e-mail]").value,
        password: event.target.querySelector("[name=password]").value,
      };
      console.log("Données de connexion envoyées au serveur :", connexion);
  
      // convertir en json
      const payload = JSON.stringify(connexion);
  
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      })
      .then(response => {
        console.log("Réponse du serveur :", response);
        return response.json();
      })
      .then(data => {
        console.log("Données reçues du serveur :", data);
        // Faire quelque chose avec les données si nécessaire
      })
      .catch(error => {
        console.error("Erreur lors de la connexion :", error);
      });
    });
  }

  