import React, { useEffect } from "react" 
import { useThree } from "react-three-fiber"
import { PCFSoftShadowMap } from "three"
import Config from "../Config" 
import { useStore } from "../data/store"
 
export default function Lights() {
    const { gl } = useThree()
    const stackSize = useStore(state => state.slices.length)

    useEffect(() => {
        gl.shadowMap.enabled = true
        gl.shadowMap.type = PCFSoftShadowMap  
    }, [])

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
                castShadow 
                color={0xFFFFFF}
                shadow-radius={2}
                position={[0, stackSize * Config.SLICE_HEIGHT, 0]}
                intensity={.1}
                target-position={[-6, stackSize * Config.SLICE_HEIGHT - 10, -2]} 
                onUpdate={self => {
                    self.target.updateMatrixWorld()
                    self.shadow.mapSize.width = 512
                    self.shadow.mapSize.height = 512
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
