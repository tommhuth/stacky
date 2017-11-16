import { MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide } from "three"
import { scene } from "../scene"
import { Settings } from "./Stack"
import { Tween, Easing } from "tween.js"

export default class Slice extends Mesh {
    constructor(width = 1, height = 1, x = 0, y = 0, z = 0) {
        let geometry = new PlaneGeometry(1, 1)
        let material = new MeshBasicMaterial({ color: 0xFFFFFF, opacity: 1, side: DoubleSide, transparent: true })

        super(geometry, material)

        this.rotation.x = Math.PI / 2;
        this.scale.x = width + 1
        this.scale.y = height + 1
        this.position.x = x
        this.position.y = y - Settings.SliceHeight / 2 + .01
        this.position.z = z

        this.animate()

        scene.add(this)
    }

    animate() {
        let { x, y } = this.scale

        new Tween(this.material)
            .to({ opacity: 0 }, 1200)
            .easing(Easing.Circular.Out)
            .start()
        new Tween(this.scale)
            .to({ x: x + 6, y: y + 6 }, 1200)
            .easing(Easing.Circular.Out)
            .start()
            .onComplete(() => this.remove())
    }

    remove() {
        scene.remove(this)
    }
} 