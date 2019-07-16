export function getSlices(state) {
    return state.stack.slices
}

export function getDirectHits(state) {
    return state.stack.directHits
}

export function getFragments(state) {
    return state.stack.fragments
}

export function getSliceOffset(state) {
    return state.stack.sliceOffset
}

export function getOffsetAxis(state) {
    return state.stack.offsetAxis
}

export function getState(state) {
    return state.stack.state
}

export function getLastSlice(state) {
    return state.stack.slices[state.stack.slices.length - 1]
}

export function getStackSize(state) {
    return state.stack.slices.length - 1
}
