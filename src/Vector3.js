import { Vector3 as Vector3Org, ArrowHelper } from "three"
import scene from "./scene"

export default class Vector3 extends Vector3Org {
    constructor(x,y,z) {
        super(x,y,z)
    }
    normalize(){
        super.normalize()

        return this
    }
    visualize(){
        var dir = new Vector3Org(this.x, this.y, this.z);

        //normalize the direction vector (convert to vector of length 1)
       // dir.normalize();

        var origin = new Vector3Org(0, 0, 0);
        var length = 1;
        var hex = 0xffff00;

        var arrowHelper = new  ArrowHelper(dir, origin, length, hex);
        arrowHelper.position.x = this.x
        arrowHelper.position.y = this.y
        arrowHelper.position.z = this.z
        arrowHelper.scale.set(15,15,15)
        scene.add(arrowHelper);
    }
}