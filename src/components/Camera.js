import React, { useState, useEffect, createRef } from "react" 
import { useThree, useRender } from "react-three-fiber"
import { Vector3, Fog } from "three"
import Config from "../Config"
import { useStore } from "../data/store" 

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
    const stackSize = useStore(state => state.slices.length)
    const ref = createRef()
    const { setDefaultCamera, scene } = useThree()
    const state = useStore(state => state.state)
    const [intermediateY, setIntermediateY] = useState(5)
    const [zoom, setZoom] = useState(getZoom())
    const x = Config.SLICE_SIZE
    const z = Config.SLICE_SIZE
    const target = [0, 0, 0]

    useEffect(() => {
        ref.current.lookAt(new Vector3(...target))
        window.addEventListener("resize", () => setZoom(getZoom()))
        scene.fog = new Fog(0x397fbf, 7, 16)
    }, [])

    useRender(() => {
        const gameOverOffset  = state === Config.STATE_GAME_OVER ? .5 : 0
        const targetY = [Config.STATE_ACTIVE, Config.STATE_GAME_OVER].includes(state) ? stackSize * Config.SLICE_HEIGHT + 5 + gameOverOffset : 5

        setIntermediateY(prev => prev + ((targetY - prev) / 20))
    }, false, [stackSize, state])

    return (
        <orthographicCamera
            left={-10}
            right={10}
            top={10}
            bottom={-10}
            near={-10}
            far={20}
            zoom={zoom}
            position={[x, intermediateY, z]}
            ref={ref}
            onUpdate={self => {
                setDefaultCamera(self)
            }}
        />
    )
}
