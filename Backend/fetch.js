const section = document.querySelector("#portfolio")

export async function getDataWork() {
  try {
    const response = await fetch('http://localhost:5678/api/works')
    const data = await response.json()
    console.log(response)
    if (response.status === 200) {
          // console.log('Success', data)
          section.innerHTML = '<h2>Mes Projets</h2>';
          const div = document.createElement("div")
          div.classList.add("gallery")
          for (let i = 0; i < data.length; i++) {
          div.innerHTML +=`<figure>
         	   <img src="${data[i].imageUrl}" alt="Abajour Tahina">
             <figcaption>${data[i].title}</figcaption>
             </figure>`
          // console.log('Success', data)
        }
        section.appendChild(div)
    }
    } catch (error) {
      console.error('Error fetching data', error);
    }
 }

getDataWork()

// export async function getDataCategories() {
//   try {
//     const response2 = await fetch('http://localhost:5678/api/categories')
//     const data2 = await response2.json()
//     if (response2.status === 200) {
//       console.log('Success', data2)
//     } else {
//       console.log('Serveur Error', data2)
//     }
//   } catch(error) {
//     console.log('Error')
//   }
// }

// getDataCategories()