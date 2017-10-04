import { WebGLRenderer, OrthographicCamera, Color } from "three"
import {Vector3} from "./Vector3"
import scene  from "./scene"
import { physicsTick, world } from "./physics"
import { Tween, Easing, update } from "tween.js"
import getIntersection from "./getIntersection"
import { Vec3 } from "cannon"
import Box from "./Box"

const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 1000)
const renderer = new WebGLRenderer({ antialias: true, alpha: false })

camera.position.set(-35, 25, -35)
camera.up = new Vector3(0, 1, 0)
camera.lookAt(new Vector3())


renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

function tick() { 
    try {
        physicsTick()
        update()
        renderer.render(scene, camera)
        requestAnimationFrame(tick)
    } catch (e) {
        console.error(e)
    }
}

tick()

let c = ["red", "green", "blue", "purple"]
let vi = 0
let size = 35
let height = 5
let offset = 40
let offset2 = 65
let duration = 4000
let boxes = []
let left
let right

document.addEventListener("click", () => {
    let color = c[vi++ % 4]
    let b1 = boxes[boxes.length - 1]
    let b2 = boxes[boxes.length - 2]
    let { hasIntersection, height, width, depth, x, y, z, leftover } = getIntersection(b1, b2)

    if (hasIntersection) {
        let boxy = new Box(width, height, depth, x, y + 5, z, 0, new Color(color))

        b1.position.set(x, y, z)
        b1.resize( width, height, depth)

        for (let lefty of leftover) {
            if (lefty.width > .1 && lefty.depth > .1) {
                let a = new Box(lefty.width, lefty.height, lefty.depth, lefty.x, lefty.y, lefty.z, undefined, b1.material.color)
                let force = Math.random() * a.body.mass * 2
                let impulse

                switch (lefty.type) {
                    case "top":
                        impulse = new Vec3(0, 0, force) 
                        break
                    case "bottom":
                        impulse = new Vec3(0, 0, -force) 
                        break
                    case "left":
                        impulse = new Vec3(force, 0, 0) 
                        break
                    case "right":
                        impulse = new Vec3(-force, 0, 0) 
                        break
                }

                a.body.applyLocalImpulse(impulse, new Vec3(0, a.scale.y, 0))
            }
        }

        left.stop()
        right.stop()

        if (vi % 2 === 0) {
            boxy.position.x = -offset2

            right = new Tween(boxy.position).to({ ...boxy.position, x: offset2 }, duration)
            left = new Tween(boxy.position).to({ ...boxy.position, x: -offset2 }, duration)
        } else {
            boxy.position.z = offset2

            right = new Tween(boxy.position).to({ ...boxy.position, z: -offset2 }, duration)
            left = new Tween(boxy.position).to({ ...boxy.position, z: offset2 }, duration)

            new Tween(camera.position)
                .to({ ...camera.position, y: camera.position.y + 10 }, 5000)
                .easing(Easing.Back.Out)
                .start()
        }

        right.chain(left).start()
        left.chain(right)

        boxes.push(boxy)
    } else {
        let boxy = new Box(b1.width, b1.height, b1.depth, b1.position.x, b1.position.y, b1.position.z, undefined, b1.material.color)
        b1.remove()

        boxy.body.applyLocalImpulse(new Vec3(1,  boxy.body.mass * 10, 0), new Vec3(0, 0, 0))
        document.removeEventListener("click", this)
    }
})

boxes.push(new Box(size, 40, size, 0, -40 / 2 - 2.5, 0, 0, "yellow"))

let boxy = new Box(size, 5, size, -offset2, 0, 0, 0, new Color(Math.random(), Math.random(), Math.random()))

let t1 = new Tween(camera.position)
    .to({ ...camera.position, y: camera.position.y + 5 }, 3000)
    .easing(Easing.Back.Out)
    .start()

right = new Tween(boxy.position)
    .to({ ...boxy.position, x: offset2, }, duration)
    .easing(Easing.Linear.None)

left = new Tween(boxy.position)
    .to({ ...boxy.position, x: -offset2, }, duration)
    .easing(Easing.Linear.None)

right.chain(left).start()
left.chain(right)


boxes.push(boxy)

// debug
window.scene = scene
window.THREE = require("three")