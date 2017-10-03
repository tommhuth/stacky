import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from "three"
import { bodies, meshes, world } from "./physics"
import { Box as PhysicBox, Body, Vec3  } from "cannon"
 
 

export default function Box(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, move = false, color = "red") { 
    var geometry = new BoxGeometry(1, 1, 1);
    var material = new MeshPhongMaterial({ color });
    var cube = new Mesh(geometry, material);

    var shape = new PhysicBox(new Vec3(width/2, height/2, depth/2))
    var body = new Body({
        mass: move ? width* height * depth : 0,
        
    })
    body.position.set(x, y,z)
    body.addShape(shape)

    //body.angularVelocity.set(0, -1, 0);
    body.applyImpulse(new Vec3(0, -1,0), new Vec3(0,0,0))
    body.angularDamping = 0.5;
    world.addBody(body);

    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(x, y, z)

    cube.scale.x = width
    cube.scale.y = height
    cube.scale.z = depth

    meshes.push(cube) 
    bodies.push(body) 

    return cube
}