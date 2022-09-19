import "../assets/styles/app.scss"

import { createRoot as createReactRoot } from "react-dom/client"
import { createRoot as createFiberRoot, extend, events } from "@react-three/fiber"
import { Group } from "three"
import { Workbox } from "workbox-window"
import Game from "./Game"
import { cameraStartY, getZoomValue } from "./components/Camera"
import Ui from "./components/Ui" 
import Config from "./Config"

extend({
    Group,
})

const fiberRoot = createFiberRoot(document.getElementById("canvas"))
const reactRoot = createReactRoot(document.getElementById("ui"))

window.addEventListener("resize", () => {
    fiberRoot.configure({
        size: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        orthographic: true,
        linear: true,
        events,
        flat: true,
        camera: {
            zoom: getZoomValue(),
            position: [10, cameraStartY, -10],
        },
        dpr: [1, window.devicePixelRatio * .75],
        gl: {
            antialias: false,
            depth: true,
            stencil: false,
            alpha: true
        }
    })
    fiberRoot.render(<Game />)
})
 
window.dispatchEvent(new Event("resize"))

reactRoot.render(<Ui />)


if (Config.REGISTER_SERVICEWORKER) {
    let worker = new Workbox("/serviceworker.js")

    worker.addEventListener("installed", e => {
        console.info(`Service worker ${e.isUpdate ? "updated" : "installed"}`)
    })
    worker.register()
}