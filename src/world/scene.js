import { Engine, FreeCamera, Animation, Scene, DirectionalLight, Vector3, Camera, Color3, Color4, SineEase, EasingFunction } from "babylonjs"
import uuid from "uuid/v1"

const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById("app")
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
const camera = new FreeCamera(uuid(), new Vector3(-45, 45, -45), scene)
const light = new DirectionalLight(uuid(), new Vector3(.2, -.81, .5), scene)

let cameraHeight = camera.position.y

scene.enablePhysics()
scene.clearColor = new Color4(0, 0, 0, 0)

camera.mode = Camera.ORTHOGRAPHIC_CAMERA
camera.orthoTop = frustumSize / 2
camera.orthoBottom = frustumSize / - 2
camera.orthoLeft = frustumSize * aspect / - 2
camera.orthoRight = frustumSize * aspect / 2
camera.setTarget(Vector3.Zero())

light.intensity = .6;

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
    camera.animation = scene.beginAnimation(camera, 0, 100, false, 2)
}

function lowerCamera() {
    if (camera.animation) {
        camera.animation.stop()
    }

    cameraHeight = 45

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
    camera.animation = scene.beginAnimation(camera, 0, 100)
}

export { scene, engine, raiseCamera, lowerCamera }