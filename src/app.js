import { Stack, StackState, StackEvent } from "./world/Stack"
import { setScore, setReady, setEnded, setRunning } from "./ui"

const stack = new Stack()

stack.on(StackEvent.ScoreChange, setScore)
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