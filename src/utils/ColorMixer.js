import { Color } from "three"
import anime from "animejs"

export default class ColorMixer {
    static shades = 12
    static colors = [
        new Color(0x397fbf), // blue
        new Color(0x15b99a), // green 
        new Color(0xfffb00), // yellow
        new Color(0xd1064d), // red
        new Color(0xffc4eb), // light pink
        new Color(0xaf00db), // purple
        new Color(0xff7700), // orange
        new Color(0xffdd00), // gold
        new Color(0xc2d9ff), // white blue
        new Color(0x14162b), // dark gray blue
        new Color(0xe600ff), // pink 
        new Color(0x2200c9), // bright blue
        new Color(0x76ad00), // moss green
        new Color(0x00e04f), // bright green
        new Color(0x15b99a), // green
        new Color(0x397fbf), // blue
    ]
    static i = 1
    static j = 0
    static top = this.colors[1].clone().lerp(new Color(0xFFFFFF), .4)
    static bottom = this.colors[0].clone().lerp(new Color(0xFFFFFF), .3)
    static _previous = this.colors[0].clone() 

    static previous() {
        return this._previous.clone()
    }
    static next() {
        let left = this.colors[this.i]
        let right = this.colors[this.i + 1 >= this.colors.length ? 1 : this.i + 1]
        let blend = left.clone().lerp(right, this.j / this.shades)

        this.j++
        this._previous = blend

        if (this.j > this.shades - 1) {
            this.j = 0

            if (this.i + 1 === this.colors.length) {
                this.i = 1
            } else {
                this.i++
            }
            this.setEnvironment()
        }

        return blend
    }
    static reset() {
        this.i = 1
        this.j = 0
        this.setEnvironment()
    }
    static setEnvironment() {
        let index = this.i 
        let top = this.colors[index].clone().lerp(new Color(0xFFFFFF), .4) 
        let bottom = this.colors[index - 1].clone().lerp(new Color(0xFFFFFF), .3)
        
        anime
            .timeline({
                duration: 2500,
                easing: "easeInOutQuad",
                autoplay: true,
                update: () => {
                    let topHsl = this.top.getHSL({})
                    let bottomHsl = this.bottom.getHSL({}) 

                    topHsl.l = .8 
                    bottomHsl.l = .8

                    document.body.style.backgroundImage = `linear-gradient(
                        to bottom,
                        hsl(${Math.floor(topHsl.h * 360)}, ${Math.floor(topHsl.s * 100)}%, ${Math.floor(topHsl.l * 100)}%),
                        hsl(${Math.floor(bottomHsl.h * 360)}, ${Math.floor(bottomHsl.s * 100)}%, ${Math.floor(bottomHsl.l * 100)}%)
                    )`
                }
            })
            .add({
                targets: this.top,
                r: top.r,
                g: top.g,
                b: top.b,
            }, 0)
            .add({
                targets: this.bottom,
                r: bottom.r,
                g: bottom.g,
                b: bottom.b,
            }, 0) 
    }
}
