import React from "react"
import Only from "./Only"
import { useSelector } from "react-redux"
import { getState, getStackSize } from "../store/selectors/stack"
import Config from "../Config"

export default function Ui() {
    let state = useSelector(getState)
    let score = useSelector(getStackSize)

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
