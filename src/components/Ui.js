import React from "react"
import Only from "./Only" 
import Config from "../Config"
import { useStore } from "../data/store"

export default function Ui() {
    let state = useStore(state => state.state)
    let score = useStore(state => state.slices.length)

    return (
        <>
            <h1 className="visually-hidden">Stacky</h1>
            <p className="visually-hidden">A JavaScript Stack clone made with React + Three.</p>

            <Only if={state !== Config.STATE_READY}>
                <div className="panel panel--score">
                    <span className="visually-hidden">Score: </span>{score}
                </div>
            </Only>

            <Only if={state === Config.STATE_GAME_OVER}>
                <div className="panel panel--game-over">
                    Game over
                </div>
                <div className="panel__subtitle">Tap to restart</div>
            </Only>
            <Only if={state === Config.STATE_READY}>
                <div className="panel panel--intro logo">
                    {"Stacky".split("").map((i,index) => <span style={{ animationDelay: (index * 125 + 500) + "ms"}} key={i}>{i}</span>)}
                </div> 
                <div className="panel__subtitle">Tap to start</div>
            </Only>
        </>
    )
}
