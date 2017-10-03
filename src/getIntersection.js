import { Box3, Vector3 } from "three"

function diff(b1, b2, b3) {
    let right = b2.translate(new Vector3(-b2.getSize().x, 0, 0)).intersect(b1) 
    let left = b3.translate(new Vector3(b3.getSize().x , 0, 0)).intersect(b1) 

    return [
        {
            x: right.getCenter().x > 0 ? right.getCenter().x + 1 : right.getCenter().x - 1,
            y: right.getCenter().y,
            height: right.getSize().x
        },
        {
            x: left.getCenter().x > 0 ? left.getCenter().x + 1 : left.getCenter().x - 1,
            y: left.getCenter().y,
            height: left.getSize().x
        }, 
    ]
}

export default function (current, previous) {
    let b1 = new Box3().setFromObject(current)
    let b2 = new Box3().setFromObject(previous).translate(new Vector3(0, 5, 0)) 
    let dff = diff(b1.clone(), b2.clone(), b2.clone()) 
    let intersection = b2.intersect(b1)  
   
    if (!b2.intersectsBox(b1)) {
        throw new Error("game over!")
    }
    
    return { 
        height: intersection.getSize().x, 
        x: intersection.getCenter().x, 
        leftover: dff
    }
}