import { Tween, Easing } from "tween.js"
import { Scene, Fog, AxisHelper, HemisphereLight, DirectionalLight, AmbientLight, OrthographicCamera, WebGLRenderer } from "three"
import { Vector3 } from "./helpers/Vector"

const renderer = new WebGLRenderer({ antialias: true, alpha: true })
const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 500)

const scene = new Scene()
const light = new DirectionalLight(0xABA9C3, .35)
const ambientLight = new AmbientLight(0xABA9C3, 1.1)
const hemisphereLight = new HemisphereLight(0xFCF7F8, 0x275DAD, .95)
const axis = new AxisHelper(50)

function render() {
    renderer.render(scene, camera)
}

function raiseCamera(y, focus) {
    new Tween(camera.position)
        .to({ y: camera.position.y + y }, 1500)
        .easing(Easing.Cubic.Out)
        .start()
}

function lowerCamera() { 
    new Tween(camera.position)
        .to({ y: 35 }, camera.position.y * 100)
        .easing(Easing.Cubic.Out)
        .start()
}

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.set(-35, 35, -35)
camera.up = new Vector3(0, 1, 0)
camera.lookAt(new Vector3(0, 0, 0))

light.position.set(-20, 10, 6)

scene.fog = new Fog(0x001AFF, 30, 180)
scene.add(light, ambientLight )

document.body.appendChild(renderer.domElement)

export { scene, camera, render, raiseCamera, lowerCamera }