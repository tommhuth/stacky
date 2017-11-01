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
            x: right.getCenter().x - .25,
            size: right.getSize(), 
            type: SliceType.Right
        },
        {
            ...left.getCenter(),
            x: left.getCenter().x + .25,
            size: left.getSize(), 
            type: SliceType.Left
        },
        {
            ...top.getCenter(),
            z: top.getCenter().z + .25,
            size: top.getSize(), 
            type: SliceType.Top
        },
        {
            ...bottom.getCenter(),
            z: bottom.getCenter().z - .25,
            size: bottom.getSize(), 
            type: SliceType.Bottom
        },
    ].filter(i => i.size.x > 0 && i.size.z > 0)
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