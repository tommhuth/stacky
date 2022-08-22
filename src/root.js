import "../assets/styles/app.scss"

import { createRoot as createReactRoot } from "react-dom/client"
import { createRoot as createFiberRoot, extend, events } from "@react-three/fiber"
import { Group } from "three"
import { Workbox } from "workbox-window"
import App from "./App"
import { getZoomValue } from "./components/Camera"
import Ui from "./components/UI" 
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
            zoom: getZoomValue()
        },
        dpr: [1, 1],
        gl: {
            antialias: false,
            depth: true,
            stencil: false,
            alpha: true
        }
    })
    fiberRoot.render(<App />)
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