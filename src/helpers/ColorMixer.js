import Color from "./Color"

export default class ColorMixer {
    static colors = ["red","yellow","green", "orange", "purple"]
    static i = 0
    static j = 0
    static current

    static next(){ 
        let left = new Color(this.colors[this.i])
        let right = new Color(this.colors[this.i + 1 >= this.colors.length ? 0 : this.i + 1])
        let blend = left.mix(right, this.j / 10)

        this.current = blend
        this.j++

        if (this.j > 10) {
            this.j = 0

            if (this.i + 1 >= this.colors.length) {
                this.i = 0
            } else {
                this.i++
            }
        }

        return blend
    }
}
 