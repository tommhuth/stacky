import { World, NaiveBroadphase, ContactMaterial, Material  } from "cannon"
import { scene } from "./scene"

const world = new World() 
const sliceContactMaterial  = new Material()
const bouncyMaterial = new ContactMaterial(sliceContactMaterial, sliceContactMaterial, { restitution: .85 })

world.gravity.set(0, -9.8, 0)
world.broadphase = new NaiveBroadphase()
world.solver.iterations = 10
world.addContactMaterial(bouncyMaterial)

function physicsLoop() {
    world.step(1 / 30)

    for (let child of scene.children) {

        if (child.body && child.body.mass > 0) {
            if (child.position.y < -200) {
                child.remove()
            } else {
                child.position.copy(child.body.position)
                child.quaternion.copy(child.body.quaternion)
            }
        }
    }
}

export { world, physicsLoop,  sliceContactMaterial }
