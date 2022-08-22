import create from "zustand"
import random from "@huth/random"
import { getColorAt } from "./color"
import { Box3, Vector3 } from "three"

export const State = {
    GAME_OVER: "gameover",
    IDLE: "idle",
    ACTIVE: "active",
}

export const SliceType = {
    FRAGMENT: "fragment",
    SLICE: "slice",
}

const startCount = 1
const init = {
    state: State.IDLE,
    stack: {
        parts: new Array(startCount).fill().map((i, index) => ({
            id: random.id(),
            size: [5, 1, 5],
            index,
            mass: 0,
            type: SliceType.SLICE,
            position: [0, index, 0],
            color: getColorAt(index)
        })).reverse(),
        height: startCount - 1,
        index: startCount - 1,
        maxIndex: 600,
        instance: null,
        slice: null,
        axis: "z",
        axisFlipped: false,
    },
    highscore: null,
    id: random.id()
}

const store = create(() => ({ ...init }))
const useStore = store


function isBoxEmpty(box) {
    return !((box.max.x > box.min.x) && (box.max.y > box.min.y) && (box.max.z > box.min.z))
}

function difference(top = new Box3(), bottom = new Box3()) {
    let bottomSize = bottom.getSize(new Vector3()).addScalar(.0001)
    let offsets = [[-bottomSize.x, 0, 0], [bottomSize.x, 0, 0], [0, 0, -bottomSize.z], [0, 0, bottomSize.z]]

    if (!top.intersectsBox(bottom)) {
        return top.clone()
    }

    for (let offset of offsets) {
        let result = bottom.clone().translate(new Vector3(...offset)).intersect(top)

        if (!isBoxEmpty(result)) {
            return result
        }
    }

    return null
}


export function match() {
    let { state, stack } = store.getState()
    let { index, parts, height, axisFlipped, axis, slice, maxIndex } = stack

    if (state === State.ACTIVE && slice) { 
        let center = new Vector3()
        let size = new Vector3()
        let topSlice = parts.find(i => i.type === SliceType.SLICE)
        let top = new Box3().setFromObject(slice)
        let bottom = new Box3().setFromCenterAndSize(
            new Vector3(topSlice.position[0], topSlice.position[1] + 1, topSlice.position[2]),
            new Vector3(...topSlice.size)
        )
        let deintersection = difference(top, bottom)
        let intersection = top.intersect(bottom)
        let newParts = []
        let color = getColorAt(height + 1, 1)

        if (deintersection && !isBoxEmpty(deintersection)) {
            deintersection.getCenter(center)
            deintersection.getSize(size)

            newParts.push({
                size: size.toArray(),
                position: [center.x, topSlice.position[1] + 1, center.z],
                color,
                type: SliceType.FRAGMENT,
            })
        }

        intersection.getCenter(center)
        intersection.getSize(size)

        if (!isBoxEmpty(intersection)) {
            newParts.push({
                size: size.toArray(),
                position: [center.x, topSlice.position[1] + 1, center.z],
                color,
                type: SliceType.SLICE,
            })
        } else {
            end()
        }

        store.setState({
            stack: {
                ...stack,
                height: height + newParts.filter(i => i.type === SliceType.SLICE).length,
                parts: [
                    ...newParts.map((i) => {
                        return {
                            ...i,
                            id: random.id(),
                            index: ++index % maxIndex
                        }
                    }),
                    ...parts,
                ],
                index: index % maxIndex,
                axis: axis === "x" ? "z" : "x",
                axisFlipped: !axisFlipped,
            }
        })
    }
}

export function setAxis(axis) {
    store.setState({
        stack: {
            ...store.getState().stack,
            axis
        }
    })
}

export function setSlice(obj) {
    store.setState({
        stack: {
            ...store.getState().stack,
            slice: obj
        }
    })
}

export function setAxisFlipped(value) {
    store.setState({
        stack: {
            ...store.getState().stack,
            axisFlipped: value
        }
    })
}

export function end() {
    store.setState({
        state: State.GAME_OVER,
    })
}

export function start() {
    store.setState({
        state: State.ACTIVE,
    })
}

export function reset() {
    store.setState({
        ...init,
        state: State.ACTIVE,
        highscore: store.getState().stack.height,
        id: random.id()
    })
}

export function setInstance(instance) {
    store.setState({
        stack: {
            ...store.getState().stack,
            instance,
        }
    })
}

export function addParts(parts = []) {
    let { index, height, maxIndex } = store.getState().stack

    store.setState({
        stack: {
            ...store.getState().stack,
            height: parts.some(i => i.type === SliceType.SLICE) ? height + 1 : height,
            parts: [
                ...parts.map((i) => {
                    return {
                        ...i,
                        id: random.id(),
                        index: ++index % maxIndex
                    }
                }),
                ...store.getState().stack.parts,
            ],
            index: index % maxIndex,
        }
    })
}

export function removePart(id) {
    store.setState({
        stack: {
            ...store.getState().stack,
            parts: store.getState().stack.parts.filter(i => i.id !== id),
        }
    })
}

export { store, useStore }