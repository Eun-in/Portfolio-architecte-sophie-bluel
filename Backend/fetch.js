// import {ajoutListenerConnexion} from "./login.js";

const section = document.querySelector("#portfolio");

export async function getDataCategories() {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();
    if (response.status === 200) {
      const id = data.length + 1;
      data.unshift({ id, name: "Tous" });
      const div = document.createElement("div");
      div.classList.add("categories");
      const ul = document.createElement("ul");

      // Utilisation d'un ensemble (Set) pour stocker les noms de catégories uniques
      const categoryNames = new Set();
      for (const category of data) {
        categoryNames.add(category.name);
      }
      for (const categoryName of categoryNames) {
        ul.innerHTML += `<li class="filter-btn">${[categoryName]}</li>`;
      }

      div.appendChild(ul);
      section.appendChild(div);

      ajoutListener();
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

getDataCategories();

export async function getDataWork() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    // console.log(data);
    if (response.status === 200) {
      const div = document.createElement("div");
      div.classList.add("gallery");
      for (let i = 0; i < data.length; i++) {
        div.innerHTML += `<figure data-category="${data[i].categoryId}">
         	   <img src="${data[i].imageUrl}" alt="Abajour Tahina">
             <figcaption>${data[i].title}</figcaption>
             </figure>`;
      }

      section.appendChild(div);
    }
  } catch (error) {
    console.error("Error fetching data", error);
  }
}

getDataWork();

export async function ajoutListener() {
  const filterBtn = document.querySelectorAll(".filter-btn");
  for (let i = 0; i < filterBtn.length; i++) {
    const element = filterBtn[i];
    element.addEventListener("click", (e) => {
      switch (e.target.textContent) {
        case "Objets":
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
        // code block
      }
    });
  }
}

export function ajoutLiaison(categoryId) {
  console.log(categoryId);
  const liaisonImg = document.querySelectorAll("#portfolio figure");
  for (let i = 0; i < liaisonImg.length; i++) {
    const element = liaisonImg[i];
    element.style.display = "none";
    if (parseInt(element.dataset.category) === categoryId || categoryId === 0) {
      element.style.display = "block";
    }

    console.log(element);
  }
}

// ajoutListenerConnexion()