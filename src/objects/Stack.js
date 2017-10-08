import intersection, { SliceType } from "../helpers/intersection"
import Slice from "./Slice"
import Pillar from "./Pillar"
import HitPlane from "./HitPlane"
import { Tween, Easing } from "tween.js"
import { raiseCamera } from "../scene"
import Color from "../helpers/Color"
import timeout from "../helpers/timeout"
import { VectorC } from "../helpers/Vector"

export const Settings = {
    Colors: ["red", "green", "blue", "purple"],
    PillarHeight: 60,
    SliceHeight: 8,
    SliceSize: 35,
    AnimationDuration: 6000,
    AnimationOffset: 65,
    ClosenessLeniency: .65
}

export default class Stack {
    slices = []
    sliceAnimation = new Tween()
    sliceDirection

    constructor() {
        this.init()
    }

    generateLeftovers(leftovers, color) {
        for (let slice of leftovers) {
            let chunk = new Slice(slice.width, slice.height, slice.depth, slice.x, slice.y, slice.z, color)
            let force = (Math.random() + .5) * chunk.body.mass * 2
            let impulse

            switch (slice.type) {
                case SliceType.Top:
                    impulse = new VectorC(0, 0, force)
                    break
                case SliceType.Bottom:
                    impulse = new VectorC(0, 0, -force)
                    break
                case SliceType.Left:
                    impulse = new VectorC(force, 0, 0)
                    break
                case SliceType.Right:
                    impulse = new VectorC(-force, 0, 0)
                    break
            }

            chunk.body.applyLocalImpulse(impulse, new VectorC(0, chunk.scale.y, 0))
        }
    }

    match() {
        let color = Settings.Colors[this.slices.length % Settings.Colors.length]
        let currentSlice = this.slices[this.slices.length - 1]
        let previousSlice = this.slices[this.slices.length - 2]
        let { hasIntersection, height, width, depth, x, y, z, leftovers, directHit } = intersection(currentSlice, previousSlice)

        if (hasIntersection) {
            let nextSlice = new Slice(width, height, depth, x, y + Settings.SliceHeight, z, undefined, 0)

            currentSlice.position.set(x, y, z)
            currentSlice.resize(width, height, depth)

            this.animate(nextSlice)
            this.generateLeftovers(leftovers, currentSlice.material.color)

            this.slices.push(nextSlice)

            if (directHit) {
                new HitPlane(width, depth, x, y, z)
            }
        } else {
            let dropOut = new Slice(currentSlice.scale.x, currentSlice.scale.y, currentSlice.scale.z, currentSlice.position.x, currentSlice.position.y, currentSlice.position.z, currentSlice.material.color)

            currentSlice.remove()
            dropOut.body.applyLocalImpulse(this.sliceDirection.mult(dropOut.body.mass * 10), new VectorC(0, 5, 0))
        }
    }

    animate(slice) {
        let position = slice.position
        let offset = Settings.AnimationOffset
        let duration = Settings.AnimationDuration

        this.sliceAnimation.stop()

        if (this.slices.length % 2 === 0) {
            let prev = -offset
            slice.position.x = -offset

            this.sliceAnimation = new Tween(position)
                .to({ x: [offset, -offset] }, duration)
                .onUpdate(() => {
                    if (prev < position.x) {
                        this.sliceDirection = new VectorC(1, 0, 0)
                    } else {
                        this.sliceDirection = new VectorC(-1, 0, 0)
                    }

                    prev = position.x
                })
                .repeat(Infinity)
                .start()
        } else {
            let prev = -offset
            slice.position.z = offset

            this.sliceAnimation = new Tween(position)
                .to({ z: [-offset, offset] }, duration)
                .onUpdate(() => {
                    if (prev < position.z) {
                        this.sliceDirection = new VectorC(0, 0, 1)
                    } else {
                        this.sliceDirection = new VectorC(0, 0, -1)
                    }

                    prev = position.z
                })
                .repeat(Infinity)
                .start()
        }

        if (this.slices.length > 3) {
            raiseCamera(Settings.SliceHeight)
        }
    }

    async init() { 
        let pillar = new Pillar(Settings.SliceSize, Settings.PillarHeight, Settings.SliceSize, Settings.SliceHeight) 

        await timeout(1250)

        let firstSlice = new Slice(Settings.SliceSize, Settings.SliceHeight, Settings.SliceSize, -Settings.AnimationOffset, 0, 0, undefined, 0)
        this.slices.push(pillar, firstSlice)
        this.animate(firstSlice) 
    }
}