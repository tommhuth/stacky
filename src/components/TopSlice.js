import React, { useState, useEffect, useRef } from "react"
import { useRender } from "react-three-fiber"
import Config from "../Config"
import { getPositionWithOffset } from "../utils/helpers"
import Only from "./Only"
import ColorMixer from "../utils/ColorMixer"
import { useStore, api } from "../data/store"

export default function TopSlice() {
    let state = useStore(state => state.state)
    let offsetAxis = useStore(state => state.offsetAxis)
    let sliceOffset = useStore(state => state.sliceOffset)
    let prev = useStore(state => state.slices[state.slices.length - 1])
    let score = useStore(state => state.score)
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
                    if (sliceOffset) {
                        let position = getPositionWithOffset(
                            prev.position[0],
                            score * Config.SLICE_HEIGHT + Config.SLICE_HEIGHT / 2,
                            prev.position[2],
                            sliceOffset,
                            offsetAxis
                        )

                        // ref.current.position.set(...position)
                    }
                },
                state => state.sliceOffset
            )
        }
    }, [state, ref.current, prev, score, offsetAxis])

    useEffect(() => {
        setColor(ColorMixer.next())
    }, [score])

    return (
        <Only if={state === Config.STATE_ACTIVE}>
            <mesh
                position={getPositionWithOffset(
                    prev.position[0],
                    score * Config.SLICE_HEIGHT + Config.SLICE_HEIGHT / 2,
                    prev.position[2],
                    sliceOffset,
                    offsetAxis
                )}
                ref={ref}
                key={"topslice"}>
                <boxBufferGeometry
                    attach="geometry"
                    args={[prev.size[0], Config.SLICE_HEIGHT, prev.size[2]]}
                />
                <meshPhongMaterial color={color} attach="material" />
            </mesh>
        </Only>
    )
}
