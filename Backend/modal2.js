import fetchData from "./fetchWorks.js";

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
    if (response.status === 200) {
      const div = document.createElement("div");
      div.classList.add("modal-gallery");
      for (let i = 0; i < works.length; i++) {
        div.innerHTML += `<figure class="figure-relative" data-category="${works[i].categoryId}">
                  <img src="${works[i].imageUrl}" alt="${works[i].title}"> <button class="delete-photo"><i class="fas fa-trash-alt"></i></button>
                  </figure>`;
      }
      modalWrapper.appendChild(div);

      // Ajouter dynamiquement HR
      const hr = document.createElement("hr");
      modalWrapper.appendChild(hr);
      modalWrapper.appendChild(inputAjouterPhoto);
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

modalCreateWorksList();

inputAjouterPhoto.addEventListener("click", () => {
  modalAddPhoto.style.display = "flex";
  modalWrapper.style.display = "none";
  // console.log('coucou'); commence toujours par faire une consolelog dans tes callback
});

// *2B9S
arrowCallBack.addEventListener("click", displayModale);