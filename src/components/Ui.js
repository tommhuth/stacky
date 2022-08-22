 
import { State, useStore } from "../utils/store"
import { Only } from "../utils/utils"

export default function Ui() {
    let state = useStore(i => i.state)
    let score = useStore(i => i.stack.height)

    return (
        <>
            <h1 className="visually-hidden">Stacky</h1>
            <p className="visually-hidden">A JavaScript Stack clone made with React + Three.</p>

            <Only if={state !== State.IDLE && score > 0}>
                <div className="panel panel--score">
                    <span className="visually-hidden">Score: </span>{score}
                </div>
            </Only>

            <Only if={state === State.GAME_OVER}>
                <div className="panel panel--game-over">
                    Game over
                </div>
                <div className="panel__subtitle">Tap to restart</div>
            </Only>
            <Only if={state === State.IDLE}>
                <div className="panel panel--intro logo">
                    {"Stacky".split("").map((i,index) => <span style={{ animationDelay: (index * 125 + 500) + "ms"}} key={i}>{i}</span>)}
                </div> 
                <div className="panel__subtitle">Tap to start</div>
            </Only>
        </>
    )
}