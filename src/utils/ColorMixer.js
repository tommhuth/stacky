import { Color } from "three"

export default class ColorMixer {
    static shades = 16
    static colors = [
        new Color(0x397fbf), // blue
        new Color(0x15b99a), // green
        new Color(0xfffb00), // yellow
        new Color(0xe600ff), // pink #af00db
        new Color(0xd1064d),  // red
        new Color(0xaf00db) // purple
    ]
    static i = 0
    static j = 0
    static _previous = this.colors[0].clone()

    static previous() {
        return this._previous.clone()
    }
    static next() {
        let left = this.colors[this.i]
        let right = this.colors[this.i + 1 >= this.colors.length ? 0 : this.i + 1]
        let blend = left.clone().lerp(right, this.j / this.shades)

        this.j++
        this._previous = blend

        if (this.j > this.shades - 1) {
            this.j = 0

            if (this.i + 1 === this.colors.length) {
                this.i = 0
            } else {
                this.i++
            }
        }

        return blend
    }
    static reset() {
        this.i = 0
        this.j = 2
    }
    static setEnvironment(color) {
        let { r, g, b } = color.clone().lerp(new Color(0x000000), .7)

        document.body.style.backgroundColor = `rgba(
            ${Math.round(r * 255)}, 
            ${Math.round(g * 255)}, 
            ${Math.round(b * 255)}, 
            .3
        )`
    }
}
