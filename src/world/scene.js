import { CannonJSPlugin, PhysicsRadialImpulseFalloff, PhysicsHelper } from "babylonjs"
import { Engine, FreeCamera, Scene, DirectionalLight, Vector3, Camera, Color4, Color3 } from "babylonjs"
import { Animation, SineEase, EasingFunction } from "babylonjs"
import { Settings as StackSettings } from "./Stack"
import uuid from "uuid/v1"

const frustumSize = 13
const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById("app")
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
const camera = new FreeCamera(uuid(), new Vector3(-15, 15, -15), scene)
const light = new DirectionalLight(uuid(), new Vector3(.2, -.81, .5), scene)

let cameraHeight = camera.position.y

scene.enablePhysics()

scene.fogMode = Scene.FOGMODE_LINEAR
scene.fogColor = Color3.Black()
scene.fogStart = 20
scene.fogEnd = 50
scene.clearColor = new Color4(0, 0, 0, 0)

camera.mode = Camera.ORTHOGRAPHIC_CAMERA
camera.maxZ = 1000
camera.minZ = -1000
camera.orthoTop = frustumSize / 2
camera.orthoBottom = frustumSize / - 2
camera.orthoLeft = frustumSize * aspect / - 2
camera.orthoRight = frustumSize * aspect / 2
camera.setTarget(Vector3.Zero())

light.intensity = 1.5;

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight

    camera.orthoTop = frustumSize / 2
    camera.orthoBottom = frustumSize / - 2
    camera.orthoLeft = frustumSize * aspect / - 2
    camera.orthoRight = frustumSize * aspect / 2

    engine.resize()
})

function raiseCamera(increment) {
    if (camera.animation) {
        camera.animation.stop()
    }

    cameraHeight += increment

    let animation = new Animation(uuid(), "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    let keys = [
        {
            frame: 0,
            value: camera.position.y
        },
        {
            frame: 100,
            value: cameraHeight
        }
    ]
    let ease = new SineEase()

    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

    animation.setEasingFunction(ease)
    animation.setKeys(keys)

    camera.animations = [animation]
    camera.animation = scene.beginAnimation(camera, 0, 100, false, 1)
}

function lowerCamera(layerCount, totalMass) {
    if (camera.animation) {
        camera.animation.stop()
    }

    cameraHeight = 15

    const physicsHelper = new PhysicsHelper(scene)
    const gravitationalFieldEvent = physicsHelper.gravitationalField(
        // position 5 leves above top layer
        new Vector3(0, (layerCount + 5) * StackSettings.LayerHeight, 0),
        // let it reach 18 leves down  
        StackSettings.LayerHeight * 18,  
        // base force on totalmass 
        totalMass,
        PhysicsRadialImpulseFalloff.Linear
    )

    const ease = new SineEase()
    const animation = new Animation(uuid(), "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    const keys = [
        {
            frame: 0,
            value: camera.position.y
        },
        {
            frame: 100,
            value: cameraHeight
        }
    ]

    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

    animation.setEasingFunction(ease)
    animation.setKeys(keys)

    camera.animations = [animation]

    gravitationalFieldEvent.enable()

    setTimeout(() => camera.animation = scene.beginAnimation(camera, 0, 100, false, .5), 150)
    setTimeout(() => gravitationalFieldEvent.disable(), 150)
}

export { scene, engine, raiseCamera, lowerCamera }