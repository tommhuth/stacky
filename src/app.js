import { Stack, StackState, StackEvent } from "./world/Stack"
import { scene, engine } from "./world/scene"
import { setScore, setReady, setEnded, setRunning } from "./ui"

const stack = new Stack()

stack.on(StackEvent.ScoreChange, setScore)
stack.on(StackEvent.Ready, setReady)
stack.on(StackEvent.Ended, setEnded)
stack.on(StackEvent.Running, setRunning)

function eventHandler() {
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
}

document.addEventListener("click", eventHandler)
document.addEventListener("touchstart", (e) => {
    e.preventDefault()
    eventHandler()
})

engine.runRenderLoop(() => {
    stack.clean()
    scene.render()
})