import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from "three"
import { world, remove } from "./physics"
import { scene } from "./scene"
import { Box as PhysicBox, Body } from "cannon"
import { VectorC } from "./Vector3"

export default class Box extends Mesh {
    constructor(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, mass = width * height * depth / 100, color = "red") {
        let geometry = new BoxGeometry(1, 1, 1)
        let material = new MeshPhongMaterial({ color })

        super(geometry, material)

        this.height = height
        this.width = width
        this.depth = depth

        this.shape = new PhysicBox(new VectorC(width / 2, height / 2, depth / 2))
        this.body = new Body({ mass })
        this.body.position.set(x, y, z)
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

        this.shape = new PhysicBox(new VectorC(width / 2, height / 2, depth / 2))
        this.body = new Body({ mass: move ? width * height * depth / 10 : 0 })
        this.body.position.set(this.position.x, this.position.y, this.position.z)
        this.body.addShape(this.shape)

        this.scale.x = width
        this.scale.y = height
        this.scale.z = depth

        world.addBody(this.body)
    }
}

export class Pillar extends Box {
    constructor(width, height, depth, sliceHeight, color) {
        super(width, height, depth, 0, (-height / 2) - (sliceHeight / 2), 0, 0, color)
    }
}

export class Slice extends Box {
    
}