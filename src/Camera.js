
import React, { useState, useEffect, createRef } from "react"
import { useSelector } from "react-redux"
import { useThree, useRender } from "react-three-fiber"
import { Vector3 } from "three"
import Config from "./Config"
import { getStackSize } from "./store/selectors/stack"

export default function Camera() {
    const ref = createRef()
    const { setDefaultCamera } = useThree()
    const stackSize = useSelector(getStackSize)
    const targetY = stackSize * Config.SLICE_HEIGHT + 10
    const [intermediateY, setY] = useState(targetY)
    const x = Config.SLICE_SIZE
    const z = Config.SLICE_SIZE
    const target = [0, 0, 0]

    useEffect(() => {
        ref.current.lookAt(new Vector3(...target))
    }, [])

    useRender(() => {
        setY(prev => prev + ((targetY - prev) / 120))
    }, false, [targetY])
     
    return (
        <orthographicCamera
            left={-10}
            right={10}
            top={10}
            bottom={-10}
            near={.1}
            far={100}
            zoom={100}
            position={[x, intermediateY, z]}
            ref={ref}
            onUpdate={self => {
                setDefaultCamera(self)
            }}
        />
    )
}
