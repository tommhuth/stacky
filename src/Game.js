import Camera from "./components/Camera"
import { EffectComposer } from "@react-three/postprocessing"
import { Suspense, useEffect } from "react"
import { CannonProvider } from "./utils/cannon"
import { match, reset, start, State, store, useStore } from "./utils/store"
import Stack from "./components/Stack"
import Background from "./components/Background"
import { palette } from "./utils/color"

export default function Game() {
    let id = useStore(i => i.id)

    useEffect(() => {
        let onClick = (e) => {  
            e.preventDefault()
            let state = store.getState().state

            switch (state) {
                case State.IDLE:
                    return start()
                case State.ACTIVE:
                    return match()
                case State.GAME_OVER:
                    return reset()
            }
        }

        window.addEventListener("mousedown", onClick)
        window.addEventListener("touchstart", onClick, {passive: false})

        return () => {
            window.removeEventListener("mousedown", onClick)
            window.removeEventListener("touchstart", onClick)
        }
    }, [])

    return (
        <>
            <fog near={18} far={44} color={palette[1]} attach="fog" />
            <Camera key={id} />

            <directionalLight
                color={0xffffff}
                position={[-6, 8, -5]}
                intensity={1}
            />
            <ambientLight color={0xffffff} intensity={.7} />

            <Background />

            <CannonProvider axisIndex={1}>
                <Stack key={id} />
            </CannonProvider>

            <Suspense fallback={null}>
                <EffectComposer />
            </Suspense>
        </>
    )
}