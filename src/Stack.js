import getIntersection, { SliceType } from "./getIntersection"
import Box, { Pillar, Slice } from "./Box"
import { Tween, Easing, update } from "tween.js"
import {  camera } from "./scene"
import { Color } from "three"
import { VectorC } from "./Vector3"

const Settings = {
    PillarHeight: 60,
    SliceHeight: 5,
    SliceSize: 35,
    AnimationDuration: 4000,
    AnimationOffset: 65
}

let c = ["red", "green", "blue", "purple"]
let vi = 0

export default class Stack {
    slices = []
    leftAnimation
    rightAnimation

    constructor() {
        this.init()
    }

    match() {
        let color = c[vi++ % 4]
        let currentSlice = this.slices[this.slices.length - 1]
        let previousSlice = this.slices[this.slices.length - 2]
        let { hasIntersection, height, width, depth, x, y, z, leftover } = getIntersection(currentSlice, previousSlice)

        if (hasIntersection) {
            let nextSlice = new Slice(width, height, depth, x, y + 5, z, 0, new Color(color))

            currentSlice.position.set(x, y, z)
            currentSlice.resize(width, height, depth)
            this.animate(nextSlice)

            for (let lefty of leftover) {
                if (lefty.width > .1 && lefty.depth > .1) {
                    let a = new Slice(lefty.width, lefty.height, lefty.depth, lefty.x, lefty.y, lefty.z, undefined, currentSlice.material.color)
                    let force = Math.random() * a.body.mass * 2
                    let impulse

                    switch (lefty.type) {
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

                    a.body.applyLocalImpulse(impulse, new VectorC(0, a.scale.y, 0))
                }
            }

            

            this.slices.push(nextSlice)
        } else {
            let nextSlice = new Slice(currentSlice.width, currentSlice.height, currentSlice.depth, currentSlice.position.x, currentSlice.position.y, currentSlice.position.z, undefined, currentSlice.material.color)
            currentSlice.remove()

            nextSlice.body.applyLocalImpulse(new VectorC(1, nextSlice.body.mass * 10, 0), new VectorC(0, 0, 0))
            document.removeEventListener("click", this)
        }
    }

    animate(slice) {
        let position = slice.position
        let offset = Settings.AnimationOffset
        let duration = Settings.AnimationDuration

        if (this.rightAnimation && this.leftAnimation) {
            this.rightAnimation.stop()
            this.leftAnimation.stop()
        }

        if (this.slices.length % 2 === 0) {
            slice.position.x = -offset

            this.rightAnimation = new Tween(position).to({ ...position, x: offset }, duration)
            this.leftAnimation = new Tween(position).to({ ...position, x: -offset }, duration)
        } else {
            slice.position.z = offset

            this.rightAnimation = new Tween(position).to({ ...position, z: -offset }, duration)
            this.leftAnimation = new Tween(position).to({ ...position, z: offset }, duration)

            new Tween(camera.position)
                .to({ ...camera.position, y: camera.position.y + 10 }, 5000)
                .easing(Easing.Cubic.InOut)
                .start()
        }

        this.rightAnimation.chain(this.leftAnimation).start()
        this.leftAnimation.chain(this.rightAnimation)
    }

    init() {
        let pillar = new Pillar(Settings.SliceSize, Settings.PillarHeight, Settings.SliceSize, Settings.SliceHeight, "yellow")
        let firstSlice = new Slice(Settings.SliceSize, Settings.SliceHeight, Settings.SliceSize, -Settings.AnimationOffset, 0, 0, 0, "red")

        this.slices.push(pillar, firstSlice)
        this.animate(firstSlice)
    }
}