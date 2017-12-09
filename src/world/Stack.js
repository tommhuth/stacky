import Emitter from "../utils/Emitter"
import { Vector3, Animation, MeshBuilder, CSG, PhysicsImpostor, StandardMaterial, Color3, SineEase, EasingFunction } from "babylonjs"
import { scene, raiseCamera, lowerCamera } from "./scene"
import uuid from "uuid/v1"

export const Settings = {
    Colors: ["red", "green", "blue", "purple"],
    PillarHeight: 20,
    LayereHeight: 1,
    LayerSize: 5,
    AnimationOffset: 10,
    ClosenessLeniency: .1
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
        this.animatePillar()
    }

    start() {
        this.state = StackState.Running

        this.makeFirstLayer()
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
        this.makeFirstLayer()
    }

    match() {
        if (this.state !== StackState.Running) {
            return
        }

        let top = this.layers.pop()
        let previous = this.layers[this.layers.length - 1]
        let distance = Vector3.Distance(
            top.position,
            new Vector3(previous.position.x, previous.position.y + Settings.LayereHeight, previous.position.z)
        )

        top.animation.stop()
        top.position.y -= Settings.LayereHeight

        let a = CSG.FromMesh(top)
        let b = CSG.FromMesh(previous)

        let intersection
        let subtraction

        if (distance <= Settings.ClosenessLeniency) {
            // count as hit in middle
            intersection = b.intersect(b)
            subtraction = b.subtract(b)

            console.info("bam")
        } else {
            intersection = a.intersect(b)
            subtraction = a.subtract(b)
        }

        if (subtraction.polygons.length) {
            // if has leftover cutoff
            let leftover = subtraction.toMesh(uuid(), top.material, scene, false)

            // mesh has been lowered for intersection test, readjust 
            leftover.convertToFlatShadedMesh()
            leftover.position.y += Settings.LayereHeight
            leftover.physicsImpostor = new PhysicsImpostor(leftover, PhysicsImpostor.BoxImpostor, { mass: this.getMass(leftover) })
            leftover.physicsImpostor.physicsBody.linearDamping = .5
            leftover.physicsImpostor.physicsBody.angularDamping = .1

            this.leftovers.push(leftover)
        }

        if (intersection.polygons.length) {
            // has intersection
            let layer = intersection.toMesh(uuid(), top.material, scene, false)

            // mesh has been lowered for intersection test, readjust
            layer.convertToFlatShadedMesh()
            layer.position.y += Settings.LayereHeight
            layer.physicsImpostor = new PhysicsImpostor(layer, PhysicsImpostor.BoxImpostor, { mass: 0 })
            layer.physicsImpostor.physicsBody.linearDamping = .5
            layer.physicsImpostor.physicsBody.angularDamping = .1

            this.layers.push(layer)

            this.broadcast(StackEvent.ScoreChange, { score: this.layers.length - 1 })
            this.makeLayer()
        } else {
            // game over!
            this.gameOver()
        }

        top.dispose()
    }

    gameOver() {
        let totalMass = 0

        for (let i = 0; i < this.layers.length; i++) {
            if (i > 0) {
                let layer = this.layers[i]
                let mass = this.getMass(layer) 

                layer.physicsImpostor.setMass(mass)
            }
        }

        // only use mass from the 13 topmost layers 
        for (let i = this.layers.length - 1; i > Math.max(this.layers.length - 13, 0); i--) { 
            totalMass += this.layers[i].physicsImpostor.mass 
        }

        this.state = StackState.Ended
        this.broadcast(StackEvent.Ended)

        lowerCamera(this.layers.length, totalMass)
    }

    animatePillar(){
        let pillar = this.layers[0] 
        let animation = new Animation(uuid(), "position.y", 60, Animation.ANIMATIONTYPE_FLOAT)
        let ease = new SineEase()
        let keys = [
            {
                frame: 0,
                value: pillar.position.y
            },
            {
                frame: 100,
                value: -(Settings.PillarHeight / 2 + Settings.LayereHeight / 2)
            }, 
        ]

        ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
    
        animation.setEasingFunction(ease)
        animation.setKeys(keys)

        pillar.animations = [animation]
        pillar.animation = scene.beginAnimation(pillar, 0, 100, undefined, 1.5)
    }

    animate(layer) {
        let lefty = (this.layers.length - 1) % 2 === 0
        let flipped = (this.layers.length - 1) % 3 === 0
        let axis = lefty ? "x" : "z"
        let animation = new Animation(uuid(), `position.${axis}`, 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)

        let keys = [
            {
                frame: 0,
                value: Settings.AnimationOffset * (flipped ? -1 : 1)
            },
            {
                frame: 50,
                value: 0
            },
            {
                frame: 100,
                value: -Settings.AnimationOffset * (flipped ? -1 : 1)
            },
            {
                frame: 150,
                value: 0
            },
            {
                frame: 200,
                value: Settings.AnimationOffset * (flipped ? -1 : 1)
            }
        ]

        animation.setKeys(keys)

        layer.animations = [animation]
        layer.animation = scene.beginAnimation(layer, 0, 200, true, .9)
    }

    makeLayer() {
        let top = this.layers[this.layers.length - 1]
        let { extendSize, centerWorld } = top.getBoundingInfo().boundingBox
        let layer = MeshBuilder.CreateBox(
            uuid(),
            {
                height: Settings.LayereHeight,
                depth: extendSize.z * 2,
                width: extendSize.x * 2,
                subdivisions: 1
            },
            scene
        )

        layer.convertToFlatShadedMesh()
        layer.position = centerWorld.clone()
        layer.position.y = (this.layers.length - 1) * Settings.LayereHeight

        layer.material = new StandardMaterial(uuid(), scene)
        layer.material.diffuseColor = new Color3(Math.random(), Math.random(), Math.random())
        layer.physicsImpostor = new PhysicsImpostor(layer, PhysicsImpostor.BoxImpostor, { mass: 0 })
        layer.physicsImpostor.physicsBody.linearDamping = .5
        layer.physicsImpostor.physicsBody.angularDamping = .1

        this.layers.push(layer)
        this.animate(layer)

        raiseCamera(Settings.LayereHeight)
    }

    makeFirstLayer() {
        let layer = MeshBuilder.CreateBox(
            uuid(),
            {
                height: Settings.LayereHeight,
                depth: Settings.LayerSize,
                width: Settings.LayerSize,
                subdivisions: 1
            },
            scene
        )

        layer.convertToFlatShadedMesh()
        layer.position.y = 0
        layer.physicsImpostor = new PhysicsImpostor(layer, PhysicsImpostor.BoxImpostor, { mass: 0 })
        layer.physicsImpostor.physicsBody.linearDamping = .5
        layer.physicsImpostor.physicsBody.angularDamping = .1

        this.layers.push(layer)

        this.animate(layer)
    }

    makePillar() {
        let pillar = MeshBuilder.CreateBox(
            uuid(),
            {
                height: Settings.PillarHeight,
                depth: Settings.LayerSize,
                width: Settings.LayerSize,
                subdivisions: 1
            },
            scene
        )

        pillar.convertToFlatShadedMesh()
        pillar.material = new StandardMaterial(uuid(), scene)
        pillar.material.diffuseColor = Color3.White()
        pillar.position.y = -Settings.PillarHeight * 1.5
        pillar.physicsImpostor = new PhysicsImpostor(pillar, PhysicsImpostor.BoxImpostor, { mass: 0 })

        this.layers.push(pillar)
    }

    getMass(layer) {
        let boundingBox = layer.getBoundingInfo().boundingBox

        return Math.max(.5, boundingBox.extendSize.z * boundingBox.extendSize.x * boundingBox.extendSize.y)
    }

    clean() {
        let removed = []

        for (let leftover of this.leftovers) {
            if (leftover.position.y < -(Settings.PillarHeight * 2)) {
                leftover.dispose()

                removed.push(leftover)
            }
        }

        if (removed.length) {
            this.leftovers = this.leftovers.filter(i => !removed.includes(i))
        }
    }
}