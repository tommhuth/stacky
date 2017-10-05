import { Tween, Easing } from "tween.js"
import { Scene, FogExp2, AxisHelper, DirectionalLight, AmbientLight, Mesh, OrthographicCamera, WebGLRenderer } from "three"
import { Vector3 } from "./Vector"

const renderer = new WebGLRenderer({ antialias: true, alpha: true })
const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight
const camera = new OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -100, 500)

const scene = new Scene()
const light = new DirectionalLight(0xFFFFFF, 1)
const ambientLight = new AmbientLight(0xFFFFFF, .5)
const axis = new AxisHelper(50)

function render() {
    renderer.render(scene, camera)
}

function raiseCamera(y, focus) {
    new Tween(camera.position)
        .to({ y: camera.position.y + y }, 3500)
        .easing(Easing.Cubic.Out)
        .delay(500)
        .start()
 
    light.shadow.camera.position.y += y
    //light.shadow.camera.bottom += y 
    //light.shadow.camera.top += y
    light.shadow.camera.updateProjectionMatrix() 
}

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.set(-35, 25, -35)
camera.up = new Vector3(0, 1, 0)
camera.lookAt(new Vector3(0, 0, 0))

light.position.set(10, 20, 10)
light.castShadow = true
light.shadow.mapSize.width = 1024 * 1
light.shadow.mapSize.height = 1024 * 1
light.shadow.camera.near = -100
light.shadow.camera.far = 100
light.shadow.camera.left = -50
light.shadow.camera.right = 50
light.shadow.camera.bottom = -50
light.shadow.camera.top = 50

scene.fog = new FogExp2(0xFFF, .0115)
scene.add(light, ambientLight)

document.body.appendChild(renderer.domElement)

export { scene, camera, render, raiseCamera }