import React, { useEffect, useRef } from "react"
import Config from "../Config"

export default function Lights() { 
    let ref = useRef()

    useEffect(() => { 
        ref.current.target.updateMatrixWorld()
    }, [ref.current])

    return (
        <>
            <ambientLight
                color={0xFFFFFF}
                intensity={.6}
            />
            <directionalLight
                ref={ref}
                color={0xFFFFFF}
                position={[0, Config.SLICE_HEIGHT, 0]}
                intensity={.8}
                target-position={[-6, Config.SLICE_HEIGHT - 10, -2]} 
            /> 
        </>
    )
}
