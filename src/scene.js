import { Tween, Easing } from "tween.js"
import { Fog, HemisphereLight, DirectionalLight, AmbientLight } from "three"
import { Scene, OrthographicCamera, WebGLRenderer } from "three"
import { Vector3 } from "./helpers/Vector"

const pixelRatio = window.devicePixelRatio
const renderer = new WebGLRenderer({ antialias: true, alpha: true, devicePixelRatio: pixelRatio })
const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 500)

const scene = new Scene()
const light = new DirectionalLight(0xFFFFFF, .35)
const light2 = new DirectionalLight(0xFFFFFF, .35)
const ambientLight = new AmbientLight(0xFFFFF, .65)
const hemisphereLight = new HemisphereLight(0xFFFFFF, 0x000000, .825) 

let cameraTween = new Tween()

function render() {
    renderer.render(scene, camera)
}

function raiseCamera(y, focus) {
    cameraTween.stop()

    cameraTween = new Tween(camera.position)
        .to({ y: camera.position.y + y }, 1500)
        .easing(Easing.Cubic.Out)
        .start()
}

function lowerCamera() { 
    cameraTween.stop()

    cameraTween = new Tween(camera.position)
        .to({ y: 35 }, camera.position.y * 50)
        .easing(Easing.Cubic.Out)
        .start()
}

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)

camera.position.set(-35, 45, -35)
camera.up = new Vector3(0, 1, 0)
camera.lookAt(new Vector3(0, 0, 0))

light.position.set(-20, 10, 6)
light2.position.set(20, 10, 20)

scene.fog = new Fog(0xFFFFFF, 10, 270)
scene.add(light, ambientLight, light, hemisphereLight)

document.body.appendChild(renderer.domElement)

window.addEventListener('resize', () => { 
    let aspect = window.innerWidth / window.innerHeight

    camera.left = frustumSize * aspect / - 2
    camera.right = frustumSize * aspect / 2
    camera.top = frustumSize / 2
    camera.bottom = frustumSize / - 2
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio)
})

export { scene, camera, render, raiseCamera, lowerCamera }