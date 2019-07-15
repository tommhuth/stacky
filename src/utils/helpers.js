import Config from "../Config"

export function getPositionWithOffset(x, y, z, offset, axis) {
    return [
        x + (getOffset(offset) * (axis === "x" ? 1 : 0)),
        y,
        z + (getOffset(offset) * (axis === "z" ? 1 : 0))
    ]
}

export function getOffset(offset) {
    return Math.cos(offset) * Config.SLICE_SIZE * 1.25
}
