import Emitter from "../utils/Emitter"
import { Vector3, MeshBuilder, CSG, PhysicsImpostor, StandardMaterial, Color3, Angle } from "babylonjs"
import { SineEase, EasingFunction, Animation } from "babylonjs"
import { scene, raiseCamera, lowerCamera } from "./scene"
import uuid from "uuid/v1"
import ColorMixer from "../utils/ColorMixer"

export const Settings = {
    Colors: ["red", "green", "blue", "purple"],
    PillarHeight: 20,
    LayerHeight: 1,
    LayerSize: 5,
    AnimationOffset: 10,
    ClosenessLeniency: .25,
    BonusScalingAddition: .1,
    PerfectHitsForBonus: 4
}

export const StackEvent = {
    Running: "running",
    ScoreBonus: "score-bonus",
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
    score = 0
    perfectHits = 0

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

        ColorMixer.reset()

        this.leftovers = []
        this.layers.splice(1, this.layers.length)
        this.state = StackState.Running
        this.score = 0

        this.broadcast(StackEvent.Running)
        this.broadcast(StackEvent.ScoreChange, { score: 0 })
        this.makeFirstLayer()
    }

    getSubstractionBox(a, b) {
        let a1 = CSG.FromMesh(a)
        let b2 = CSG.FromMesh(b)

        let subtraction = a1.subtract(b2)

        if (subtraction.polygons.length) {
            let box = subtraction.toMesh(uuid(), a.material, scene, false)

            box.convertToFlatShadedMesh()
            box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: this.getMass(box) })
            box.physicsImpostor.physicsBody.linearDamping = .5
            box.physicsImpostor.physicsBody.angularDamping = .1

            return box
        } else {
            return null
        }
    }

    getIntersectionBox(a, b, material = a.material) {
        let a1 = CSG.FromMesh(a)
        let b2 = CSG.FromMesh(b)
        let intersection = a1.intersect(b2)


        if (intersection.polygons.length) {
            let box = intersection.toMesh(uuid(), material, scene, false)

            box.convertToFlatShadedMesh()
            box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0 })
            box.physicsImpostor.physicsBody.linearDamping = .5
            box.physicsImpostor.physicsBody.angularDamping = .1

            return box
        } else {
            return null
        }
    }
    makeHitSplash(box, bonusScaling = 1) { 
        let { boundingBox: { centerWorld, extendSize } } = box.getBoundingInfo()
        let plane = MeshBuilder.CreatePlane(
            uuid(), {
                width: (extendSize.x * 2 + .65) * bonusScaling,
                height: (extendSize.z * 2 + .65) * bonusScaling
            },
            scene
        )

        plane.position.x = centerWorld.x
        plane.position.z = centerWorld.z
        plane.position.y = centerWorld.y + Settings.LayerHeight / 2
        plane.rotate(new Vector3(1, 0, 0), Angle.FromDegrees(90).radians())
        plane.material = new StandardMaterial(uuid(), scene)
        plane.material.diffuseColor = Color3.White()
        plane.material.fogEnabled = false

        let animationOpacity = new Animation(uuid(), "visibility", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
        let animationScale = new Animation(uuid(), "scaling", 60, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT)
        let animationOpacityKeys = [
            {
                frame: 0,
                value: 1
            },
            {
                frame: 50,
                value: 0
            }
        ]
        let animationScaleKeys = [
            {
                frame: 0,
                value: new Vector3(1, 1, 1)
            },
            {
                frame: 150,
                value: new Vector3(.1, .1, .1)
            }
        ]
        let ease = new SineEase()

        ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

        animationOpacity.setEasingFunction(ease)
        animationOpacity.setKeys(animationOpacityKeys)

        animationScale.setEasingFunction(ease)
        animationScale.setKeys(animationScaleKeys)

        plane.animations = [animationOpacity, animationScale]
        plane.animation = scene.beginAnimation(plane, 0, 150, false, 1, () => plane.dispose())
    }
    match() {
        if (this.state !== StackState.Running) {
            return
        }

        let top = this.layers.pop()
        let previous = this.layers[this.layers.length - 1]
        let distance = Vector3.Distance(
            top.position,
            new Vector3(previous.position.x, previous.position.y + Settings.LayerHeight, previous.position.z)
        )
        let intersection
        let subtraction 

        // move down for CSG 
        top.position.y -= Settings.LayerHeight
        top.animation.stop()

        if (distance <= Settings.ClosenessLeniency) {
            intersection = this.getIntersectionBox(previous, previous, top.material)

            this.perfectHits++

            if (this.perfectHits >= Settings.PerfectHitsForBonus) { 
                this.perfectHits = 0

                intersection.scaling = intersection.scaling.add(
                    new Vector3(Settings.BonusScalingAddition, 0, Settings.BonusScalingAddition)
                )
            }

            this.makeHitSplash(intersection, intersection.scaling.x)
            this.broadcast(StackEvent.ScoreBonus)
        } else {
            intersection = this.getIntersectionBox(top, previous)
            subtraction = this.getSubstractionBox(top, previous)

            this.perfectHits = 0
        }

        if (subtraction) {
            // move up after CSG 
            subtraction.position.y += Settings.LayerHeight
            this.leftovers.push(subtraction)
        }

        if (intersection) {
            // move up after CSG 
            intersection.position.y += Settings.LayerHeight

            this.layers.push(intersection)
            this.score += 1 
            this.broadcast(StackEvent.ScoreChange, { score: this.score })
            this.makeLayer()
        } else {
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

    animatePillar() {
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
                value: -(Settings.PillarHeight / 2 + Settings.LayerHeight / 2)
            },
        ]

        ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

        animation.setEasingFunction(ease)
        animation.setKeys(keys)

        pillar.animations = [animation]
        pillar.animation = scene.beginAnimation(pillar, 0, 100, undefined, 1.5)
    }

    makeBox(
        size = {
            height: Settings.LayerHeight,
            depth: Settings.LayerSize,
            width: Settings.LayerSize
        },
        mass = false,
        color = ColorMixer.next()
    ) {
        let box = MeshBuilder.CreateBox(
            uuid(),
            {
                ...size,
                subdivisions: 1
            },
            scene
        )

        box.convertToFlatShadedMesh()
        box.position.y = 0
        box.material = new StandardMaterial(uuid(), scene)
        box.material.diffuseColor = color
        box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: mass ? this.getMass(box) : 0 })
        box.physicsImpostor.physicsBody.linearDamping = .5
        box.physicsImpostor.physicsBody.angularDamping = .1

        return box
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
        layer.animation = scene.beginAnimation(layer, 0, 200, true, 1.1)
    }

    makeLayer() {
        let top = this.layers[this.layers.length - 1]
        let { extendSize, centerWorld } = top.getBoundingInfo().boundingBox
        let layer = this.makeBox(
            {
                height: Settings.LayerHeight,
                depth: extendSize.z * 2 * top.scaling.x,
                width: extendSize.x * 2 * top.scaling.z
            }
        )

        layer.position = centerWorld.clone()
        layer.position.y = (this.layers.length - 1) * Settings.LayerHeight

        this.layers.push(layer)
        this.animate(layer)

        raiseCamera(Settings.LayerHeight)
    }

    makeFirstLayer() {
        let layer = this.makeBox(undefined, undefined)

        this.layers.push(layer)

        this.animate(layer)
    }

    makePillar() {
        let pillar = this.makeBox(
            {
                height: Settings.PillarHeight,
                depth: Settings.LayerSize,
                width: Settings.LayerSize
            },
            undefined,
            Color3.White()

        )

        pillar.material.diffuseColor = Color3.White()
        pillar.position.y = -Settings.PillarHeight * 1.5

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