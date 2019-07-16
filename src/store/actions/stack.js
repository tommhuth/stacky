import * as stackActions from "./creators/stack"
import { Box3, Vector3 } from "three"
import { getSlices, getOffsetAxis, getSliceOffset, getDirectHits } from "../../store/selectors/stack"
import { getPositionWithOffset, getOffset } from "../../utils/helpers"
import Config from "../../Config"
import ColorMixer from "../../utils/ColorMixer"

export function incrementOffset() {
    return async function (dispatch) {
        dispatch(stackActions.incrementOffset())
    }
}

export function reset() {
    return async function (dispatch) {
        ColorMixer.reset()
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
        let directHits = getDirectHits(state)
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
        let bottomSize = bottom.getSize(new Vector3())
        let y = slices.length * Config.SLICE_HEIGHT
        let distance = bottom.getCenter(new Vector3()).distanceTo(new Vector3(
            bottom.getCenter(new Vector3()).x + (offsetAxis === "x" ? getOffset(sliceOffset) : 0),
            bottom.getCenter(new Vector3()).y,
            bottom.getCenter(new Vector3()).z + (offsetAxis === "z" ? getOffset(sliceOffset) : 0)
        ))
        let directHit = distance < Config.DIRECT_HIT_THRESHOLD
        let directHitAddition = directHit && directHits + 1 >= Config.DIRECT_HIT_ADDITION_THRESHOLD
        let top = bottom.clone().translate(
            new Vector3(
                offsetAxis === "x" && !directHit ? getOffset(sliceOffset) : 0,
                0,
                offsetAxis === "z" && !directHit ? getOffset(sliceOffset) : 0
            )
        )

        if (directHit && !directHitAddition) {
            dispatch(stackActions.setDirectHits(directHits + 1))
        } else {
            dispatch(stackActions.setDirectHits(0))
        }

        if (bottom.intersectsBox(top)) {
            let intersection = bottom.clone().intersect(top)
            let size = intersection.getSize(new Vector3())
            let center = intersection.getCenter(new Vector3())
            let sizeOffsets = offsetAxis === "x" ? [bottomSize.x, -bottomSize.x] : [bottomSize.z, -bottomSize.z]

            if (!directHit) {
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
                            mass: size.x * Config.SLICE_HEIGHT * size.z,
                            color: ColorMixer.previous()
                        }))
                    }
                }
            }

            dispatch(stackActions.addSlice({
                position: [center.x, y, center.z],
                size: [
                    size.x + (directHitAddition ? .1 : 0),
                    Config.SLICE_HEIGHT,
                    size.z + (directHitAddition ? .1 : 0)
                ],
                mass: 0,
                color: ColorMixer.previous()
            }))
        } else {
            let size = bottom.getSize(new Vector3())
            let center = bottom.getCenter(new Vector3())

            dispatch(stackActions.setState(Config.STATE_GAME_OVER))
            dispatch(stackActions.addFragment({
                position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                size: [size.x, Config.SLICE_HEIGHT, size.z],
                mass: size.x * Config.SLICE_HEIGHT * size.z,
                color: ColorMixer.previous()
            }))
        }

        dispatch(stackActions.resetOffset())
        dispatch(stackActions.invertOffsetAxis())
    }
}

