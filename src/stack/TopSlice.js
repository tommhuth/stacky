
import React, {useState, useEffect} from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRender } from "react-three-fiber"
import { getSlices, getOffsetAxis, getSliceOffset, getLastSlice, getState } from "../store/selectors/stack"
import { incrementOffset } from "../store/actions/stack"
import Config from "../Config"
import { getPositionWithOffset } from "../utils/helpers"
import Only from "./Only"
import Slice from "./Slice"
import ColorMixer from "../utils/ColorMixer"


export default function TopSlice() {
    const dispatch = useDispatch()
    const sliceOffset = useSelector(getSliceOffset)
    const offsetAxis = useSelector(getOffsetAxis)
    const state = useSelector(getState)
    const prev = useSelector(getLastSlice)
    const slices = useSelector(getSlices)
    const [color, setColor] = useState(null)

    useRender(() => {
        if (state === Config.STATE_ACTIVE) {
            dispatch(incrementOffset())
        }
    }, false, [state])

    useEffect(() => {
        setColor(ColorMixer.next())
    },[slices.length])

    return (
        <Only if={state === Config.STATE_ACTIVE}>
            <Slice
                color={color}
                key={slices.length}
                size={[prev.size[0], Config.SLICE_HEIGHT, prev.size[2]]}
                mass={0}
                position={getPositionWithOffset(prev.position[0], slices.length * Config.SLICE_HEIGHT, prev.position[2], sliceOffset, offsetAxis)}
            />
        </Only>
    )
}
