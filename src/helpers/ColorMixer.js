import Color from "./Color"
import arrayShuffle from "array-shuffle"

const background = 0xC2C1C2

export default class ColorMixer {
    static maxShades = 20
    static colors = [0x397FBF, 0x79B99A, 0xD1414D]
    static i = 0
    static j = 0

    static next() {
        let left = new Color(this.colors[this.i])
        let right = new Color(this.colors[this.i + 1 >= this.colors.length ? 0 : this.i + 1])
        let blend = left.mix(right, this.j / this.maxShades)

        this.j++

        if (this.j > this.maxShades - 1) {
            this.j = 0

            if (this.i + 1 >= this.colors.length) {
                this.i = 0
            } else {
                this.i++
            }
        }

        this.setBackgroundColor(blend)

        return blend
    }

    static setBackgroundColor(color) {
        document.getElementsByClassName("background")[0].style.backgroundColor = color.getHexString()
    }

    static reset() {
        this.i = 0
        this.j = 0
    }
}
