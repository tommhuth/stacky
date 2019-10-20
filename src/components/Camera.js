import { useState, useEffect } from "react"
import { useThree, useFrame } from "react-three-fiber"
import { Vector3 } from "three"
import Config from "../Config"
import { useStore } from "../data/store"
import ColorMixer from "../utils/ColorMixer"
import anime from "animejs"

function getZoom() {
    let breakpoints = [
        {
            breakpoint: "(max-width: 30em)",
            zoom: 55
        },
        {
            breakpoint: "(max-width: 40em)",
            zoom: 60
        },
        {
            breakpoint: "(max-width: 45em)",
            zoom: 60
        },
        {
            breakpoint: "(max-width: 65em)",
            zoom: 75
        },
        {
            breakpoint: "(min-width: 80em)",
            zoom: 90
        },
    ]

    for (let { zoom, breakpoint } of breakpoints) {
        if (window.matchMedia(breakpoint).matches) {
            return zoom
        }
    }

    return 90
}

export default function Camera() {
    let { camera } = useThree()
    let stackSize = useStore(state => state.score)
    let state = useStore(state => state.state)
    let currentSlice = useStore(state => state.slices[state.slices.length - 1])
    let [zoom, setZoom] = useState(() => getZoom())
    let { scene } = useThree()

    useFrame(() => {
        let gameOverOffset = state === Config.STATE_GAME_OVER ? .25 : 0
        let targetY = [
            Config.STATE_ACTIVE,
            Config.STATE_GAME_OVER
        ].includes(state) ? stackSize * Config.SLICE_HEIGHT + 5 + gameOverOffset : 5

        if (camera) {
            camera.position.x += (currentSlice.position[0] + Config.SLICE_SIZE - camera.position.x) / 80
            camera.position.y += (targetY - camera.position.y) / 30
            camera.position.z += (currentSlice.position[2] + Config.SLICE_SIZE - camera.position.z) / 80
        }
    })

    useEffect(() => {
        let listener = () => setZoom(getZoom())

        camera.zoom = zoom
        camera.updateProjectionMatrix()

        window.addEventListener("resize", listener)

        return () => window.removeEventListener("resize", listener)
    }, [zoom])

    useEffect(() => {
        camera.position.set(Config.SLICE_SIZE, 5, Config.SLICE_SIZE)
        camera.lookAt(new Vector3(0, 0, 0)) 
    }, [])

    useEffect(() => {
        let color =  ColorMixer.colors[ColorMixer.i - 1]

        anime({
            targets: scene.fog.color,
            r: color.r,
            g: color.g,
            b: color.b,
            duration: 2500,
            easing: "easeOutCubic",
            autoplay: true
        })
    }, [stackSize])

    return null
}
