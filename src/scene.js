import { Engine, FreeCamera, Scene, CannonJSPlugin, HemisphericLight, Vector3, Camera, Color3, PointLight } from "babylonjs"

const frustumSize = 100
const aspect = window.innerWidth / window.innerHeight

const canvas = document.getElementById("app")
const engine = new Engine(canvas, true, { deterministicLockstep: true, lockstepMaxSteps: 4 }, false)
const scene = new Scene(engine)
const camera = new FreeCamera("camera", new Vector3(-45, 45, -45), scene)
const light = new HemisphericLight('light1', new Vector3(0, -1, 0), scene)  
const physEngine = new CannonJSPlugin(false)

scene.enablePhysics(new Vector3(0, -9.81, 0), physEngine)
scene.gravity = new Vector3(0, -9.81, 0)

camera.mode = Camera.ORTHOGRAPHIC_CAMERA
camera.orthoTop =  frustumSize / 2
camera.orthoBottom = frustumSize / - 2
camera.orthoLeft = frustumSize * aspect / - 2
camera.orthoRight = frustumSize * aspect / 2
camera.setTarget(Vector3.Zero()) 

light.groundColor = new Color3(.1, .5, .1)
light.diffuse = Color3.White()
light.intensity = .4;
 
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