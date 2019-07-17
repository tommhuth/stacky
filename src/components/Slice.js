
import React, { useState, useEffect, useRef } from "react"
import { Box, Vec3 } from "cannon"
import { DoubleSide } from "three"
import { useCannon } from "../utils/cannon"
import Config from "../Config"
import Only from "./Only"
import anime from "animejs"

export default function Slice({ position, mass = 0, size = [1, 1, 1], color, directHit }) {
    const planeRef = useRef()
    const [body, setBody] = useState(null)
    const [sizeAddition, setSizeAddition] = useState(0) 
    const [opacity, setOpacity] = useState(1) 
    
    const ref = useCannon(
        { mass },
        body => {
            body.addShape(new Box(new Vec3(size[0] / 2, size[1] / 2, size[2] / 2)))
            body.position.set(...position)

            setBody(body)
        }
    )

    useEffect(() => {
        if (body) {
            body.position.set(...position)
        }
    }, [body, position])

    useEffect(() => {
        if (directHit) { 
            let targets = { sizeAddition, opacity }

            anime({
                targets,
                sizeAddition: .5,
                opacity: 0,
                duration: 800,
                delay: 0,
                easing: "easeOutQuart",
                update() {
                    setSizeAddition(targets.sizeAddition) 
                    setOpacity(targets.opacity)
                }
            })
        }
    }, [directHit])

    return (
        <>
            <Only if={directHit}>
                <mesh
                    ref={planeRef}
                    position={[position[0], position[1] + size[1] / 2 - Config.SLICE_HEIGHT, position[2]]}
                    rotation-x={Math.PI / 2}
                >
                    <planeGeometry attach="geometry" args={[size[0] + sizeAddition, size[2] + sizeAddition, 1]} />
                    <meshPhongMaterial transparent opacity={opacity} side={DoubleSide} color={0xFFFFFF} attach="material" />
                </mesh>
            </Only>
            <mesh ref={ref} castShadow receiveShadow>
                <boxGeometry attach="geometry" args={size} />
                <meshPhongMaterial color={color} attach="material" />
            </mesh>
        </>
    )
}
