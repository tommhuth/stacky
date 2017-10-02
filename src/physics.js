import { World, NaiveBroadphase } from "cannon"

const world = new World()

world.gravity.set(0, -9.8, 0) 
world.broadphase = new NaiveBroadphase();
world.solver.iterations = 5;

const bodies = []
const meshes = []

function physicsTick() {
    world.step(1/30)

    for(let i = 0; i < meshes.length; i++) {
        let body = bodies[i]
        let mesh = meshes[i]

        if(body.mass > 0) {   
            mesh.position.copy(body.position);
            mesh.quaternion.copy(body.quaternion) 
        } 
    }
}

export { bodies, meshes, world, physicsTick }
