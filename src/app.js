import { Vector3, Animation, MeshBuilder, CSG, PhysicsImpostor, StandardMaterial, Color3 } from "babylonjs"
import { scene } from "./scene"

const stack = []


function makeGround() {
    var ground = MeshBuilder.CreateBox('ground1', { height: 40, depth: 35, width: 35, subdivisions: 1 }, scene)

    ground.position.y = -22.5
    ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(ground)
}

function makeBox() {
    let top = stack[stack.length - 1]
    var boundingBx = top.getBoundingInfo()
    console.log(boundingBx)
  
    let boundingBox = boundingBx.boundingBox
    var box = MeshBuilder.CreateBox('box1', { height: 5, depth: boundingBox.extendSize.z * 2, width: boundingBox.extendSize.x * 2, subdivisions: 1 }, scene)

    box.position =  boundingBx.boundingBox.centerWorld.clone()
    box.position.y = (stack.length - 1) * 5

    box.material = new StandardMaterial("xx", scene)
    box.material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random())
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(box)

    animateBox(box)
}

function makeFirstBox() {
    var box = MeshBuilder.CreateBox('box1', { height: 5, depth: 35, width: 35, subdivisions: 1 }, scene)

    box.position.y = 0
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

    stack.push(box)

    animateBox(box)
}

function animateBox(box) {
    let lefty = (stack.length - 1) % 2 == 0
    let prop = lefty ? "x" : "z"
    var animation = new Animation("anm", "position." + prop, 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

    var keys = [
        {
            frame: 0,
            value: 60  
        },
        {
            frame: 200,
            value: -60  
        },
        {
            frame: 400,
            value: 60  
        }
    ]

    animation.setKeys(keys)

    box.animations = [animation]
    box.animation = scene.beginAnimation(box, 0, 400, true)
}

function match() {
    let top = stack[stack.length - 1]

    top.animation.stop()
    top.position.y -= 5

    let a = CSG.FromMesh(top)
    let b = CSG.FromMesh(stack[stack.length - 2])
    let intersection = a.intersect(b)
    let subtraction = a.subtract(b)
 

    if (!intersection.polygons.length) {
        top.physicsImpostor.setMass(5)
        top.position.y += 5

        throw new Error("Missed - game over!")
    } else {
        let box = intersection.toMesh("s", top.material, scene, false)
        let leftover = subtraction.toMesh("ss", top.material, scene, false)

        box.position.y += 5
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

        leftover.position.y += 5
        leftover.physicsImpostor = new PhysicsImpostor(leftover, PhysicsImpostor.BoxImpostor, { mass: 5 })
 
        console.log(box.position)
        stack.splice(stack.length - 1, 1) 
        
        stack.push(box)
        top.dispose()

        makeBox()
    }
}

document.addEventListener("click", () => {
    match()
})


makeGround()
makeFirstBox()