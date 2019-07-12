import React from "react"
import ReactDOM from "react-dom"
import Stack from "./Stack"  
import { Canvas } from "react-three-fiber"
import { CannonProvider } from "./cannon" 

ReactDOM.render(
    <div style={{ height: "100vh", width: "100vw" }}>
        <Canvas>
            <ambientLight color={0xFFFFFF} intensity={.35} />
            <directionalLight 
                castShadow 
                position={[-2, 3, 2]} 
                target-position={[0, 0, 0]} 
            />
            <CannonProvider>
                <Stack />
            </CannonProvider>
        </Canvas>
    </div>,
    document.getElementById("root")
)
