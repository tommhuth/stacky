
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { getSlices } from "../store/selectors/stack"
import Slice from "./Slice"
import anime from "animejs"

export default function Slices() {
    let slices = useSelector(getSlices)
    let [offsetY, setOffsetY] = useState(-10)

    useEffect(() => {
        let targets = { offsetY } 

        anime({
            targets,
            duration: 2000,
            offsetY: 0,
            change () {
                setOffsetY(targets.offsetY)
            },
            complete () {
                setOffsetY(0)
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
