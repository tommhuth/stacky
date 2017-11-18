import Emitter from "../utils/Emitter"
import { Vector3, Animation, MeshBuilder, CSG, PhysicsImpostor, StandardMaterial, Color3 } from "babylonjs"
import { scene, raiseCamera, lowerCamera } from "./scene"
import uuid from "uuid/v1"

export const Settings = {
    Colors: ["red", "green", "blue", "purple"],
    PillarHeight: 80,
    SliceHeight: 8,
    SliceSize: 35,
    AnimationOffset: 65
}

export const StackEvent = {
    Running: "running",
    Ready: "ready",
    Ended: "ended",
    ScoreChange: "score-change"
}

export const StackState = {
    Running: "running",
    Ended: "ended",
    Ready: "ready"
}

export class Stack extends Emitter {
    layers = []
    leftovers = []
    state = StackState.Ready

    constructor() {
        super()

        this.init()
    }

    init() {
        this.makePillar()
    }

    start() {
        this.state = StackState.Running

        this.makeFirstBox()
        this.broadcast(StackEvent.Running)
    }

    restart() {
        for (let i = 0; i < this.layers.length; i++) {
            if (i > 0) {
                this.layers[i].dispose()
            }
        }

        for (let i = 0; i < this.leftovers.length; i++) {
            this.leftovers[i].dispose()
        }

        this.leftovers = []
        this.layers.splice(1, this.layers.length)
        this.state = StackState.Running

        this.broadcast(StackEvent.Running)
        this.broadcast(StackEvent.ScoreChange, { score: 0 })
        this.makeFirstBox()
    }

    makePillar() {
        let pillar = MeshBuilder.CreateBox(uuid(), { height: 60, depth: 35, width: 35, subdivisions: 1 }, scene)

        pillar.position.y = -(60 / 2 + 2.5)
        pillar.___ISPILLAR = true
        pillar.physicsImpostor = new PhysicsImpostor(pillar, PhysicsImpostor.BoxImpostor, { mass: 0 })

        pillar.computeWorldMatrix(true)

        this.layers.push(pillar)
    }

    makeFirstBox() {
        let box = MeshBuilder.CreateBox(uuid(), { height: 5, depth: 35, width: 35, subdivisions: 1 }, scene)

        box.position.y = 0
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

        this.layers.push(box)

        this.animate(box)
    }

    match() {
        if (this.state !== StackState.Running) {
            return
        }

        let top = this.layers.pop()
        let previous = this.layers[this.layers.length - 1]
        let distance = Vector3.Distance(top.position, new Vector3(previous.position.x, previous.position.y + 5, previous.position.z))

        top.animation.stop()
        top.position.y -= 5 

        let a = CSG.FromMesh(top)
        let b = CSG.FromMesh(previous)

        let intersection
        let subtraction

        if (distance <= .75) { 
            console.log("bingo")
            intersection = b.intersect(b)
            subtraction = b.subtract(b)
        } else {
            intersection = a.intersect(b)
            subtraction = a.subtract(b)
        }

        if (subtraction.polygons.length && distance > .75) {
            let leftover = subtraction.toMesh(uuid(), top.material, scene, false)

            leftover.position.y += 5
            leftover.physicsImpostor = new PhysicsImpostor(leftover, PhysicsImpostor.BoxImpostor, { mass: this.getMass(leftover) })

            this.leftovers.push(leftover)
        }

        if (intersection.polygons.length) {
            let box = intersection.toMesh(uuid(), top.material, scene, false)

            box.position.y += 5
            box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

            this.layers.push(box)

            this.broadcast(StackEvent.ScoreChange, { score: this.layers.length - 1 })
            this.makeBox()
        } else {
            this.state = StackState.Ended

            this.broadcast(StackEvent.Ended)
            lowerCamera()
        }

        top.dispose()
    }

    animate(box) {
        let lefty = (this.layers.length - 1) % 2 === 0
        let flipped = (this.layers.length - 1) % 3 === 0
        let prop = lefty ? "x" : "z"
        let animation = new Animation(uuid(), `position.${prop}`, 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

        let keys = [
            {
                frame: 0,
                value: 60 * (flipped ? -1 : 1)
            },
            {
                frame: 100,
                value: 0
            },
            {
                frame: 200,
                value: -60 * (flipped ? -1 : 1)
            },
            {
                frame: 300,
                value: 0
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

    makeBox() {
        let top = this.layers[this.layers.length - 1]
        let boundingBox = top.getBoundingInfo().boundingBox
        let box = MeshBuilder.CreateBox(uuid(), { height: 5, depth: boundingBox.extendSize.z * 2, width: boundingBox.extendSize.x * 2, subdivisions: 1 }, scene)

        box.position = boundingBox.centerWorld.clone()
        box.position.y = (this.layers.length - 1) * 5

        box.material = new StandardMaterial(uuid(), scene)
        box.material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random())
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })

        this.layers.push(box)
        this.animate(box)

        raiseCamera(5)
    }

    getMass(mesh) {
        let boundingBox = mesh.getBoundingInfo().boundingBox

        return boundingBox.extendSize.z * boundingBox.extendSize.x * boundingBox.extendSize.y / 3
    }
}