import { Vector3, Animation, MeshBuilder, CSG, PhysicsImpostor, StandardMaterial, Color3 } from "babylonjs"
import { scene, raiseCamera } from "./scene"
import uuid from "uuid/v1"
import { getMass } from "./helpers"

const stack = []

function makeGround() {
    let ground = MeshBuilder.CreateBox(uuid(), { height: 60, depth: 35, width: 35, subdivisions: 1 }, scene)

    ground.position.y = -(60 / 2 + 2.5)
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(ground)
}

function makeBox() {
    let top = stack[stack.length - 1]
    let boundingBox = top.getBoundingInfo().boundingBox
    let box = MeshBuilder.CreateBox(uuid(), { height: 5, depth: boundingBox.extendSize.z * 2, width: boundingBox.extendSize.x * 2, subdivisions: 1 }, scene)

    box.position = boundingBox.centerWorld.clone()
    box.position.y = (stack.length - 1) * 5

    box.material = new StandardMaterial(uuid(), scene)
    box.material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random())
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(box)

    animateBox(box)
    raiseCamera(5)
}

function makeFirstBox() {
    let box = MeshBuilder.CreateBox(uuid(), { height: 5, depth: 35, width: 35, subdivisions: 1 }, scene)

    box.position.y = 0
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(box)

    animateBox(box)
}

function animateBox(box) {
    let lefty = (stack.length - 1) % 2 === 0
    let flipped = (stack.length - 1) % 3 === 0
    let prop = lefty ? "x" : "z"
    let animation = new Animation(uuid(), `position.${prop}`, 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

    let keys = [
        {
            frame: 0,
            value: 60 * (flipped ? -1 : 1)
        },
        {
            frame: 200,
            value: -60 * (flipped ? -1 : 1)
        },
        {
            frame: 400,
            value: 60 * (flipped ? -1 : 1)
        }
    ]

    animation.setKeys(keys)

    box.animations = [animation]
    box.animation = scene.beginAnimation(box, 0, 400, true)
}

function match() {
    let top = stack.pop()
    let previous = stack[stack.length - 1]

    top.animation.stop()
    top.position.y -= 5

    let a = CSG.FromMesh(top)
    let b = CSG.FromMesh(previous)
    let intersection = a.intersect(b)
    let subtraction = a.subtract(b)

    if (subtraction.polygons.length) {
        let leftover = subtraction.toMesh(uuid(), top.material, scene, false)
 
        leftover.position.y += 5
        leftover.physicsImpostor = new PhysicsImpostor(leftover, PhysicsImpostor.BoxImpostor, { mass: getMass(leftover) })
        /*leftover.physicsImpostor.applyImpulse(
            new Vector3(0, -getMass(leftover) * 10, 0), 
            leftover.position
        )*/
    }

    if (!intersection.polygons.length) {
        console.warn("Missed -- game over!")
    } else {
        let box = intersection.toMesh(uuid(), top.material, scene, false)

        box.position.y += 5
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

        stack.push(box)

        makeBox()
    }

    top.dispose()
}

document.addEventListener("click", () => {
    match()
})

makeGround()
makeFirstBox()