import { Box3, Vector3 } from "three"

export default function (current, previous) {
    let b1 = new Box3().setFromObject(current)
    let b2 = new Box3().setFromObject(previous).translate(new Vector3(0, 5, 0)) 
    let leftover = b2.clone().translate(new Vector3(-b2.getSize().x, 0,0)) 
    let intersection = b2.intersect(b1) 
    let chop = leftover.intersect(b1)
 
 
    if (!b2.intersectsBox(b1)) {
        throw new Error("game over!")
    }
    
    return { 
        height: intersection.getSize().x, 
        x: intersection.getCenter().x, 
        leftover: { 
            x: chop.getCenter().x, 
            y: chop.getCenter().y, 
            height: chop.getSize().x 
        }
    }
}