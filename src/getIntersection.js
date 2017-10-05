import { Box3 } from "three"
import { Vector3 } from "./Vector"

export const SliceType = {
    Right: "right",
    Left: "left",
    Top: "top",
    Bottom: "bottom"
}

function diff(b1, b2) {
    let { x, z } = b2.getSize()
    let right = new Box3().copy(b2).translate(new Vector3(-x, 0, 0)).intersect(b1)
    let left = new Box3().copy(b2).translate(new Vector3(x, 0, 0)).intersect(b1)
    let top = new Box3().copy(b2).translate(new Vector3(0, 0, z)).intersect(b1)
    let bottom = new Box3().copy(b2).translate(new Vector3(0, 0, -z)).intersect(b1)

    return [
        {
            ...right.getCenter(),
            x: right.getCenter().x - .5,
            width: right.getSize().x,
            height: right.getSize().y,
            depth: right.getSize().z,
            type: "right"
        },
        {
            ...left.getCenter(),
            x: left.getCenter().x + .5,
            width: left.getSize().x,
            height: left.getSize().y,
            depth: left.getSize().z,
            type: "left"
        },
        {
            ...top.getCenter(),
            z: top.getCenter().z + .5,
            width: top.getSize().x,
            height: top.getSize().y,
            depth: top.getSize().z,
            type: "top"
        },
        {
            ...bottom.getCenter(),
            z: bottom.getCenter().z - .5,
            width: bottom.getSize().x,
            height: bottom.getSize().y,
            depth: bottom.getSize().z,
            type: "bottom"
        },
    ].filter(i => i.width > .1 && i.depth > .1)
}

export default function (current, previous) {
    let b1 = new Box3().setFromObject(current)
    let b2 = new Box3().setFromObject(previous).translate(new Vector3(0, 5, 0))
    let dff = diff(b1.clone(), b2.clone())
    let intersection = b1.intersect(b2)

    if (!b2.intersectsBox(b1)) {
        return {
            hasIntersection: false
        }
    }

    return {
        hasIntersection: true,
        width: intersection.getSize().x,
        depth: intersection.getSize().z,
        height: intersection.getSize().y,
        x: intersection.getCenter().x,
        z: intersection.getCenter().z,
        y: intersection.getCenter().y,
        leftovers: dff
    }
}