import { BoxGeometry, MeshPhongMaterial, Mesh, Color } from "three"
import { bodies, meshes, world } from "./physics"
 

export default function Box(width = 1, height = 1, depth = 1, x = 0, y = 0, z = 0, move = false, color = "red") { 
    var geometry = new BoxGeometry(width, height, depth);
    var material = new MeshPhongMaterial({ color });
    var cube = new Mesh(geometry, material);
  
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.position.set(x, y, z)

    meshes.push(cube)
    if(move) { 
        bodies.push(world.add({
            type: "box",
            move,
            size: [width, height, depth],
            pos: [x, y, z],
            density: height * width * depth,
            friction: .4,
            restitution: .2,
            belongsTo: 1,
            collidesWith: 1,
            world
        }))
    }

    return cube
}