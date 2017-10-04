import { World, NaiveBroadphase } from "cannon"

let world = new World()
let meshes = []

world.gravity.set(0, -9.8, 0)
world.broadphase = new NaiveBroadphase();
world.solver.iterations = 10;

function physicsTick() {
    world.step(1 / 30)

    for (let mesh of meshes) {

        if (mesh.body.mass > 0) {
            mesh.position.copy(mesh.body.position);
            mesh.quaternion.copy(mesh.body.quaternion)
        }
    }
}

export function remove(o){
    for(let i = 0; i < meshes.length; i++) {
        let obj = meshes[i]
        if(obj === o ){
            meshes.splice(i, 1)
        }
    }
    meshes = meshes.filter(i => i !== o)
}
 

export { meshes, world, physicsTick }
