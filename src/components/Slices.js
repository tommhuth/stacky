import React, { useState, useEffect } from "react" 
import Slice from "./Slice"
import anime from "animejs"
import { useStore } from "../data/store"

export default function Slices() {
    let slices = useStore(state => state.slices)
    let [offsetY, setOffsetY] = useState(-20)

    useEffect(() => {
        let targets = { offsetY } 

        anime({
            targets,
            duration: 2500,
            offsetY: 0,
            delay: 500,
            change () {
                setOffsetY(targets.offsetY)
            }
        })
    }, [])

    return (
        <>
            {slices.map((i, index) => {
                return (
                    <Slice
                        directHit={i.directHit}
                        color={i.color}
                        key={index}
                        position={[i.position[0], i.position[1] + offsetY, i.position[2]]}
                        mass={i.mass}
                        size={i.size}
                    />
                )
            })}
        </>
    )
}
