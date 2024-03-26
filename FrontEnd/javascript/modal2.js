import fetchData from "./fetchWorks.js";
import fetchDataCat from "./fetchCategories.js";

// récupérer et rendre la modale dynamique
const modal = document.querySelector(".modal");
const modalWrapper = document.querySelector(".modal-wrapper");
const modalAddPhoto = document.querySelector(".modal-add-photo");
const inputAjouterPhoto = document.querySelector(".modal-ajout-btn");
const arrowCallBack = document.querySelector(".fa-arrow-left");
const API_URL = "http://localhost:5678/api/works";

// faire apparaître et disparaître la modale
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

// btn pour ouvrir la modale
const btnEdition = document.querySelector(".fa-pen-to-square");

// span croix pour la fermer
const spanClose = document.querySelectorAll(".fa-xmark");
for (const croix of spanClose) {
  croix.addEventListener("click", displayClose);
}

btnEdition.addEventListener("click", displayModale);

// ferme la modale quand on click en dehors de la modale
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    modalWrapper.style.display = "none";
    modalAddPhoto.style.display = "none";
  }
};

// Fonction pour mettre à jour le DOM de la galerie index après la suppression d'une image
function updateGalleryIndex(id) {
  const galleryImage = document.querySelector(`.gallery [id="${id}"]`);
  if (galleryImage) {
    galleryImage.parentNode.remove();
  }
}

// Fonction pour supprimer une image
function deleteProjet(trash) {
  trash.addEventListener("click", (e) => {
    e.preventDefault();
    const id = trash.id;

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
        } else {
          trash.parentNode.remove();
          updateGalleryIndex(id); // Mettre à jour le DOM de la galerie index
        }
      })
      .then((data) => {
        console.log("Données reçues du serveur :", data);
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression :", error);
      });
  });
}

const categoryInput = document.querySelector("#form-category");
const titleInput = document.querySelector("#add-title");
// creation du DOM
function createWorkHTML(workData) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const deleteButton = document.createElement("button");
  const trashIcon = document.createElement("i");

  img.src = workData.imageUrl;
  img.alt = workData.title;

  figure.setAttribute("class", "figure-relative");
  deleteButton.classList.add("delete-photo");
  trashIcon.classList.add("fas", "fa-trash-alt");

  deleteButton.id = workData.id;

  // Appeler deleteProjet avec le bouton de suppression
  deleteProjet(deleteButton);

  deleteButton.appendChild(trashIcon);
  figure.appendChild(img);
  figure.appendChild(deleteButton);

  return figure;
}

// afficher les catégories dans la modale
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

// désactiver le bouton "Valider"
function disabledValider() {
  const formAddImg = document.querySelector("#form-add-img");
  const confirmValid = document.querySelector("#confirm-valid");
  const addImg = document.querySelector("#add-img");
  const titleInput = document.querySelector("#add-title");
  const categoryInput = document.querySelector("#form-category");

  formAddImg.addEventListener("input", () => {
    if (addImg.value && titleInput.value && categoryInput.value !== "default") {
      confirmValid.classList.add("input-valider");
    } else {
      confirmValid.classList.remove("input-valider");
    }
  });
}

// prévisualisation de l'image
const imgPreview = document.querySelector(".container-add-img img");
const imgFile = document.querySelector(".container-add-img input");
const imgLabel = document.querySelector(".container-add-img label");
const imgI = document.querySelector(".container-add-img .fa-image");
const imgSpan = document.querySelector(".container-add-img span");

imgFile.addEventListener("change", () => {
  const file = imgFile.files[0];
  if (file) {
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

// créer une nouvelle image
const form = document.querySelector(".modal-add-photo form");
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const token = sessionStorage.getItem("auth");
  const formData = new FormData();

  formData.append("image", imgFile.files[0]);
  formData.append("title", titleInput.value);
  formData.append("category", categoryInput.value);

  if (!imgFile.files[0] || !titleInput.value || !categoryInput.value) {
    document.querySelector(".errorDataFile").style.display = "block";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la requête Fetch");
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Projet ajouté avec succès :`, data);
      document.querySelector(".errorDataFile").style.display = "none";

      const newWork = data;
      const newWorkHTML = createWorkHTML(newWork);

      modalWrapper.querySelector(".modal-gallery").appendChild(newWorkHTML);

      const portfolioGallery = document.querySelector("#portfolio .gallery");
      portfolioGallery.appendChild(newWorkHTML.cloneNode(true));

      modalAddPhoto.style.display = "none";
      modal.style.display = "flex";
      modalWrapper.style.display = "flex";
      
      //reset du formulaire et du previewImg
      form.reset();
      imgFile.value = '';
      imgPreview.style.display = 'none';
      imgFile.style.display = 'block';
      
      // Après l'ajout d'une nouvelle img, appeler la fonction deleteProjet pour prendre en compte les nouveaux boutons de suppression
      const trashNodes = document.querySelectorAll(".delete-photo");
      trashNodes.forEach((trash) => {
        deleteProjet(trash);
      });
    })
    .catch((error) => {
      console.error(`Erreur lors de l'ajout du projet :`, error);
    });
});

// Appeler la fonction pour créer la liste des travaux au chargement de la page
export async function modalCreateWorksList() {
  try {
    const [response, works] = await fetchData();
    if (response.status === 200) {
      const div = document.createElement("div");
      div.classList.add("modal-gallery");
      for (let i = 0; i < works.length; i++) {
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        const deleteButton = document.createElement("button");
        const trashIcon = document.createElement("i");

        img.src = works[i].imageUrl;
        img.alt = works[i].title;

        figure.setAttribute("class", "figure-relative");
        deleteButton.classList.add("delete-photo");
        trashIcon.classList.add("fas", "fa-trash-alt");

        deleteButton.id = works[i].id;

        deleteButton.appendChild(trashIcon);
        figure.appendChild(img);
        figure.appendChild(deleteButton);

        div.appendChild(figure);

        // Appeler deleteProjet avec le bouton de suppression
        deleteProjet(deleteButton);
      }
      const hr = document.createElement("hr");
      modalWrapper.appendChild(div);
      modalWrapper.appendChild(hr);
      modalWrapper.appendChild(inputAjouterPhoto);
      disabledValider();
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

modalCreateWorksList();

inputAjouterPhoto.addEventListener("click", () => {
  modalAddPhoto.style.display = "flex";
  modalWrapper.style.display = "none";
});

arrowCallBack.addEventListener("click", displayModale);
