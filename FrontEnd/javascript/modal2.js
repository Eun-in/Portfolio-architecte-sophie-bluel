import fetchData from "./fetchWorks.js";
import fetchDataCat from "./fetchCategories.js";


// Get the modal
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddPhoto = document.querySelector(".modal-add-photo");
const inputAjouterPhoto = document.querySelector(".modal-ajout-btn");
const arrowCallBack = document.querySelector(".fa-arrow-left");

//séparer une callback pour l'utiliser sur plusieurs éléments *2B9S
const displayModale = () => {
  modal.style.display = "flex";
  modalWrapper.style.display = "flex";
  modalAddPhoto.style.display = "none";
};

const displayClose = () => {
  modal.style.display = "none";
  modalWrapper.style.display = "none";
  modalAddPhoto.style.display = "none";
};

// Get the button that opens the modal
const btnEdition = document.querySelector(".fa-pen-to-square");

// // Get the <span> element that closes the modal
const spanClose = document.querySelectorAll(".fa-xmark");
for (const croix of spanClose) {
  croix.addEventListener("click", displayClose);
}

// // When the user clicks the button, open the modal *2B9S
btnEdition.addEventListener("click", displayModale);

// // When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalWrapper.style.display = "none";
    modalAddPhoto.style.display = "none";
  }
};

export async function modalCreateWorksList() {
  try {
    const [response, works] = await fetchData();
    // const arrayWorksNode = [response, works]
    if (response.status === 200) {
      const div = document.createElement("div");
      div.classList.add("modal-gallery");
      for (let i = 0; i < works.length; i++) {
        div.innerHTML += `<figure class="figure-relative" data-category="${works[i].categoryId}">
                  <img src="${works[i].imageUrl}" alt="${works[i].title}"> <button class="delete-photo" id="${works[i].id}"><i class="fas fa-trash-alt"></i></button>
                  </figure>`;
      }
      const hr = document.createElement("hr");
      // modalWrapper.innerHTML = '';
      modalWrapper.appendChild(div);
      modalWrapper.appendChild(hr);
      modalWrapper.appendChild(inputAjouterPhoto);

      // Console log pour vérifier les identifiants des boutons de suppression
      //  console.log("Identifiants des boutons de suppression :", document.querySelectorAll(".delete-photo"));
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
  deleteProjet();
}

modalCreateWorksList();

inputAjouterPhoto.addEventListener("click", () => {
  modalAddPhoto.style.display = "flex";
  modalWrapper.style.display = "none";
  // console.log('coucou'); commence toujours par faire une consolelog dans tes callback
});

// *2B9S
arrowCallBack.addEventListener("click", displayModale);

// Delete images ///////////////
function deleteProjet() {
  const trashNode = document.querySelectorAll(".delete-photo");
  trashNode.forEach((trash) => {
    trash.addEventListener("click", (e) => {
      e.preventDefault();
      const id = trash.id;
      // console.log(trash);

      const token = sessionStorage.getItem("auth");

      fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        body: null,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            console.log("Réponse du serveur, la suppression a échoué");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Données reçues du serveur :", data);
        });
    });
  });
}

//////////////AJOUTER PREVIEW/////////////////

const imgPreview = document.querySelector(".container-add-img img");
const imgFile = document.querySelector(".container-add-img input");
const imgLabel = document.querySelector(".container-add-img label");
const imgI = document.querySelector(".container-add-img .fa-image");
const imgSpan = document.querySelector(".container-add-img span");

imgFile.addEventListener("change", () => {
  const file = imgFile.files[0];
  if (file) {
    //FileReader permet à des applications web de lire le contenu de fichiers async. On peut ainsi lire des File
    const reader = new FileReader();
    reader.onload = function (e) {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "flex";
      imgFile.style.display = "none";
      imgLabel.style.display = "none";
      imgI.style.display = "none";
      imgSpan.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

/////////////////Recuperer les cat////////////////////

async function displayCatModal() {
  const select = document.querySelector("#form-add-img select");
  try {
    const [response, categories] = await fetchDataCat();
    if (response.status === 200) {
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error fetching categories", error);
  }
}
displayCatModal();

////////////AJOUTER PROJETS FETCH POST////////////

const form = document.querySelector(".modal-add-photo form");
const titleInput = document.querySelector("#add-title");
const categoryInput = document.querySelector("#form-category");
const API_URL = "http://localhost:5678/api/works";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = sessionStorage.getItem("auth");

  const formData = new FormData();
  

  // Ajout des champs requis
  formData.append("image", imgFile.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);
  
  // Vérifie si tous les champs sont remplis
  if (!imgFile.files[0] || !titleInput.value || !categoryInput.value) {
    document.querySelector(".errorDataFile").style.display = "block";
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la requête Fetch");
    }

    const data = await response.json();
    console.log(`Projet ajouté avec succès :`, data);
    document.querySelector(".errorDataFile").style.display = "none";

    // Gérer la réponse de la requête Fetch ici
  } catch (error) {
    console.error(`Erreur lors de l'ajout du projet :`, error);
  }
});
