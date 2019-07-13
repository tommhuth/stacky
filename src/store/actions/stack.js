import * as stackActions from "./creators/stack"
import { Box3, Vector3 } from "three"
import { getSlices, getOffsetAxis, getSliceOffset } from "../../store/selectors/stack"
import { getPositionWithOffset, getOffset } from "../../utils/helpers"
import Config from "../../Config"

export function incrementOffset() {
    return async function (dispatch) {
        dispatch(stackActions.incrementOffset())
    }
}

export function reset() {
    return async function (dispatch) {
        dispatch(stackActions.reset())
    }
}

export function start() {
    return async function (dispatch) {
        dispatch(stackActions.setState(Config.STATE_ACTIVE))
    }
}

export function match() {
    return async function (dispatch, getState) {
        let state = getState()
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

                    dispatch(stackActions.addFragment({
                        position: [center.x, y, center.z],
                        size: [size.x, Config.SLICE_HEIGHT, size.z],
                        mass: size.x * Config.SLICE_HEIGHT * size.z
                    }))
                }
            }

            dispatch(stackActions.addSlice({
                position: [center.x, y, center.z],
                size: [size.x, Config.SLICE_HEIGHT, size.z],
                mass: 0
            }))
        } else {
            let size = bottom.getSize(new Vector3())
            let center = bottom.getCenter(new Vector3())

            dispatch(stackActions.setState(Config.STATE_GAME_OVER))
            dispatch(stackActions.addFragment({
                position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                size: [size.x, Config.SLICE_HEIGHT, size.z],
                mass: size.x * Config.SLICE_HEIGHT * size.z
            }))
        }

        dispatch(stackActions.resetOffset())
        dispatch(stackActions.invertOffsetAxis())
    }
}

