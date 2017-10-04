import { WebGLRenderer, Color } from "three"
import { Vector3, VectorC } from "./Vector3"
import { scene, camera, render } from "./scene"
import { physicsTick, world } from "./physics"
import { Tween, Easing, update } from "tween.js"
import getIntersection from "./getIntersection"
import Box from "./Box"
import Stack from "./Stack"

const stack = new Stack()

function tick() {
    try {
        physicsTick()
        update()
        render()
        requestAnimationFrame(tick)
    } catch (e) {
        console.error(e)
    }
}

tick()
 

document.addEventListener("click", () => {
   stack.match()
})


// debug
window.scene = scene
window.THREE = require("three")