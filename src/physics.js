import { World, NaiveBroadphase } from "cannon"
import scene from "./scene"

const world = new World() 

world.gravity.set(0, -9.8, 0)
world.broadphase = new NaiveBroadphase()
world.solver.iterations = 10

function physicsTick() {
    world.step(1 / 30)

    for (let mesh of scene.children) {

        if (mesh.body && mesh.body.mass > 0) {
            mesh.position.copy(mesh.body.position)
            mesh.quaternion.copy(mesh.body.quaternion)
        }
    }
}
   
export {  world, physicsTick }
