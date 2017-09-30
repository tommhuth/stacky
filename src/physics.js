import { World } from "oimo"

const world = new World({  
    timestep: 1 / 30,
    iterations: 2,
    broadphase: 1, // 1 brute force, 2 sweep and prune, 3 volume tree
    worldscale: 1, // scale full world 
    random: true,  // randomize sample
    info: false,   // calculate statistic or not
    gravity: [0, -9.8, 0]  
})

const bodies = []
const meshes = []

function physicsTick() {
    world.step()

    for(let i = 0; i < meshes.length; i++) {
        let body = bodies[i]
        let mesh = meshes[i]
  
        if(body && !body.sleeping) {
            mesh.position.copy(body.getPosition());
            mesh.quaternion.copy(body.getQuaternion());
        }
    }
}

export { bodies, meshes, world, physicsTick }
