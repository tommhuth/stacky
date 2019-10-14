import React from "react"
import Config from "../Config"
import { useStore } from "../data/store"

export default function Lights() {
    const stackSize = useStore(state => state.slices.length)

    return (
        <>
            <ambientLight
                color={0xFFFFFF}
                intensity={.25}
            />
            <directionalLight
                color={0xFFFFFF}
                position={[0, stackSize * Config.SLICE_HEIGHT, 0]}
                intensity={1.09}
                target-position={[-6, stackSize * Config.SLICE_HEIGHT - 10, -2]}
                onUpdate={self => {
                    self.target.updateMatrixWorld()
                }}
            />
            <directionalLight
                color={0xFFFFFF}
                position={[0, stackSize * Config.SLICE_HEIGHT, 0]}
                intensity={.1}
                target-position={[-6, stackSize * Config.SLICE_HEIGHT - 10, -2]}
                onUpdate={self => {
                    self.target.updateMatrixWorld()
                }}
            />
        </>
    )
}
