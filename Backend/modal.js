let modal = null
//sélecteur pour tous les éléments sélectionnables 
const focusableSelector = "button, a, input"
//
let focusables = []

const openModal = function (e) {
    e.preventDefault()
    modal = document.querySelector(e.target.getAttribute('href'))
    //sélectionne seulement les éléments focusable dans la modale
    //array.from pour changer une nodelist en tab
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    modal.style.display = null
    modal.removeAttribute('aria-hidden')
    modal.setAttribute('aria-modal', 'true')
    modal.addEventListener('click', closeModal)
    //permet de ne pas fermer la fenêtre quand ton clique à l'intérieur de la modale
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', true)
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

const focusInModal = function (e) {
    e.preventDefault()
    //élément actuellement focus
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'))
    index++
    if (index >= focusables.length) {
        index = 0
    }
    focusables[index].focus()
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

//pression du clavier escape, hors projet
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    // écouter le tab
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})