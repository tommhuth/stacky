import Box from "./Box"
import {
    Scene,
    FogExp2,
    Fog,
    BoxGeometry,
    AxisHelper,
    DirectionalLight,
    AmbientLight,
    PlaneGeometry,
    Mesh,
    MeshPhongMaterial,
    Vector3,
    DoubleSide,
    Math
} from "three"

const scene = new Scene()
const light = new DirectionalLight(0xFFFFFF, 1)
const ambientLight = new AmbientLight(0xFFFFFF, .5)
const floor = new Box(200, 1, 200, 0, -40, 0, false, "blue")
const axis = new AxisHelper(50)
const fog = new FogExp2(0x000000, .0125)   
//const column = new Box(25, 50, 25, 0, -27.5, 0, false, "yellow")

export function addBox(...aguments) {
    let box = new Box(...arguments)

    scene.add(box)

    return box
}

light.position.set(10, 20, 10)
light.target = floor
light.castShadow = true
light.shadow.mapSize.width = 1024 // default is 512 
light.shadow.mapSize.height = 1024 // default is 512
light.shadow.camera.near = -100
light.shadow.camera.far = 100
light.shadow.camera.left = -100
light.shadow.camera.right = 100
light.shadow.camera.bottom = -100
light.shadow.camera.top = 100

floor.receiveShadow = true

scene.fog = fog 
scene.add(light, axis, ambientLight, floor)

export default scene