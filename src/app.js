import { scene, render } from "./scene"
import { physicsLoop } from "./simulation"
import { update as tweenLoop } from "tween.js"
import Stack from "./objects/Stack"

// kick it off
(function loop() {
    try {
        physicsLoop()
        tweenLoop()
        render()
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