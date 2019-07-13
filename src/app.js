import React from "react"
import { Provider } from "react-redux"
import ReactDOM from "react-dom"
import Stack from "./stack/Stack"
import makeStore from "./store/make-store"
import { Canvas } from "react-three-fiber" 
import { CannonProvider } from "./utils/cannon"
import Camera from "./Camera"

const store = makeStore()
  
ReactDOM.render(
    <> 
        <div style={{ height: "100vh", width: "100vw" }}>
            <Canvas>
                <Provider store={store}>
                    <Camera /> 
                    <ambientLight color={0xFFFFFF} intensity={1} />
                    <directionalLight
                        shadow-radius={10}
                        castShadow
                        position={[6, 10, 2]}
                        intensity={.5}
                        target-position={[0, 0, 0]}
                    />
                    <CannonProvider>
                        <Stack />
                    </CannonProvider>
                </Provider>
            </Canvas>
        </div>
    </>,
    document.getElementById("root")
)
