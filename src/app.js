import "babel-polyfill"
import { scene, render } from "./scene"
import { physicsLoop } from "./simulation"
import { update as tweenLoop } from "tween.js"
import Stack from "./objects/Stack"

(function loop() {
    try {
        // order is important here to avoid ghosting/flicker of slices
        // clamped to center of previous slice -- strange
        physicsLoop()
        render()
        tweenLoop()
        requestAnimationFrame(loop)
    } catch (e) {
        console.error(e)
    }
})()
 
const stack = new Stack()


document.addEventListener("touchstart", (e) => {
    e.preventDefault()
    stack.match()
})
 
document.addEventListener("touchmove", (e) => {
    e.preventDefault() 
})

document.addEventListener("click", () => {
    stack.match()
}) 

// debug
window.scene = scene
window.THREE = require("three")