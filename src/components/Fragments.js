import React from "react"
import { useStore } from "../data/store"
import Slice from "./Slice"

export default function Fragments() {
    const fragments = useStore(state => state.fragments)

    return (
        <>
            {fragments.map(({ color, position, size, id }) => {
                return (
                    <Slice
                        color={color}
                        key={id}
                        position={position}
                        mass={size[0] * size[2]}
                        size={size}
                    />
                )
            })}
        </>
    )
}
