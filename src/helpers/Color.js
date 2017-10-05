import { Color as Color3 } from "three"

export default class Color extends Color3 {
    mix(color, weight = .5) {
        var w = 2 * weight - 1;
        var a = 0;

        var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
        var w2 = 1 - w1;

        this.r = w1 * color.r + w2 * this.r
        this.g = w1 * color.g + w2 * this.g
        this.b = w1 * color.b + w2 * this.b

        return this
    }
}