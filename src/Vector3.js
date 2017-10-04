import { Vector3 as ThreeVector3, ArrowHelper } from "three"
import { Vec3 } from "cannon"
import {scene} from "./scene"

export class Vector3 extends ThreeVector3 { 
    normalize(){
        super.normalize()

        return this
    }
    visualize(){
        var dir = new ThreeVector3(this.x, this.y, this.z)  
        var origin = new ThreeVector3(0, 0, 0) 
        var arrowHelper = new ArrowHelper(dir, origin, 5, 0xffff00, 10, 10)

        arrowHelper.position.x = this.x
        arrowHelper.position.y = this.y
        arrowHelper.position.z = this.z
        arrowHelper.scale.set(15,15,15)
        scene.add(arrowHelper)
    }
}

export class VectorC  extends Vec3 {
    visualize() {
        var dir = new ThreeVector3(this.x, this.y, this.z)
        var origin = new ThreeVector3(0, 0, 0)
        var arrowHelper = new ArrowHelper(dir, 5, 1, he0xffff00, 10, 10)

        arrowHelper.position.x = this.x
        arrowHelper.position.y = this.y
        arrowHelper.position.z = this.z
        arrowHelper.scale.set(15, 15, 15)
        scene.add(arrowHelper)
    }
}