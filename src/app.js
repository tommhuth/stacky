import "../assets/style/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Workbox } from "workbox-window"
import Stack from "./components/Stack"
import { Canvas } from "react-three-fiber"
import ColorMixer from "./utils/ColorMixer"
import { CannonProvider } from "./utils/cannon"
import Camera from "./components/Camera"
import Lights from "./components/Lights"
import Ui from "./components/Ui"
import Config from "./Config"

const pixelRatio = window.matchMedia("(min-width:900px)").matches ? Math.min(window.devicePixelRatio, 1.5) : window.devicePixelRatio

ColorMixer.setEnvironment()

ReactDOM.render(
    <>
        <Ui />
        <Canvas pixelRatio={pixelRatio}>
            <CannonProvider defaultFriction={1} defaultRestitution={.2}>
                <Camera />
                <Lights />
                <Stack />
            </CannonProvider>
        </Canvas>
    </>,
    document.getElementById("root")
)

if (Config.REGISTER_SERVICEWORKER) {
    let worker = new Workbox("/serviceworker.js")

    worker.addEventListener("installed", e => {
        console.info(`Service worker ${e.isUpdate ? "updated" : "installed"}`)
    })
    worker.register()
}
