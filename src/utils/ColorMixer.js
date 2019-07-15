import { Color } from "three"

export default class ColorMixer {
    static shades = 8
    static colors = [
        new Color(0xffffff),
        new Color(0x397fbf),
        new Color(0x15b99a),
        new Color(0xd1064d)
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
    static setEnvironment() {
        if (this.j % 2 === 0) {
            let color = this.previous()

            document.body.style.backgroundColor = `rgba(
                ${Math.round(color.r * 255)}, 
                ${Math.round(color.g * 255)}, 
                ${Math.round(color.b * 255)}, 
                .3
            )`
        }
    }
}
