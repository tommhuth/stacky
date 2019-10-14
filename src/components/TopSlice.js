import React, { useState, useEffect, useRef } from "react"
import { useRender } from "react-three-fiber"
import Config from "../Config"
import { getPositionWithOffset } from "../utils/helpers"
import Only from "./Only"
import Slice from "./Slice"
import ColorMixer from "../utils/ColorMixer"
import { useStore, api } from "../data/store" 

export default function TopSlice() {
    let offsetAxis = useStore(state => state.offsetAxis)
    let state = useStore(state => state.state)
    let prev = useStore(state => state.slices[state.slices.length - 1])
    let slices = useStore(state => state.slices)
    let incrementOffset = useStore(state => state.incrementOffset)
    let [color, setColor] = useState()
    let ref = useRef() 

    useRender(() => {
        if (state === Config.STATE_ACTIVE) {
            incrementOffset()
        }
    }, false, [state])

    useEffect(() => {
        if (state === Config.STATE_ACTIVE) {
            return api.subscribe(
                (sliceOffset) => {
                    let position = getPositionWithOffset(
                        prev.position[0],
                        slices.length * Config.SLICE_HEIGHT,
                        prev.position[2],
                        sliceOffset,
                        offsetAxis
                    )

                    ref.current.position.set(...position)
                },
                state => state.sliceOffset
            )
        }
    }, [state, offsetAxis, slices, prev, ref.current])

    useEffect(() => {
        setColor(ColorMixer.next())
    }, [slices.length])

    return (
        <Only if={state === Config.STATE_ACTIVE}>
            <Slice
                color={color}
                size={[prev.size[0], Config.SLICE_HEIGHT, prev.size[2]]}
                mass={0}
                ref={ref}
                position={getPositionWithOffset(
                    prev.position[0],
                    slices.length * Config.SLICE_HEIGHT,
                    prev.position[2],
                    0,
                    offsetAxis
                )}
            />
        </Only>
    )
}
