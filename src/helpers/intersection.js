import { Box3 } from "three"
import { Vector3 } from "./Vector"
import { Settings } from "../objects/Stack"

export const SliceType = {
    Right: "right",
    Left: "left",
    Top: "top",
    Bottom: "bottom"
} 

function difference(a, b) {
    let { x, z } = b.getSize()
    let right = new Box3().copy(b).translate(new Vector3(-x, 0, 0)).intersect(a)
    let left = new Box3().copy(b).translate(new Vector3(x, 0, 0)).intersect(a)
    let top = new Box3().copy(b).translate(new Vector3(0, 0, z)).intersect(a)
    let bottom = new Box3().copy(b).translate(new Vector3(0, 0, -z)).intersect(a)

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
    ].filter(i => i.width > .25 && i.depth > .25)
}

export default function (current, previous) {
    let previousPosition = new Vector3(previous.position.x, previous.position.y + 8, previous.position.z)
    let distance = current.position.distanceTo(previousPosition)
    let closeEnough = distance < Settings.ClosenessLeniency
    
    if(closeEnough) { 
        return {
            hasIntersection: true,
            directHit: true,
            width: previous.scale.x,
            depth: previous.scale.z,
            height: previous.scale.y,
            ...previous.position,
            y: current.position.y,
            leftovers: []
        }
    } else { 
        let a = new Box3().setFromObject(current)
        let b = new Box3().setFromObject(previous).translate(new Vector3(0, Settings.SliceHeight, 0))
        let leftovers = difference(a.clone(), b.clone())
        let intersection = a.intersect(b) 

        if (Math.abs(distance) < 1) {

        }

        if (!b.intersectsBox(a)) {
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
            leftovers
        }
    } 
}