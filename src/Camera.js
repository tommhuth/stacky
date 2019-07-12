
import React, { useState, useEffect, createRef } from "react"
import { useThree, useRender } from "react-three-fiber"
import { Vector3 } from "three"

export default function Camera({
    position: [x, targetY, z] = [0, 0, 0],
    target = [0, 10, 0]
}) {
    const ref = createRef()
    const { setDefaultCamera } = useThree()
    const [intermediateY, setY] = useState(targetY)

    useEffect(() => {
        ref.current.lookAt(new Vector3(...target))
    }, [])

    useRender(() => {
        setY(prev => prev + ((targetY - prev) / 80))
    }, false, [targetY])

    return (
        <orthographicCamera
            left={-50}
            right={50}
            top={50}
            bottom={-50}
            near={.1}
            far={100}
            zoom={35}
            position={[x, intermediateY, z]}
            ref={ref}
            onUpdate={self => {
                setDefaultCamera(self)
            }}
        />
    )
}
