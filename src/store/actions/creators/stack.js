export const StackAction = {
    ADD_SLICE: "stack:add-slice",
    ADD_FRAGMENT: "stack:add-fragment",
    INCREMENT_OFFSET: "stack:increment-offset",
    RESET_OFFSET: "stack:reset-offset",
    INVERT_OFFSET_AXIS: "stack:invert-offset-axis",
    SET_STATE: "stack:set-state",
    RESET: "stack:reset",
    SET_DIRECT_HITS: "stack:set-direct-hits"
}

export function setDirectHits(count) {
    return {
        type: StackAction.SET_DIRECT_HITS,
        payload: count
    }
}

export function addSlice(slice) {
    return {
        type: StackAction.ADD_SLICE,
        payload: slice
    }
}

export function addFragment(fragment) {
    return {
        type: StackAction.ADD_FRAGMENT,
        payload: fragment
    }
}

export function incrementOffset() {
    return {
        type: StackAction.INCREMENT_OFFSET
    }
}
export function reset() {
    return {
        type: StackAction.RESET
    }
}

export function resetOffset() {
    return {
        type: StackAction.RESET_OFFSET
    }
}

export function setState(state) {
    return {
        type: StackAction.SET_STATE,
        payload: state
    }
}

export function invertOffsetAxis() {
    return {
        type: StackAction.INVERT_OFFSET_AXIS
    }
}

