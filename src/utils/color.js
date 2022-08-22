import { Color } from "three"

const palette = [
    new Color(0x15b99a), // green  
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
] 
const shades = 12

export function getMajorColorAt(i) {
    return Math.floor(i / shades) % palette.length
}

export function getColorAt(i) {
    let major = getMajorColorAt(i)
    let minor = (i - major * shades) % shades
    let bottom = palette[major]
    let top = palette[major + 1] || palette[0]

    return new Color().lerpColors(bottom, top, minor / shades)
}

export function getLuma(r, g, b) {
    return .299 * r + .587 * g + .114 * b
}

export { shades, palette }