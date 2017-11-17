import { Engine, FreeCamera, Scene, CannonJSPlugin, HemisphericLight, Vector3, Camera, Color3, PointLight } from "babylonjs"
import uuid from "uuid/v1"

const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById("app")
const engine = new Engine(canvas, true, { deterministicLockstep: true, lockstepMaxSteps: 4 }, true)
const scene = new Scene(engine)
const camera = new FreeCamera(uuid(), new Vector3(-45, 45, -45), scene)
const light = new HemisphericLight(uuid(), new Vector3(0, -1, 0), scene)  
const pointLight = new PointLight(uuid(),new Vector3(-55, -55, -10), scene)  
const physEngine = new CannonJSPlugin(false)

physEngine.setTimeStep(1/60)

scene.enablePhysics(new Vector3(0, -9.81, 0), physEngine)
scene.gravity = new Vector3(0, -9.81, 0)

camera.mode = Camera.ORTHOGRAPHIC_CAMERA
camera.orthoTop =  frustumSize / 2
camera.orthoBottom = frustumSize / - 2
camera.orthoLeft = frustumSize * aspect / - 2
camera.orthoRight = frustumSize * aspect / 2
camera.setTarget(Vector3.Zero()) 

light.groundColor = Color3.White()
light.diffuse = new Color3(0, .5, 0) 
light.intensity = .4;

pointLight.intensity = .4
 
engine.runRenderLoop(() => scene.render()) 

window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight

    camera.orthoTop =  frustumSize / 2
    camera.orthoBottom = frustumSize / - 2
    camera.orthoLeft = frustumSize * aspect / - 2
    camera.orthoRight = frustumSize * aspect / 2
    engine.resize()
})

export { scene, camera }