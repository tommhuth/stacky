import { StackAction } from "../actions/creators/stack"
import Config from "../../Config"
import ColorMixer from "../../utils/ColorMixer"

const init = {
    sliceOffset: 0,
    offsetAxis: "x",
    state: Config.STATE_READY,
    directHits: 0,
    slices: [
        {
            position: [0, -(Config.BOTTOM_SLICE_HEIGHT / 2 - Config.SLICE_HEIGHT / 2), 0],
            size: [Config.SLICE_SIZE, Config.BOTTOM_SLICE_HEIGHT, Config.SLICE_SIZE],
            mass: 0,
            color: ColorMixer.next()
        }
    ],
    fragments: []
}

export default function (state = { ...init }, { type, payload }) {
    switch (type) {
        case StackAction.RESET:
            return { ...init, state: Config.STATE_ACTIVE } 
        case StackAction.SET_DIRECT_HITS:
            return { ...state, directHits: payload }
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
                sliceOffset: state.sliceOffset + Config.SLICE_SPEED_INCREMENT
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
