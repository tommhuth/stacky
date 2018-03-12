const scores = document.querySelectorAll(".score")
const ui = document.querySelector(".ui-wrapper")
const sections = document.querySelectorAll(".ui-section")
const mainScore = ui.querySelector(".running-score")

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

export function setScore({ score }) { 
    scores.forEach(i => i.innerText = score)
}

export function setScoreBonus() { 
    mainScore.classList.add("pow")

    setTimeout(() => mainScore.classList.remove("pow"), 500)
}