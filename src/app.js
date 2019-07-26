import "../assets/style/app.scss"

import React from "react"
import { Provider } from "react-redux"
import ReactDOM from "react-dom"
import Stack from "./components/Stack"
import makeStore from "./store/make-store"
import { Canvas } from "react-three-fiber"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Lights from "./components/Lights" 
import Ui from "./components/Ui"

const store = makeStore()

ReactDOM.render(
    <>
        <Provider store={store}>
            <Ui />
        </Provider>
        <div style={{ height: "100vh", width: "100vw" }}>
            <Canvas pixelRatio={window.matchMedia("(min-width: 1000px)").matches ? Math.min(1.5, window.devicePixelRatio) : window.devicePixelRatio }>
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
