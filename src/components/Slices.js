
import React from "react"
import { useSelector } from "react-redux"
import { getSlices } from "../store/selectors/stack"
import Slice from "./Slice"

export default function Slices() {
    const slices = useSelector(getSlices)

    return (
        <>
            {slices.map((i, index) => {
                return <Slice  color={i.color} key={index} position={i.position} mass={i.mass} size={i.size} />
            })}
        </>
    )
}
