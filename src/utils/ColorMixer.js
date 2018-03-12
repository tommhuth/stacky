
import { Color3 as Color } from "babylonjs"

export default class ColorMixer {
    static maxShades = 8
    static colors = [
        Color.White(),
        new Color(57 / 255, 127 / 255, 191 / 255), 
        new Color(21 / 255, 185 / 255, 154 / 255), 
        new Color(209 / 255, 6 / 255, 77 / 255)
    ]
    static i = 0
    static j = 2

    static mix(color1, color2, weight = .5) {
        color1 = color1.clone()
        color2 = color2.clone()
        var w = 2 * weight - 1;
        var a = 0;

        var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;
        var w2 = 1 - w1;

        color2.r = (w1 * color1.r + w2 * color2.r)
        color2.g = (w1 * color1.g + w2 * color2.g)
        color2.b = (w1 * color1.b + w2 * color2.b)

        return color2
    }

    static next() {
        let left = this.colors[this.i] 
        let right = this.colors[this.i + 1 >= this.colors.length ? 0 : this.i + 1] 
        let blend = this.mix(right, left, this.j / this.maxShades)

        if(this.j % 2 === 0){ 
            this.setBackground(blend)
        }

        this.j++

        if (this.j > this.maxShades - 1) {
            this.j = 0

            if (this.i + 1 >= this.colors.length) {
                this.i = 0
            } else {
                this.i++
            }
        }

        return blend
    }

    static reset() {
        this.i = 0
        this.j = 0
    }

    static setBackground(color) {  
        document.body.style.backgroundColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, .4)`
    }
}
