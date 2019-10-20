import "../assets/style/app.scss"

import React from "react"
import ReactDOM from "react-dom"
import { Workbox } from "workbox-window"
import Stack from "./components/Stack"
import { Canvas  } from "react-three-fiber"
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
        <Canvas
            orthographic
            pixelRatio={pixelRatio}
            camera={{
                position: [Config.SLICE_SIZE, 5, Config.SLICE_SIZE],
                zoom: 50,
                left: -10,
                right: 10,
                top: 10,
                bottom: -10,
                near: -10,
                far: 20
            }}
        >
            <CannonProvider defaultFriction={1} defaultRestitution={.62}>
                <Lights />
                <Camera />
                <Stack />
            </CannonProvider>
            <fog args={[0x397fbf, 6, 20]} attach={"fog"} />
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
