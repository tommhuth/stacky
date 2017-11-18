import { Engine, FreeCamera, Animation, Scene, HemisphericLight, Vector3, Camera, Color3, Color4, PointLight, SineEase, EasingFunction } from "babylonjs"
import uuid from "uuid/v1"

const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById("app")
const engine = new Engine(canvas, true, undefined, true)
const scene = new Scene(engine)
const camera = new FreeCamera(uuid(), new Vector3(-45, 45, -45), scene)
const light = new HemisphericLight(uuid(), new Vector3(0, -1, 0), scene)
const pointLight = new PointLight(uuid(), new Vector3(-85, -55, -95), scene)

scene.enablePhysics()
scene.clearColor = new Color4(0, 0, 0, 0)

camera.mode = Camera.ORTHOGRAPHIC_CAMERA
camera.orthoTop = frustumSize / 2
camera.orthoBottom = frustumSize / - 2
camera.orthoLeft = frustumSize * aspect / - 2
camera.orthoRight = frustumSize * aspect / 2
camera.setTarget(Vector3.Zero())

light.groundColor = Color3.White()
light.diffuse = new Color3(.5, .5, .5)
light.intensity = .4;

pointLight.intensity = .4

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

    let animation = new Animation(uuid(), "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    let keys = [
        {
            frame: 0,
            value: camera.position.y
        },
        {
            frame: 100,
            value: camera.position.y + increment
        }
    ]
    let ease = new SineEase()

    ease.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)

    animation.setEasingFunction(ease)
    animation.setKeys(keys)

    camera.animations = [animation]
    camera.animation = scene.beginAnimation(camera, 0, 100)
}

function lowerCamera() {
    if (camera.animation) {
        camera.animation.stop()
    }

    let animation = new Animation(uuid(), "position.y", 60, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CONSTANT)
    let keys = [
        {
            frame: 0,
            value: camera.position.y
        },
        {
            frame: 100,
            value: 45
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