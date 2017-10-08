import Slice from "./Slice"
import { Tween, Easing } from "tween.js"

export default class Pillar extends Slice {
    constructor(width, height, depth, sliceHeight) {
        let y = (-height / 2) - (sliceHeight / 2)

        super(width, height, depth, 0, -150, 0, undefined, 0)

        new Tween(this.position)
            .to({ y }, 1500) 
            .onComplete(() => this.body.position.set(0, y, 0))
            .easing(Easing.Cubic.Out)
            .start()
    }
}
