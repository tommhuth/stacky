import { StackAction } from "../actions/creators/stack"
import Config from "../../Config"
 
const init = {
    sliceOffset: 0,
    offsetAxis: "x",
    state: Config.STATE_READY,
    slices: [
        {
            position: [0, -(15 - Config.SLICE_HEIGHT / 2), 0],
            size: [Config.SLICE_SIZE, 30, Config.SLICE_SIZE],
            mass: 0
        }
    ],
    fragments: []
}

export default function (state = init, { type, payload }) {
    switch (type) {
        case StackAction.ADD_SLICE:
            return {
                ...state,
                slices: [
                    ...state.slices,
                    payload
                ]
            }
        case StackAction.ADD_FRAGMENT:
            return {
                ...state,
                fragments: [
                    ...state.fragments,
                    payload
                ]
            }
        case StackAction.INCREMENT_OFFSET:
            return {
                ...state,
                sliceOffset: state.sliceOffset + .0125
            }
        case StackAction.RESET_OFFSET:
            return {
                ...state,
                sliceOffset: 0
            }
        case StackAction.SET_STATE:
            return {
                ...state,
                state: payload
            }
        case StackAction.INVERT_OFFSET_AXIS:
            return {
                ...state,
                offsetAxis: state.offsetAxis === "x" ? "z" : "x"
            }
        default:
            return state
    }
}
