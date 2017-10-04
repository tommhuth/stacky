import { Scene, FogExp2, Fog, AxisHelper, DirectionalLight, AmbientLight, Mesh, Vector3 } from "three"

const scene = new Scene()
const light = new DirectionalLight(0xFFFFFF, 1)
const ambientLight = new AmbientLight(0xFFFFFF, .5)
const axis = new AxisHelper(50) 
 
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
scene.add(light, axis, ambientLight)

export default scene