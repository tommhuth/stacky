import * as stackActions from "./creators/stack"

export function addSlice(slice) {
    return async function (dispatch) {
        dispatch(stackActions.addSlice(slice))
    }
}

export function addFragment(fragment) {
    return async function (dispatch) {
        dispatch(stackActions.addFragment(fragment))
    }
}

export function incrementOffset() {
    return async function (dispatch) {
        dispatch(stackActions.incrementOffset())
    }
}

export function resetOffset() {
    return async function (dispatch) {
        dispatch(stackActions.resetOffset())
    }
}

export function setState(state) {
    return async function (dispatch) {
        dispatch(stackActions.setState(state))
    }
}

export function invertOffsetAxis() {
    return async function (dispatch) {
        dispatch(stackActions.invertOffsetAxis())
    }
}
