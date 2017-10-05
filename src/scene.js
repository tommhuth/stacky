import { 
    Scene, FogExp2, Fog, 
    AxisHelper, 
    DirectionalLight, AmbientLight, 
    Mesh, Vector3, 
    OrthographicCamera, 
    WebGLRenderer 
} from "three"

const renderer = new WebGLRenderer({ antialias: true, alpha: false })
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

renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.set(-35, 25, -35)
camera.up = new Vector3(0, 1, 0)
camera.lookAt(new Vector3())

light.position.set(10, 20, 10)
light.castShadow = true
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
light.shadow.camera.near = -50
light.shadow.camera.far = 50
light.shadow.camera.left = -50
light.shadow.camera.right = 50
light.shadow.camera.bottom = -50
light.shadow.camera.top = 50

scene.fog = new FogExp2(0x666666, .0125)
scene.add(light, ambientLight)

document.body.appendChild(renderer.domElement)

export { scene, camera, render }