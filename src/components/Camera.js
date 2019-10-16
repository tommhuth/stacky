import React, { useState, useEffect, createRef } from "react"
import { useThree, useRender } from "react-three-fiber"
import { Vector3, Fog } from "three"
import Config from "../Config"
import { useStore } from "../data/store"
import ColorMixer from "../utils/ColorMixer"
import anime from "animejs"

function getZoom() {
    const breakpoints = [
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
            zoom: 65
        },
        {
            breakpoint: "(max-width: 65em)",
            zoom: 85
        },
        {
            breakpoint: "(min-width: 80em)",
            zoom: 100
        },
    ]

    for (let { zoom, breakpoint } of breakpoints) {
        if (window.matchMedia(breakpoint).matches) {
            return zoom
        }
    }

    return 100
}

export default function Camera() {
    const stackSize = useStore(state => state.score)
    const ref = createRef()
    const { setDefaultCamera, scene } = useThree()
    const state = useStore(state => state.state)
    const currentSlice = useStore(state => state.slices[state.slices.length - 1])
    const [zoom, setZoom] = useState(() => getZoom()) 

    useEffect(() => {
        ref.current.position.set(Config.SLICE_SIZE, 5, Config.SLICE_SIZE)
        ref.current.lookAt(new Vector3(0,0,0))

        window.addEventListener("resize", () => setZoom(getZoom()))
        
        scene.fog = new Fog(0x397fbf, 7, 18)
    }, [])

    useRender(() => {
        const gameOverOffset = state === Config.STATE_GAME_OVER ? .25 : 0
        const targetY = [
            Config.STATE_ACTIVE,
            Config.STATE_GAME_OVER
        ].includes(state) ? stackSize * Config.SLICE_HEIGHT + 5 + gameOverOffset : 5

        if (ref.current) { 
            ref.current.position.x += (currentSlice.position[0] + Config.SLICE_SIZE - ref.current.position.x) / 80
            ref.current.position.y += (targetY - ref.current.position.y) / 30
            ref.current.position.z += (currentSlice.position[2] + Config.SLICE_SIZE - ref.current.position.z) / 80
        }
    }, false, [stackSize, currentSlice, state, ref.current])

    useEffect(() => {
        let color = ColorMixer.colors[ColorMixer.i - 1]

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


    return (
        <orthographicCamera
            left={-10}
            right={10}
            top={10}
            bottom={-10}
            near={-10}
            far={20}
            zoom={zoom}
            ref={ref}
            onUpdate={self => {
                setDefaultCamera(self)
            }}
        />
    )
}
