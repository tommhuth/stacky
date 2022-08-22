import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useLayoutEffect } from "react" 
import { SliceType, State, store } from "../utils/store"
import { map } from "../utils/utils"

export const cameraStartY = 15

export function getZoomValue() {
    return map(window.innerWidth, 400, 1200, 34, 65)
}

export default function Camera({ startPosition = [10, cameraStartY, -10] }) {
    let { camera, viewport } = useThree() 

    useLayoutEffect(() => {
        camera.position.set(...startPosition)
        camera.zoom = map(window.innerWidth, 400, 1000, 30, 70)
        camera.near = -10
        camera.updateProjectionMatrix()
        camera.lookAt(0, 0, 0)
        camera.position.y = cameraStartY * .5 
    }, [camera, ...startPosition]) 

    useEffect(()=> {
        camera.zoom = getZoomValue()
        camera.updateProjectionMatrix() 
    }, [camera, viewport])

    useFrame(() => {
        let { stack, state } = store.getState()
        let isGameOver = state === State.GAME_OVER
        let topSlice = stack.parts.find(i => i.type === SliceType.SLICE)
        let targetX = isGameOver ? startPosition[0] : topSlice.position[0] + startPosition[0]
        let targetZ = isGameOver ? startPosition[2] : topSlice.position[2] + startPosition[2]

        camera.position.x += (targetX - camera.position.x) * (isGameOver ? .05 : .005)
        camera.position.y += (stack.height - (isGameOver ? startPosition[1] * .75 : 0) + startPosition[1] - camera.position.y) * (isGameOver ? .05 : .025)
        camera.position.z += (targetZ - camera.position.z) * (isGameOver ? .05 : .005)
  
        if (isGameOver) {
            let targetZoom = getZoomValue() * (isGameOver ? .7 : 1)

            camera.zoom += (targetZoom - camera.zoom) * .01

            if (Math.abs(targetZoom - camera.zoom) > .001) {
                camera.updateProjectionMatrix() 
            } else {
                camera.zoom = targetZoom 
            }
        }  
    })

    return null
}