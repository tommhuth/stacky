import { BoxGeometry, MeshPhongMaterial, Mesh } from "three"
import { world, sliceContactMaterial } from "../simulation"
import { scene } from "../scene"
import { Box, Body } from "cannon"
import { VectorC } from "../helpers/Vector"
import ColorMixer from "../helpers/ColorMixer"

export default class Slice extends Mesh {
    constructor(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, color = ColorMixer.next(), mass = width * height * depth / 100) {
        let geometry = new BoxGeometry(1, 1, 1)
        let material = new MeshPhongMaterial({ color })

        super(geometry, material)

        this.shape = new Box(new VectorC(width / 2, height / 2, depth / 2))
        this.body = new Body({ mass, material: sliceContactMaterial })
        this.body.position.set(x, y, z)
        this.body.linearDamping = .015
        this.body.addShape(this.shape)

        this.castShadow = true
        this.receiveShadow = true
        this.position.set(x, y, z)
        this.scale.x = width
        this.scale.y = height
        this.scale.z = depth

        world.addBody(this.body)
        scene.add(this)
    }

    remove() {
        world.removeBody(this.body)
        scene.remove(this)
    }

    resize(width, height, depth, move = false) {
        world.remove(this.body)

        this.shape = new Box(new VectorC(width / 2, height / 2, depth / 2))
        this.body = new Body({ mass: move ? width * height * depth / 10 : 0 })
        this.body.position.set(this.position.x, this.position.y, this.position.z)
        this.body.addShape(this.shape)

        this.scale.x = width
        this.scale.y = height
        this.scale.z = depth

        world.addBody(this.body)
    }
} 