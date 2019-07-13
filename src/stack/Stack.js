
import React, { useEffect } from "react"
import { useDispatch, useStore } from "react-redux"
import { Box3, Vector3 } from "three"
import { getSlices, getOffsetAxis, getSliceOffset } from "../store/selectors/stack"
import { setState, invertOffsetAxis, addSlice, addFragment, resetOffset } from "../store/actions/stack"
import Config from "../Config"
import Fragments from "./Fragments"
import TopSlice from "./TopSlice"
import Slices from "./Slices"
import { getPositionWithOffset, getOffset } from "../utils/helpers"
import { bindActionCreators } from "redux"
import { useMemo } from "react"

export function useActions(actions = [], deps = []) {
    const dispatch = useDispatch()

    return useMemo(() => {
        let result = {}

        for (let action of actions) {
            result[action.name] = bindActionCreators(action, dispatch)
        }

        return result
    }, [dispatch, ...deps])
}

export default function Stack() {
    let store = useStore()
    let actions = useActions([
        addSlice,
        addFragment,
        setState,
        resetOffset,
        invertOffsetAxis
    ])

    useEffect(() => {
        const handleClick = () => {
            let state = store.getState()
            let slices = getSlices(state)
            let sliceOffset = getSliceOffset(state)
            let offsetAxis = getOffsetAxis(state)
            let prev = slices[slices.length - 1]
            let bottom = new Box3(
                new Vector3(
                    prev.position[0] - prev.size[0] / 2,
                    prev.position[1] - prev.size[1] / 2,
                    prev.position[2] - prev.size[2] / 2
                ),
                new Vector3(
                    prev.position[0] + prev.size[0] / 2,
                    prev.position[1] + prev.size[1] / 2,
                    prev.position[2] + prev.size[2] / 2
                )
            )
            let top = bottom.clone().translate(
                new Vector3(
                    offsetAxis === "x" ? getOffset(sliceOffset) : 0,
                    0,
                    offsetAxis === "z" ? getOffset(sliceOffset) : 0
                )
            )
            let bottomSize = bottom.getSize(new Vector3())
            let y = slices.length * Config.SLICE_HEIGHT

            if (bottom.intersectsBox(top)) {
                let intersection = bottom.clone().intersect(top)
                let size = intersection.getSize(new Vector3())
                let center = intersection.getCenter(new Vector3())
                let sizeOffsets = offsetAxis === "x" ? [bottomSize.x, -bottomSize.x] : [bottomSize.z, -bottomSize.z]

                for (let offset of sizeOffsets) {
                    let offsetBottom = bottom.clone().translate(
                        new Vector3(
                            offsetAxis === "x" ? offset : 0,
                            0,
                            offsetAxis === "z" ? offset : 0
                        )
                    )

                    if (offsetBottom.intersectsBox(top)) {
                        let offsetLeft = offsetBottom.clone().intersect(top)
                        let size = offsetLeft.getSize(new Vector3())
                        let center = offsetLeft.getCenter(new Vector3())

                        actions.addFragment({
                            position: [center.x, y, center.z],
                            size: [size.x, Config.SLICE_HEIGHT, size.z],
                            mass: size.x * Config.SLICE_HEIGHT * size.z
                        })
                    }
                }

                actions.addSlice({
                    position: [center.x, y, center.z],
                    size: [size.x, Config.SLICE_HEIGHT, size.z],
                    mass: 0
                })
            } else {
                let size = bottom.getSize(new Vector3())
                let center = bottom.getCenter(new Vector3())

                actions.setState(Config.STATE_GAME_OVER)

                actions.addFragment({
                    position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                    size: [size.x, Config.SLICE_HEIGHT, size.z],
                    mass: size.x * Config.SLICE_HEIGHT * size.z
                })
            }

            actions.resetOffset()
            actions.invertOffsetAxis()
        }

        window.addEventListener("click", handleClick)

        return () => window.removeEventListener("click", handleClick)
    }, [])

    return (
        <>
            <TopSlice />
            <Slices />
            <Fragments />
        </>
    )
}
