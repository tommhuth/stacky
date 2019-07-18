import "../assets/style/app.scss"

import React from "react"
import { Provider } from "react-redux"
import ReactDOM from "react-dom"
import Stack from "./components/Stack"
import makeStore from "./store/make-store"
import { Canvas } from "react-three-fiber"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Only from "./components/Only"
import { useSelector } from "react-redux"
import { getState, getStackSize } from "./store/selectors/stack"
import Config from "./Config"
import Lights from "./components/Lights"

function UI() {
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
                    <div className="panel__subtitle">Tap to restart</div>
                </div>
            </Only>
            <Only if={state === Config.STATE_READY}>
                <div className="panel panel--intro">
                    {"Stacky".split().map(i => <span key={i}>{i}</span>)}
                    <div className="panel__subtitle">Tap to start</div>
                </div>
            </Only>
        </>
    )
}

const store = makeStore()

ReactDOM.render(
    <>
        <Provider store={store}>
            <UI />
        </Provider>
        <div style={{ height: "100vh", width: "100vw" }}>
            <Canvas pixelRatio={Math.min(1.25, window.devicePixelRatio)}>
                <Provider store={store}>
                    <CannonProvider defaultFriction={1} defaultRestitution={.2}>
                        <Camera />
                        <Lights />
                        <Stack />
                    </CannonProvider>
                </Provider>
            </Canvas>
        </div>
    </>,
    document.getElementById("root")
)
