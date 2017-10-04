import { World, NaiveBroadphase } from "cannon"

const world = new World()
const meshes = []

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

export { meshes, world, physicsTick }
