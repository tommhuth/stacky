import getIntersection, { SliceType } from "./getIntersection"
import Box, { Pillar, Slice } from "./Box"
import { Tween, Easing, update } from "tween.js"
import { camera } from "./scene"
import { Color } from "three"
import { VectorC } from "./Vector3"

const Settings = {
    Colors: ["red", "green", "blue", "purple"],
    PillarHeight: 60,
    SliceHeight: 5,
    SliceSize: 35,
    AnimationDuration: 4000,
    AnimationOffset: 65
}

export default class Stack {
    slices = []
    leftAnimation
    rightAnimation

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
        let { hasIntersection, height, width, depth, x, y, z, leftovers } = getIntersection(currentSlice, previousSlice)

        if (hasIntersection) {
            let nextSlice = new Slice(width, height, depth, x, y + Settings.SliceHeight, z, new Color(color), 0)

            currentSlice.position.set(x, y, z)
            currentSlice.resize(width, height, depth)

            this.animate(nextSlice)
            this.generateLeftovers(leftovers, currentSlice.material.color)

            this.slices.push(nextSlice)
        } else {
            let dropOut = new Slice(currentSlice.width, currentSlice.height, currentSlice.depth, currentSlice.position.x, currentSlice.position.y, currentSlice.position.z, currentSlice.material.color)

            currentSlice.remove()
            dropOut.body.applyLocalImpulse(new VectorC(1, dropOut.body.mass * 10, 0), new VectorC(0, 0, 0))
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
        let firstSlice = new Slice(Settings.SliceSize, Settings.SliceHeight, Settings.SliceSize, -Settings.AnimationOffset, 0, 0, "red", 0)

        this.slices.push(pillar, firstSlice)
        this.animate(firstSlice)
    }
}