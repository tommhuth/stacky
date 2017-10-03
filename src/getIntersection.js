import { Box3, Vector3 } from "three"

function diff(b1, b2) {
    let { x, z } = b2.getSize()
    let right = new Box3().copy(b2).translate(new Vector3(-x, 0, 0)).intersect(b1) 
    let left = new Box3().copy(b2).translate(new Vector3(x, 0, 0)).intersect(b1) 
    let top = new Box3().copy(b2).translate(new Vector3(0, 0, z)).intersect(b1) 
    let bottom = new Box3().copy(b2).translate(new Vector3(0, 0, -z)).intersect(b1) 
    
    return [
        { 
            ...right.getCenter(),
            width: right.getSize().x,
            height: right.getSize().y,
            depth: right.getSize().z,
        },
        {
            ...left.getCenter(),
            width: left.getSize().x,
            height: left.getSize().y,
            depth: left.getSize().z,
        },
        {
            ...top.getCenter(),
            width: top.getSize().x,
            height: top.getSize().y,
            depth: top.getSize().z,
        },
        {
            ...bottom.getCenter(),
            width: bottom.getSize().x,
            height: bottom.getSize().y,
            depth: bottom.getSize().z,
        }, 
    ]
}

export default function (current, previous) {
    let b1 = new Box3().setFromObject(current)
    let b2 = new Box3().setFromObject(previous).translate(new Vector3(0, 5, 0)) 
    let dff = diff(b1.clone(), b2.clone()) 
    let intersection = b1.intersect(b2)   

    if (!b2.intersectsBox(b1)) {
        throw new Error("game over!")
    }
    
    return {
        width: intersection.getSize().x,
        depth: intersection.getSize().z,
        height: intersection.getSize().y,
        x: intersection.getCenter().x,
        z: intersection.getCenter().z, 
        y: intersection.getCenter().y, 
        leftover: dff
    }
}