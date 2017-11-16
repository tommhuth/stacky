import "babel-polyfill"
import { scene, render } from "./scene"
import { physicsLoop } from "./simulation"
import { update as tweenLoop } from "tween.js"
import Stack, { StackEvent, StackState } from "./objects/Stack"
import { setScore, setReady, setEnded, setRunning } from "./ui"

(function loop() {
    try {
        // order is important here to avoid ghosting/flicker of slices
        // clamped to center of previous slice -- strange
        physicsLoop()
        tweenLoop()
        render()
        requestAnimationFrame(loop)
    } catch (e) {
        console.error(e)
    }
})()

const stack = new Stack()

stack.on(StackEvent.ScoreChange, setScore)
stack.on(StackEvent.Ready, setReady)
stack.on(StackEvent.Ended, setEnded)
stack.on(StackEvent.Running, setRunning)

document.addEventListener("touchstart", handleClick)
document.addEventListener("click", handleClick)
document.addEventListener("touchmove", e => e.preventDefault())

function handleClick(e) {
    e.preventDefault()

    switch (stack.state) {
        case StackState.Ready:
            stack.start()
            break;
        case StackState.Runnning:
            stack.match()
            break
        case StackState.Ended:
            stack.reset()
            break
    }
}

// debug
window.scene = scene
window.THREE = require("three")