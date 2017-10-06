import { scene, render } from "./scene"
import { physicsLoop } from "./simulation"
import { update as tweenLoop } from "tween.js"
import Stack from "./objects/Stack"

(function loop() {
    try {
        // order is important here to avoid ghosting/flicker of slices
        // clamped to center of previous slice
        physicsLoop()
        render()
        tweenLoop()
        requestAnimationFrame(loop)
    } catch (e) {
        console.error(e)
    }
})()

// make stack
const stack = new Stack()

document.addEventListener("click", () => {
    stack.match()
})

document.addEventListener("touchstart", () => {
    stack.match()
})


// debug
window.scene = scene
window.THREE = require("three")