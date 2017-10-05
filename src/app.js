import { scene, render } from "./scene"
import { physicsTick } from "./physics"
import { update as tweenTick } from "tween.js"
import Stack from "./Stack"

const stack = new Stack();

(function loop() {
    try {
        physicsTick()
        tweenTick()
        render()
        requestAnimationFrame(loop)
    } catch (e) {
        console.error(e)
    }
})()

document.addEventListener("click", () => {
    stack.match()
})

document.addEventListener("touchstart", () => {
    stack.match()
})


// debug

window.scene = scene
window.THREE = require("three")