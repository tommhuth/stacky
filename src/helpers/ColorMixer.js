import Color from "./Color"
import arrayShuffle from "array-shuffle"

export default class ColorMixer {
    static maxShades = 20
    static colors = [0xE70E97, 0xffbb00, 0x00D10F]
    static i = 0
    static j = 0
    static current

    static next() {
        let left = new Color(this.colors[this.i])
        let right = new Color(this.colors[this.i + 1 >= this.colors.length ? 0 : this.i + 1])
        let blend = left.mix(right, this.j / this.maxShades)

        this.current = blend
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
        document.body.style.backgroundColor = new Color(0x001AFF).mix(color, .3).getHexString()
    }
}
