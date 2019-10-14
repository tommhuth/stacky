import React from "react"
import { useStore } from "../data/store"
import Slice from "./Slice"

export default function Fragments() {
    const fragments = useStore(state => state.fragments)

    return (
        <>
            {fragments.map((i, index) => {
                return <Slice color={i.color} key={index} position={i.position} mass={i.mass} size={i.size} />
            })}
        </>
    )
}
