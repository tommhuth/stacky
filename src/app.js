import { Stack, StackState, StackEvent } from "./world/Stack"
import { scene, engine } from "./world/scene"
import { setScore, setReady, setEnded, setRunning, setScoreBonus, init } from "./ui"
 
const stack = new Stack()

stack.on(StackEvent.ScoreChange, setScore)
stack.on(StackEvent.ScoreBonus, setScoreBonus)
stack.on(StackEvent.Ready, setReady)
stack.on(StackEvent.Ended, setEnded)
stack.on(StackEvent.Running, setRunning)

document.addEventListener("click", () => {
    switch (stack.state) {
        case StackState.Ended:
            stack.restart()
            break
        case StackState.Ready:
            stack.start()
            break
        case StackState.Running:
            stack.match()
            break
    }
})

document.querySelector(".fullscreen-button").addEventListener("click", (e) => {
    e.stopPropagation()
    document.body.webkitRequestFullscreen()
})

engine.runRenderLoop(() => {
    stack.clean()
    scene.render()
})

init()