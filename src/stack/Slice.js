
import React, { useState, useEffect } from "react" 
import { Box, Vec3 } from "cannon"
import { useCannon } from "../utils/cannon" 

export default function Slice({ position, mass = 0, size = [1, 1, 1] }) { 
    const [color, setColor] = useState("red")
    const [body, setBody] = useState(null)

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
        setColor(0x555555)
    }, []) 

    return (
        <mesh ref={ref} castShadow receiveShadow>
            <boxGeometry attach="geometry" args={size} />
            <meshPhongMaterial color={color} attach="material" />
        </mesh>
    )
}
