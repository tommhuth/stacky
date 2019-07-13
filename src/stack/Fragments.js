
import React from "react"
import { useSelector } from "react-redux"
import { getFragments } from "../store/selectors/stack"
import Slice from "./Slice"

export default function Fragments() {
    const fragments = useSelector(getFragments)

    return (
        <>
            {fragments.map((i, index) => {
                return <Slice key={index} position={i.position} mass={i.mass} size={i.size} />
            })}
        </>
    )
}
