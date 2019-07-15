
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useThree } from "react-three-fiber"
import { PCFSoftShadowMap } from "three"
import Config from "../Config"
import { getStackSize } from "../store/selectors/stack"

export default function Lights() {
    const { gl } = useThree()
    const stackSize = useSelector(getStackSize)

    useEffect(() => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = PCFSoftShadowMap
    }, [])

    return (
        <>
            <ambientLight color={0xf7feff} intensity={.8} />
            <directionalLight  
                position={[0, stackSize * Config.SLICE_HEIGHT, 0]}
                intensity={.2}
                target-position={[-6, stackSize * Config.SLICE_HEIGHT - 10, -2]}
                onUpdate={self => {
                    self.target.updateMatrixWorld() 
                }}
            />
            <directionalLight
                castShadow
                shadow-radius={1}
                position={[0, stackSize * Config.SLICE_HEIGHT, 0]}
                intensity={.1}
                target-position={[-6, stackSize * Config.SLICE_HEIGHT - 10, -2]}
                onUpdate={self => {
                    self.target.updateMatrixWorld()
                    self.shadow.mapSize.width = 1024
                    self.shadow.mapSize.height = 1024
                    self.shadow.camera.near = -5
                    self.shadow.camera.far = 5
                    self.shadow.camera.left = -8
                    self.shadow.camera.right = 8
                    self.shadow.camera.top = 8
                    self.shadow.camera.bottom = -8
                }}
            />
        </>
    )
}
