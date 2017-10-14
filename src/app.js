import "babel-polyfill"
import { scene, render } from "./scene"
import { physicsLoop } from "./simulation"
import { update as tweenLoop } from "tween.js"
import Stack, { Event, State } from "./objects/Stack"
import { setScore, setReady, setEnded, setRunning } from "./ui"

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

stack.on(Event.ScoreChange, setScore)
stack.on(Event.Ready, setReady)
stack.on(Event.Ended, setEnded)
stack.on(Event.Running, setRunning)

document.addEventListener("touchstart", handleClick)
document.addEventListener("click", handleClick)
document.addEventListener("touchmove", e => e.preventDefault())

function handleClick(e) {
    e.preventDefault()

    switch (stack.state) {
        case State.Ready:
            stack.start()
            break;
        case State.Runnning:
            stack.match()
            break
        case State.Ended:
            stack.reset()
            break
    }
}

// debug
window.scene = scene
window.THREE = require("three")