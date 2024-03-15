/////////// ici j'importe d'autres fonctions/////////////

import fetchData from "./fetchWorks.js";
import fetchDataCat from "./fetchCategories.js";

const section = document.querySelector("#portfolio");

///////// je récupère les catégories/////////////
export default async function getDataCategories() {
  try {
    const [response, categories] = await fetchDataCat();
    if (response.status === 200) {
      const id = categories.length + 1;
      categories.unshift({ id, name: "Tous" });
      const div = document.createElement("div");
      div.classList.add("categories");
      const ul = document.createElement("ul");
      // Utilisation d'un ensemble (Set) pour stocker les noms de catégories uniques
      const categoryNames = new Set();
      for (const category of categories) {
        ul.innerHTML += `<li class="filter-btn">${[category.name]}</li>`;
        categoryNames.add(category.name);
      }

      div.appendChild(ul);
      section.appendChild(div);

      ajoutListener();
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

////////// je récupère la liste des projets/////////
export async function createWorksList() {
  try {
    const [response, works] = await fetchData();
    // console.log(data);
    if (response.status === 200) {
      const div = document.createElement("div");
      div.classList.add("gallery");
      for (let i = 0; i < works.length; i++) {
        div.innerHTML += `<figure data-category="${works[i].categoryId}">
         	   <img src="${works[i].imageUrl}" alt="Abajour Tahina">
             <figcaption>${works[i].title}</figcaption>
             </figure>`;
      }
      section.appendChild(div);
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

//////////j'itère (procede de calcul répétitif jusquà condition remplie)//////
////////// sur chaque bouton de filtre et j'écoute////////////
export async function ajoutListener() {
  const filterBtn = document.querySelectorAll(".filter-btn");
  for (let i = 0; i < filterBtn.length; i++) {
    const element = filterBtn[i];
    element.addEventListener("click", (e) => {
      switch (e.target.textContent) {
        case "Objets":
        //// j'utilise la fonction du bas pour trier les categoryId
          ajoutLiaison(1);
          break;
        case "Appartements":
          ajoutLiaison(2);
          break;
        case "Hotels & restaurants":
          ajoutLiaison(3);
          break;
        default:
          ajoutLiaison(0);
          break;
      }
    });
  }
}



export function ajoutLiaison(categoryId) {
  // console.log(categoryId);
  const liaisonImg = document.querySelectorAll("#portfolio figure");
  for (let i = 0; i < liaisonImg.length; i++) {
    const element = liaisonImg[i];
    element.style.display = "none";
    //////parseInt permet de changer string(chaine de caractère) to integer (nbre de entier)/////
    if (parseInt(element.dataset.category) === categoryId || categoryId === 0) {
      element.style.display = "block";
    }

    console.log(element);
  }
}

// permet de toujours charger les catégories avant les projets
(async () => {
  await getDataCategories();
  await createWorksList();
})();