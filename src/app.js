import { WebGLRenderer, Color } from "three"
import { Vector3, VectorC } from "./Vector3"
import { scene, camera, render } from "./scene"
import { physicsTick, world } from "./physics"
import { Tween, Easing, update as tweenTick } from "tween.js"
import getIntersection from "./getIntersection"
import Box from "./Box"
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