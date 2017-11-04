const score = document.querySelectorAll(".score")
const ui = document.querySelector(".ui-wrapper")
const sections = document.querySelectorAll(".ui-section")

export function setEnded() {
    sections.forEach(i => i.classList.remove("ui-section--active"))

    ui.querySelector(".ended").classList.add("ui-section--active")
}

export function setRunning() {
    sections.forEach(i => i.classList.remove("ui-section--active"))

    ui.querySelector(".running").classList.add("ui-section--active")
}

export function setReady() {
    sections.forEach(i => i.classList.remove("ui-section--active"))

    ui.querySelector(".ready").classList.add("ui-section--active")
}

export function setScore({ stackSize }) {
    score.forEach(i => i.innerText = stackSize)
}